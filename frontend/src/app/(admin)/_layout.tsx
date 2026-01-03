import React, { useState } from 'react';
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import MenuModal from '@/components/MenuModal';

export default function AdminLayout() {
    const [menuVisible, setMenuVisible] = useState(false);

    return (
        <>
            <Tabs
                screenOptions={{
                    tabBarActiveTintColor: '#4CAF50',
                    tabBarInactiveTintColor: '#666',
                    tabBarStyle: {
                        backgroundColor: '#fff',
                        borderTopWidth: 1,
                        borderTopColor: '#E5E7EB',
                    },
                    headerShown: false, // Hide page titles
                }}
            >
                <Tabs.Screen
                    name="dashboard"
                    options={{
                        title: 'Dashboard',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="users"
                    options={{
                        title: 'Users',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="people-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="menu"
                    options={{
                        title: 'Menu',
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="menu-outline" size={size} color={color} />
                        ),
                    }}
                    listeners={{
                        tabPress: (e) => {
                            e.preventDefault();
                            setMenuVisible(true);
                        },
                    }}
                />
                {/* Hidden screens - accessible via menu or other navigation */}
                <Tabs.Screen
                    name="links"
                    options={{
                        href: null, // Hide from tab bar
                    }}
                />
                <Tabs.Screen
                    name="classes"
                    options={{
                        href: null, // Hide from tab bar
                    }}
                />
                <Tabs.Screen
                    name="academic-years"
                    options={{
                        href: null, // Hide from tab bar
                    }}
                />
                <Tabs.Screen
                    name="audit-logs"
                    options={{
                        href: null, // Hide from tab bar
                    }}
                />
            </Tabs>

            <MenuModal
                visible={menuVisible}
                onClose={() => setMenuVisible(false)}
            />
        </>
    );
}
