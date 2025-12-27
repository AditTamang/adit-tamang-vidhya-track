import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

// Schedule item interface
interface ScheduleItem {
    id: number;
    title: string;
    description?: string;
    event_date: string;
    start_time?: string;
    end_time?: string;
    status: string;
    class_name?: string;
}

export default function ScheduleScreen() {
    const [loading, setLoading] = useState(true);
    const [selectedTab, setSelectedTab] = useState('All');
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState<number | null>(null);
    const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>([]);

    useEffect(() => {
        loadSchedule();
    }, []);

    const loadSchedule = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            // Get linked student
            const studentRes = await fetch(`${API_BASE_URL}/api/parent-student/linked`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const studentData = await studentRes.json();

            if (studentData.status === 200 && studentData.data && studentData.data.length > 0) {
                const student = studentData.data[0];
                setStudentName(student.name);
                setStudentId(student.id);

                // Fetch real schedule from API
                const scheduleRes = await fetch(`${API_BASE_URL}/api/schedule/student/${student.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const scheduleData = await scheduleRes.json();

                if (scheduleData.status === 200 && scheduleData.data) {
                    setScheduleItems(scheduleData.data);
                }
            }
        } catch (error) {
            console.log('Error loading schedule:', error);
        } finally {
            setLoading(false);
        }
    };

    // Format date for display
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        const options: Intl.DateTimeFormatOptions = { weekday: 'short', day: 'numeric', month: 'short' };
        return date.toLocaleDateString('en-US', options);
    };

    // Format time for display
    const formatTime = (startTime?: string, endTime?: string) => {
        if (!startTime) return 'All Day';
        if (!endTime) return startTime;
        return `${startTime} - ${endTime}`;
    };

    // Filter schedule based on selected tab
    const filteredSchedule = scheduleItems.filter(item => {
        if (selectedTab === 'All') return true;
        return item.status.toLowerCase() === selectedTab.toLowerCase();
    });

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status.toLowerCase()) {
            case 'upcoming': return '#F59E0B';
            case 'completed': return '#22C55E';
            case 'missed': return '#EF4444';
            default: return '#9CA3AF';
        }
    };

    // Get status icon
    const getStatusIcon = (status: string) => {
        switch (status.toLowerCase()) {
            case 'upcoming': return 'time-outline';
            case 'completed': return 'checkmark-circle-outline';
            case 'missed': return 'close-circle-outline';
            default: return 'ellipse-outline';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Schedule</Text>
                {studentName ? (
                    <Text style={styles.studentName}>{studentName}</Text>
                ) : null}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Filter Tabs */}
                <View style={styles.tabs}>
                    {['All', 'Upcoming', 'Completed', 'Missed'].map((tab) => (
                        <TouchableOpacity
                            key={tab}
                            style={[styles.tab, selectedTab === tab && styles.tabActive]}
                            onPress={() => setSelectedTab(tab)}
                        >
                            <Text style={[styles.tabText, selectedTab === tab && styles.tabTextActive]}>
                                {tab}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Schedule List */}
                {filteredSchedule.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="calendar-outline" size={60} color={COLORS.textLight} />
                        <Text style={styles.emptyTitle}>No Events</Text>
                        <Text style={styles.emptySubtext}>
                            {selectedTab === 'All'
                                ? 'No scheduled events yet'
                                : `No ${selectedTab.toLowerCase()} events`}
                        </Text>
                    </View>
                ) : (
                    filteredSchedule.map((item) => (
                        <View key={item.id} style={styles.scheduleCard}>
                            <View style={[styles.statusIndicator, { backgroundColor: getStatusColor(item.status) }]} />

                            <View style={styles.cardContent}>
                                <View style={styles.cardHeader}>
                                    <Text style={styles.scheduleTitle}>{item.title}</Text>
                                    <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) + '20' }]}>
                                        <Ionicons
                                            name={getStatusIcon(item.status) as any}
                                            size={14}
                                            color={getStatusColor(item.status)}
                                        />
                                        <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.dateTimeRow}>
                                    <View style={styles.dateTime}>
                                        <Ionicons name="calendar-outline" size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.dateTimeText}>{formatDate(item.event_date)}</Text>
                                    </View>
                                    <View style={styles.dateTime}>
                                        <Ionicons name="time-outline" size={14} color={COLORS.textSecondary} />
                                        <Text style={styles.dateTimeText}>{formatTime(item.start_time, item.end_time)}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    studentName: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    tabs: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 8,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: COLORS.white,
    },
    tabActive: {
        backgroundColor: COLORS.primary,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    tabTextActive: {
        color: COLORS.white,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    scheduleCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        marginBottom: 12,
        flexDirection: 'row',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    statusIndicator: {
        width: 4,
    },
    cardContent: {
        flex: 1,
        padding: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 10,
    },
    scheduleTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        flex: 1,
        marginRight: 10,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        gap: 4,
    },
    statusText: {
        fontSize: 11,
        fontWeight: '600',
    },
    dateTimeRow: {
        flexDirection: 'row',
        gap: 16,
    },
    dateTime: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    dateTimeText: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
});
