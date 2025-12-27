import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

// Grade interface
interface Grade {
    id: number;
    subject: string;
    marks: number;
    total_marks: number;
    grade: string;
}

export default function GradeScreen() {
    const [loading, setLoading] = useState(true);
    const [studentName, setStudentName] = useState('');
    const [studentId, setStudentId] = useState<number | null>(null);
    const [grades, setGrades] = useState<Grade[]>([]);
    const [overallPercentage, setOverallPercentage] = useState(0);

    useEffect(() => {
        loadGrades();
    }, []);

    const loadGrades = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            // First get linked student
            const studentRes = await fetch(`${API_BASE_URL}/api/parent-student/linked`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const studentData = await studentRes.json();

            if (studentData.status === 200 && studentData.data && studentData.data.length > 0) {
                const student = studentData.data[0];
                setStudentName(student.name);
                setStudentId(student.id);

                // Fetch real grades from API
                const gradesRes = await fetch(`${API_BASE_URL}/api/grades/student/${student.id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                const gradesData = await gradesRes.json();

                if (gradesData.status === 200 && gradesData.data && gradesData.data.length > 0) {
                    setGrades(gradesData.data);

                    // Calculate overall percentage
                    const totalMarks = gradesData.data.reduce((sum: number, g: Grade) => sum + Number(g.marks), 0);
                    const totalPossible = gradesData.data.reduce((sum: number, g: Grade) => sum + Number(g.total_marks), 0);
                    const percentage = Math.round((totalMarks / totalPossible) * 100);
                    setOverallPercentage(percentage);
                } else {
                    // No grades yet - show empty state
                    setGrades([]);
                    setOverallPercentage(0);
                }
            }
        } catch (error) {
            console.log('Error loading grades:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate circle progress
    const circumference = 2 * Math.PI * 50;
    const strokeDashoffset = circumference - (overallPercentage / 100) * circumference;

    // Get color based on grade
    const getGradeColor = (grade: string) => {
        if (grade.startsWith('A')) return '#4CAF50';
        if (grade.startsWith('B')) return '#2196F3';
        if (grade.startsWith('C')) return '#FF9800';
        return '#F44336';
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
                <Text style={styles.title}>Grades</Text>
                {studentName ? (
                    <Text style={styles.studentName}>{studentName}</Text>
                ) : null}
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {grades.length === 0 ? (
                    // Empty State
                    <View style={styles.emptyContainer}>
                        <Ionicons name="school-outline" size={60} color={COLORS.textLight} />
                        <Text style={styles.emptyTitle}>No Grades Yet</Text>
                        <Text style={styles.emptySubtext}>
                            Grades will appear here once teachers add them
                        </Text>
                    </View>
                ) : (
                    <>
                        {/* Overall Performance Card */}
                        <View style={styles.performanceCard}>
                            <Text style={styles.cardTitle}>Overall Performance</Text>

                            <View style={styles.progressContainer}>
                                <View style={styles.progressCircle}>
                                    <Svg width="120" height="120">
                                        {/* Background Circle */}
                                        <Circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke="#E2E8F0"
                                            strokeWidth="10"
                                            fill="none"
                                        />
                                        {/* Progress Circle */}
                                        <Circle
                                            cx="60"
                                            cy="60"
                                            r="50"
                                            stroke={overallPercentage >= 80 ? '#4CAF50' : overallPercentage >= 60 ? '#2196F3' : '#FF9800'}
                                            strokeWidth="10"
                                            fill="none"
                                            strokeDasharray={circumference}
                                            strokeDashoffset={strokeDashoffset}
                                            strokeLinecap="round"
                                            transform="rotate(-90 60 60)"
                                        />
                                    </Svg>
                                    <View style={styles.progressText}>
                                        <Text style={styles.percentageValue}>{overallPercentage}%</Text>
                                        <Text style={styles.percentageLabel}>Overall</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Subject-wise Grades */}
                        <Text style={styles.sectionTitle}>Subject-wise Grades</Text>

                        {grades.map((grade) => (
                            <View key={grade.id} style={styles.gradeCard}>
                                <View style={styles.gradeInfo}>
                                    <Text style={styles.subjectName}>{grade.subject}</Text>
                                    <Text style={styles.marksText}>
                                        {grade.marks} / {grade.total_marks}
                                    </Text>
                                </View>
                                <View style={[styles.gradeBadge, { backgroundColor: getGradeColor(grade.grade) }]}>
                                    <Text style={styles.gradeText}>{grade.grade}</Text>
                                </View>
                            </View>
                        ))}
                    </>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
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
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    studentName: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 60,
    },
    emptyTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 16,
    },
    emptySubtext: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginTop: 8,
        textAlign: 'center',
    },
    performanceCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 16,
    },
    progressContainer: {
        alignItems: 'center',
    },
    progressCircle: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressText: {
        position: 'absolute',
        alignItems: 'center',
    },
    percentageValue: {
        fontSize: 28,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    percentageLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    gradeCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    gradeInfo: {
        flex: 1,
    },
    subjectName: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    marksText: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    gradeBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    gradeText: {
        fontSize: 14,
        fontWeight: '700',
        color: COLORS.white,
    },
});