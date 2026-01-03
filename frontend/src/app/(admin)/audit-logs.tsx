import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { getAuditLogs } from '@/services/adminService';

interface AuditLog {
    id: number;
    action: string;
    target_type: string;
    target_id: number;
    details: string;
    created_at: string;
    admin_name: string;
}

export default function AuditLogsScreen() {
    const [logs, setLogs] = useState<AuditLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        loadLogs(1);
    }, []);

    const loadLogs = async (pageNum: number, refresh = false) => {
        if (pageNum === 1) setLoading(true);
        try {
            const response = await getAuditLogs(pageNum);
            if (response.status === 200) {
                const newLogs = response.data.logs;
                if (refresh) {
                    setLogs(newLogs);
                } else {
                    setLogs(prev => [...prev, ...newLogs]);
                }
                setHasMore(newLogs.length === 20); // Assuming limit is 20
            }
        } catch (error) {
            console.error('Error loading audit logs:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const handleRefresh = () => {
        setRefreshing(true);
        setPage(1);
        loadLogs(1, true);
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            loadLogs(nextPage);
        }
    };

    const formatDetails = (details: string) => {
        try {
            const parsed = JSON.parse(details);
            return Object.entries(parsed)
                .map(([key, value]) => `${key}: ${value}`)
                .join(', ');
        } catch (e) {
            return details;
        }
    };

    const renderItem = ({ item }: { item: AuditLog }) => (
        <View style={styles.logCard}>
            <View style={styles.logHeader}>
                <View style={[styles.actionBadge, getActionStyle(item.action)]}>
                    <Text style={styles.actionText}>{item.action.replace(/_/g, ' ')}</Text>
                </View>
                <Text style={styles.dateText}>
                    {new Date(item.created_at).toLocaleString()}
                </Text>
            </View>
            <View style={styles.logContent}>
                <Text style={styles.logDetail}>
                    <Text style={styles.label}>Admin: </Text>
                    {item.admin_name || 'Unknown'}
                </Text>
                <Text style={styles.logDetail}>
                    <Text style={styles.label}>Details: </Text>
                    {formatDetails(item.details)}
                </Text>
            </View>
        </View>
    );

    const getActionStyle = (action: string) => {
        if (action.includes('ACTIVATE')) return { backgroundColor: '#E8F5E9' }; // Green
        if (action.includes('DEACTIVATE')) return { backgroundColor: '#FFEBEE' }; // Red
        if (action.includes('approve')) return { backgroundColor: '#E3F2FD' }; // Blue
        return { backgroundColor: '#F3F4F6' }; // Gray
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Audit Logs</Text>
            </View>

            {loading && page === 1 ? (
                <View style={styles.centerContainer}>
                    <ActivityIndicator size="large" color={COLORS.primary} />
                </View>
            ) : logs.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Ionicons name="clipboard-outline" size={48} color={COLORS.textSecondary} />
                    <Text style={styles.emptyText}>No logs found</Text>
                </View>
            ) : (
                <FlatList
                    data={logs}
                    renderItem={renderItem}
                    keyExtractor={item => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    onEndReached={handleLoadMore}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={hasMore ? <ActivityIndicator color={COLORS.primary} /> : null}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 15,
        paddingHorizontal: 20,
        backgroundColor: COLORS.white,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        padding: 16,
    },
    logCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    logHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    actionBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 8,
    },
    actionText: {
        fontSize: 12,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    dateText: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    logContent: {
        gap: 4,
    },
    logDetail: {
        fontSize: 14,
        color: COLORS.textPrimary,
    },
    label: {
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    emptyText: {
        marginTop: 12,
        fontSize: 16,
        color: COLORS.textSecondary,
    },
});
