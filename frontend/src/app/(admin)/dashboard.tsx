import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Toast from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {};

const AdminDashboard = (props: Props) => {
    const router = useRouter();
    const { t } = useLanguage();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const loadStats = async () => {
        try {
            const { getDashboardStats } = await import('@/services/adminService');
            const response = await getDashboardStats();
            if (response.status === 200) {
                setStats(response.data);
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to load dashboard data', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadStats();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadStats();
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>{t('loading')}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#4CAF50']} />
                }
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t('dashboard')}</Text>
                    <Text style={styles.headerSubtitle}>{t('quickOverview')}</Text>
                </View>

                {/* Stats Cards */}
                <View style={styles.statsGrid}>
                    {/* Total Users */}
                    <View style={[styles.statCard, styles.statCardGreen]}>
                        <Ionicons name="people" size={32} color="#4CAF50" />
                        <Text style={styles.statNumber}>{stats?.totalUsers || 0}</Text>
                        <Text style={styles.statLabel}>{t('users')}</Text>
                    </View>

                    {/* Pending Approvals */}
                    <View style={[styles.statCard, styles.statCardOrange]}>
                        <Ionicons name="time" size={32} color="#FF9800" />
                        <Text style={styles.statNumber}>{stats?.pendingApprovals || 0}</Text>
                        <Text style={styles.statLabel}>Pending</Text>
                    </View>
                </View>

                {/* Role Distribution */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('statistics')}</Text>
                    <View style={styles.roleGrid}>
                        <View style={styles.roleCard}>
                            <Ionicons name="school-outline" size={24} color="#2196F3" />
                            <Text style={styles.roleNumber}>{stats?.teachers || 0}</Text>
                            <Text style={styles.roleLabel}>{t('teachers')}</Text>
                        </View>
                        <View style={styles.roleCard}>
                            <Ionicons name="people-outline" size={24} color="#9C27B0" />
                            <Text style={styles.roleNumber}>{stats?.parents || 0}</Text>
                            <Text style={styles.roleLabel}>{t('parents')}</Text>
                        </View>
                        <View style={styles.roleCard}>
                            <Ionicons name="person-outline" size={24} color="#4CAF50" />
                            <Text style={styles.roleNumber}>{stats?.students || 0}</Text>
                            <Text style={styles.roleLabel}>{t('students')}</Text>
                        </View>
                    </View>
                </View>

                {/* Quick Actions */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>{t('quickActions')}</Text>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/(admin)/users')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="people" size={24} color="#4CAF50" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>{t('manageUsers')}</Text>
                            <Text style={styles.actionSubtitle}>{t('viewDetails')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => router.push('/(admin)/links')}
                    >
                        <View style={styles.actionIcon}>
                            <Ionicons name="link" size={24} color="#2196F3" />
                        </View>
                        <View style={styles.actionContent}>
                            <Text style={styles.actionTitle}>Parent Links</Text>
                            <Text style={styles.actionSubtitle}>{t('manageClasses')}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="#999" />
                    </TouchableOpacity>
                </View>
            </ScrollView>

            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={() => setToast({ ...toast, visible: false })}
                type={toast.type}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#666',
    },
    scrollContent: {
        padding: 20,
    },
    header: {
        marginBottom: 30,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    statsGrid: {
        flexDirection: 'row',
        gap: 15,
        marginBottom: 30,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    statCardGreen: {
        borderLeftWidth: 4,
        borderLeftColor: '#4CAF50',
    },
    statCardOrange: {
        borderLeftWidth: 4,
        borderLeftColor: '#FF9800',
    },
    statNumber: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 10,
    },
    statLabel: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    section: {
        marginBottom: 30,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    roleGrid: {
        flexDirection: 'row',
        gap: 12,
    },
    roleCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    roleNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 8,
    },
    roleLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
    },
    actionButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    actionIcon: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    actionContent: {
        flex: 1,
    },
    actionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    actionSubtitle: {
        fontSize: 13,
        color: '#666',
    },
});

export default AdminDashboard;
