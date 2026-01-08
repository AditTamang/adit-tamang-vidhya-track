import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    Modal,
    TextInput,
    Switch
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from '@/components/Toast';
import { useLanguage } from '@/contexts/LanguageContext';

type UserData = {
    id: number;
    name: string;
    email: string;
    role: string;
    phone_number?: string;
    created_at?: string;
};

const AdminProfile = () => {
    const router = useRouter();
    const { language, setLanguage, t } = useLanguage();
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    // Modal states
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [showNotificationsModal, setShowNotificationsModal] = useState(false);
    const [showLanguageModal, setShowLanguageModal] = useState(false);
    const [showAboutModal, setShowAboutModal] = useState(false);

    // Edit profile state
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPhone, setEditPhone] = useState('');
    const [saving, setSaving] = useState(false);

    // Password state
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    // Notification settings
    const [emailNotifications, setEmailNotifications] = useState(true);
    const [pushNotifications, setPushNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);

    useEffect(() => {
        loadUserData();
    }, []);

    const loadUserData = async () => {
        try {
            const userString = await AsyncStorage.getItem('userData');
            if (userString) {
                const user = JSON.parse(userString);
                setUserData(user);
                setEditName(user.name || '');
                setEditEmail(user.email || '');
                setEditPhone(user.phone_number || '');
            }
        } catch (error) {
            console.error('Error loading user data:', error);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const handleEditProfile = () => {
        setEditName(userData?.name || '');
        setEditEmail(userData?.email || '');
        setEditPhone(userData?.phone_number || '');
        setShowEditModal(true);
    };

    const saveProfile = async () => {
        if (!editName.trim() || !editEmail.trim()) {
            showToast(t('nameEmailRequired'), 'error');
            return;
        }

        setSaving(true);
        try {
            const updatedUser = {
                ...userData,
                name: editName,
                email: editEmail,
                phone_number: editPhone
            };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));
            setUserData(updatedUser as UserData);
            setShowEditModal(false);
            showToast(t('profileUpdated'), 'success');
        } catch (error) {
            showToast(t('failedToUpdate'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async () => {
        if (!currentPassword || !newPassword || !confirmPassword) {
            showToast(t('allFieldsRequired'), 'error');
            return;
        }

        if (newPassword !== confirmPassword) {
            showToast(t('passwordsDoNotMatch'), 'error');
            return;
        }

        if (newPassword.length < 6) {
            showToast(t('passwordMinLength'), 'error');
            return;
        }

        setSaving(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowPasswordModal(false);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmPassword('');
            showToast(t('passwordChanged'), 'success');
        } catch (error) {
            showToast(t('failedToChangePassword'), 'error');
        } finally {
            setSaving(false);
        }
    };

    const saveNotificationSettings = async () => {
        try {
            await AsyncStorage.setItem('notificationSettings', JSON.stringify({
                email: emailNotifications,
                push: pushNotifications,
                sms: smsNotifications
            }));
            setShowNotificationsModal(false);
            showToast(t('notificationSettingsSaved'), 'success');
        } catch (error) {
            showToast(t('failedToSaveSettings'), 'error');
        }
    };

    const selectLanguage = async (lang: string) => {
        try {
            await setLanguage(lang as 'English' | 'नेपाली (Nepali)');
            setShowLanguageModal(false);
            showToast(`${t('languageChanged')} ${lang}`, 'success');
        } catch (error) {
            console.error('Error saving language:', error);
            showToast(t('failedToSaveSettings'), 'error');
        }
    };

    const handleLogout = async () => {
        Alert.alert(
            t('logoutConfirmTitle'),
            t('logoutConfirmMessage'),
            [
                { text: t('cancel'), style: 'cancel' },
                {
                    text: t('logout'),
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            // Clear all auth-related storage
                            await AsyncStorage.removeItem('authToken');
                            await AsyncStorage.removeItem('userData');
                            await AsyncStorage.removeItem('token');
                            await AsyncStorage.removeItem('user');
                            // Navigate to login
                            router.replace('/(auth)/login');
                        } catch (error) {
                            console.error('Logout error:', error);
                        }
                    }
                }
            ]
        );
    };

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .substring(0, 2);
    };

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <>
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>{t('profile')}</Text>
                    <Text style={styles.headerSubtitle}>{t('manageAccount')}</Text>
                </View>

                {/* Profile Card */}
                <View style={styles.profileCard}>
                    <View style={styles.avatarContainer}>
                        <View style={styles.avatar}>
                            <Text style={styles.avatarText}>
                                {userData?.name ? getInitials(userData.name) : 'AD'}
                            </Text>
                        </View>
                        <View style={styles.roleIconBadge}>
                            <Ionicons name="shield-checkmark" size={20} color="#fff" />
                        </View>
                    </View>
                    <Text style={styles.name}>{userData?.name || 'Admin'}</Text>
                    <View style={styles.roleChip}>
                        <Ionicons name="shield-checkmark" size={14} color="#4CAF50" />
                        <Text style={styles.roleChipText}>{t('administrator')}</Text>
                    </View>
                    <Text style={styles.email}>{userData?.email || 'admin@gmail.com'}</Text>
                    {userData?.phone_number && (
                        <Text style={styles.phone}>📱 {userData.phone_number}</Text>
                    )}
                </View>

                {/* Stats Cards */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <Ionicons name="calendar-outline" size={24} color="#4CAF50" />
                        <Text style={styles.statValue}>{formatDate(userData?.created_at)}</Text>
                        <Text style={styles.statLabel}>{t('joined')}</Text>
                    </View>
                    <View style={styles.statCard}>
                        <Ionicons name="checkmark-circle-outline" size={24} color="#2196F3" />
                        <Text style={styles.statValue}>{t('active')}</Text>
                        <Text style={styles.statLabel}>{t('status')}</Text>
                    </View>
                </View>

                {/* Account Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('account')}</Text>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem} onPress={handleEditProfile}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="person-outline" size={22} color="#4CAF50" />
                        </View>
                        <Text style={styles.menuText}>{t('editProfile')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowPasswordModal(true)}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="lock-closed-outline" size={22} color="#FF9800" />
                        </View>
                        <Text style={styles.menuText}>{t('changePassword')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowNotificationsModal(true)}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="notifications-outline" size={22} color="#9C27B0" />
                        </View>
                        <Text style={styles.menuText}>{t('notifications')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Preferences Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('preferences')}</Text>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="settings-outline" size={22} color="#2196F3" />
                        </View>
                        <Text style={styles.menuText}>{t('settings')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowLanguageModal(true)}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="language-outline" size={22} color="#607D8B" />
                        </View>
                        <Text style={styles.menuText}>{t('language')}</Text>
                        <View style={styles.languageBadge}>
                            <Text style={styles.languageText}>{language}</Text>
                        </View>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Support Section */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>{t('support')}</Text>
                </View>
                <View style={styles.section}>
                    <TouchableOpacity style={styles.menuItem}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="help-circle-outline" size={22} color="#00BCD4" />
                        </View>
                        <Text style={styles.menuText}>{t('helpSupport')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.menuItem} onPress={() => setShowAboutModal(true)}>
                        <View style={styles.menuIconContainer}>
                            <Ionicons name="information-circle-outline" size={22} color="#3F51B5" />
                        </View>
                        <Text style={styles.menuText}>{t('about')}</Text>
                        <Ionicons name="chevron-forward" size={20} color="#999" />
                    </TouchableOpacity>
                </View>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#F44336" />
                    <Text style={styles.logoutText}>{t('logout')}</Text>
                </TouchableOpacity>

                {/* Version Info */}
                <Text style={styles.versionText}>Version 1.0.0</Text>
            </ScrollView>

            {/* Edit Profile Modal */}
            <Modal visible={showEditModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('editProfile')}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t('fullName')}
                            value={editName}
                            onChangeText={setEditName}
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('email')}
                            value={editEmail}
                            onChangeText={setEditEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('phoneNumber')}
                            value={editPhone}
                            onChangeText={setEditPhone}
                            keyboardType="phone-pad"
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSave]}
                                onPress={saveProfile}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.modalButtonTextSave}>{t('save')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Change Password Modal */}
            <Modal visible={showPasswordModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('changePassword')}</Text>

                        <TextInput
                            style={styles.input}
                            placeholder={t('currentPassword')}
                            value={currentPassword}
                            onChangeText={setCurrentPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('newPassword')}
                            value={newPassword}
                            onChangeText={setNewPassword}
                            secureTextEntry
                        />
                        <TextInput
                            style={styles.input}
                            placeholder={t('confirmNewPassword')}
                            value={confirmPassword}
                            onChangeText={setConfirmPassword}
                            secureTextEntry
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setShowPasswordModal(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSave]}
                                onPress={handleChangePassword}
                                disabled={saving}
                            >
                                {saving ? (
                                    <ActivityIndicator color="#fff" size="small" />
                                ) : (
                                    <Text style={styles.modalButtonTextSave}>{t('change')}</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Notifications Modal */}
            <Modal visible={showNotificationsModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('notificationSettings')}</Text>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="mail-outline" size={24} color="#4CAF50" />
                                <Text style={styles.settingText}>{t('emailNotifications')}</Text>
                            </View>
                            <Switch
                                value={emailNotifications}
                                onValueChange={setEmailNotifications}
                                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="phone-portrait-outline" size={24} color="#2196F3" />
                                <Text style={styles.settingText}>{t('pushNotifications')}</Text>
                            </View>
                            <Switch
                                value={pushNotifications}
                                onValueChange={setPushNotifications}
                                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                            />
                        </View>

                        <View style={styles.settingRow}>
                            <View style={styles.settingInfo}>
                                <Ionicons name="chatbubble-outline" size={24} color="#FF9800" />
                                <Text style={styles.settingText}>{t('smsNotifications')}</Text>
                            </View>
                            <Switch
                                value={smsNotifications}
                                onValueChange={setSmsNotifications}
                                trackColor={{ false: '#ccc', true: '#4CAF50' }}
                            />
                        </View>

                        <View style={styles.modalButtons}>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonCancel]}
                                onPress={() => setShowNotificationsModal(false)}
                            >
                                <Text style={styles.modalButtonTextCancel}>{t('cancel')}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.modalButton, styles.modalButtonSave]}
                                onPress={saveNotificationSettings}
                            >
                                <Text style={styles.modalButtonTextSave}>{t('save')}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Language Modal */}
            <Modal visible={showLanguageModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>{t('selectLanguage')}</Text>

                        {['English', 'नेपाली (Nepali)'].map((lang) => (
                            <TouchableOpacity
                                key={lang}
                                style={[
                                    styles.languageOption,
                                    language === lang && styles.languageOptionActive
                                ]}
                                onPress={() => selectLanguage(lang)}
                            >
                                <Text style={[
                                    styles.languageOptionText,
                                    language === lang && styles.languageOptionTextActive
                                ]}>
                                    {lang}
                                </Text>
                                {language === lang && (
                                    <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                                )}
                            </TouchableOpacity>
                        ))}

                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonCancel, { marginTop: 20 }]}
                            onPress={() => setShowLanguageModal(false)}
                        >
                            <Text style={styles.modalButtonTextCancel}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* About Modal */}
            <Modal visible={showAboutModal} transparent animationType="slide">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <View style={styles.aboutHeader}>
                            <View style={styles.aboutIcon}>
                                <Ionicons name="school" size={40} color="#4CAF50" />
                            </View>
                            <Text style={styles.modalTitle}>VidhyaTrack</Text>
                            <Text style={styles.aboutVersion}>Version 1.0</Text>
                        </View>

                        <Text style={styles.aboutDescription}>
                            {t('appDescription')}
                        </Text>

                        <View style={styles.aboutInfo}>
                            <View style={styles.aboutRow}>
                                <Text style={styles.aboutLabel}>{t('developer')}</Text>
                                <Text style={styles.aboutValue}>{t('Adit Tamang')}</Text>
                            </View>
                            <View style={styles.aboutRow}>
                                <Text style={styles.aboutLabel}>{t('email')}</Text>
                                <Text style={styles.aboutValue}>tamangadit86@gmail.com.com</Text>
                            </View>
                            <View style={styles.aboutRow}>
                                <Text style={styles.aboutLabel}>{t('website')}</Text>
                                <Text style={styles.aboutValue}>www.vidhyatrack.com.np</Text>
                            </View>
                        </View>

                        <TouchableOpacity
                            style={[styles.modalButton, styles.modalButtonSave]}
                            onPress={() => setShowAboutModal(false)}
                        >
                            <Text style={styles.modalButtonTextSave}>{t('close')}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={() => setToast({ ...toast, visible: false })}
                type={toast.type}
            />
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    header: {
        marginBottom: 25,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#000',
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
    },
    profileCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 30,
        alignItems: 'center',
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#4CAF50',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarText: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#fff',
    },
    roleIconBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#4CAF50',
        borderWidth: 3,
        borderColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    roleChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        paddingHorizontal: 12,
        paddingVertical: 6,
        backgroundColor: '#4CAF50' + '15',
        borderRadius: 20,
        marginBottom: 8,
    },
    roleChipText: {
        fontSize: 13,
        fontWeight: '600',
        color: '#4CAF50',
    },
    email: {
        fontSize: 14,
        color: '#666',
    },
    phone: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        gap: 12,
        marginBottom: 25,
    },
    statCard: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    statValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 8,
    },
    statLabel: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    sectionHeader: {
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000',
    },
    section: {
        backgroundColor: '#fff',
        borderRadius: 16,
        marginBottom: 25,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    menuIconContainer: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuText: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    languageBadge: {
        paddingHorizontal: 10,
        paddingVertical: 4,
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        marginRight: 8,
    },
    languageText: {
        fontSize: 13,
        color: '#666',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        gap: 10,
        borderWidth: 2,
        borderColor: '#F44336',
        marginBottom: 20,
    },
    logoutText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#F44336',
    },
    versionText: {
        textAlign: 'center',
        fontSize: 12,
        color: '#999',
    },
    // Modal styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '85%',
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 25,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 12,
        padding: 14,
        fontSize: 16,
        marginBottom: 16,
        backgroundColor: '#F9F9F9',
    },
    modalButtons: {
        flexDirection: 'row',
        gap: 12,
        marginTop: 10,
    },
    modalButton: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    modalButtonCancel: {
        backgroundColor: '#F5F5F5',
    },
    modalButtonSave: {
        backgroundColor: '#4CAF50',
    },
    modalButtonTextCancel: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
    },
    modalButtonTextSave: {
        fontSize: 16,
        fontWeight: '600',
        color: '#fff',
    },
    // Notification settings
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    settingInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    settingText: {
        fontSize: 16,
        color: '#000',
    },
    // Language options
    languageOption: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        backgroundColor: '#F5F5F5',
        marginBottom: 10,
    },
    languageOptionActive: {
        backgroundColor: '#4CAF50' + '15',
    },
    languageOptionText: {
        fontSize: 16,
        color: '#000',
    },
    languageOptionTextActive: {
        color: '#4CAF50',
        fontWeight: '600',
    },
    // About modal
    aboutHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    aboutIcon: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#4CAF50' + '15',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 12,
    },
    aboutVersion: {
        fontSize: 14,
        color: '#999',
        marginTop: 4,
    },
    aboutDescription: {
        fontSize: 14,
        color: '#666',
        lineHeight: 22,
        textAlign: 'center',
        marginBottom: 20,
    },
    aboutInfo: {
        backgroundColor: '#F9F9F9',
        borderRadius: 12,
        padding: 16,
        marginBottom: 20,
    },
    aboutRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    aboutLabel: {
        fontSize: 14,
        color: '#999',
    },
    aboutValue: {
        fontSize: 14,
        color: '#000',
        fontWeight: '500',
    },
});

export default AdminProfile;
