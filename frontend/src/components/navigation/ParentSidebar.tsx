import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { COLORS } from "@/constants/Colors";


interface MenuItem {
    id: string;
    title: string;
    icon: string;
    route: string;
    badge?: number;
}

const menuItems: MenuItem[] = [
    { id: "1", title: "Dashboard", icon: "home-outline", route: "/(parent)/dashboard" },
    { id: "2", title: "Student Profile", icon: "person-outline", route: "/(parent)/profile" },
    { id: "3", title: "Attendance", icon: "calendar-outline", route: "/(parent)/attendance" },
    { id: "4", title: "Homework", icon: "document-text-outline", route: "/(parent)/homework", badge: 4 },
    { id: "5", title: "Results", icon: "stats-chart-outline", route: "/(parent)/results" },
    { id: "6", title: "Report Cards", icon: "document-outline", route: "/(parent)/report-cards" },
    { id: "7", title: "Chat", icon: "chatbubbles-outline", route: "/(parent)/chat", badge: 2 },
    { id: "8", title: "Fees", icon: "card-outline", route: "/(parent)/fees" },
    { id: "9", title: "Announcements", icon: "megaphone-outline", route: "/(parent)/announcements", badge: 1 },
    { id: "10", title: "Behavior", icon: "star-outline", route: "/(parent)/behavior" },
    { id: "11", title: "Remarks", icon: "chatbox-ellipses-outline", route: "/(parent)/remarks" },
    { id: "12", title: "Settings", icon: "settings-outline", route: "/(parent)/settings" },
];

export default function ParentSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.logoEmoji}>🌳</Text>
                <Text style={styles.logoText}>VidhyaTrack</Text>
            </View>

            <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
                {menuItems.map((item) => {
                    const isActive = pathname === item.route;
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.menuItem, isActive && styles.menuItemActive]}
                            onPress={() => router.push(item.route as any)}
                            activeOpacity={0.7}
                        >
                            <Ionicons name={item.icon as any} size={20} color={isActive ? COLORS.primary : COLORS.textSecondary} />
                            <Text style={[styles.menuText, isActive && styles.menuTextActive]}>{item.title}</Text>
                            {item.badge ? (
                                <View style={styles.menuBadge}>
                                    <Text style={styles.menuBadgeText}>{item.badge}</Text>
                                </View>
                            ) : null}
                        </TouchableOpacity>
                    );
                })}
                <View style={styles.divider} />
                <TouchableOpacity style={styles.menuItem} onPress={() => router.replace("/(auth)/login")}>
                    <Ionicons name="log-out-outline" size={20} color={COLORS.error} />
                    <Text style={[styles.menuText, { color: COLORS.error }]}>Logout</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.white, paddingTop: 24 },
    header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: COLORS.border, flexDirection: "row", alignItems: "center", gap: 10 },
    logoEmoji: { fontSize: 26 },
    logoText: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
    menuContainer: { padding: 12 },
    menuItem: { flexDirection: "row", alignItems: "center", paddingVertical: 10, paddingHorizontal: 10, borderRadius: 10, marginBottom: 6, gap: 12 },
    menuItemActive: { backgroundColor: "#ECFDF3" },
    menuText: { flex: 1, color: COLORS.textSecondary, fontWeight: "500" },
    menuTextActive: { color: COLORS.primary, fontWeight: "700" },
    menuBadge: { backgroundColor: COLORS.error, borderRadius: 10, paddingHorizontal: 6, paddingVertical: 2 },
    menuBadgeText: { color: COLORS.white, fontSize: 11, fontWeight: "700" },
    divider: { height: 1, backgroundColor: COLORS.border, marginVertical: 12 },
});
