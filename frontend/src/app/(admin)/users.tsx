import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
    getAllUsers,
    getPendingUsers,
    approveUser,
    rejectUser,
    updateUserRole,
    toggleUserStatus
} from '@/services/adminService';

type User = {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_number: string;
    is_approved: boolean;
    is_active: boolean;
    created_at: string;
};

export default function UsersScreen() {
    const [users, setUsers] = useState<User[]>([]);
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [usersRes, pendingRes] = await Promise.all([
                getAllUsers(1, 50),
                getPendingUsers()
            ]);

            if (usersRes.status === 200) {
                setUsers(usersRes.data.users);
            }
            if (pendingRes.status === 200) {
                setPendingUsers(pendingRes.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load users');
        } finally {
            setLoading(false);
        }
    };

    // Approve user
    const handleApprove = async (userId: number) => {
        try {
            const res = await approveUser(userId);
            if (res.status === 200) {
                Alert.alert('Success', 'User approved');
                loadData();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    // Reject user
    const handleReject = (userId: number) => {
        Alert.alert('Reject User', 'This will delete the user.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Reject',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const res = await rejectUser(userId);
                        if (res.status === 200) {
                            Alert.alert('Success', 'User rejected');
                            loadData();
                        }
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                }
            }
        ]);
    };

    // Toggle active status
    const handleToggleStatus = (user: User) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        Alert.alert(`${action} user?`, '', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Yes',
                onPress: async () => {
                    try {
                        const res = await toggleUserStatus(user.id);
                        if (res.status === 200) {
                            Alert.alert('Success', `User ${action}d`);
                            loadData();
                        }
                    } catch (error: any) {
                        Alert.alert('Error', error.message);
                    }
                }
            }
        ]);
    };

    // Update role
    const handleUpdateRole = async (role: string) => {
        if (!selectedUser) return;
        try {
            const res = await updateUserRole(selectedUser.id, role);
            if (res.status === 200) {
                Alert.alert('Success', 'Role updated');
                setShowRoleModal(false);
                setSelectedUser(null);
                loadData();
            }
        } catch (error: any) {
            Alert.alert('Error', error.message);
        }
    };

    // Get role color
    const getRoleColor = (role: string) => {
        if (role === 'admin') return '#E91E63';
        if (role === 'teacher') return '#2196F3';
        if (role === 'parent') return '#9C27B0';
        return '#4CAF50';
    };

    // Filter users
    const filteredUsers = filter === 'all'
        ? users
        : users.filter(u => u.role === filter);

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
                <Text style={styles.title}>User Management</Text>

                {/* Pending Approvals */}
                {pendingUsers.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Pending Approvals ({pendingUsers.length})
                        </Text>
                        {pendingUsers.map(user => (
                            <View key={user.id} style={styles.card}>
                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>{user.name}</Text>
                                    <Text style={styles.userEmail}>{user.email}</Text>
                                    <Text style={[styles.roleTag, { backgroundColor: getRoleColor(user.role) }]}>
                                        {user.role.toUpperCase()}
                                    </Text>
                                </View>
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={styles.approveBtn}
                                        onPress={() => handleApprove(user.id)}
                                    >
                                        <Ionicons name="checkmark" size={18} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.rejectBtn}
                                        onPress={() => handleReject(user.id)}
                                    >
                                        <Ionicons name="close" size={18} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Filter buttons */}
                <View style={styles.filterRow}>
                    {['all', 'teacher', 'student', 'parent'].map(role => (
                        <TouchableOpacity
                            key={role}
                            style={[styles.filterBtn, filter === role && styles.filterActive]}
                            onPress={() => setFilter(role)}
                        >
                            <Text style={[styles.filterText, filter === role && styles.filterTextActive]}>
                                {role === 'all' ? 'All' : role.charAt(0).toUpperCase() + role.slice(1)}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {/* Users List */}
                <Text style={styles.sectionTitle}>All Users ({filteredUsers.length})</Text>

                {filteredUsers.length === 0 ? (
                    <Text style={styles.emptyText}>No users found</Text>
                ) : (
                    filteredUsers.map(user => (
                        <View key={user.id} style={styles.card}>
                            <View style={styles.userInfo}>
                                <Text style={styles.userName}>{user.name}</Text>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                <View style={styles.tagRow}>
                                    <Text style={[styles.roleTag, { backgroundColor: getRoleColor(user.role) }]}>
                                        {user.role.toUpperCase()}
                                    </Text>
                                    {user.is_active === false && (
                                        <Text style={styles.inactiveTag}>INACTIVE</Text>
                                    )}
                                </View>
                            </View>
                            {user.role !== 'admin' && (
                                <View style={styles.actions}>
                                    <TouchableOpacity
                                        style={[styles.iconBtn, { backgroundColor: user.is_active ? '#FFEBEE' : '#E8F5E9' }]}
                                        onPress={() => handleToggleStatus(user)}
                                    >
                                        <Ionicons
                                            name="power"
                                            size={18}
                                            color={user.is_active ? '#F44336' : '#4CAF50'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.iconBtn}
                                        onPress={() => {
                                            setSelectedUser(user);
                                            setShowRoleModal(true);
                                        }}
                                    >
                                        <Ionicons name="create-outline" size={18} color="#666" />
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    ))
                )}
            </ScrollView>

            {/* Role Modal */}
            <Modal visible={showRoleModal} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Change Role</Text>
                        <Text style={styles.modalSubtitle}>{selectedUser?.name}</Text>

                        {['student', 'teacher', 'parent'].map(role => (
                            <TouchableOpacity
                                key={role}
                                style={[
                                    styles.roleOption,
                                    selectedUser?.role === role && styles.roleOptionActive
                                ]}
                                onPress={() => handleUpdateRole(role)}
                            >
                                <Text style={styles.roleOptionText}>
                                    {role.charAt(0).toUpperCase() + role.slice(1)}
                                </Text>
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={styles.cancelBtn}
                            onPress={() => {
                                setShowRoleModal(false);
                                setSelectedUser(null);
                            }}
                        >
                            <Text style={styles.cancelText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 20,
    },
    section: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
    },
    userEmail: {
        fontSize: 13,
        color: '#666',
        marginTop: 2,
    },
    tagRow: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 6,
    },
    roleTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 10,
        color: '#fff',
        fontWeight: '600',
        alignSelf: 'flex-start',
        marginTop: 6,
    },
    inactiveTag: {
        backgroundColor: '#FFEBEE',
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 10,
        color: '#F44336',
        fontWeight: '600',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    approveBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    iconBtn: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#f0f0f0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    filterRow: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 20,
    },
    filterBtn: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        backgroundColor: '#e0e0e0',
        borderRadius: 20,
    },
    filterActive: {
        backgroundColor: '#4CAF50',
    },
    filterText: {
        fontSize: 13,
        color: '#666',
    },
    filterTextActive: {
        color: '#fff',
    },
    emptyText: {
        textAlign: 'center',
        color: '#999',
        marginTop: 30,
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 15,
    },
    roleOption: {
        padding: 12,
        borderRadius: 8,
        backgroundColor: '#f5f5f5',
        marginBottom: 8,
    },
    roleOptionActive: {
        backgroundColor: '#4CAF50',
    },
    roleOptionText: {
        fontSize: 15,
        color: '#333',
        textAlign: 'center',
    },
    cancelBtn: {
        padding: 12,
        marginTop: 10,
    },
    cancelText: {
        textAlign: 'center',
        color: '#666',
    },
});
