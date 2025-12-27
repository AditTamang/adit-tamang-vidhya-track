import { Link, useRouter } from 'expo-router';
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
import Toast from '@/components/Toast';

type Props = {};

const Login = (props: Props) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [toast, setToast] = useState({ visible: false, message: '', type: 'info' as 'success' | 'error' | 'info' });

    const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
        setToast({ visible: true, message, type });
    };

    const hideToast = () => {
        setToast({ ...toast, visible: false });
    };

    const handleLogin = async () => {
        if (!email || !password) {
            showToast('Please fill in all fields', 'error');
            return;
        }

        // Email validation removed to allow all valid emails as per requirements

        setIsLoading(true);
        try {
            const { login } = await import('@/services/authService');
            const response = await login({ email, password });

            if (response.status === 200 && response.data) {
                const user = response.data.user;
                const userRole = user.role;

                showToast('Login Successful', 'success');

                // Delay navigation slightly to show success message
                setTimeout(() => {
                    // Navigate to appropriate dashboard based on user role
                    if (userRole === 'admin') {
                        router.replace('/(admin)/dashboard');
                    } else if (userRole === 'parent') {
                        router.replace('/(parent)/dashboard');
                    } else if (userRole === 'teacher') {
                        router.replace('/(teacher)/dashboard');
                    } else if (userRole === 'student') {
                        router.replace('/(student)/dashboard');
                    } else {
                        router.replace('/(parent)/dashboard'); // Default fallback
                    }
                }, 1000);
            } else if (response.status === 403) {
                // Admin approval pending
                Alert.alert(
                    'Your account is pending admin approval. Please wait for an admin to approve your account.'
                );
            } else {
                showToast(response.message || 'Invalid credentials', 'error');
            }
        } catch (error: any) {
            // Check if it's the admin approval error
            if (error.message && error.message.includes('pending admin approval')) {
                showToast('Your account is pending admin approval.', 'info');
            } else {
                showToast(error.message || 'Login failed. Please try again.', 'error');
            }
        } finally {
            setIsLoading(false);
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
                    {/* Logo */}
                    <View style={styles.logoContainer}>
                        <Image
                            source={require('../../../assets/logo.png')}
                            style={styles.logo}
                            resizeMode="contain"
                        />
                        <Text style={styles.logoText}>
                            <Text style={styles.logoTextGreen}>Vidhya</Text>
                            <Text style={styles.logoTextBlack}>Track</Text>
                        </Text>
                    </View>

                    {/* Welcome Text */}
                    <Text style={styles.welcomeText}>Welcome Back</Text>
                    <Text style={styles.subText}>Sign in to access VidyaTrack Nepal</Text>

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
                                placeholder="Enter your email address"
                                placeholderTextColor="#999"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoComplete="email"
                            />
                        </View>
                    </View>

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your password"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Forgot Password */}
                    <View style={styles.optionsContainer}>
                        <Link href="/forgot-password" asChild>
                            <TouchableOpacity>
                                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>

                    {/* Sign In Button */}
                    <TouchableOpacity
                        style={[styles.signInButton, isLoading && styles.signInButtonDisabled]}
                        onPress={handleLogin}
                        disabled={isLoading}
                    >
                        <Text style={styles.signInButtonText}>
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    <View style={styles.signUpContainer}>
                        <Text style={styles.signUpText}>Don't have an account? </Text>
                        <Link href="/register" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signUpLink}>Sign up now</Text>
                            </TouchableOpacity>
                        </Link>
                    </View>
                </View>
            </ScrollView>
            <Toast
                message={toast.message}
                visible={toast.visible}
                onHide={hideToast}
                type={toast.type}
            />
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
    welcomeText: {
        fontSize: 32,
        fontWeight: 'bold',
        fontStyle: 'italic',
        textAlign: 'center',
        color: '#000',
        marginTop: 20,
    },
    subText: {
        fontSize: 14,
        textAlign: 'center',
        color: '#333',
        marginTop: 5,
        marginBottom: 20,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        width: 60,
        height: 2,
        backgroundColor: '#000',
        marginHorizontal: 10,
    },
    inputGroup: {
        marginBottom: 20,
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
    eyeIcon: {
        padding: 5,
    },
    optionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 30,
    },
    rememberMeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    checkbox: {
        width: 18,
        height: 18,
        borderWidth: 2,
        borderColor: '#666',
        borderRadius: 3,
        marginRight: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rememberMeText: {
        fontSize: 13,
        color: '#000',
    },
    forgotPasswordText: {
        fontSize: 13,
        color: '#000',
        fontWeight: '600',
        marginLeft: 200
    },
    signInButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 14,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 17,
    },
    signInButtonDisabled: {
        opacity: 0.6,
    },
    signInButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    signUpContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
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

export default Login;