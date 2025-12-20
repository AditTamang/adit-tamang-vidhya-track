import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';

export default function TeacherProfile() {
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                setUser(JSON.parse(userData));
            }
        } catch (e) { }
    };

    const handleLogout = async () => {
        Alert.alert('Logout', 'Are you sure you want to logout?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Logout', style: 'destructive', onPress: async () => {
                    const { logout } = await import('@/services/authService');
                    await logout();
                    router.replace('/(auth)/login');
                }
            }
        ]);
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>My Profile</Text>
            </View>

            <View style={styles.profileCard}>
                <View style={styles.avatar}>
                    <Ionicons name="person" size={50} color={COLORS.primary} />
                </View>
                <Text style={styles.name}>{user?.name || 'Teacher'}</Text>
                <Text style={styles.email}>{user?.email || ''}</Text>
                <Text style={styles.role}>Teacher</Text>
            </View>

            <View style={styles.menuList}>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="person-outline" size={22} color="#333" />
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={22} color="#333" />
                    <Text style={styles.menuText}>Settings</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={22} color="#333" />
                    <Text style={styles.menuText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={22} color="#E53935" />
                    <Text style={[styles.menuText, { color: '#E53935' }]}>Logout</Text>
                    <Ionicons name="chevron-forward" size={20} color="#E53935" />
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background },
    header: { paddingTop: 50, paddingHorizontal: 20, paddingBottom: 20 },
    title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary },
    profileCard: { alignItems: 'center', paddingVertical: 30, backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, marginBottom: 20 },
    avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E8EDF0', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
    name: { fontSize: 20, fontWeight: '700', color: COLORS.textPrimary },
    email: { fontSize: 14, color: COLORS.textLight, marginTop: 5 },
    role: { fontSize: 12, color: COLORS.primary, marginTop: 5, textTransform: 'uppercase', fontWeight: '600' },
    menuList: { paddingHorizontal: 20 },
    menuItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', padding: 16, borderRadius: 12, marginBottom: 10 },
    menuText: { flex: 1, marginLeft: 15, fontSize: 16, color: '#333' },
    logoutItem: { marginTop: 20 },
});

