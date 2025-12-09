import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    Image, KeyboardAvoidingView, Platform, ScrollView, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const ForgotPassword = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email) {
            Alert.alert("Error", "Please enter your email");
            return;
        }

        // Validate Gmail email
        if (!email.endsWith('@gmail.com')) {
            Alert.alert("Error", "Email must be a Gmail address (@gmail.com)");
            return;
        }

        setIsLoading(true);

        try {
            const { forgotPassword } = await import('@/services/authService');
            const response = await forgotPassword(email);

            if (response.status === 200) {
                Alert.alert("Success", "OTP sent to your email");

                router.push({
                    pathname: "/otp-verification",
                    params: { email, flow: 'reset' },
                });
            } else {
                Alert.alert("Error", response.message || "Something went wrong");
            }

        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to send OTP");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                <View style={styles.innerContainer}>

                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                        <Text style={styles.backButtonText}>Back to Login</Text>
                    </TouchableOpacity>

                    <View style={styles.logoContainer}>
                        <Image source={require("../../../assets/logo.png")} style={styles.logo} resizeMode="contain" />
                        <Text style={styles.logoText}>
                            <Text style={styles.logoTextGreen}>Vidhya</Text>
                            <Text style={styles.logoTextBlack}>Track</Text>
                        </Text>
                    </View>

                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subText}>No worries! Enter your email to get reset instructions</Text>

                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Ionicons name="pulse" size={24} color="#4CAF50" />
                        <View style={styles.dividerLine} />
                    </View>

                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your Gmail (@gmail.com)"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>
                    </View>

                    <TouchableOpacity
                        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                        disabled={isLoading}
                        onPress={handleSendOTP}
                    >
                        <Text style={styles.sendButtonText}>{isLoading ? "Sending..." : "Send OTP"}</Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#D1D5DB" },
    scrollContent: { flexGrow: 1, justifyContent: "center" },
    innerContainer: { paddingHorizontal: 30, paddingVertical: 40 },
    backButton: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
    backButtonText: { marginLeft: 8, fontSize: 14, fontWeight: "500" },
    logoContainer: { alignItems: "center", marginBottom: 20 },
    logo: { width: 80, height: 80 },
    logoText: { fontSize: 28, fontWeight: "bold" },
    logoTextGreen: { color: "#4CAF50" },
    logoTextBlack: { color: "#000" },
    title: { fontSize: 28, fontWeight: "bold", textAlign: "center" },
    subText: { textAlign: "center", color: "#333", marginTop: 8 },
    dividerContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginVertical: 25 },
    dividerLine: { width: 60, height: 2, backgroundColor: "#000" },
    inputGroup: {},
    label: { marginBottom: 6, fontSize: 14, fontWeight: "600" },
    inputContainer: { flexDirection: "row", backgroundColor: "#E5E7EB", borderRadius: 12, paddingHorizontal: 15, height: 50, alignItems: "center" },
    inputIcon: { marginRight: 10 },
    input: { flex: 1 },
    sendButton: { backgroundColor: "#4CAF50", borderRadius: 12, height: 50, alignItems: "center", justifyContent: "center", flexDirection: "row" },
    sendButtonText: { color: "#fff", fontSize: 16, fontWeight: "600", marginRight: 10 },
    sendButtonDisabled: { opacity: 0.6 }
});

export default ForgotPassword;
