import { COLORS } from "@/constants/Colors";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";


interface Props {
    subject: string;
    grade: string;
    percentage: number;
    lastTest: string;
    color?: string;
    onPress?: () => void;
}

export default function SubjectCard({ subject, grade, percentage, lastTest, color = COLORS.primary, onPress }: Props) {
    return (
        <TouchableOpacity style={styles.card} onPress={onPress}>
            <Text style={styles.title}>{subject}</Text>
            <View style={styles.progressRow}>
                <View style={styles.progressBar}>
                    <View style={[styles.progressFill, { width: `${percentage}%`, backgroundColor: color }]} />
                </View>
                <Text style={styles.perc}>{percentage}%</Text>
            </View>
            <View style={styles.meta}>
                <Text style={styles.metaLabel}>Grade</Text>
                <Text style={[styles.metaValue, { color }]}>{grade}</Text>
                <Text style={styles.metaLabel}>Last</Text>
                <Text style={styles.metaValue}>{lastTest}</Text>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: { backgroundColor: COLORS.white, borderRadius: 12, padding: 14, marginBottom: 12, elevation: 2 },
    title: { fontWeight: "700", fontSize: 16, marginBottom: 8, color: COLORS.textPrimary },
    progressRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
    progressBar: { flex: 1, height: 8, backgroundColor: "#EEF2FF", borderRadius: 8, marginRight: 10, overflow: "hidden" },
    progressFill: { height: "100%", borderRadius: 8 },
    perc: { fontWeight: "700", color: COLORS.textSecondary },
    meta: { flexDirection: "row", justifyContent: "space-between", marginTop: 6 },
    metaLabel: { color: COLORS.textLight, fontSize: 12 },
    metaValue: { fontWeight: "700", fontSize: 13 },
});
