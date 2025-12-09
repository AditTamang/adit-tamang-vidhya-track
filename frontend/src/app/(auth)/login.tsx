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

type Props = {};

const Login = (props: Props) => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        // Validate Gmail email
        if (!email.endsWith('@gmail.com')) {
            Alert.alert('Error', 'Email must be a Gmail address (@gmail.com)');
            return;
        }

        setIsLoading(true);
        try {
            const { login } = await import('@/services/authService');
            const response = await login({ email, password });

            if (response.status === 200 && response.data) {
                const user = response.data.user;
                const userRole = user.role;

                // Navigate to appropriate dashboard based on user role
                if (userRole === 'parent') {
                    router.replace('/(parent)/dashboard');
                } else if (userRole === 'teacher') {
                    router.replace('/(teacher)/dashboard');
                } else if (userRole === 'student') {
                    router.replace('/(student)/dashboard');
                } else {
                    router.replace('/(parent)/dashboard'); // Default fallback
                }
            } else {
                Alert.alert('Error', response.message || 'Invalid credentials');
            }
        } catch (error: any) {
            Alert.alert('Error', error.message || 'Login failed. Please try again.');
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
                                placeholder="Enter your email address)"
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

                    {/* Remember Me & Forgot Password */}
                    <View style={styles.optionsContainer}>
                        <TouchableOpacity
                            style={styles.rememberMeContainer}
                            onPress={() => setRememberMe(!rememberMe)}
                        >
                            <View style={[styles.checkbox, rememberMe && styles.checkboxChecked]}>
                                {rememberMe && <Ionicons name="checkmark" size={14} color="#fff" />}
                            </View>
                            <Text style={styles.rememberMeText}>Remember me</Text>
                        </TouchableOpacity>

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

                    {/* Sign Up Link */}
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
    checkboxChecked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    rememberMeText: {
        fontSize: 13,
        color: '#000',
    },
    forgotPasswordText: {
        fontSize: 13,
        color: '#000',
        fontWeight: '600',
    },
    signInButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
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