import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_BASE_URL } from '@/services/api';

type ClassItem = {
    id: number;
    name: string;
    description?: string;
};

type Section = {
    id: number;
    name: string;
    class_id: number;
    teacher_name?: string;
};

export default function AdminClassesScreen() {
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [sections, setSections] = useState<Section[]>([]);

    // Modal states
    const [showAddClass, setShowAddClass] = useState(false);
    const [showAddSection, setShowAddSection] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newSectionName, setNewSectionName] = useState('');

    useEffect(() => {
        loadClasses();
    }, []);

    // Get auth token
    const getToken = async () => {
        return await AsyncStorage.getItem('authToken');
    };

    // Load all classes
    const loadClasses = async () => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/classes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 200) {
                setClasses(data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load classes');
        } finally {
            setLoading(false);
        }
    };

    // Load sections for a class
    const loadSections = async (classId: number) => {
        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/classes/${classId}/sections`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await res.json();
            if (data.status === 200) {
                setSections(data.data);
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to load sections');
        }
    };

    // Select a class
    const handleSelectClass = (cls: ClassItem) => {
        setSelectedClass(cls);
        loadSections(cls.id);
    };

    // Add new class
    const handleAddClass = async () => {
        if (!newClassName.trim()) {
            Alert.alert('Error', 'Enter class name');
            return;
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newClassName })
            });
            const data = await res.json();

            if (data.status === 201) {
                Alert.alert('Success', 'Class created');
                setShowAddClass(false);
                setNewClassName('');
                loadClasses();
            } else {
                Alert.alert('Error', data.message || 'Failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    // Add new section
    const handleAddSection = async () => {
        if (!newSectionName.trim() || !selectedClass) {
            Alert.alert('Error', 'Enter section name');
            return;
        }

        try {
            const token = await getToken();
            const res = await fetch(`${API_BASE_URL}/api/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newSectionName, class_id: selectedClass.id })
            });
            const data = await res.json();

            if (data.status === 201) {
                Alert.alert('Success', 'Section created');
                setShowAddSection(false);
                setNewSectionName('');
                loadSections(selectedClass.id);
            } else {
                Alert.alert('Error', data.message || 'Failed');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    // Delete class
    const handleDeleteClass = (classId: number) => {
        Alert.alert('Delete?', 'This will delete all sections too.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete',
                style: 'destructive',
                onPress: async () => {
                    try {
                        const token = await getToken();
                        const res = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
                            method: 'DELETE',
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        const data = await res.json();

                        if (data.status === 200) {
                            if (selectedClass?.id === classId) {
                                setSelectedClass(null);
                                setSections([]);
                            }
                            loadClasses();
                        }
                    } catch (error) {
                        Alert.alert('Error', 'Failed to delete');
                    }
                }
            }
        ]);
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Classes & Sections</Text>
                <TouchableOpacity style={styles.addBtn} onPress={() => setShowAddClass(true)}>
                    <Ionicons name="add" size={24} color="#fff" />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content}>
                {/* Classes list */}
                <Text style={styles.sectionTitle}>Classes</Text>

                {classes.length === 0 ? (
                    <Text style={styles.emptyText}>No classes yet</Text>
                ) : (
                    classes.map(cls => (
                        <TouchableOpacity
                            key={cls.id}
                            style={[styles.card, selectedClass?.id === cls.id && styles.cardSelected]}
                            onPress={() => handleSelectClass(cls)}
                        >
                            <View style={styles.cardContent}>
                                <Ionicons name="school" size={20} color="#4CAF50" />
                                <Text style={styles.cardText}>{cls.name}</Text>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteClass(cls.id)}>
                                <Ionicons name="trash-outline" size={18} color="#F44336" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}

                {/* Sections */}
                {selectedClass && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Sections for {selectedClass.name}</Text>
                            <TouchableOpacity onPress={() => setShowAddSection(true)}>
                                <Ionicons name="add-circle" size={24} color="#4CAF50" />
                            </TouchableOpacity>
                        </View>

                        {sections.length === 0 ? (
                            <Text style={styles.emptyText}>No sections</Text>
                        ) : (
                            sections.map(sec => (
                                <View key={sec.id} style={styles.sectionCard}>
                                    <Text style={styles.sectionBadge}>{sec.name}</Text>
                                    <Text style={styles.teacherText}>
                                        {sec.teacher_name || 'No teacher'}
                                    </Text>
                                </View>
                            ))
                        )}
                    </>
                )}
            </ScrollView>

            {/* Add Class Modal */}
            <Modal visible={showAddClass} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Add Class</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Class name (e.g. Grade 1)"
                            value={newClassName}
                            onChangeText={setNewClassName}
                        />
                        <View style={styles.modalBtns}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setShowAddClass(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddClass}>
                                <Text style={styles.saveText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Section Modal */}
            <Modal visible={showAddSection} transparent animationType="fade">
                <View style={styles.modalBg}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Add Section</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Section name (e.g. A, B)"
                            value={newSectionName}
                            onChangeText={setNewSectionName}
                        />
                        <View style={styles.modalBtns}>
                            <TouchableOpacity
                                style={styles.cancelBtn}
                                onPress={() => setShowAddSection(false)}
                            >
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddSection}>
                                <Text style={styles.saveText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    addBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 10,
    },
    emptyText: {
        color: '#999',
        textAlign: 'center',
        marginVertical: 20,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    cardSelected: {
        borderColor: '#4CAF50',
    },
    cardContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    cardText: {
        fontSize: 16,
        color: '#333',
    },
    sectionCard: {
        backgroundColor: '#fff',
        borderRadius: 8,
        padding: 12,
        marginBottom: 8,
        flexDirection: 'row',
        alignItems: 'center',
    },
    sectionBadge: {
        backgroundColor: '#4CAF50',
        color: '#fff',
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderRadius: 15,
        fontWeight: '600',
        marginRight: 10,
    },
    teacherText: {
        color: '#666',
    },
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 20,
        width: '80%',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    input: {
        backgroundColor: '#f5f5f5',
        borderRadius: 8,
        padding: 12,
        fontSize: 15,
        marginBottom: 15,
    },
    modalBtns: {
        flexDirection: 'row',
        gap: 10,
    },
    cancelBtn: {
        flex: 1,
        padding: 12,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        alignItems: 'center',
    },
    cancelText: {
        color: '#666',
    },
    saveBtn: {
        flex: 1,
        padding: 12,
        backgroundColor: '#4CAF50',
        borderRadius: 8,
        alignItems: 'center',
    },
    saveText: {
        color: '#fff',
        fontWeight: '600',
    },
});
