import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Toast from '@/components/Toast';
import {
    getAllUsers,
    getPendingUsers,
    approveUser,
    rejectUser,
    updateUserRole,
    getClassesSections,
    updateTeacherClasses,
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

const UsersScreen = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [pendingUsers, setPendingUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [showRoleModal, setShowRoleModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    // Pagination and filtering state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalUsers, setTotalUsers] = useState(0);
    const [selectedRole, setSelectedRole] = useState<string>('all'); // all, teacher, student, parent
    const itemsPerPage = 10;

    // Class assignment state
    const [classes, setClasses] = useState<any[]>([]);
    const [showAssignClassModal, setShowAssignClassModal] = useState(false);
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [assigning, setAssigning] = useState(false);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const loadData = async (page = 1) => {
        console.log('loadData started', { page });
        setLoading(true);
        try {
            console.log('Fetching users and pending users...');
            const [usersResponse, pendingResponse] = await Promise.all([
                getAllUsers(page, itemsPerPage),
                getPendingUsers()
            ]);
            console.log('Fetch complete', { usersStatus: usersResponse.status, pendingStatus: pendingResponse.status });

            if (usersResponse.status === 200) {
                setUsers(usersResponse.data.users);
                setTotalPages(usersResponse.data.totalPages || 1);
                setTotalUsers(usersResponse.data.totalUsers || usersResponse.data.users.length);
                setCurrentPage(page);
            }
            if (pendingResponse.status === 200) {
                setPendingUsers(pendingResponse.data);
            }
        } catch (error: any) {
            console.error('Error in loadData:', error);
            showToast(error.message || 'Failed to load users', 'error');
        } finally {
            console.log('Setting loading to false');
            setLoading(false);
            setRefreshing(false);
        }
    };

    // Filter users by role
    useEffect(() => {
        if (selectedRole === 'all') {
            setFilteredUsers(users);
        } else {
            setFilteredUsers(users.filter(user => user.role === selectedRole));
        }
    }, [users, selectedRole]);

    const loadClasses = async () => {
        try {
            const response = await getClassesSections();
            if (response.status === 200) {
                setClasses(response.data);
                return response.data;
            }
        } catch (error) {
            console.log('Error loading classes:', error);
            return null;
        }
    };

    useEffect(() => {
        loadData();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadData(currentPage);
    };

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            loadData(newPage);
        }
    };

    const handleRoleFilter = (role: string) => {
        setSelectedRole(role);
    };

    const getRoleCount = (role: string) => {
        if (role === 'all') return users.length;
        return users.filter(u => u.role === role).length;
    };

    const handleApprove = async (userId: number) => {
        try {
            const response = await approveUser(userId);

            if (response.status === 200) {
                showToast('User approved successfully', 'success');
                loadData();
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to approve user', 'error');
        }
    };

    const handleReject = async (userId: number) => {
        Alert.alert(
            'Reject User',
            'Are you sure? This will permanently delete the user.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Reject',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await rejectUser(userId);

                            if (response.status === 200) {
                                showToast('User rejected and removed', 'success');
                                loadData();
                            }
                        } catch (error: any) {
                            showToast(error.message || 'Failed to reject user', 'error');
                        }
                    }
                }
            ]
        );
    };

    const handleUpdateRole = async (role: string) => {
        if (!selectedUser) return;

        try {
            const response = await updateUserRole(selectedUser.id, role);

            if (response.status === 200) {
                showToast('Role updated successfully', 'success');
                setShowRoleModal(false);
                setSelectedUser(null);
                loadData();
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to update role', 'error');
        }
    };

    const handleToggleStatus = async (user: User) => {
        const action = user.is_active ? 'deactivate' : 'activate';
        Alert.alert(
            `${action.charAt(0).toUpperCase() + action.slice(1)} User`,
            `Are you sure you want to ${action} ${user.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: action.charAt(0).toUpperCase() + action.slice(1),
                    style: user.is_active ? 'destructive' : 'default',
                    onPress: async () => {
                        try {
                            const response = await toggleUserStatus(user.id);
                            if (response.status === 200) {
                                showToast(response.message, 'success');
                                loadData(currentPage);
                            }
                        } catch (error: any) {
                            showToast(error.message || `Failed to ${action} user`, 'error');
                        }
                    }
                }
            ]
        );
    };

    const handleAssignClass = async (user: User) => {
        setSelectedUser(user);
        setShowAssignClassModal(true);
        // Load classes and pre-select current assignments
        const loadedClasses = await loadClasses();
        if (loadedClasses) {
            const currentAssignments: number[] = [];
            loadedClasses.forEach((cls: any) => {
                cls.sections.forEach((sec: any) => {
                    if (sec.teacherId === user.id) {
                        currentAssignments.push(sec.id);
                    }
                });
            });
            setSelectedSections(currentAssignments);
        }
    };

    const toggleSectionSelection = (sectionId: number) => {
        setSelectedSections(prev => {
            if (prev.includes(sectionId)) {
                return prev.filter(id => id !== sectionId);
            } else {
                return [...prev, sectionId];
            }
        });
    };

    const submitClassAssignment = async () => {
        if (!selectedUser) return;

        setAssigning(true);
        try {
            const response = await updateTeacherClasses(selectedUser.id, selectedSections);

            if (response.status === 200) {
                showToast('Class assignments updated', 'success');
                setShowAssignClassModal(false);
                // Reload classes to reflect changes immediately in case we re-open
                loadClasses();
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to update assignments', 'error');
        } finally {
            setAssigning(false);
        }
    };

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin': return '#E91E63';
            case 'teacher': return '#2196F3';
            case 'parent': return '#9C27B0';
            case 'student': return '#4CAF50';
            default: return '#666';
        }
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case 'admin': return 'shield-checkmark';
            case 'teacher': return 'school';
            case 'parent': return 'people';
            case 'student': return 'person';
            default: return 'person';
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
                <Text style={styles.loadingText}>Loading Users...</Text>
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
                    <Text style={styles.headerTitle}>User Management</Text>
                    <Text style={styles.headerSubtitle}>Manage all registered users</Text>
                </View>

                {/* Pending Approvals */}
                {pendingUsers.length > 0 && (
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>
                            Pending Approvals ({pendingUsers.length})
                        </Text>
                        {pendingUsers.map(user => (
                            <View key={user.id} style={styles.userCard}>
                                <View style={styles.userInfo}>
                                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                        <Ionicons name={getRoleIcon(user.role) as any} size={16} color={getRoleColor(user.role)} />
                                    </View>
                                    <View style={styles.userDetails}>
                                        <Text style={styles.userName}>{user.name}</Text>
                                        <Text style={styles.userEmail}>{user.email}</Text>
                                        <Text style={styles.userRole}>{user.role.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <View style={styles.actionButtons}>
                                    <TouchableOpacity
                                        style={styles.approveButton}
                                        onPress={() => handleApprove(user.id)}
                                    >
                                        <Ionicons name="checkmark" size={20} color="#fff" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.rejectButton}
                                        onPress={() => handleReject(user.id)}
                                    >
                                        <Ionicons name="close" size={20} color="#fff" />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </View>
                )}

                {/* Role Filter Tabs */}
                <View style={styles.section}>
                    <View style={styles.filterContainer}>
                        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScrollContent}>
                            <TouchableOpacity
                                style={[styles.filterTab, selectedRole === 'all' && styles.filterTabActive]}
                                onPress={() => handleRoleFilter('all')}
                            >
                                <Text style={[styles.filterTabText, selectedRole === 'all' && styles.filterTabTextActive]}>
                                    All ({getRoleCount('all')})
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterTab, selectedRole === 'teacher' && styles.filterTabActive]}
                                onPress={() => handleRoleFilter('teacher')}
                            >
                                <Ionicons name="school" size={18} color={selectedRole === 'teacher' ? '#fff' : '#999'} />
                                <Text style={[styles.filterTabText, selectedRole === 'teacher' && styles.filterTabTextActive]}>
                                    Teachers ({getRoleCount('teacher')})
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterTab, selectedRole === 'student' && styles.filterTabActive]}
                                onPress={() => handleRoleFilter('student')}
                            >
                                <Ionicons name="person" size={18} color={selectedRole === 'student' ? '#fff' : '#999'} />
                                <Text style={[styles.filterTabText, selectedRole === 'student' && styles.filterTabTextActive]}>
                                    Students ({getRoleCount('student')})
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.filterTab, selectedRole === 'parent' && styles.filterTabActive]}
                                onPress={() => handleRoleFilter('parent')}
                            >
                                <Ionicons name="people" size={18} color={selectedRole === 'parent' ? '#fff' : '#999'} />
                                <Text style={[styles.filterTabText, selectedRole === 'parent' && styles.filterTabTextActive]}>
                                    Parents ({getRoleCount('parent')})
                                </Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>

                    {/* Users List */}
                    <View style={styles.usersListHeader}>
                        <Text style={styles.sectionTitle}>
                            {selectedRole === 'all' ? 'All Users' : `${selectedRole.charAt(0).toUpperCase() + selectedRole.slice(1)}s`}
                        </Text>
                        <Text style={styles.userCount}>
                            {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
                        </Text>
                    </View>

                    {filteredUsers.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Ionicons name="people-outline" size={48} color="#CCC" />
                            <Text style={styles.emptyStateText}>No users found</Text>
                        </View>
                    ) : (
                        filteredUsers.map(user => (
                            <View key={user.id} style={styles.userCard}>
                                <View style={styles.userInfo}>
                                    <View style={[styles.roleBadge, { backgroundColor: getRoleColor(user.role) + '20' }]}>
                                        <Ionicons name={getRoleIcon(user.role) as any} size={16} color={getRoleColor(user.role)} />
                                    </View>
                                    <View style={styles.userDetails}>
                                        <Text style={styles.userName}>{user.name}</Text>
                                        <Text style={styles.userEmail}>{user.email}</Text>
                                        <View style={styles.userMetaRow}>
                                            <Text style={[styles.roleTag, { backgroundColor: getRoleColor(user.role) }]}>
                                                {user.role.toUpperCase()}
                                            </Text>
                                            {user.is_approved && (
                                                <View style={styles.approvedBadge}>
                                                    <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                                                    <Text style={styles.approvedText}>Approved</Text>
                                                </View>
                                            )}
                                            {user.is_active === false && (
                                                <View style={[styles.approvedBadge, { backgroundColor: '#FFEBEE' }]}>
                                                    <Ionicons name="close-circle" size={14} color="#F44336" />
                                                    <Text style={[styles.approvedText, { color: '#F44336' }]}>Inactive</Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                </View>
                                {user.role !== 'admin' && (
                                    <View style={{ flexDirection: 'row', gap: 8 }}>
                                        {/* Toggle Active Status */}
                                        <TouchableOpacity
                                            style={[styles.editButton, { backgroundColor: user.is_active === false ? '#E8F5E9' : '#FFEBEE' }]}
                                            onPress={() => handleToggleStatus(user)}
                                        >
                                            <Ionicons
                                                name={user.is_active === false ? "power" : "power"}
                                                size={20}
                                                color={user.is_active === false ? "#4CAF50" : "#F44336"}
                                            />
                                        </TouchableOpacity>
                                        {user.role === 'teacher' && (
                                            <TouchableOpacity
                                                style={[styles.editButton, { backgroundColor: '#E3F2FD' }]}
                                                onPress={() => handleAssignClass(user)}
                                            >
                                                <Ionicons name="school-outline" size={20} color="#2196F3" />
                                            </TouchableOpacity>
                                        )}
                                        <TouchableOpacity
                                            style={styles.editButton}
                                            onPress={() => {
                                                setSelectedUser(user);
                                                setShowRoleModal(true);
                                            }}
                                        >
                                            <Ionicons name="create-outline" size={20} color="#666" />
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        ))
                    )}

                    {/* Pagination Controls */}
                    {totalPages > 1 && (
                        <View style={styles.paginationContainer}>
                            <TouchableOpacity
                                style={[styles.paginationButton, currentPage === 1 && styles.paginationButtonDisabled]}
                                onPress={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                            >
                                <Ionicons name="chevron-back" size={20} color={currentPage === 1 ? '#CCC' : '#4CAF50'} />
                            </TouchableOpacity>

                            <View style={styles.paginationInfo}>
                                <Text style={styles.paginationText}>
                                    Page {currentPage} of {totalPages}
                                </Text>
                                <Text style={styles.paginationSubtext}>
                                    {totalUsers} total users
                                </Text>
                            </View>

                            <TouchableOpacity
                                style={[styles.paginationButton, currentPage === totalPages && styles.paginationButtonDisabled]}
                                onPress={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                            >
                                <Ionicons name="chevron-forward" size={20} color={currentPage === totalPages ? '#CCC' : '#4CAF50'} />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>

            {/* Assign Class Modal */}
            <Modal
                visible={showAssignClassModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowAssignClassModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Assign Classes</Text>
                        <Text style={styles.modalSubtitle}>Teacher: {selectedUser?.name}</Text>

                        <ScrollView style={{ maxHeight: 300 }}>
                            {classes.map(cls => (
                                <View key={cls.id} style={{ marginBottom: 15 }}>
                                    <Text style={{ fontWeight: 'bold', marginBottom: 8, fontSize: 16 }}>
                                        {cls.name}
                                    </Text>
                                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                                        {cls.sections.map((sec: any) => {
                                            const isSelected = selectedSections.includes(sec.id);
                                            const isAssignedToOther = sec.teacherId && sec.teacherId !== selectedUser?.id;

                                            return (
                                                <TouchableOpacity
                                                    key={sec.id}
                                                    style={[
                                                        styles.roleOption,
                                                        { padding: 10, flex: 0, minWidth: 60, justifyContent: 'center' },
                                                        isSelected && styles.roleOptionActive,
                                                        isAssignedToOther && { opacity: 0.6, backgroundColor: '#ffebee' }
                                                    ]}
                                                    onPress={() => toggleSectionSelection(sec.id)}
                                                >
                                                    <Text style={[
                                                        styles.roleOptionText,
                                                        isSelected && styles.roleOptionTextActive,
                                                        { fontSize: 14 },
                                                        isAssignedToOther && { color: '#d32f2f', fontSize: 12 }
                                                    ]}>
                                                        Sec {sec.name}
                                                        {isAssignedToOther && ` (${sec.teacherName?.split(' ')[0]})`}
                                                    </Text>
                                                    {isSelected && (
                                                        <Ionicons name="checkmark-circle" size={16} color="#fff" style={{ marginLeft: 4 }} />
                                                    )}
                                                </TouchableOpacity>
                                            );
                                        })}
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        <View style={{ flexDirection: 'row', gap: 10, marginTop: 20 }}>
                            <TouchableOpacity
                                style={[styles.modalCloseButton, { flex: 1 }]}
                                onPress={() => setShowAssignClassModal(false)}
                            >
                                <Text style={styles.modalCloseText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalCloseButton, { flex: 1, backgroundColor: '#4CAF50' }]}
                                onPress={submitClassAssignment}
                                disabled={assigning}
                            >
                                {assigning ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={[styles.modalCloseText, { color: '#fff' }]}>Save Assignments</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Role Update Modal */}
            <Modal
                visible={showRoleModal}
                transparent
                animationType="slide"
                onRequestClose={() => setShowRoleModal(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Update Role</Text>
                        <Text style={styles.modalSubtitle}>{selectedUser?.name}</Text>

                        <View style={styles.roleOptions}>
                            {['student', 'teacher', 'parent'].map(role => (
                                <TouchableOpacity
                                    key={role}
                                    style={[
                                        styles.roleOption,
                                        selectedUser?.role === role && styles.roleOptionActive
                                    ]}
                                    onPress={() => handleUpdateRole(role)}
                                >
                                    <Ionicons
                                        name={getRoleIcon(role) as any}
                                        size={24}
                                        color={selectedUser?.role === role ? '#fff' : getRoleColor(role)}
                                    />
                                    <Text style={[
                                        styles.roleOptionText,
                                        selectedUser?.role === role && styles.roleOptionTextActive
                                    ]}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <TouchableOpacity
                            style={styles.modalCloseButton}
                            onPress={() => {
                                setShowRoleModal(false);
                                setSelectedUser(null);
                            }}
                        >
                            <Text style={styles.modalCloseText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

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
        marginBottom: 25,
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
    section: {
        marginBottom: 25,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#000',
        marginBottom: 12,
    },
    userCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    roleBadge: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    userDetails: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
        marginBottom: 4,
    },
    userEmail: {
        fontSize: 13,
        color: '#666',
        marginBottom: 6,
    },
    userMetaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    userRole: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666',
    },
    roleTag: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: 4,
        fontSize: 10,
        fontWeight: '600',
        color: '#fff',
    },
    approvedBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    approvedText: {
        fontSize: 11,
        color: '#4CAF50',
        fontWeight: '500',
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 8,
    },
    approveButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    rejectButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F44336',
        justifyContent: 'center',
        alignItems: 'center',
    },
    editButton: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 25,
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    modalSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    roleOptions: {
        gap: 12,
        marginBottom: 20,
    },
    roleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        gap: 12,
    },
    roleOptionActive: {
        backgroundColor: '#4CAF50',
    },
    roleOptionText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    roleOptionTextActive: {
        color: '#fff',
    },
    modalCloseButton: {
        padding: 15,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
    },
    modalCloseText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    // Filter tabs styles
    filterContainer: {
        marginBottom: 20,
        paddingVertical: 10,
    },
    filterScrollContent: {
        paddingHorizontal: 0,
        gap: 12,
    },
    filterTab: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
        paddingVertical: 14,
        paddingHorizontal: 20,
        borderRadius: 24,
        backgroundColor: '#E8E8E8',
    },
    filterTabActive: {
        backgroundColor: '#4CAF50',
    },
    filterTabText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#666',
    },
    filterTabTextActive: {
        color: '#fff',
    },
    // Users list header
    usersListHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    userCount: {
        fontSize: 14,
        color: '#999',
    },
    // Empty state
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 40,
    },
    emptyStateText: {
        fontSize: 16,
        color: '#999',
        marginTop: 12,
    },
    // Pagination styles
    paginationContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: '#E5E7EB',
    },
    paginationButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationButtonDisabled: {
        opacity: 0.4,
    },
    paginationInfo: {
        alignItems: 'center',
    },
    paginationText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
    },
    paginationSubtext: {
        fontSize: 12,
        color: '#999',
        marginTop: 2,
    },
});

export default UsersScreen;
