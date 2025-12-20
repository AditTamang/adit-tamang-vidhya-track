import React, { useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

export default function ScheduleScreen() {
    const [selectedTab, setSelectedTab] = useState('All');

    const scheduleItems = [
        { id: 1, status: 'Pending', color: '#F59E0B', title: 'Database Lecture', date: 'Mon, 22 Jan', time: '10:00 AM - 12:00 PM' },
        { id: 2, status: 'Approved', color: '#22C55E', title: 'Project Presentation', date: 'Tue, 23 Jan', time: '1:00 PM - 2:00 PM' },
        { id: 3, status: 'Pending', color: '#F59E0B', title: 'Team Meeting', date: 'Wed, 24 Jan', time: '3:00 PM - 4:00 PM' },
        { id: 4, status: 'Late', color: '#EF4444', icon: 'calendar', title: 'Assignment Deadline', date: 'Thu, 25 Jan', time: '11:59 PM' },
        { id: 5, status: 'Approved', color: '#22C55E', title: 'UI Review', date: 'Fri, 26 Jan', time: '9:00 AM - 10:00 AM' },
        { id: 6, status: 'Approved', color: '#22C55E', title: 'Final Submission', date: 'Sat, 27 Jan', time: '5:00 PM' },
    ];

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Schedule</Text>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'All' && styles.tabActive]}
                        onPress={() => setSelectedTab('All')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'All' && styles.tabTextActive]}>
                            All (20)
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'Pending' && styles.tabActive]}
                        onPress={() => setSelectedTab('Pending')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'Pending' && styles.tabTextActive]}>
                            Pending
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'Approved' && styles.tabActive]}
                        onPress={() => setSelectedTab('Approved')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'Approved' && styles.tabTextActive]}>
                            Approved
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'Late' && styles.tabActive]}
                        onPress={() => setSelectedTab('Late')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'Late' && styles.tabTextActive]}>
                            Late
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Schedule List */}
                <View style={styles.scheduleList}>
                    {scheduleItems.map((item) => (
                        <View key={item.id} style={styles.scheduleItem}>
                            {item.icon && (
                                <View style={styles.itemIcon}>
                                    <Ionicons name="calendar" size={20} color={COLORS.textPrimary} />
                                </View>
                            )}

                            <View>
                                <Text style={{ fontSize: 16, fontWeight: '700', color: COLORS.textPrimary }}>
                                    {item.title}
                                </Text>
                                <Text style={{ fontSize: 13, color: COLORS.textSecondary, marginTop: 2 }}>
                                    {item.date}
                                </Text>
                                <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
                                    {item.time}
                                </Text>
                            </View>

                            <View style={[styles.statusBadge, { backgroundColor: item.color }]}>
                                <Text style={styles.statusText}>{item.status}</Text>
                            </View>
                        </View>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C5D3D8',
    },
    header: {
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#C5D3D8',
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    tabs: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 20,
    },
    tab: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: COLORS.textSecondary,
    },
    tabActive: {
        backgroundColor: '#F59E0B',
        borderColor: '#F59E0B',
    },
    tabText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    tabTextActive: {
        color: COLORS.textPrimary,
    },
    scheduleList: {
        gap: 16,
        paddingBottom: 20,
    },
    scheduleItem: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        minHeight: 60,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    itemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8EDF0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusBadge: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    statusText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
});
