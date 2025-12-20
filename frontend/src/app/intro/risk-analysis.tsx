import { useRouter } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Circle } from 'react-native-svg';

export default function RiskAnalysis() {
    const router = useRouter();

    return (
        <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                {/* Title */}
                <Text style={styles.title}>Student Risk Analysis</Text>

                {/* Risk Level and Score */}
                <View style={styles.riskHeader}>
                    <View style={styles.riskLevelContainer}>
                        <Text style={styles.riskLabel}>Risk Level</Text>
                        <View style={[styles.riskBadge, styles.riskBadgeMedium]}>
                            <Text style={styles.riskBadgeText}>Medium</Text>
                        </View>
                    </View>

                    <View style={styles.riskScoreContainer}>
                        <Svg width="80" height="80">
                            <Circle
                                cx="40"
                                cy="40"
                                r="35"
                                stroke="#E2E8F0"
                                strokeWidth="6"
                                fill="none"
                            />
                            <Circle
                                cx="40"
                                cy="40"
                                r="35"
                                stroke="#3B82F6"
                                strokeWidth="6"
                                fill="none"
                                strokeDasharray="220"
                                strokeDashoffset="55"
                                strokeLinecap="round"
                                transform="rotate(-90 40 40)"
                            />
                        </Svg>
                        <View style={styles.riskScoreText}>
                            <Text style={styles.riskScoreValue}>75%</Text>
                            <Text style={styles.riskScoreLabel}>Risk Score</Text>
                        </View>
                    </View>
                </View>

                {/* Contributing Factors */}
                <View style={styles.factorsSection}>
                    <Text style={styles.sectionTitle}>Contributing Factors</Text>

                    {/* Attendance Rate */}
                    <View style={styles.factorItem}>
                        <Text style={styles.factorLabel}>Attendance Rate</Text>
                        <View style={styles.factorBarContainer}>
                            <View style={[styles.factorBar, styles.factorBarOrange, { width: '78%' }]} />
                        </View>
                        <Text style={styles.factorValue}>78% / 90%</Text>
                    </View>

                    {/* Assignment Completion */}
                    <View style={styles.factorItem}>
                        <Text style={styles.factorLabel}>Assignment Completion</Text>
                        <View style={styles.factorBarContainer}>
                            <View style={[styles.factorBar, styles.factorBarRed, { width: '65%' }]} />
                        </View>
                        <Text style={styles.factorValue}>65% / 85%</Text>
                    </View>

                    {/* Recent Grades */}
                    <View style={styles.factorItem}>
                        <Text style={styles.factorLabel}>Recent Grades</Text>
                        <View style={styles.factorBarContainer}>
                            <View style={[styles.factorBar, styles.factorBarOrange, { width: '72%' }]} />
                        </View>
                        <Text style={styles.factorValue}>72% / 75%</Text>
                    </View>

                    {/* Behavior Score */}
                    <View style={styles.factorItem}>
                        <Text style={styles.factorLabel}>Behavior Score</Text>
                        <View style={styles.factorBarContainer}>
                            <View style={[styles.factorBar, styles.factorBarGreen, { width: '88%' }]} />
                        </View>
                        <Text style={styles.factorValue}>88% / 80%</Text>
                    </View>
                </View>

                {/* Suggested Intervention */}
                <View style={styles.interventionSection}>
                    <View style={styles.interventionHeader}>
                        <Ionicons name="bulb" size={24} color="#4CAF50" />
                        <Text style={styles.interventionTitle}>Suggested Intervention</Text>
                    </View>
                    <Text style={styles.interventionText}>
                        Schedule a parent-teacher meeting to discuss attendance patterns. Consider assigning a study buddy for homework accountability.
                    </Text>
                </View>

                {/* Get Started Button */}
                <TouchableOpacity
                    style={styles.getStartedButton}
                    onPress={() => router.replace('/intro/home-preview')}
                >
                    <Text style={styles.getStartedButtonText}>Get Started</Text>
                    <Ionicons name="arrow-forward" size={20} color="#666" />
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#D1D5DB',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 60,
        paddingBottom: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 24,
        textAlign: 'center',
    },
    riskHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 32,
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
    },
    riskLevelContainer: {
        flex: 1,
    },
    riskLabel: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    riskBadge: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
        alignSelf: 'flex-start',
    },
    riskBadgeMedium: {
        backgroundColor: '#F59E0B',
    },
    riskBadgeText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    riskScoreContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    riskScoreText: {
        position: 'absolute',
        alignItems: 'center',
    },
    riskScoreValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    riskScoreLabel: {
        fontSize: 12,
        color: '#666',
    },
    factorsSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
    },
    factorItem: {
        marginBottom: 20,
    },
    factorLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    factorBarContainer: {
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 4,
        marginBottom: 4,
        overflow: 'hidden',
    },
    factorBar: {
        height: '100%',
        borderRadius: 4,
    },
    factorBarOrange: {
        backgroundColor: '#F59E0B',
    },
    factorBarRed: {
        backgroundColor: '#EF4444',
    },
    factorBarGreen: {
        backgroundColor: '#22C55E',
    },
    factorValue: {
        fontSize: 12,
        color: '#666',
    },
    interventionSection: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
    },
    interventionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 12,
    },
    interventionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000',
    },
    interventionText: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
    },
    getStartedButton: {
        backgroundColor: '#E5E7EB',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    getStartedButtonText: {
        color: '#666',
        fontSize: 16,
        fontWeight: '600',
    },
});

