import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from '@/components/Toast';

type LinkRequest = {
    id: number;
    parent_id: number;
    student_id: number;
    parent_name: string;
    parent_email: string;
    student_name: string;
    student_code?: string | null;
    class?: string | null;
    section?: string | null;
    created_at: string;
};

const ParentStudentLinksScreen = () => {
    const [links, setLinks] = useState<LinkRequest[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const loadLinks = async () => {
        try {
            const { getPendingLinks } = await import('@/services/adminService');
            const response = await getPendingLinks();

            if (response.status === 200) {
                setLinks(response.data);
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to load link requests', 'error');
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        loadLinks();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadLinks();
    };

    const handleApprove = async (linkId: number, parentName: string, studentName: string) => {
        Alert.alert(
            'Approve Link Request',
            `Link ${parentName} (Parent) to ${studentName} (Student)?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Approve',
                    onPress: async () => {
                        try {
                            const { approveLink } = await import('@/services/adminService');
                            const response = await approveLink(linkId);

                            if (response.status === 200) {
                                showToast('Link approved successfully', 'success');
                                loadLinks();
                            }
                        } catch (error: any) {
                            showToast(error.message || 'Failed to approve link', 'error');
                        }
                    }
                }
            ]
        );
    };

    
    const handleReject = async (linkId: number, parentName: string, studentName: string) => {
        Alert.alert(
            'Reject Link Request',
            `Reject connection between ${parentName} and ${studentName}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const { rejectLink } = await import('@/services/adminService');
                            const response = await rejectLink(linkId);

                            if (response.status === 200) {
                                showToast('Link rejected successfully', 'success');
                                loadLinks();
                            }
                        } catch (error: any) {
                            showToast(error.message || 'Failed to reject link', 'error');
                        }
                    }
                }
            ]
        );
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Link Requests...</Text>
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
                    <Text style={styles.headerTitle}>Parent-Student Links</Text>
                    <Text style={styles.headerSubtitle}>Approve connection requests</Text>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <Ionicons name="information-circle" size={24} color="#2196F3" />
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>How it works</Text>
                        <Text style={styles.infoText}>
                            Parents request to link with their children using the student code. Review and approve these requests.
                        </Text>
                    </View>
                </View>

                {/* Link Requests */}
                {links.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Ionicons name="checkmark-circle-outline" size={64} color="#ccc" />
                        <Text style={styles.emptyText}>No pending link requests</Text>
                        <Text style={styles.emptySubtext}>All link requests have been processed</Text>
                    </View>
                ) : (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Pending Requests ({links.length})
                        </Text>
                        {links.map(link => (
                            <View key={link.id} style={styles.linkCard}>
                                {/* Parent Info */}
                                <View style={styles.personSection}>
                                    <View style={styles.personHeader}>
                                        <View style={styles.iconBadge} style={{ backgroundColor: '#9C27B0' + '20' }}>
                                            <Ionicons name="people" size={20} color="#9C27B0" />
                                        </View>
                                        <View style={styles.personInfo}>
                                            <Text style={styles.personLabel}>Parent</Text>
                                            <Text style={styles.personName}>{link.parent_name}</Text>
                                            <Text style={styles.personEmail}>{link.parent_email}</Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Connection Arrow */}
                                <View style={styles.arrowContainer}>
                                    <View style={styles.arrowLine} />
                                    <Ionicons name="link" size={20} color="#4CAF50" />
                                    <View style={styles.arrowLine} />
                                </View>

                                {/* Student Info */}
                                <View style={styles.personSection}>
                                    <View style={styles.personHeader}>
                                        <View style={[styles.iconBadge, { backgroundColor: '#4CAF50' + '20' }]}>
                                            <Ionicons name="person" size={20} color="#4CAF50" />
                                        </View>
                                        <View style={styles.personInfo}>
                                            <Text style={styles.personLabel}>Student</Text>
                                            <Text style={styles.personName}>{link.student_name || 'Unknown Student'}</Text>
                                            <View style={styles.studentMeta}>
                                                <Text style={styles.studentCode}>
                                                    Code: {link.student_code || 'N/A'}
                                                </Text>
                                                {link.class && link.section && (
                                                    <Text style={styles.studentClass}>
                                                        Class {link.class} - {link.section}
                                                    </Text>
                                                )}
                                            </View>
                                        </View>
                                    </View>
                                </View>

                                {/* Action Buttons */}
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.approveButton}
                                        onPress={() => handleApprove(link.id, link.parent_name, link.student_name)}
                                    >
                                        <Ionicons name="checkmark-circle" size={20} color="#fff" />
                                        <Text style={styles.buttonText}>Approve</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.rejectButton}
                                        onPress={() => handleReject(link.id, link.parent_name, link.student_name)}
                                    >
                                        <Ionicons name="close-circle" size={20} color="#fff" />
                                        <Text style={styles.buttonText}>Reject</Text>
                                    </TouchableOpacity>
                                </View>

                                {/* Timestamp */}
                                <Text style={styles.timestamp}>
                                    Requested: {new Date(link.created_at).toLocaleDateString()}
                                </Text>
                            </View>
                        ))}
                    </View>
                )}
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
        marginBottom: 20,
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
    infoCard: {
        flexDirection: 'row',
        backgroundColor: '#E3F2FD',
        borderRadius: 12,
        padding: 15,
        marginBottom: 25,
        gap: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#1976D2',
        marginBottom: 4,
    },
    infoText: {
        fontSize: 13,
        color: '#1565C0',
        lineHeight: 18,
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 60,
    },
    emptyText: {
        fontSize: 18,
        fontWeight: '600',
        color: '#999',
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 8,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 15,
    },
    linkCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    personSection: {
        marginBottom: 12,
    },
    personHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    iconBadge: {
        width: 44,
        height: 44,
        borderRadius: 22,
        justifyContent: 'center',
        alignItems: 'center',
    },
    personInfo: {
        flex: 1,
    },
    personLabel: {
        fontSize: 11,
        fontWeight: '600',
        color: '#999',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    personName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 3,
    },
    personEmail: {
        fontSize: 13,
        color: '#666',
    },
    studentMeta: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 4,
    },
    studentCode: {
        fontSize: 12,
        fontWeight: '600',
        color: '#4CAF50',
    },
    studentClass: {
        fontSize: 12,
        color: '#666',
    },
    arrowContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 12,
        gap: 10,
    },
    arrowLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#E0E0E0',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 15,
        marginBottom: 10,
    },
    approveButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        padding: 14,
        gap: 8,
    },
    rejectButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#F44336',
        borderRadius: 12,
        padding: 14,
        gap: 8,
    },
    buttonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    timestamp: {
        fontSize: 11,
        color: '#999',
        textAlign: 'center',
        fontStyle: 'italic',
    },
});

export default ParentStudentLinksScreen;
