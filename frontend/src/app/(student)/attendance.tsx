import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, Alert, ViewStyle } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { apiCall } from '@/services/api';

interface AttendanceRecord {
    id: number;
    date: string;
    status: 'present' | 'absent' | 'late';
}

export default function StudentAttendance() {
    const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAttendance();
    }, []);

    const fetchAttendance = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const userData = await AsyncStorage.getItem('userData');
            if (userData) {
                const user = JSON.parse(userData);
                // Fetch using my own ID
                const response = await apiCall(`/api/attendance/student/${user.id}`);
                if (response.ok) {
                    const json = await response.json();
                    setAttendance(json);
                } else {
                    Alert.alert("Error", "Failed to load attendance");
                }
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.header}>My Attendance</Text>
            <FlatList
                data={attendance}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.row}>
                        <Text style={styles.date}>{new Date(item.date).toLocaleDateString()}</Text>
                        <View style={[styles.badge, getBadgeColor(item.status)]}>
                            <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No attendance records found.</Text>}
            />
        </View>
    );
}

const getBadgeColor = (status: string): ViewStyle => {
    if (status === 'present') return { backgroundColor: '#E8F5E9' };
    if (status === 'absent') return { backgroundColor: '#FFEBEE' };
    if (status === 'late') return { backgroundColor: '#FFF8E1' };
    return { backgroundColor: '#F5F5F5' };
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: COLORS.textPrimary },
    emptyText: { textAlign: 'center', marginTop: 20, color: COLORS.textLight },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10
    },
    date: { fontSize: 16, fontWeight: '500', color: COLORS.textPrimary },
    badge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
    statusText: { fontSize: 12, fontWeight: 'bold', color: '#333' }
});
