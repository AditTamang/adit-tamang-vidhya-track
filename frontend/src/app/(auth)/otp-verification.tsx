import { useRouter, useLocalSearchParams } from "expo-router";
import React, { useRef, useState } from "react";
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ScrollView, Image, Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

import Toast from '@/components/Toast';

export default function OTPVerification() {
    const router = useRouter();
    const { email, flow } = useLocalSearchParams();

    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const [isResending, setIsResending] = useState(false);
    const [cooldown, setCooldown] = useState(0);
    const inputRefs = useRef<Array<TextInput | null>>([]);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    // Timer effect for cooldown
    React.useEffect(() => {
        let timer: any;
        if (cooldown > 0) {
            timer = setInterval(() => {
                setCooldown((prev) => prev - 1);
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [cooldown]);

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
            showToast("Enter the 6-digit OTP", "error");
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
                    showToast("Email Verified! Pending Admin Approval.", "success");
                    setTimeout(() => {
                        router.replace('/login');
                    }, 2000);
                } else {
                    // Reset password OTP verified - proceed to reset password
                    showToast("OTP Verified", "success");
                    setTimeout(() => {
                        router.push({
                            pathname: "/reset-password",
                            params: { email }
                        });
                    }, 1000);
                }
            } else {
                showToast(response.message || "Invalid OTP", "error");
            }

        } catch (err: any) {
            showToast(err.message || "Failed to verify OTP", "error");
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

                <TouchableOpacity onPress={handleResend} disabled={isResending || cooldown > 0}>
                    <Text style={[styles.resendText, (isResending || cooldown > 0) && { opacity: 0.5 }]}>
                        {isResending ? "Sending..." : cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend Code"}
                    </Text>
                </TouchableOpacity>
            </ScrollView>
            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={hideToast}
                type={toast.type}
            />
        </KeyboardAvoidingView>
    );

    // Resend OTP handler
    async function handleResend() {
        if (cooldown > 0) return;

        setIsResending(true);
        try {
            const { resendOTP } = await import('@/services/authService');
            const purpose = flow === 'registration' ? 'registration' : 'forgot_password';
            const response = await resendOTP(email as string, purpose);

            if (response.status === 200) {
                showToast("New OTP sent!", "success");
                setCooldown(60); // 60s cooldown
                // Clear the OTP fields
                setOtp(["", "", "", "", "", ""]);
            } else {
                showToast(response.message || "Failed to resend OTP", "error");
            }
        } catch (err: any) {
            showToast(err.message || "Failed to resend OTP", "error");
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
