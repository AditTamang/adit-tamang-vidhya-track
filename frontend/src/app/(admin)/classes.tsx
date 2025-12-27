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
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

// Class interface
interface ClassItem {
    id: number;
    name: string;
    description?: string;
}

// Section interface
interface Section {
    id: number;
    name: string;
    class_id: number;
    teacher_name?: string;
}

export default function AdminClassesScreen() {
    const [loading, setLoading] = useState(true);
    const [classes, setClasses] = useState<ClassItem[]>([]);
    const [selectedClass, setSelectedClass] = useState<ClassItem | null>(null);
    const [sections, setSections] = useState<Section[]>([]);

    // Modal states
    const [showAddClass, setShowAddClass] = useState(false);
    const [showAddSection, setShowAddSection] = useState(false);
    const [newClassName, setNewClassName] = useState('');
    const [newClassDesc, setNewClassDesc] = useState('');
    const [newSectionName, setNewSectionName] = useState('');

    useEffect(() => {
        loadClasses();
    }, []);

    const loadClasses = async () => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            const response = await fetch(`${API_BASE_URL}/api/classes`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.status === 200) {
                setClasses(data.data);
            }
        } catch (error) {
            console.log('Error loading classes:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadSections = async (classId: number) => {
        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            const response = await fetch(`${API_BASE_URL}/api/classes/${classId}/sections`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const data = await response.json();

            if (data.status === 200) {
                setSections(data.data);
            }
        } catch (error) {
            console.log('Error loading sections:', error);
        }
    };

    const handleClassSelect = (cls: ClassItem) => {
        setSelectedClass(cls);
        loadSections(cls.id);
    };

    const handleAddClass = async () => {
        if (!newClassName.trim()) {
            Alert.alert('Error', 'Please enter a class name');
            return;
        }

        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            const response = await fetch(`${API_BASE_URL}/api/classes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newClassName, description: newClassDesc })
            });
            const data = await response.json();

            if (data.status === 201) {
                Alert.alert('Success', 'Class created successfully');
                setShowAddClass(false);
                setNewClassName('');
                setNewClassDesc('');
                loadClasses();
            } else {
                Alert.alert('Error', data.message || 'Failed to create class');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const handleAddSection = async () => {
        if (!newSectionName.trim() || !selectedClass) {
            Alert.alert('Error', 'Please enter a section name');
            return;
        }

        try {
            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
            const token = await AsyncStorage.getItem('authToken');

            const response = await fetch(`${API_BASE_URL}/api/sections`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ name: newSectionName, class_id: selectedClass.id })
            });
            const data = await response.json();

            if (data.status === 201) {
                Alert.alert('Success', 'Section created successfully');
                setShowAddSection(false);
                setNewSectionName('');
                loadSections(selectedClass.id);
            } else {
                Alert.alert('Error', data.message || 'Failed to create section');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong');
        }
    };

    const handleDeleteClass = async (classId: number) => {
        Alert.alert(
            'Delete Class',
            'Are you sure? This will delete the class and all its sections.',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                            const token = await AsyncStorage.getItem('authToken');

                            const response = await fetch(`${API_BASE_URL}/api/classes/${classId}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` }
                            });
                            const data = await response.json();

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
            ]
        );
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
                <Text style={styles.title}>Classes & Sections</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => setShowAddClass(true)}>
                    <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Classes List */}
                <Text style={styles.sectionTitle}>Classes</Text>

                {classes.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Ionicons name="school-outline" size={40} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No classes yet</Text>
                        <Text style={styles.emptySubtext}>Tap + to add a class</Text>
                    </View>
                ) : (
                    classes.map((cls) => (
                        <TouchableOpacity
                            key={cls.id}
                            style={[styles.classCard, selectedClass?.id === cls.id && styles.classCardSelected]}
                            onPress={() => handleClassSelect(cls)}
                        >
                            <View style={styles.classInfo}>
                                <Ionicons name="school" size={24} color={selectedClass?.id === cls.id ? COLORS.primary : COLORS.textSecondary} />
                                <View style={{ marginLeft: 12, flex: 1 }}>
                                    <Text style={styles.className}>{cls.name}</Text>
                                    {cls.description && (
                                        <Text style={styles.classDesc}>{cls.description}</Text>
                                    )}
                                </View>
                            </View>
                            <TouchableOpacity onPress={() => handleDeleteClass(cls.id)}>
                                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    ))
                )}

                {/* Sections (shown when a class is selected) */}
                {selectedClass && (
                    <>
                        <View style={styles.sectionHeader}>
                            <Text style={styles.sectionTitle}>Sections for {selectedClass.name}</Text>
                            <TouchableOpacity onPress={() => setShowAddSection(true)}>
                                <Ionicons name="add-circle" size={28} color={COLORS.primary} />
                            </TouchableOpacity>
                        </View>

                        {sections.length === 0 ? (
                            <View style={styles.emptyCard}>
                                <Text style={styles.emptyText}>No sections</Text>
                                <Text style={styles.emptySubtext}>Tap + to add sections</Text>
                            </View>
                        ) : (
                            sections.map((section) => (
                                <View key={section.id} style={styles.sectionCard}>
                                    <View style={styles.sectionBadge}>
                                        <Text style={styles.sectionBadgeText}>{section.name}</Text>
                                    </View>
                                    <Text style={styles.sectionTeacher}>
                                        {section.teacher_name || 'No teacher assigned'}
                                    </Text>
                                </View>
                            ))
                        )}
                    </>
                )}

                <View style={{ height: 30 }} />
            </ScrollView>

            {/* Add Class Modal */}
            <Modal visible={showAddClass} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add New Class</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Class Name (e.g., Grade 1)"
                            value={newClassName}
                            onChangeText={setNewClassName}
                        />
                        <TextInput
                            style={[styles.input, { height: 80 }]}
                            placeholder="Description (optional)"
                            value={newClassDesc}
                            onChangeText={setNewClassDesc}
                            multiline
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddClass(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddClass}>
                                <Text style={styles.saveBtnText}>Add Class</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Add Section Modal */}
            <Modal visible={showAddSection} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Add Section to {selectedClass?.name}</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Section Name (e.g., A, B, C)"
                            value={newSectionName}
                            onChangeText={setNewSectionName}
                        />
                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowAddSection(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleAddSection}>
                                <Text style={styles.saveBtnText}>Add Section</Text>
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
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    addButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 12,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 12,
    },
    emptyCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        marginBottom: 12,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 10,
    },
    emptySubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    classCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    classCardSelected: {
        borderColor: COLORS.primary,
    },
    classInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    className: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    classDesc: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    sectionCard: {
        backgroundColor: COLORS.white,
        borderRadius: 10,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    sectionBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 12,
    },
    sectionBadgeText: {
        color: COLORS.white,
        fontWeight: '700',
        fontSize: 14,
    },
    sectionTeacher: {
        fontSize: 14,
        color: COLORS.textSecondary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderRadius: 16,
        padding: 24,
        width: '85%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: COLORS.textPrimary,
        marginBottom: 20,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 14,
        fontSize: 16,
        marginBottom: 12,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 8,
    },
    cancelBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        backgroundColor: '#F3F4F6',
        alignItems: 'center',
    },
    cancelBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textSecondary,
    },
    saveBtn: {
        flex: 1,
        padding: 14,
        borderRadius: 10,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
    },
    saveBtnText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.white,
    },
});
