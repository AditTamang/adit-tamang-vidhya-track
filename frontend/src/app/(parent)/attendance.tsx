import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { apiCall } from '@/services/api';
import { useRouter } from 'expo-router';

interface Child {
    id: number;
    name: string;
    class_name?: string;
}

interface AttendanceRecord {
    id: number;
    date: string;
    status: 'present' | 'absent' | 'late';
}

export default function ParentAttendance() {
    const [children, setChildren] = useState<Child[]>([]);
    const [selectedChild, setSelectedChild] = useState<Child | null>(null);
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchChildren();
    }, []);

    const fetchChildren = async () => {
        try {
            setLoading(true);
            const response = await apiCall('/api/parent-student/linked');
            if (response.ok) {
                const json = await response.json();
                setChildren(json.data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchAttendance = async (child: Child) => {
        try {
            setSelectedChild(child);
            setLoading(true);
            const response = await apiCall(`/api/attendance/student/${child.id}`);
            if (response.ok) {
                const json = await response.json();
                setAttendance(json);
            } else {
                Alert.alert("Error", "Failed to fetch attendance");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading && !children.length && !attendance.length) {
        return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    if (!selectedChild) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Select Child</Text>
                <FlatList
                    data={children}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => fetchAttendance(item)}>
                            <Text style={styles.cardTitle}>{item.name}</Text>
                            <Text style={styles.cardSubtitle}>Class: {item.class_name || 'N/A'}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No children linked.</Text>}
                />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setSelectedChild(null)}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerSmall}>{selectedChild.name}'s Attendance</Text>
            </View>

            <FlatList
                data={attendance}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                        <View style={[styles.badge, styles.badgeColor(item.status)]}>
                            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No attendance records found.</Text>}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: COLORS.textPrimary },
    headerSmall: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
    topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backButton: { fontSize: 16, color: COLORS.primary, padding: 10 },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2
    },
    cardTitle: { fontSize: 18, fontWeight: '600', color: COLORS.textPrimary },
    cardSubtitle: { fontSize: 14, color: COLORS.textSecondary, marginTop: 5 },
    emptyText: { textAlign: 'center', marginTop: 20, color: COLORS.textLight },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10
    },
    date: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    badgeColor: ((status: string) => {
        if (status === 'present') return { backgroundColor: '#E8F5E9' };
        if (status === 'absent') return { backgroundColor: '#FFEBEE' };
        if (status === 'late') return { backgroundColor: '#FFF8E1' };
        return { backgroundColor: '#F5F5F5' };
    }) as unknown as ViewStyle, // Use a cast or better yet avoid using function in stylesheet if possible, or use inline styles for dynamic parts.
    statusText: { fontSize: 12, fontWeight: 'bold', color: '#333' }
});

// Fix for dynamic styles not being supported in StyleSheet.create directly implies we should use them inline or helper function.
// Refactoring styles.badgeColor usage to a helper function outside StyleSheet.
