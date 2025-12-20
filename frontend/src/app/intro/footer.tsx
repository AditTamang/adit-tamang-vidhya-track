import React from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function FooterIntro() {
    return (
        <ScrollView contentContainerStyle={styles.container}>

            {/* Logo + Menu */}
            <View style={styles.headerRow}>
                <Image
                    source={require("../../../assets/logo.png")}
                    style={styles.logo}
                />
                <Ionicons name="menu" size={28} color="#000" />
            </View>

            {/* Heading */}
            <Text style={styles.heading}>
                In every report, we reveal{' '}
                <Text style={{ fontWeight: "800" }}>progress;</Text>
                {'\n'}in every step, we guide{' '}
                <Text style={{ fontWeight: "800" }}>success.</Text>
            </Text>

            <Text style={styles.description}>
                Nepal’s first smart school communication platform. Connecting schools, parents, and students for
                better learning. Track progress, receive real-time updates, and stay engaged every day.
            </Text>

            {/* Image */}
            <Image
                source={require("../../../assets/logo.png")}
                style={styles.studentImage}
                resizeMode="contain"
            />

            {/* Get Started */}
            <TouchableOpacity style={styles.primaryButton}>
                <Text style={styles.primaryText}>Get Started</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
            </TouchableOpacity>

            {/* Learn More */}
            <TouchableOpacity style={styles.secondaryButton}>
                <Text style={styles.secondaryText}>Learn More</Text>
            </TouchableOpacity>

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#C8D1D3",
        padding: 25,
        flexGrow: 1,
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    logo: { width: 60, height: 60 },
    heading: {
        fontSize: 22,
        fontWeight: "700",
        marginTop: 25,
        marginBottom: 10,
    },
    description: {
        color: "#333",
        lineHeight: 20,
        fontSize: 14,
        marginBottom: 20,
    },
    studentImage: {
        width: "100%",
        height: 260,
        marginTop: 10,
    },
    primaryButton: {
        backgroundColor: "#4CAF50",
        borderRadius: 12,
        height: 50,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    primaryText: {
        color: "#fff",
        fontWeight: "700",
        fontSize: 16,
        marginRight: 10,
    },
    secondaryButton: {
        backgroundColor: "#000",
        borderRadius: 12,
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 15,
    },
    secondaryText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "600",
    },
});
