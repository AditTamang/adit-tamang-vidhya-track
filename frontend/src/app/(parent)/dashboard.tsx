import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

// Simple interface for linked student
interface LinkedStudent {
    id: number;
    name: string;
    email: string;
    class_name?: string;
    section?: string;
}

export default function ParentDashboard() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [parentName, setParentName] = useState('Parent');
    const [linkedStudents, setLinkedStudents] = useState<LinkedStudent[]>([]);
    const [showLinkModal, setShowLinkModal] = useState(false);
    const [studentCode, setStudentCode] = useState('');
    const [linking, setLinking] = useState(false);

    // Load parent data and linked students on screen load
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');
            const userData = await AsyncStorage.getItem('userData');

            // Get parent name
            if (userData) {
                const user = JSON.parse(userData);
                setParentName(user.name || 'Parent');
            }

            // Fetch linked students
            const response = await fetch(`${API_BASE_URL}/api/parent-student/linked`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.status === 200 && data.data) {
                setLinkedStudents(data.data);
            }
        } catch (error) {
            console.log('Error loading data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLinkChild = async () => {
        if (!studentCode.trim()) {
            alert('Please enter a student code');
            return;
        }

        setLinking(true);
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            console.log('[Link Child] Requesting link for code:', studentCode);
            console.log('[Link Child] Token exists:', !!token);

            const response = await fetch(`${API_BASE_URL}/api/parent-student/request-by-code`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ studentCode })
            });

            console.log('[Link Child] Response status:', response.status);

            const data = await response.json();
            console.log('[Link Child] Response data:', data);

            if (data.status === 201) {
                alert('Success! Link request sent. Please wait for admin approval.');
                setShowLinkModal(false);
                setStudentCode('');
            } else {
                console.error('[Link Child] Server error:', data.message);
                alert(data.message || 'Failed to link student');
            }
        } catch (error: any) {
            console.error('[Link Child] Caught error:', error);
            console.error('[Link Child] Error message:', error.message);
            alert(`Error: ${error.message || 'Network error'}`);
        } finally {
            setLinking(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hi, {parentName}!</Text>
                    <Text style={styles.subGreeting}>Parent Dashboard</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="notifications-outline" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Linked Students Section */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <Text style={styles.sectionTitle}>My Children</Text>
                    <TouchableOpacity onPress={() => setShowLinkModal(true)}>
                        <Text style={{ color: COLORS.primary, fontWeight: '600' }}>+ Link Child</Text>
                    </TouchableOpacity>
                </View>

                {linkedStudents.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Ionicons name="person-add-outline" size={40} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No linked students yet</Text>
                        <Text style={styles.emptySubtext}>Tap "Link Child" to add</Text>
                        <TouchableOpacity style={styles.linkButton} onPress={() => setShowLinkModal(true)}>
                            <Text style={styles.linkButtonText}>Link Child</Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    linkedStudents.map((student) => (
                        <View key={student.id} style={styles.studentCard}>
                            <View style={styles.studentAvatar}>
                                <Text style={styles.avatarText}>
                                    {student.name.charAt(0).toUpperCase()}
                                </Text>
                            </View>
                            <View style={styles.studentInfo}>
                                <Text style={styles.studentName}>{student.name}</Text>
                                <Text style={styles.studentClass}>
                                    {student.class_name ? `Class ${student.class_name}` : 'Class not assigned'}
                                    {student.section ? ` - Section ${student.section}` : ''}
                                </Text>
                            </View>
                        </View>
                    ))
                )}

                {/* Quick Actions */}
                <Text style={[styles.sectionTitle, { marginTop: 24 }]}>Quick Actions</Text>

                <View style={styles.grid}>
                    {/* Grades */}
                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push('/(parent)/grade')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
                            <Ionicons name="school" size={28} color="#4CAF50" />
                        </View>
                        <Text style={styles.featureText}>Grades</Text>
                    </TouchableOpacity>

                    {/* Schedule */}
                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push('/(parent)/schedule')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
                            <Ionicons name="calendar" size={28} color="#1976D2" />
                        </View>
                        <Text style={styles.featureText}>Schedule</Text>
                    </TouchableOpacity>

                    {/* Attendance */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
                            <Ionicons name="checkmark-circle" size={28} color="#F57C00" />
                        </View>
                        <Text style={styles.featureText}>Attendance</Text>
                    </TouchableOpacity>

                    {/* Messages */}
                    <TouchableOpacity
                        style={styles.featureCard}
                        onPress={() => router.push('/(parent)/messages')}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: '#FCE4EC' }]}>
                            <Ionicons name="chatbubbles" size={28} color="#E91E63" />
                        </View>
                        <Text style={styles.featureText}>Messages</Text>
                    </TouchableOpacity>

                    {/* Fee */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#F3E5F5' }]}>
                            <Ionicons name="card" size={28} color="#9C27B0" />
                        </View>
                        <Text style={styles.featureText}>Fee</Text>
                    </TouchableOpacity>

                    {/* Homework */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={[styles.iconCircle, { backgroundColor: '#E0F7FA' }]}>
                            <Ionicons name="document-text" size={28} color="#00ACC1" />
                        </View>
                        <Text style={styles.featureText}>Homework</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>

            {/* Link Child Modal */}
            {showLinkModal && (
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Link Your Child</Text>
                        <Text style={styles.modalSubtext}>Enter the Student Code provided by the school</Text>

                        <TextInput
                            style={styles.input}
                            placeholder="Student Code (e.g., STU20251234)"
                            value={studentCode}
                            onChangeText={setStudentCode}
                            autoCapitalize="characters"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setShowLinkModal(false)}
                                disabled={linking}
                            >
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.saveBtn}
                                onPress={handleLinkChild}
                                disabled={linking}
                            >
                                {linking ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.saveBtnText}>Request Link</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    greeting: {
        fontSize: 22,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    subGreeting: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    emptyCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        marginBottom: 16,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    studentCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    studentAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    avatarText: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.white,
    },
    studentInfo: {
        flex: 1,
    },
    studentName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    studentClass: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
        paddingBottom: 30,
    },
    featureCard: {
        width: '47%',
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconCircle: {
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureText: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
    linkButton: {
        marginTop: 15,
        backgroundColor: COLORS.primary,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    linkButtonText: {
        color: '#fff',
        fontWeight: '600',
    },
    modalOverlay: {
        position: 'absolute',
        top: 0, bottom: 0, left: 0, right: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 24,
        width: '85%',
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8,
        textAlign: 'center',
    },
    modalSubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 20,
        color: '#333',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    saveBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
});