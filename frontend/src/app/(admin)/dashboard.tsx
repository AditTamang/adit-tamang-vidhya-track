import React, { useEffect, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';

export default function AdminDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('Admin');
    const [stats, setStats] = useState({ totalUsers: 0, pendingUsers: 0 });

    useEffect(() => {
        const loadData = async () => {
            try {
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                const token = await AsyncStorage.getItem('authToken');
                const userData = await AsyncStorage.getItem('userData');

                if (userData) {
                    const user = JSON.parse(userData);
                    setUserName(user.name || 'Admin');
                }

                // Fetch Stats
                const { API_BASE_URL } = require('@/services/api');
                const res = await fetch(`${API_BASE_URL}/api/admin/stats`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const data = await res.json();
                if (data.status === 200) {
                    setStats(data.data);
                }
            } catch (e) {
                console.error("Dashboard Load Error: ", e);
            }
        };
        loadData();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hi, {userName}!</Text>
                    <Text style={styles.subGreeting}>Admin Dashboard</Text>
                </View>
                <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#333" /></TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    <View style={[styles.statCard, { backgroundColor: '#E3F2FD' }]}>
                        <Ionicons name="people" size={30} color="#1976D2" />
                        <Text style={styles.statNumber}>{stats.totalUsers}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>
                    <View style={[styles.statCard, { backgroundColor: '#FFF3E0' }]}>
                        <Ionicons name="time" size={30} color="#F57C00" />
                        <Text style={styles.statNumber}>{stats.pendingUsers}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>

                {/* Quick Actions */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>
                <View style={styles.actionsGrid}>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(admin)/approvals')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="checkmark-circle" size={28} color="#4CAF50" />
                        </View>
                        <Text style={styles.actionText}>Approve Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/(admin)/users')}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="people" size={28} color="#1976D2" />
                        </View>
                        <Text style={styles.actionText}>Manage Users</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="school" size={28} color="#F57C00" />
                        </View>
                        <Text style={styles.actionText}>Classes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FCE4EC' }]}>
                            <Ionicons name="settings" size={28} color="#E91E63" />
                        </View>
                        <Text style={styles.actionText}>Settings</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
    greeting: { fontSize: 22, fontWeight: '700', color: '#333' },
    subGreeting: { fontSize: 14, color: '#666' },
    content: { flex: 1, paddingHorizontal: 20 },
    statsRow: { flexDirection: 'row', gap: 12, marginBottom: 25 },
    statCard: { flex: 1, borderRadius: 16, padding: 20, alignItems: 'center' },
    statNumber: { fontSize: 28, fontWeight: '700', color: '#333', marginTop: 10 },
    statLabel: { fontSize: 13, color: '#666', marginTop: 5 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
    actionsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    actionCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
    iconCircle: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
    actionText: { fontSize: 13, fontWeight: '600', color: '#333', textAlign: 'center' },
});

