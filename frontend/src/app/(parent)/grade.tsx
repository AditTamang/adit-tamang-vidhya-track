import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';
import { COLORS } from '@/constants/Colors';

export default function GradeScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="menu" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <Text style={styles.logoEmoji}>📖</Text>
                    <Text style={styles.logoText}>VidyaTrack</Text>
                </View>

                <View style={{ width: 24 }} />
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={styles.title}>Grade & Performance Tracking</Text>

                {/* Performance Overview Card */}
                <View style={styles.performanceCard}>
                    <Text style={styles.cardTitle}>Performance Overview</Text>

                    {/* Circular Progress */}
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
                                    stroke="#4F46E5"
                                    strokeWidth="10"
                                    fill="none"
                                    strokeDasharray="314"
                                    strokeDashoffset="78.5"
                                    strokeLinecap="round"
                                    transform="rotate(-90 60 60)"
                                />
                            </Svg>
                            <View style={styles.progressText}>
                                <Text style={styles.gradeLabel}>Overall Grade</Text>
                                <Text style={styles.gradeValue}>75%</Text>
                            </View>
                        </View>
                        <Text style={styles.progressLabel}>75%</Text>
                    </View>
                </View>

                {/* Upcoming Assignments */}
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Upcoming Assignments</Text>

                    <View style={[styles.assignmentCard, { backgroundColor: '#FEF3C7' }]}>
                        <View>
                            <Text style={styles.assignmentTitle}>English Essay</Text>
                            <Text style={styles.assignmentDue}>Due in 2 days</Text>
                        </View>
                    </View>

                    <View style={[styles.assignmentCard, { backgroundColor: '#FECACA' }]}>
                        <View>
                            <Text style={styles.assignmentTitle}>Physics Project</Text>
                            <Text style={styles.assignmentDue}>Due tomorrow</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#C5D3D8',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: '#C5D3D8',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    logoEmoji: {
        fontSize: 25,
    },
    logoText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 20,
    },
    performanceCard: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
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
        marginBottom: 20,
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
    gradeLabel: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginBottom: 4,
    },
    gradeValue: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    progressLabel: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
        marginTop: 12,
    },
    section: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    assignmentCard: {
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    assignmentTitle: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 4,
    },
    assignmentDue: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
});