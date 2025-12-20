import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { COLORS } from "@/constants/Colors";


export default function ParentHeader({ title }: { title?: string }) {
    const router = useRouter();
    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => router.back()}>
                <Ionicons name="arrow-back" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.title}>{title || "Dashboard"}</Text>
            <TouchableOpacity onPress={() => router.push("/(parent)/notifications")}>
                <Ionicons name="notifications-outline" size={22} color={COLORS.textPrimary} />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { height: 56, backgroundColor: COLORS.white, paddingHorizontal: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", borderBottomWidth: 1, borderBottomColor: COLORS.border },
    title: { fontSize: 18, fontWeight: "700", color: COLORS.textPrimary },
});
