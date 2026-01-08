import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, TextInput, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';

// This component handles the profile page for all users
// It is simple and re-usable
export default function ProfileComponent() {
    const router = useRouter();

    // State variables
    const [user, setUser] = useState<any>(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editName, setEditName] = useState('');
    const [editPhone, setEditPhone] = useState('');

    // Load data when page opens
    useEffect(() => {
        loadData();
    }, []);

    // Function to get user data from storage
    const loadData = async () => {
        try {
            // We use 'userData' key for all users now
            const jsonValue = await AsyncStorage.getItem('userData');
            if (jsonValue != null) {
                const userData = JSON.parse(jsonValue);
                setUser(userData);

                // Set initial values for edit form
                setEditName(userData.name || '');
                setEditPhone(userData.phone_number || '');
            }
        } catch (e) {
            console.log("Error loading data");
        }
    };

    // Function to handle logout
    const handleLogout = async () => {
        Alert.alert(
            "Logout",
            "Are you sure you want to log out?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Yes, Logout",
                    onPress: async () => {
                        // Clear all data
                        await AsyncStorage.clear();
                        // Go to login page
                        router.replace('/(auth)/login');
                    }
                }
            ]
        );
    };

    // Function to save profile changes
    const saveProfile = async () => {
        if (!user) return;

        try {
            // Import apiCall (dynamically or at top)
            const { apiCall } = require('@/services/api');

            const payload = {
                name: editName,
                phone_number: editPhone
            };

            const response = await apiCall('/api/profile/update', {
                method: 'PUT',
                body: JSON.stringify(payload)
            });

            const result = await response.json();

            if (response.ok) {
                // Update local user object
                const updatedUser = { ...user, ...payload };
                // Save to storage
                await AsyncStorage.setItem('userData', JSON.stringify(updatedUser));

                // Update state
                setUser(updatedUser);
                setShowEditModal(false);
                Alert.alert("Success", "Profile updated successfully!");
            } else {
                    Alert.alert("Error", result.message || "Failed to update profile");
                }
        } catch (error) {
            console.error("Profile update error:", error);
            Alert.alert("Error", "Network or server error");
        }
    };

    if (!user) {
        return (
            <View style={styles.center}>
                <Text>Loading profile...</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header Section */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Profile</Text>
            </View>

            {/* Profile Card */}
            <View style={styles.card}>
                <View style={styles.avatarBox}>
                    <Ionicons name="person" size={50} color="#fff" />
                </View>

                <Text style={styles.nameText}>{user.name}</Text>
                <Text style={styles.emailText}>{user.email}</Text>
                <Text style={styles.roleText}>{user.role}</Text>
            </View>

            {/* Menu Options */}
            <View style={styles.menuContainer}>

                {/* Edit Profile Button */}
                <TouchableOpacity style={styles.menuItem} onPress={() => setShowEditModal(true)}>
                    <Ionicons name="create-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Edit Profile</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Settings Button */}
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="settings-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>App Settings</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Help Button */}
                <TouchableOpacity style={styles.menuItem}>
                    <Ionicons name="help-circle-outline" size={24} color="#333" />
                    <Text style={styles.menuText}>Help & Support</Text>
                    <Ionicons name="chevron-forward" size={20} color="#ccc" />
                </TouchableOpacity>

                {/* Logout Button */}
                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                    <Ionicons name="log-out-outline" size={24} color="white" />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>

            {/* Edit Modal */}
            <Modal visible={showEditModal} animationType="slide" transparent>
                <View style={styles.modalBg}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Profile</Text>

                        <Text style={styles.label}>Full Name</Text>
                        <TextInput
                            style={styles.input}
                            value={editName}
                            onChangeText={setEditName}
                            placeholder="Enter Name"
                        />

                        <Text style={styles.label}>Phone Number</Text>
                        <TextInput
                            style={styles.input}
                            value={editPhone}
                            onChangeText={setEditPhone}
                            placeholder="Enter Phone"
                            keyboardType="phone-pad"
                        />

                        <View style={styles.modalBtnRow}>
                            <TouchableOpacity
                                style={[styles.modalBtn, styles.cancelBtn]}
                                onPress={() => setShowEditModal(false)}
                            >
                                <Text style={styles.btnText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.modalBtn, styles.saveBtn]}
                                onPress={saveProfile}
                            >
                                <Text style={[styles.btnText, { color: 'white' }]}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
}

// Simple Styles
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
        paddingTop: 60,
        paddingBottom: 20,
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
    },
    card: {
        backgroundColor: '#fff',
        margin: 20,
        padding: 30,
        borderRadius: 15,
        alignItems: 'center',
        // Shadow for neat look
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    avatarBox: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: COLORS.primary || '#4CAF50', // Fallback color
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    nameText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    emailText: {
        fontSize: 16,
        color: '#666',
        marginBottom: 5,
    },
    roleText: {
        fontSize: 14,
        color: COLORS.primary || '#4CAF50',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
    },
    menuText: {
        flex: 1,
        marginLeft: 15,
        fontSize: 16,
        color: '#333',
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ff5252',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
        marginBottom: 40,
    },
    logoutText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
        marginLeft: 10,
    },
    // Modal Styles
    modalBg: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 15,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
        marginTop: 10,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        padding: 10,
        borderRadius: 8,
        fontSize: 16,
    },
    modalBtnRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 25,
    },
    modalBtn: {
        flex: 1,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelBtn: {
        backgroundColor: '#eee',
    },
    saveBtn: {
        backgroundColor: COLORS.primary || '#4CAF50',
    },
    btnText: {
        fontWeight: 'bold',
        fontSize: 16,
    }
});
