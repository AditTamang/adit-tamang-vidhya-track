import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    is_approved: boolean;
    is_verified: boolean;
}

export default function AdminUsers() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<string>('all');
    // Pagination state
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useFocusEffect(
        useCallback(() => {
            fetchUsers();
        }, [page])
    );

    const fetchUsers = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            // Pass pagination params
            const res = await fetch(`${API_BASE_URL}/api/admin/users?page=${page}&limit=10`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();

            if (data.status === 200 && data.data) {
                // New response structure: data.data.users
                setUsers(data.data.users || []);
                setTotalPages(data.data.meta?.totalPages || 1);
            }
        } catch (e) {
            console.error('Error fetching users:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id: number) => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/approve-user/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 200) {
                fetchUsers(); // Refresh list
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleReject = async (id: number) => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/reject-user/${id}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 200) {
                fetchUsers(); // Refresh list
            }
        } catch (e) {
            console.error(e);
        }
    };

    const filteredUsers = filter === 'all' ? users : users.filter(u => u.role === filter);

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'student': return '#2196F3';
            case 'parent': return '#9C27B0';
            case 'teacher': return '#FF5722';
            default: return '#607D8B';
        }
    };

    const renderUser = ({ item }: { item: User }) => (
        <View style={styles.userCard}>
            <View style={styles.avatar}>
                <Ionicons name="person" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <View style={styles.badges}>
                    <Text style={[styles.badge, { backgroundColor: getRoleColor(item.role) }]}>{item.role}</Text>
                    <Text style={[styles.badge, { backgroundColor: item.is_approved ? '#4CAF50' : '#FF9800' }]}>
                        {item.is_approved ? 'Approved' : 'Pending'}
                    </Text>
                </View>
                {!item.is_approved && (
                    <View style={styles.actionButtons}>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#4CAF50' }]} onPress={() => handleApprove(item.id)}>
                            <Text style={styles.actionBtnText}>Approve</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.actionBtn, { backgroundColor: '#F44336' }]} onPress={() => handleReject(item.id)}>
                            <Text style={styles.actionBtnText}>Reject</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>All Users</Text>
                <Text style={styles.count}>{filteredUsers.length} users</Text>
            </View>

            {/* Filter tabs */}
            <View style={styles.filterRow}>
                {['all', 'student', 'parent', 'teacher'].map(f => (
                    <TouchableOpacity key={f} style={[styles.filterBtn, filter === f && styles.filterActive]} onPress={() => setFilter(f)}>
                        <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>{f}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={item => item.id.toString()}
                renderItem={renderUser}
                contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
                ListFooterComponent={
                    <View style={styles.paginationContainer}>
                        <TouchableOpacity
                            style={[styles.pageBtn, page === 1 && styles.disabledBtn]}
                            disabled={page === 1}
                            onPress={() => setPage(p => Math.max(1, p - 1))}
                        >
                            <Ionicons name="chevron-back" size={20} color={page === 1 ? "#ccc" : "#333"} />
                            <Text style={[styles.pageBtnText, page === 1 && { color: '#ccc' }]}>Prev</Text>
                        </TouchableOpacity>

                        <Text style={styles.pageInfo}>Page {page} of {totalPages}</Text>

                        <TouchableOpacity
                            style={[styles.pageBtn, page === totalPages && styles.disabledBtn]}
                            disabled={page === totalPages}
                            onPress={() => setPage(p => Math.min(totalPages, p + 1))}
                        >
                            <Text style={[styles.pageBtnText, page === totalPages && { color: '#ccc' }]}>Next</Text>
                            <Ionicons name="chevron-forward" size={20} color={page === totalPages ? "#ccc" : "#333"} />
                        </TouchableOpacity>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
    count: { fontSize: 14, color: COLORS.textLight },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    filterRow: { flexDirection: 'row', paddingHorizontal: 20, gap: 10, marginBottom: 10 },
    filterBtn: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#E8EDF0' },
    filterActive: { backgroundColor: COLORS.primary },
    filterText: { fontSize: 13, color: '#666', textTransform: 'capitalize' },
    filterTextActive: { color: '#fff' },
    userCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8EDF0', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600', color: '#333' },
    userEmail: { fontSize: 13, color: '#666', marginTop: 2 },
    badges: { flexDirection: 'row', gap: 8, marginTop: 8 },
    badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, fontSize: 11, color: '#fff', overflow: 'hidden', textTransform: 'capitalize' },
    paginationContainer: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 20, gap: 15 },
    pageBtn: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#fff', borderRadius: 8, elevation: 2 },
    disabledBtn: { backgroundColor: '#f5f5f5', elevation: 0 },
    pageBtnText: { marginHorizontal: 5, fontSize: 14, fontWeight: '600', color: '#333' },
    pageInfo: { fontSize: 14, fontWeight: '600', color: '#666' },
    actionButtons: { flexDirection: 'row', gap: 10, marginTop: 10 },
    actionBtn: { paddingHorizontal: 15, paddingVertical: 6, borderRadius: 8 },
    actionBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});
