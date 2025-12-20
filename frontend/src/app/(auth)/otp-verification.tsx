import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function OTPVerification() {
    const router = useRouter();
    const { email, flow } = useLocalSearchParams();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    const handleChange = (value: string, index: number) => {
        const updated = [...otp];
        updated[index] = value;
        setOtp(updated);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleVerify = async () => {
        const code = otp.join("");
        if (code.length !== 6) {
            Alert.alert("Error", "Enter the 6-digit OTP");
            return;
        }

        try {
            const { verifyRegistrationOTP, verifyResetOTP } = await import('@/services/authService');

            // Determine which flow we're in (registration or reset password)
            const isRegistrationFlow = flow === 'registration';

            let response;
            if (isRegistrationFlow) {
                response = await verifyRegistrationOTP(email as string, code);
            } else {
                response = await verifyResetOTP(email as string, code);
            }

            if (response.status === 200) {
                if (isRegistrationFlow) {
                    // Registration OTP verified - user must wait for admin approval
                    Alert.alert(
                        "Email Verified!",
                        "Your email has been verified. Please wait for admin approval before you can login.",
                        [
                            {
                                text: 'OK',
                                onPress: () => {
                                    // Go back to login page
                                    router.replace('/login');
                                }
                            }
                        ]
                    );
                } else {
                    // Reset password OTP verified - proceed to reset password
                    Alert.alert("Success", "OTP verified");
                    router.push({
                        pathname: "/reset-password",
                        params: { email }
                    });
                }
            } else {
                Alert.alert("Error", response.message || "Invalid OTP");
            }

        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to verify OTP");
        }
    };

    return (
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <ScrollView contentContainerStyle={styles.content}>
                <TouchableOpacity onPress={() => router.back()}>
                    <Ionicons name="arrow-back" size={26} color="#000" />
                </TouchableOpacity>

                <Image source={require("../../../assets/logo.png")} style={styles.otpImage} />

                <Text style={styles.title}>OTP Verification</Text>
                <Text style={styles.subtitle}>Enter the code sent to {email}</Text>

                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(el) => {
                                inputRefs.current[index] = el;
                            }}
                            style={styles.otpBox}
                            keyboardType="number-pad"
                            maxLength={1}
                            value={digit}
                            onChangeText={(value) => handleChange(value, index)}
                        />
                    ))}
                </View>

                <TouchableOpacity style={styles.button} onPress={handleVerify}>
                    <Text style={styles.buttonText}>Verify OTP</Text>
                    <Ionicons name="arrow-forward" size={20} color="#FFF" />
                </TouchableOpacity>

                <TouchableOpacity onPress={handleResend} disabled={isResending}>
                    <Text style={[styles.resendText, isResending && { opacity: 0.5 }]}>
                        {isResending ? "Sending..." : "Resend Code"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );

    // Resend OTP handler
    async function handleResend() {
        setIsResending(true);
        try {
            const { resendOTP } = await import('@/services/authService');
            const purpose = flow === 'registration' ? 'registration' : 'forgot_password';
            const response = await resendOTP(email as string, purpose);

            if (response.status === 200) {
                Alert.alert("Success", "New OTP sent to your email!");
                // Clear the OTP fields
                setOtp(["", "", "", "", "", ""]);
            } else {
                Alert.alert("Error", response.message || "Failed to resend OTP");
            }
        } catch (err: any) {
            Alert.alert("Error", err.message || "Failed to resend OTP");
        } finally {
            setIsResending(false);
        }
    }
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#D1D5DB" },
    content: { padding: 25 },
    otpImage: { width: 180, height: 180, alignSelf: "center", marginVertical: 20 },
    title: { fontSize: 28, fontWeight: "700", textAlign: "center" },
    subtitle: { textAlign: "center", color: "#444", marginTop: 5 },
    otpContainer: { flexDirection: "row", justifyContent: "space-between", marginTop: 30 },
    otpBox: { width: 45, height: 55, backgroundColor: "#FFF", borderRadius: 10, fontSize: 22, textAlign: "center" },
    button: { marginTop: 40, backgroundColor: "#4CAF50", height: 50, borderRadius: 12, flexDirection: "row", justifyContent: "center", alignItems: "center" },
    buttonText: { color: "#FFF", fontSize: 16, fontWeight: "600", marginRight: 10 },
    resendText: { textAlign: "center", marginTop: 20, color: "#4CAF50" }
});
