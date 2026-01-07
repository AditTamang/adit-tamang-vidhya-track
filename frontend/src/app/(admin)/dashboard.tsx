import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getDashboardStats } from '@/services/adminService';

export default function AdminDashboard() {
    const router = useRouter();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadStats();
    }, []);

    const loadStats = async () => {
        try {
            const response = await getDashboardStats();
            if (response.status === 200) {
                setStats(response.data);
            }
        } catch (error) {
            console.log('Failed to load stats');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView style={styles.content}>
                {/* Header */}
                <Text style={styles.title}>Dashboard</Text>
                <Text style={styles.subtitle}>Welcome to admin panel</Text>

                {/* Stats Row */}
                <View style={styles.statsRow}>
                    <View style={styles.statBox}>
                        <Ionicons name="people" size={28} color="#4CAF50" />
                        <Text style={styles.statNumber}>{stats?.totalUsers || 0}</Text>
                        <Text style={styles.statLabel}>Total Users</Text>
                    </View>

                    <View style={styles.statBox}>
                        <Ionicons name="time" size={28} color="#FF9800" />
                        <Text style={styles.statNumber}>{stats?.pendingApprovals || 0}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>

                {/* Role counts */}
                <Text style={styles.sectionTitle}>User Statistics</Text>
                <View style={styles.roleRow}>
                    <View style={styles.roleBox}>
                        <Text style={styles.roleNumber}>{stats?.teachers || 0}</Text>
                        <Text style={styles.roleLabel}>Teachers</Text>
                    </View>
                    <View style={styles.roleBox}>
                        <Text style={styles.roleNumber}>{stats?.parents || 0}</Text>
                        <Text style={styles.roleLabel}>Parents</Text>
                    </View>
                    <View style={styles.roleBox}>
                        <Text style={styles.roleNumber}>{stats?.students || 0}</Text>
                        <Text style={styles.roleLabel}>Students</Text>
                    </View>
                </View>

                {/* Quick Links */}
                <Text style={styles.sectionTitle}>Quick Actions</Text>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/(admin)/users')}
                >
                    <Ionicons name="people" size={22} color="#4CAF50" />
                    <Text style={styles.linkText}>Manage Users</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/(admin)/links')}
                >
                    <Ionicons name="link" size={22} color="#2196F3" />
                    <Text style={styles.linkText}>Parent Links</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() => router.push('/(admin)/classes')}
                >
                    <Ionicons name="school" size={22} color="#9C27B0" />
                    <Text style={styles.linkText}>Classes</Text>
                    <Ionicons name="chevron-forward" size={20} color="#999" />
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 25,
    },
    statsRow: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 25,
    },
    statBox: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    statNumber: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 13,
        color: '#666',
        marginTop: 4,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginBottom: 12,
    },
    roleRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 25,
    },
    roleBox: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    roleNumber: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    roleLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    linkButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    linkText: {
        flex: 1,
        fontSize: 16,
        color: '#333',
        marginLeft: 12,
    },
});
