import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Animated,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

type MenuItemType = {
    id: string;
    title: string;
    icon: string;
    route?: string;
    onPress?: () => void;
};

type MenuModalProps = {
    visible: boolean;
    onClose: () => void;
};

export default function MenuModal({ visible, onClose }: MenuModalProps) {
    const router = useRouter();

    const menuItems: MenuItemType[] = [
        {
            id: 'links',
            title: 'Parent-Student Links',
            icon: 'link-outline',
            route: '/(admin)/links',
        },
        {
            id: 'classes',
            title: 'Classes & Sections',
            icon: 'school-outline',
            route: '/(admin)/classes',
        },
        {
            id: 'academic-years',
            title: 'Academic Years',
            icon: 'calendar-outline',
            route: '/(admin)/academic-years',
        },
        {
            id: 'audit-logs',
            title: 'Audit Logs',
            icon: 'clipboard-outline',
            route: '/(admin)/audit-logs',
        },
        // Add more menu items as needed
        // {
        //     id: 'reports',
        //     title: 'Reports',
        //     icon: 'stats-chart-outline',
        // },
        // {
        //     id: 'settings',
        //     title: 'Settings',
        //     icon: 'settings-outline',
        // },
    ];

    const handleMenuItemPress = (item: MenuItemType) => {
        if (item.route) {
            router.push(item.route as any);
        } else if (item.onPress) {
            item.onPress();
        }
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                style={styles.overlay}
                activeOpacity={1}
                onPress={onClose}
            >
                <View style={styles.menuContainer}>
                    <View style={styles.menuHeader}>
                        <Text style={styles.menuTitle}>Admin Menu</Text>
                        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                            <Ionicons name="close" size={24} color="#666" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView style={styles.menuContent}>
                        {menuItems.map((item) => (
                            <TouchableOpacity
                                key={item.id}
                                style={styles.menuItem}
                                onPress={() => handleMenuItemPress(item)}
                            >
                                <View style={styles.menuItemIcon}>
                                    <Ionicons name={item.icon as any} size={24} color="#4CAF50" />
                                </View>
                                <Text style={styles.menuItemText}>{item.title}</Text>
                                <Ionicons name="chevron-forward" size={20} color="#999" />
                            </TouchableOpacity>
                        ))}
                    </ScrollView>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    menuContainer: {
        width: '85%',
        maxHeight: '70%',
        backgroundColor: '#fff',
        borderRadius: 16,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8,
    },
    menuHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E5E7EB',
    },
    menuTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000',
    },
    closeButton: {
        padding: 4,
    },
    menuContent: {
        padding: 12,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#F9FAFB',
        borderRadius: 12,
        marginBottom: 10,
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#E8F5E9',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    menuItemText: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
        color: '#000',
    },
});
