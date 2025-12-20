import React from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

export default function DashboardScreen() {
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity>
                    <Ionicons name="menu" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>

                <View style={styles.logoContainer}>
                    <Text style={styles.logoEmoji}>🌳</Text>
                    <Text style={styles.logoText}>VidyaTrack</Text>
                </View>

                <TouchableOpacity>
                    <Ionicons name="search" size={24} color={COLORS.textPrimary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Title */}
                <Text style={styles.title}>Features</Text>
                <Text style={styles.subtitle}>You can select multiple symptoms</Text>

                {/* Feature Grid */}
                <View style={styles.grid}>
                    {/* Dashboard */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="home" size={28} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureText}>Dashboard</Text>
                    </TouchableOpacity>

                    {/* Fee */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="card" size={28} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureText}>Fee</Text>
                    </TouchableOpacity>

                    {/* Homework */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="document-text" size={28} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureText}>Homework</Text>
                    </TouchableOpacity>

                    {/* Student Profile */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="person" size={28} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureText}>Student Profile</Text>
                    </TouchableOpacity>

                    {/* Attendance */}
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}>
                            <Ionicons name="calendar" size={28} color={COLORS.textPrimary} />
                        </View>
                        <Text style={styles.featureText}>Attendance</Text>
                    </TouchableOpacity>
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
        fontSize: 24,
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
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: COLORS.textSecondary,
        marginBottom: 24,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 16,
        paddingBottom: 20,
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
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#E8EDF0',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureText: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        textAlign: 'center',
    },
});