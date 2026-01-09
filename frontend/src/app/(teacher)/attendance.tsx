import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, ActivityIndicator } from 'react-native';
import { COLORS } from '@/constants/Colors';
import { apiCall } from '@/services/api';
import { useRouter } from 'expo-router';

export default function TeacherAttendance() {
    const [sections, setSections] = useState([]);
    const [selectedSection, setSelectedSection] = useState(null);
    const [students, setStudents] = useState([]);
    const [attendance, setAttendance] = useState({}); // { studentId: 'present' | 'absent' | 'late' }
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchSections();
    }, []);

    const fetchSections = async () => {
        try {
            setLoading(true);
            const response = await apiCall('/api/sections/my');
            if (response.ok) {
                const json = await response.json();
                setSections(json.data);
            } else {
                Alert.alert("Error", "Failed to load sections");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error");
        } finally {
            setLoading(false);
        }
    };

    const fetchStudents = async (section) => {
        try {
            setSelectedSection(section);
            setLoading(true);

            // 1. Fetch Students
            const studentsRes = await apiCall(`/api/student/section/${section.id}`);

            // 2. Fetch Existing Attendance for Today
            const today = new Date().toISOString().split('T')[0];
            const attendanceRes = await apiCall(`/api/attendance/class?classId=${section.class_id}&date=${today}`);

            if (studentsRes.ok) {
                const studentsJson = await studentsRes.json();
                const studentsData = studentsJson.data || [];
                setStudents(studentsData);

                // 3. Merge Attendance
                const initialAttendance = {};

                // Default all to 'present'
                studentsData.forEach(s => {
                    initialAttendance[s.user_id] = 'present';
                });

                // If existing attendance found, overwrite
                if (attendanceRes.ok) {
                    const attendanceData = await attendanceRes.json();
                    // attendanceData is an array of records (based on controller) or { data: [] }?
                    // Controller sends res.json(data) which is the array directly.
                    // But to be safe, let's handle both array or object with data property if API changes.
                    const records = Array.isArray(attendanceData) ? attendanceData : (attendanceData.data || []);

                    records.forEach(record => {
                        if (record.student_id && record.status) {
                            initialAttendance[record.student_id] = record.status;
                        }
                    });
                }

                setAttendance(initialAttendance);
            } else {
                Alert.alert("Error", "Failed to load students");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error");
        } finally {
            setLoading(false);
        }
    };

    const markStatus = (studentId, status) => {
        setAttendance(prev => ({ ...prev, [studentId]: status }));
    };

    const submitAttendance = async () => {
        if (!selectedSection) return;

        // Prepare data
        const payload = Object.keys(attendance).map(userId => {
            const student = students.find(s => s.user_id == userId);
            if (!student) return null;
            return {
                student_id: student.user_id, // assuming user_id matches users table id which is referenced in attendance
                class_id: selectedSection.class_id, // linked to classes table
                date: new Date().toISOString().split('T')[0],
                status: attendance[userId],
                remarks: ''
            };
        }).filter(Boolean);

        try {
            setLoading(true);
            const response = await apiCall('/api/attendance/mark', {
                method: 'POST',
                body: JSON.stringify({ attendance: payload })
            });

            if (response.ok) {
                Alert.alert("Success", "Attendance marked successfully!");
                setSelectedSection(null); // Go back to section list
                setStudents([]);
            } else {
                Alert.alert("Error", "Failed to submit attendance");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Network error");
        } finally {
            setLoading(false);
        }
    };

    if (loading && !students.length && !sections.length) {
        return <View style={styles.center}><ActivityIndicator size="large" color={COLORS.primary} /></View>;
    }

    // Step 1: Select Section
    if (!selectedSection) {
        return (
            <View style={styles.container}>
                <Text style={styles.header}>Select Section</Text>
                <FlatList
                    data={sections}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <TouchableOpacity style={styles.card} onPress={() => fetchStudents(item)}>
                            <Text style={styles.cardTitle}>{item.class_name} - {item.name}</Text>
                        </TouchableOpacity>
                    )}
                    ListEmptyComponent={<Text style={styles.emptyText}>No classes assigned.</Text>}
                />
            </View>
        );
    }

    // Step 2: Mark Attendance
    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => setSelectedSection(null)}>
                    <Text style={styles.backButton}>← Back</Text>
                </TouchableOpacity>
                <Text style={styles.headerSmall}>Attendance: {selectedSection.class_name} - {selectedSection.name}</Text>
            </View>

            <FlatList
                data={students}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <View style={styles.studentRow}>
                        <Text style={styles.studentName}>{item.name}</Text>
                        <View style={styles.buttonGroup}>
                            {['present', 'absent', 'late'].map(status => (
                                <TouchableOpacity
                                    key={status}
                                    style={[
                                        styles.statusButton,
                                        attendance[item.user_id] === status && styles.statusActive(status)
                                    ]}
                                    onPress={() => markStatus(item.user_id, status)}
                                >
                                    <Text style={[
                                        styles.statusText,
                                        attendance[item.user_id] === status && { color: '#fff' }
                                    ]}>
                                        {status.charAt(0).toUpperCase()}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                )}
            />

            <TouchableOpacity style={styles.submitButton} onPress={submitAttendance}>
                {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>Submit Attendance</Text>}
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: COLORS.background },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: COLORS.textPrimary },
    headerSmall: { fontSize: 18, fontWeight: 'bold', color: COLORS.textPrimary, flex: 1, textAlign: 'center' },
    topBar: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
    backButton: { fontSize: 16, color: COLORS.primary, padding: 10 },
    card: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        marginBottom: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 5
    },
    cardTitle: { fontSize: 18, fontWeight: '600' },
    emptyText: { textAlign: 'center', marginTop: 20, color: COLORS.textLight },

    studentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginBottom: 10
    },
    studentName: { fontSize: 16, fontWeight: '500', width: '40%' },
    buttonGroup: { flexDirection: 'row', gap: 10 },
    statusButton: {
        width: 35,
        height: 35,
        borderRadius: 17.5,
        borderWidth: 1,
        borderColor: '#ccc',
        justifyContent: 'center',
        alignItems: 'center',
    },
    statusText: { fontSize: 14, fontWeight: 'bold', color: '#555' },
    statusActive: (status) => {
        if (status === 'present') return { backgroundColor: '#4CAF50', borderColor: '#4CAF50' };
        if (status === 'absent') return { backgroundColor: '#F44336', borderColor: '#F44336' };
        if (status === 'late') return { backgroundColor: '#FFC107', borderColor: '#FFC107' };
        return {};
    },
    submitButton: {
        backgroundColor: COLORS.primary,
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20
    },
    submitText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
});
