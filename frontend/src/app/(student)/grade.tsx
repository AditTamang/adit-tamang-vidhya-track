import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '@/constants/Colors';

export default function StudentGrades() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>My Grades</Text>
            <Text style={styles.subtitle}>Coming soon...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: COLORS.background },
    title: { fontSize: 24, fontWeight: '700', color: COLORS.textPrimary, marginBottom: 10 },
    subtitle: { fontSize: 16, color: COLORS.textLight },
});

