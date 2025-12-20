import { useRouter } from 'expo-router';
import React, { useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const { height } = Dimensions.get('window');

export default function Onboard3() {
    const router = useRouter();
    const navigated = useRef(false);

    const handleScroll = ({
        nativeEvent,
    }: {
        nativeEvent: {
            contentOffset: { y: number };
            contentSize: { height: number };
            layoutMeasurement: { height: number };
        };
    }) => {
        if (navigated.current) return;
        const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
        const nearBottom =
            contentOffset.y + layoutMeasurement.height >= contentSize.height - 40;
        if (nearBottom) {
            navigated.current = true;
            router.push('/intro/risk-analysis');
        }
    };

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView 
                contentContainerStyle={styles.container}
                showsVerticalScrollIndicator={false}
                bounces={false}
                onScroll={handleScroll}
                scrollEventThrottle={16}
            >
                <View style={styles.content}>
                    {/* Logo and Branding */}
                    <View style={styles.logoCard}>
                        <View style={styles.logoContainer}>
                            <View style={styles.logoIcon}>
                                <Ionicons name="book" size={24} color="#fff" />
                            </View>
                            <Text style={styles.logoText}>VidhyaTrack</Text>
                        </View>
                    </View>

                    {/* Tagline */}
                    <Text style={styles.tagline}>
                        In every report, we reveal <Text style={styles.taglineBold}>progress;</Text>{'\n'}
                        in every step, we guide <Text style={styles.taglineBold}>success.</Text>
                    </Text>

                    {/* Description */}
                    <Text style={styles.description}>
                        Nepal's first smart school communication platform. Connecting schools, parents, and students for better learning. Track progress, receive real-time updates, and stay engaged every day. From attendance to assignments and results — everything you need for education, right at your fingertips.
                    </Text>

                    {/* Student Image Placeholder */}
                    <View style={styles.studentImageContainer}>
                        <View style={styles.studentImagePlaceholder}>
                            <Ionicons name="school" size={60} color="#4CAF50" />
                            <Text style={styles.imagePlaceholderText}>Graduation Photo</Text>
                        </View>
                    </View>

                    {/* Navigation */}
                    <View style={styles.navigationContainer}>
                        <TouchableOpacity
                            style={styles.getStartedButton}
                            onPress={() => router.push('/intro/risk-analysis')}
                        >
                            <Text style={styles.getStartedButtonText}>Get Started</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.learnMoreButton}
                            onPress={() => router.push('/intro/risk-analysis')}
                        >
                            <Text style={styles.learnMoreButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Progress Indicator */}
                    <View style={styles.progressContainer}>
                        <View style={styles.progressDot} />
                        <View style={styles.progressDot} />
                        <View style={[styles.progressDot, styles.progressDotActive]} />
                    </View>

                    {/* Swipe Indicator */}
                    <View style={styles.swipeIndicator}>
                        <Ionicons name="chevron-up" size={20} color="#4CAF50" />
                        <Text style={styles.swipeText}>Swipe up for more</Text>
                    </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
    );
}

