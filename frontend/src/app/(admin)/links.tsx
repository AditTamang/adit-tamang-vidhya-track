import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPendingLinks, approveLink, rejectLink } from '@/services/adminService';

// Simple type for link request
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

export default function ParentStudentLinksScreen() {
    const [links, setLinks] = useState<LinkRequest[]>([]);
    const [loading, setLoading] = useState(true);

    // Load links on page load
    useEffect(() => {
        loadLinks();
    }, []);

    const loadLinks = async () => {
        try {
            const response = await getPendingLinks();
            if (response.status === 200) {
                setLinks(response.data);
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Failed to load');
        } finally {
            setLoading(false);
        }
    };

    // Approve a link
    const handleApprove = (linkId: number) => {
        Alert.alert('Approve Link', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        const response = await approveLink(linkId);
                        if (response.status === 200) {
                            Alert.alert('Success', 'Link approved');
                            loadLinks();
                        }
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                }
            }
        ]);
    };

    // Reject a link
    const handleReject = (linkId: number) => {
        Alert.alert('Reject Link', 'Are you sure?', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const response = await rejectLink(linkId);
                        if (response.status === 200) {
                            Alert.alert('Success', 'Link rejected');
                            loadLinks();
                        }
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                }
            }
        ]);
    };

    // Show loading
    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Page Title */}
            <View style={styles.header}>
                <Text style={styles.title}>Parent-Student Links</Text>
                <Text style={styles.subtitle}>Pending requests: {links.length}</Text>
            </View>

            <ScrollView style={styles.list}>
                {links.length === 0 ? (
                    <View style={styles.emptyBox}>
                        <Ionicons name="checkmark-circle" size={50} color="#ccc" />
                        <Text style={styles.emptyText}>No pending requests</Text>
                    </View>
                ) : (
                    links.map((link) => (
                        <View key={link.id} style={styles.card}>
                            {/* Parent info */}
                            <Text style={styles.label}>Parent:</Text>
                            <Text style={styles.name}>{link.parent_name}</Text>
                            <Text style={styles.email}>{link.parent_email}</Text>

                            {/* Divider */}
                            <View style={styles.divider} />

                            {/* Student info */}
                            <Text style={styles.label}>Student:</Text>
                            <Text style={styles.name}>{link.student_name || 'Unknown'}</Text>
                            <Text style={styles.code}>Code: {link.student_code || 'N/A'}</Text>
                            {link.class && link.section && (
                                <Text style={styles.classInfo}>
                                    Class {link.class} - Section {link.section}
                                </Text>
                            )}

                            {/* Date */}
                            <Text style={styles.date}>
                                Requested: {new Date(link.created_at).toLocaleDateString()}
                            </Text>

                            {/* Buttons */}
                            <View style={styles.buttons}>
                                <TouchableOpacity
                                    style={styles.approveBtn}
                                    onPress={() => handleApprove(link.id)}
                                >
                                    <Text style={styles.btnText}>Approve</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styles.rejectBtn}
                                    onPress={() => handleReject(link.id)}
                                >
                                    <Text style={styles.btnText}>Reject</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
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
    loadingText: {
        marginTop: 10,
        color: '#666',
    },
    header: {
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    list: {
        flex: 1,
        padding: 15,
    },
    emptyBox: {
        alignItems: 'center',
        marginTop: 50,
    },
    emptyText: {
        marginTop: 10,
        fontSize: 16,
        color: '#999',
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    label: {
        fontSize: 12,
        color: '#888',
        marginTop: 5,
    },
    name: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    code: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
    classInfo: {
        fontSize: 13,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 10,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 10,
        fontStyle: 'italic',
    },
    buttons: {
        flexDirection: 'row',
        marginTop: 15,
        gap: 10,
    },
    approveBtn: {
        flex: 1,
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    rejectBtn: {
        flex: 1,
        backgroundColor: '#f44336',
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    btnText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
});
