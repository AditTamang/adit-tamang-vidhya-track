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
import Toast from '@/components/Toast';
import {
    getAllAcademicYears,
    createAcademicYear,
    updateAcademicYear,
    setActiveAcademicYear,
    deleteAcademicYear
} from '@/services/academicYearService';

interface AcademicYear {
    id: number;
    name: string;
    start_date: string;
    end_date: string;
    is_active: boolean;
}

export default function AcademicYearsScreen() {
    const [loading, setLoading] = useState(true);
    const [years, setYears] = useState<AcademicYear[]>([]);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedYear, setSelectedYear] = useState<AcademicYear | null>(null);

    // Form states
    const [name, setName] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    useEffect(() => {
        loadData();
    }, []);

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const loadData = async () => {
        setLoading(true);
        try {
            const response = await getAllAcademicYears();
            if (response.status === 200) {
                setYears(response.data);
            }
        } catch (error: any) {
            showToast(error.message || 'Failed to load data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (year?: AcademicYear) => {
        if (year) {
            setIsEditing(true);
            setSelectedYear(year);
            setName(year.name);
            // Format dates if needed, usually backend returns ISO string
            setStartDate(year.start_date.split('T')[0]);
            setEndDate(year.end_date.split('T')[0]);
        } else {
            setIsEditing(false);
            setSelectedYear(null);
            setName('');
            setStartDate('');
            setEndDate('');
        }
        setShowModal(true);
    };

    const handleSubmit = async () => {
        if (!name || !startDate || !endDate) {
            showToast('All fields are required', 'error');
            return;
        }

        // Basic date validation (YYYY-MM-DD)
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(startDate) || !dateRegex.test(endDate)) {
            showToast('Dates must be in YYYY-MM-DD format', 'error');
            return;
        }

        try {
            let response;
            if (isEditing && selectedYear) {
                response = await updateAcademicYear(selectedYear.id, name, startDate, endDate);
            } else {
                response = await createAcademicYear(name, startDate, endDate);
            }

            if (response.status === 200 || response.status === 201) {
                showToast(response.message, 'success');
                setShowModal(false);
                loadData();
            }
        } catch (error: any) {
            showToast(error.message || 'Operation failed', 'error');
        }
    };

    const handleSetActive = async (year: AcademicYear) => {
        Alert.alert(
            'Set Active Year',
            `Are you sure you want to set ${year.name} as the active academic year?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Confirm',
                    onPress: async () => {
                        try {
                            const response = await setActiveAcademicYear(year.id);
                            if (response.status === 200) {
                                showToast(response.message, 'success');
                                loadData();
                            }
                        } catch (error: any) {
                            showToast(error.message || 'Failed to set active year', 'error');
                        }
                    }
                }
            ]
        );
    };

    const handleDelete = async (year: AcademicYear) => {
        if (year.is_active) {
            showToast('Cannot delete active academic year', 'error');
            return;
        }

        Alert.alert(
            'Delete Year',
            `Are you sure you want to delete ${year.name}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            const response = await deleteAcademicYear(year.id);
                            if (response.status === 200) {
                                showToast(response.message, 'success');
                                loadData();
                            }
                        } catch (error: any) {
                            showToast(error.message || 'Failed to delete year', 'error');
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
                <Text style={styles.title}>Academic Years</Text>
                <TouchableOpacity style={styles.addButton} onPress={() => handleOpenModal()}>
                    <Ionicons name="add" size={24} color={COLORS.white} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {years.length === 0 ? (
                    <View style={styles.emptyCard}>
                        <Ionicons name="calendar-outline" size={40} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No academic years set</Text>
                        <Text style={styles.emptySubtext}>Tap + to create one</Text>
                    </View>
                ) : (
                    years.map((year) => (
                        <View key={year.id} style={[styles.card, year.is_active && styles.cardActive]}>
                            <View style={styles.cardHeader}>
                                <View style={styles.cardTitleRow}>
                                    <Ionicons
                                        name={year.is_active ? "checkmark-circle" : "calendar-outline"}
                                        size={24}
                                        color={year.is_active ? COLORS.primary : COLORS.textSecondary}
                                    />
                                    <Text style={styles.yearName}>{year.name}</Text>
                                    {year.is_active && (
                                        <View style={styles.activeBadge}>
                                            <Text style={styles.activeBadgeText}>ACTIVE</Text>
                                        </View>
                                    )}
                                </View>
                                <View style={styles.actions}>
                                    {!year.is_active && (
                                        <TouchableOpacity
                                            style={styles.actionBtn}
                                            onPress={() => handleSetActive(year)}
                                            testID="set-active-btn"
                                        >
                                            <Ionicons name="radio-button-off" size={20} color={COLORS.textSecondary} />
                                        </TouchableOpacity>
                                    )}
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => handleOpenModal(year)}
                                    >
                                        <Ionicons name="create-outline" size={20} color="#2196F3" />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.actionBtn}
                                        onPress={() => handleDelete(year)}
                                        disabled={year.is_active}
                                    >
                                        <Ionicons
                                            name="trash-outline"
                                            size={20}
                                            color={year.is_active ? '#CCC' : '#EF4444'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.cardDates}>
                                <View style={styles.dateRow}>
                                    <Text style={styles.dateLabel}>Start:</Text>
                                    <Text style={styles.dateValue}>{new Date(year.start_date).toLocaleDateString()}</Text>
                                </View>
                                <View style={styles.dateRow}>
                                    <Text style={styles.dateLabel}>End:</Text>
                                    <Text style={styles.dateValue}>{new Date(year.end_date).toLocaleDateString()}</Text>
                                </View>
                            </View>
                        </View>
                    ))
                )}
                <View style={{ height: 30 }} />
            </ScrollView>

            <Modal visible={showModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{isEditing ? 'Edit Academic Year' : 'New Academic Year'}</Text>

                        <Text style={styles.inputLabel}>Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="e.g. 2025-2026"
                            value={name}
                            onChangeText={setName}
                        />

                        <Text style={styles.inputLabel}>Start Date (YYYY-MM-DD)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={startDate}
                            onChangeText={setStartDate}
                        />

                        <Text style={styles.inputLabel}>End Date (YYYY-MM-DD)</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="YYYY-MM-DD"
                            value={endDate}
                            onChangeText={setEndDate}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                                <Text style={styles.cancelBtnText}>Cancel</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.saveBtn} onPress={handleSubmit}>
                                <Text style={styles.saveBtnText}>{isEditing ? 'Update' : 'Create'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Toast
                visible={toast.visible}
                message={toast.message}
                type={toast.type}
                onHide={() => setToast(prev => ({ ...prev, visible: false }))}
            />
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
    emptyCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 30,
        alignItems: 'center',
        marginTop: 20,
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
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    cardActive: {
        borderColor: COLORS.primary,
        backgroundColor: '#F0FDF4',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    cardTitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    yearName: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    activeBadge: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: 8,
        paddingVertical: 2,
        borderRadius: 4,
    },
    activeBadgeText: {
        color: COLORS.white,
        fontSize: 10,
        fontWeight: 'bold',
    },
    actions: {
        flexDirection: 'row',
        gap: 8,
    },
    actionBtn: {
        padding: 4,
    },
    cardDates: {
        flexDirection: 'row',
        gap: 20,
        paddingTop: 8,
        borderTopWidth: 1,
        borderTopColor: '#EEE',
    },
    dateRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    dateLabel: {
        fontSize: 13,
        color: COLORS.textSecondary,
    },
    dateValue: {
        fontSize: 13,
        fontWeight: '600',
        color: COLORS.textPrimary,
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
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginBottom: 6,
        marginTop: 10,
    },
    input: {
        backgroundColor: '#F3F4F6',
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 24,
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
