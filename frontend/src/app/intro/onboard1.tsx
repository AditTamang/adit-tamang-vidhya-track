import { useRouter } from 'expo-router';
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function Onboard1() {
    const router = useRouter();

    return (
        <ScrollView 
            contentContainerStyle={styles.container}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.content}>
                {/* Illustration */}
                <View style={styles.illustrationContainer}>
                    <View style={styles.illustration}>
                        {/* Calendar */}
                        <View style={styles.calendarBox}>
                            <View style={styles.calendarGrid}>
                                {[1, 2, 3, 4, 5, 6, 7].map((day) => (
                                    <View key={day} style={styles.calendarDay} />
                                ))}
                            </View>
                        </View>
                        
                        {/* Stopwatch */}
                        <View style={styles.stopwatch}>
                            <View style={styles.stopwatchCircle} />
                        </View>
                        
                        {/* Phone with Checkmark */}
                        <View style={styles.phone}>
                            <View style={styles.phoneScreen}>
                                <Ionicons name="checkmark-circle" size={40} color="#4CAF50" />
                            </View>
                        </View>
                        
                        {/* Connecting Lines */}
                        <View style={styles.connector1} />
                        <View style={styles.connector2} />
                    </View>
                </View>

                {/* Title */}
                <Text style={styles.title}>Instant School Updates, One Tap</Text>

                {/* Description */}
                <Text style={styles.description}>
                    From class updates to performance insights, manage everything easily — organized, real-time, and secure.
                </Text>

                {/* Navigation */}
                <View style={styles.navigationContainer}>
                    <TouchableOpacity
                        style={styles.nextButton}
                        onPress={() => router.push('/intro/onboard2')}
                    >
                        <Text style={styles.nextButtonText}>Next</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.skipButton}
                        onPress={() => router.replace('/login')}
                    >
                        <Text style={styles.skipButtonText}>Skip</Text>
                    </TouchableOpacity>
                </View>

                {/* Progress Indicator */}
                <View style={styles.progressContainer}>
                    <View style={[styles.progressDot, styles.progressDotActive]} />
                    <View style={styles.progressDot} />
                    <View style={styles.progressDot} />
                </View>
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
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    illustrationContainer: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    illustration: {
        width: 280,
        height: 280,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    calendarBox: {
        position: 'absolute',
        top: 20,
        left: 40,
        width: 80,
        height: 80,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        padding: 8,
    },
    calendarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 4,
    },
    calendarDay: {
        width: 8,
        height: 8,
        backgroundColor: '#fff',
        borderRadius: 2,
    },
    stopwatch: {
        position: 'absolute',
        top: 100,
        right: 50,
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stopwatchCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 4,
        borderColor: '#4CAF50',
    },
    phone: {
        position: 'absolute',
        bottom: 30,
        left: 60,
        width: 100,
        height: 120,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    phoneScreen: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    connector1: {
        position: 'absolute',
        top: 60,
        left: 100,
        width: 2,
        height: 40,
        backgroundColor: '#4CAF50',
        opacity: 0.3,
    },
    connector2: {
        position: 'absolute',
        bottom: 80,
        right: 80,
        width: 2,
        height: 30,
        backgroundColor: '#4CAF50',
        opacity: 0.3,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        textAlign: 'center',
        marginBottom: 16,
        paddingHorizontal: 20,
    },
    description: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
        lineHeight: 22,
        paddingHorizontal: 20,
        marginBottom: 40,
    },
    navigationContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 16,
    },
    nextButton: {
        backgroundColor: '#4CAF50',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    nextButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    skipButton: {
        paddingVertical: 12,
    },
    skipButtonText: {
        color: '#4CAF50',
        fontSize: 14,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 8,
        marginTop: 20,
    },
    progressDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#999',
    },
    progressDotActive: {
        backgroundColor: '#4CAF50',
        width: 24,
    },
});

