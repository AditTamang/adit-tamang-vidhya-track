import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

interface PendingUser {
    id: number;
    name: string;
    email: string;
    role: string;
    created_at: string;
}

export default function AdminApprovals() {
    const [users, setUsers] = useState<PendingUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPendingUsers();
    }, []);

    const fetchPendingUsers = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/pending-users`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 200) {
                setUsers(data.data || []);
            }
        } catch (e) {
            console.error('Error fetching pending users:', e);
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (userId: number) => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');
            const res = await fetch(`${API_BASE_URL}/api/admin/approve-user/${userId}`, {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 200) {
                Alert.alert('Success', 'User approved!');
                setUsers(users.filter(u => u.id !== userId));
            } else {
                Alert.alert('Error', data.message);
            }
        } catch (e: any) {
            Alert.alert('Error', e.message);
        }
    };

    const handleReject = async (userId: number) => {
        Alert.alert('Reject User', 'Are you sure you want to reject this user?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject', style: 'destructive', onPress: async () => {
                    try {
                        const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                        const token = await AsyncStorage.getItem('authToken');
                        const res = await fetch(`${API_BASE_URL}/api/admin/reject-user/${userId}`, {
                            method: 'POST',
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await res.json();
                        if (data.status === 200) {
                            Alert.alert('Done', 'User rejected');
                            setUsers(users.filter(u => u.id !== userId));
                        }
                    } catch (e: any) {
                        Alert.alert('Error', e.message);
                    }
                }
            }
        ]);
    };

    const renderUser = ({ item }: { item: PendingUser }) => (
        <View style={styles.userCard}>
            <View style={styles.userInfo}>
                <Text style={styles.userName}>{item.name}</Text>
                <Text style={styles.userEmail}>{item.email}</Text>
                <Text style={styles.userRole}>{item.role}</Text>
            </View>
            <View style={styles.actions}>
                <TouchableOpacity style={styles.approveBtn} onPress={() => handleApprove(item.id)}>
                    <Ionicons name="checkmark" size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.rejectBtn} onPress={() => handleReject(item.id)}>
                    <Ionicons name="close" size={20} color="#fff" />
                </TouchableOpacity>
            </View>
        </View>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Pending Approvals</Text>
            </View>
            {users.length === 0 ? (
                <View style={styles.center}>
                    <Ionicons name="checkmark-circle" size={60} color="#4CAF50" />
                    <Text style={styles.emptyText}>No pending approvals</Text>
                </View>
            ) : (
                <FlatList data={users} keyExtractor={item => item.id.toString()} renderItem={renderUser} contentContainerStyle={{ padding: 20 }} />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 10 },
    title: { fontSize: 24, fontWeight: '700', color: COLORS.text },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    emptyText: { fontSize: 16, color: COLORS.textLight, marginTop: 15 },
    userCard: { flexDirection: 'row', backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, alignItems: 'center' },
    userInfo: { flex: 1 },
    userName: { fontSize: 16, fontWeight: '600', color: '#333' },
    userEmail: { fontSize: 13, color: '#666', marginTop: 2 },
    userRole: { fontSize: 12, color: COLORS.primary, marginTop: 4, textTransform: 'capitalize' },
    actions: { flexDirection: 'row', gap: 10 },
    approveBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#4CAF50', justifyContent: 'center', alignItems: 'center' },
    rejectBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#E53935', justifyContent: 'center', alignItems: 'center' },
});