export function Onboard3Details() {
    const router = useRouter();

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <ScrollView
                contentContainerStyle={detailsStyles.container}
                showsVerticalScrollIndicator={false}
                bounces={false}
            >
                <View style={detailsStyles.content}>
                    {/* Logo and Branding */}
                    <View style={detailsStyles.logoCard}>
                        <View style={detailsStyles.logoContainer}>
                            <View style={detailsStyles.logoIcon}>
                                <Ionicons name="book" size={24} color="#fff" />
                            </View>
                            <Text style={detailsStyles.logoText}>VidhyaTrack</Text>
                        </View>
                    </View>

                    {/* Tagline */}
                    <Text style={detailsStyles.tagline}>
                        In every report, we reveal <Text style={detailsStyles.taglineBold}>progress;</Text>{'\n'}
                        in every step, we guide <Text style={detailsStyles.taglineBold}>success.</Text>
                    </Text>

                    {/* Description */}
                    <Text style={detailsStyles.description}>
                        Nepal's first smart school communication platform. Connecting schools, parents, and students for better learning. Track progress, receive real-time updates, and stay engaged every day. From attendance to assignments and results — everything you need for education, right at your fingertips.
                    </Text>

                    {/* Student Image Placeholder */}
                    <View style={detailsStyles.studentImageContainer}>
                        <View style={detailsStyles.studentImagePlaceholder}>
                            <Ionicons name="school" size={60} color="#4CAF50" />
                            <Text style={detailsStyles.imagePlaceholderText}>Graduation Photo</Text>
                        </View>
                    </View>

                    {/* Navigation */}
                    <View style={detailsStyles.navigationContainer}>
                        <TouchableOpacity
                            style={detailsStyles.getStartedButton}
                            onPress={() => router.push('/intro/risk-analysis')}
                        >
                            <Text style={detailsStyles.getStartedButtonText}>Get Started</Text>
                            <Ionicons name="arrow-forward" size={20} color="#fff" />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={detailsStyles.learnMoreButton}
                            onPress={() => router.push('/intro/risk-analysis')}
                        >
                            <Text style={detailsStyles.learnMoreButtonText}>Learn More</Text>
                        </TouchableOpacity>
                    </View>

                    {/* AI Early Warning System Section */}
                    <View style={detailsStyles.featureSection}>
                        <Text style={detailsStyles.featureTitle}>Predict Risk Before It's Too Late</Text>
                        <Text style={detailsStyles.featureDescription}>
                            Our AI Early Warning System analyzes patterns in attendance, grades, homework completion, and behavior to identify students who may need additional support before they fall behind.
                        </Text>

                        {/* Features Grid */}
                        <View style={detailsStyles.featuresGrid}>
                            {/* Multi-Factor Analysis */}
                            <View style={detailsStyles.featureCard}>
                                <View style={detailsStyles.featureIcon}>
                                    <Ionicons name="pulse" size={24} color="#4CAF50" />
                                </View>
                                <Text style={detailsStyles.featureCardTitle}>Multi-Factor Analysis</Text>
                                <Text style={detailsStyles.featureCardDescription}>
                                    Combines attendance, grades, assignments, and behavior data
                                </Text>
                            </View>

                            {/* Risk Categories */}
                            <View style={detailsStyles.featureCard}>
                                <View style={detailsStyles.featureIcon}>
                                    <Ionicons name="warning" size={24} color="#4CAF50" />
                                </View>
                                <Text style={detailsStyles.featureCardTitle}>Risk Categories</Text>
                                <Text style={detailsStyles.featureCardDescription}>
                                    Clear low, medium, and high risk classifications
                                </Text>
                            </View>

                            {/* Intervention Suggestions */}
                            <View style={detailsStyles.featureCard}>
                                <View style={detailsStyles.featureIcon}>
                                    <Ionicons name="thumbs-up" size={24} color="#4CAF50" />
                                </View>
                                <Text style={detailsStyles.featureCardTitle}>Intervention Suggestions</Text>
                                <Text style={detailsStyles.featureCardDescription}>
                                    AI-recommended actions tailored to each student
                                </Text>
                            </View>

                            {/* Progress Tracking */}
                            <View style={detailsStyles.featureCard}>
                                <View style={detailsStyles.featureIcon}>
                                    <Ionicons name="bar-chart" size={24} color="#4CAF50" />
                                </View>
                                <Text style={detailsStyles.featureCardTitle}>Progress Tracking</Text>
                                <Text style={detailsStyles.featureCardDescription}>
                                    Monitor intervention effectiveness over time
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Swipe Indicator */}
                    <View style={detailsStyles.swipeIndicator}>
                        <Ionicons name="chevron-up" size={20} color="#4CAF50" />
                        <Text style={detailsStyles.swipeText}>Swipe up for risk analysis</Text>
                    </View>
                </View>
            </ScrollView>
        </GestureHandlerRootView>
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
        paddingTop: 40,
        paddingBottom: 40,
        alignItems: 'center',
    },
    logoCard: {
        backgroundColor: '#B8E6B8',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        width: '100%',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    tagline: {
        fontSize: 20,
        fontWeight: '600',
        fontStyle: 'italic',
        color: '#000',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 28,
    },
    taglineBold: {
        fontWeight: '800',
    },
    description: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    studentImageContainer: {
        width: '100%',
        height: 200,
        marginBottom: 30,
        backgroundColor: '#B8E6B8',
        borderRadius: 16,
        overflow: 'hidden',
    },
    studentImagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePlaceholderText: {
        marginTop: 10,
        fontSize: 12,
        color: '#4CAF50',
    },
    navigationContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
        marginBottom: 20,
    },
    getStartedButton: {
        backgroundColor: '#4CAF50',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    getStartedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    learnMoreButton: {
        backgroundColor: '#666',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    learnMoreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    progressContainer: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 20,
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
    swipeIndicator: {
        alignItems: 'center',
        gap: 4,
    },
    swipeText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
});

const detailsStyles = StyleSheet.create({
    container: {
        flexGrow: 1,
        backgroundColor: '#D1D5DB',
    },
    content: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 40,
        paddingBottom: 40,
    },
    logoCard: {
        backgroundColor: '#B8E6B8',
        borderRadius: 16,
        padding: 20,
        marginBottom: 24,
        width: '100%',
        alignItems: 'center',
    },
    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    logoIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logoText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#4CAF50',
    },
    tagline: {
        fontSize: 20,
        fontWeight: '600',
        fontStyle: 'italic',
        color: '#000',
        textAlign: 'center',
        marginBottom: 16,
        lineHeight: 28,
    },
    taglineBold: {
        fontWeight: '800',
    },
    description: {
        fontSize: 13,
        color: '#333',
        textAlign: 'center',
        lineHeight: 20,
        marginBottom: 24,
    },
    studentImageContainer: {
        width: '100%',
        height: 200,
        marginBottom: 30,
        backgroundColor: '#B8E6B8',
        borderRadius: 16,
        overflow: 'hidden',
    },
    studentImagePlaceholder: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
    },
    imagePlaceholderText: {
        marginTop: 10,
        fontSize: 12,
        color: '#4CAF50',
    },
    navigationContainer: {
        width: '100%',
        alignItems: 'center',
        gap: 12,
        marginBottom: 30,
    },
    getStartedButton: {
        backgroundColor: '#4CAF50',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    getStartedButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    learnMoreButton: {
        backgroundColor: '#666',
        width: '100%',
        paddingVertical: 16,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    learnMoreButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    featureSection: {
        backgroundColor: '#B8E6B8',
        borderRadius: 16,
        padding: 20,
        marginTop: 20,
    },
    featureTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 12,
    },
    featureDescription: {
        fontSize: 14,
        color: '#333',
        lineHeight: 20,
        marginBottom: 20,
    },
    featuresGrid: {
        gap: 16,
    },
    featureCard: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
    },
    featureIcon: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: '#E8F5E9',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    featureCardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    featureCardDescription: {
        fontSize: 13,
        color: '#666',
        lineHeight: 18,
    },
    swipeIndicator: {
        alignItems: 'center',
        gap: 4,
        marginTop: 20,
    },
    swipeText: {
        fontSize: 12,
        color: '#4CAF50',
        fontWeight: '500',
    },
});

