import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity,
    StyleSheet, KeyboardAvoidingView, Platform,
    ScrollView, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function ResetPassword() {
    const router = useRouter();
    const { email } = useLocalSearchParams();

    const decodedEmail = decodeURIComponent(email as string);

    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [show, setShow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        if (!password || !confirm) {
            Alert.alert("Error", "All fields are required");
            return;
        }

        // Validate password format: at least 1 uppercase, 1 number, 1 special character
        const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).*$/;
        if (!passwordRegex.test(password)) {
            Alert.alert(
                "Error",
                "Password must contain at least one uppercase letter, one number, and one special character"
            );
            return;
        }

        if (password !== confirm) {
            Alert.alert("Error", "Passwords do not match");
            return;
        }

        setIsLoading(true);
        try {
            const { resetPassword } = await import('@/services/authService');
            const response = await resetPassword(decodedEmail, password);

            if (response.status === 200) {
                Alert.alert("Success", "Password updated successfully", [
                    {
                        text: 'OK',
                        onPress: () => router.push("/login")
                    }
                ]);
            } else {
                Alert.alert("Error", response.message || "Failed to reset password");
            }

        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to reset password");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={26} color="#000" />
                </TouchableOpacity>

                <Text style={styles.title}>Reset Password</Text>
                <Text style={styles.subtitle}>
                    Enter your new password
                </Text>

                {/* NEW PASSWORD */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>New Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!show}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter new password"
                        />
                        <TouchableOpacity onPress={() => setShow(!show)}>
                            <Ionicons
                                name={show ? "eye-outline" : "eye-off-outline"}
                                size={20}
                                color="#666"
                            />
                        </TouchableOpacity>
                    </View>
                    <Text style={styles.helperText}>
                        Must contain: 1 uppercase, 1 number, 1 special character
                    </Text>
                </View>

                {/* CONFIRM PASSWORD */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Confirm Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons name="lock-closed-outline" size={20} color="#666" />
                        <TextInput
                            style={styles.input}
                            secureTextEntry={!show}
                            value={confirm}
                            onChangeText={setConfirm}
                            placeholder="Confirm new password"
                        />
                    </View>
                </View>

                {/* SUBMIT BUTTON */}
                <TouchableOpacity 
                    style={[styles.button, isLoading && styles.buttonDisabled]} 
                    onPress={handleSubmit}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Updating Password...' : 'Update Password'}
                    </Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>

            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#D1D5DB" },
    content: { padding: 25 },
    title: { fontSize: 28, fontWeight: "700", textAlign: "center", marginTop: 20 },
    subtitle: { textAlign: "center", marginTop: 5, color: "#444" },
    inputGroup: { marginTop: 25 },
    label: { fontSize: 14, fontWeight: "600", marginBottom: 8 },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#E5E7EB",
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
    },
    input: { flex: 1, marginLeft: 10 },
    button: {
        marginTop: 40,
        backgroundColor: "#4CAF50",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        height: 50,
        borderRadius: 12,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "600",
        marginRight: 10,
    },
    buttonDisabled: {
        opacity: 0.6,
    },
    helperText: {
        fontSize: 12,
        color: "#666",
        marginTop: 5,
        fontStyle: "italic",
    },
});
