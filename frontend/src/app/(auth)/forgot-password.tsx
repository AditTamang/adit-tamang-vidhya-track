import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {};

const ForgotPassword = (props: Props) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSendOTP = async () => {
        if (!email) {
            Alert.alert('Error', 'Please enter your email address');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement actual OTP sending logic here
            setTimeout(() => {
                setIsLoading(false);
                Alert.alert('Success', 'OTP sent to your email');
                // Navigate to OTP verification screen if you have one
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', 'Failed to send OTP');
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.innerContainer}>
                    {/* Back Button */}
                    <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
                        <Ionicons name="arrow-back" size={24} color="#000" />
                        <Text style={styles.backButtonText}>Back to Login</Text>
                    </TouchableOpacity>

                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/icon.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>
                            <Text style={styles.logoTextGreen}>Vidhya</Text>
                            <Text style={styles.logoTextBlack}>Track</Text>
                        </Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>Forgot Password?</Text>
                    <Text style={styles.subText}>
                        No worries! Enter your email and we'll send you reset instructions
                    </Text>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Ionicons name="pulse" size={24} color="#4CAF50" />
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Email Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Email Address</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="mail-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your email"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    {/* Send OTP Button */}
                    <TouchableOpacity
                        style={[styles.sendButton, isLoading && styles.sendButtonDisabled]}
                        onPress={handleSendOTP}
                        disabled={isLoading}
                    >
                        <Text style={styles.sendButtonText}>
                            {isLoading ? 'Sending...' : 'Send OTP'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    {/* Sign Up Link */}
                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => router.push('/register')}>
                            <Text style={styles.signUpLink}>Sign up now</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D1D5DB',
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 40,
        justifyContent: 'center',
    },
    backButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
    },
    backButtonText: {
        fontSize: 14,
        color: '#000',
        marginLeft: 8,
        fontWeight: '500',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    logo: {
        width: 80,
        height: 80,
        marginBottom: 10,
    },
    logoText: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    logoTextGreen: {
        color: '#4CAF50',
    },
    logoTextBlack: {
        color: '#000',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#000',
        marginTop: 20,
    },
    subText: {
        fontSize: 13,
        textAlign: 'center',
        color: '#333',
        marginTop: 8,
        marginBottom: 20,
        paddingHorizontal: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 25,
    },
    dividerLine: {
        width: 60,
        height: 2,
        backgroundColor: '#000',
        marginHorizontal: 10,
    },
    inputGroup: {
        marginBottom: 30,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 50,
    },
    inputIcon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 14,
        color: '#000',
    },
    sendButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    sendButtonDisabled: {
        opacity: 0.6,
    },
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    signUpText: {
        fontSize: 13,
        color: '#000',
    },
    signUpLink: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: '600',
    },
});

export default ForgotPassword;