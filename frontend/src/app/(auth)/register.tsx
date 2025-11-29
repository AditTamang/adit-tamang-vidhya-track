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

type UserRole = 'teacher' | 'parent' | 'student';

type Props = {};

const Register = (props: Props) => {
    const router = useRouter();
    const [selectedRole, setSelectedRole] = useState<UserRole>('parent');
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [studentCode, setStudentCode] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleRegister = async () => {
        if (!fullName || !email || !password || !confirmPassword) {
            Alert.alert('Error', 'Please fill in all required fields');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Error', 'Passwords do not match');
            return;
        }

        if (selectedRole === 'parent' && !studentCode) {
            Alert.alert('Error', 'Please enter student code');
            return;
        }

        setIsLoading(true);
        try {
            // TODO: Implement actual registration logic here
            setTimeout(() => {
                setIsLoading(false);
                Alert.alert(
                    'Success',
                    'Registration submitted! Please wait for admin approval.',
                    [{ text: 'OK', onPress: () => router.replace('/login') }]
                );
            }, 1500);
        } catch (error) {
            setIsLoading(false);
            Alert.alert('Error', 'Registration failed');
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
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subText}>Sign up to get started with VidyaTrack Nepal</Text>

                    {/* Divider */}
                    <View style={styles.dividerContainer}>
                        <View style={styles.dividerLine} />
                        <Ionicons name="pulse" size={24} color="#4CAF50" />
                        <View style={styles.dividerLine} />
                    </View>

                    {/* Role Selection */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>I am a</Text>
                        <View style={styles.roleContainer}>
                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    selectedRole === 'teacher' && styles.roleButtonActive,
                                ]}
                                onPress={() => setSelectedRole('teacher')}
                            >
                                <Ionicons
                                    name="school-outline"
                                    size={20}
                                    color={selectedRole === 'teacher' ? '#fff' : '#666'}
                                />
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        selectedRole === 'teacher' && styles.roleButtonTextActive,
                                    ]}
                                >
                                    Teacher
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[
                                    styles.roleButton,
                                    selectedRole === 'parent' && styles.roleButtonActive,
                                ]}
                                onPress={() => setSelectedRole('parent')}
                            >
                                <Ionicons
                                    name="people-outline"
                                    size={20}
                                    color={selectedRole === 'parent' ? '#fff' : '#666'}
                                />
                                <Text
                                    style={[
                                        styles.roleButtonText,
                                        selectedRole === 'parent' && styles.roleButtonTextActive,
                                    ]}
                                >
                                    Parent
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Full Name Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Full Name</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="person-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your full name"
                                placeholderTextColor="#999"
                                value={fullName}
                                onChangeText={setFullName}
                            />
                        </View>
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

                    {/* Phone Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Phone Number</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="call-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Enter your phone number"
                                placeholderTextColor="#999"
                                value={phone}
                                onChangeText={setPhone}
                                keyboardType="phone-pad"
                            />
                        </View>
                    </View>

                    {/* Student Code (for Parents only) */}
                    {selectedRole === 'parent' && (
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Student Code</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="key-outline" size={20} color="#666" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter student code"
                                    placeholderTextColor="#999"
                                    value={studentCode}
                                    onChangeText={setStudentCode}
                                    autoCapitalize="characters"
                                />
                            </View>
                            <Text style={styles.helperText}>
                                Enter the unique code provided by the school
                            </Text>
                        </View>
                    )}

                    {/* Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Create a password"
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

                    {/* Confirm Password Input */}
                    <View style={styles.inputGroup}>
                        <Text style={styles.label}>Confirm Password</Text>
                        <View style={styles.inputContainer}>
                            <Ionicons name="lock-closed-outline" size={20} color="#666" style={styles.inputIcon} />
                            <TextInput
                                style={styles.input}
                                placeholder="Confirm your password"
                                placeholderTextColor="#999"
                                value={confirmPassword}
                                onChangeText={setConfirmPassword}
                                secureTextEntry={!showConfirmPassword}
                                autoCapitalize="none"
                            />
                            <TouchableOpacity
                                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={styles.eyeIcon}
                            >
                                <Ionicons
                                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                                    size={20}
                                    color="#666"
                                />
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Register Button */}
                    <TouchableOpacity
                        style={[styles.registerButton, isLoading && styles.registerButtonDisabled]}
                        onPress={handleRegister}
                        disabled={isLoading}
                    >
                        <Text style={styles.registerButtonText}>
                            {isLoading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                        <Ionicons name="arrow-forward" size={20} color="#fff" />
                    </TouchableOpacity>

                    {/* Sign In Link */}
                    <View style={styles.signInContainer}>
                        <Text style={styles.signInText}>Already have an account? </Text>
                        <Link href="/login" asChild>
                            <TouchableOpacity>
                                <Text style={styles.signInLink}>Sign in</Text>
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
    },
    innerContainer: {
        flex: 1,
        paddingHorizontal: 30,
        paddingVertical: 40,
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 15,
        marginTop: 20,
    },
    logo: {
        width: 70,
        height: 70,
        marginBottom: 8,
    },
    logoText: {
        fontSize: 24,
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
        marginTop: 10,
    },
    subText: {
        fontSize: 13,
        textAlign: 'center',
        color: '#333',
        marginTop: 5,
        marginBottom: 15,
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
    },
    dividerLine: {
        width: 50,
        height: 2,
        backgroundColor: '#000',
        marginHorizontal: 10,
    },
    inputGroup: {
        marginBottom: 16,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000',
        marginBottom: 8,
    },
    roleContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    roleButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        paddingVertical: 12,
        gap: 8,
    },
    roleButtonActive: {
        backgroundColor: '#4CAF50',
    },
    roleButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
    },
    roleButtonTextActive: {
        color: '#fff',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E5E7EB',
        borderRadius: 12,
        paddingHorizontal: 15,
        height: 48,
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
    helperText: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        fontStyle: 'italic',
    },
    registerButton: {
        backgroundColor: '#4CAF50',
        borderRadius: 12,
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
        marginBottom: 20,
    },
    registerButtonDisabled: {
        opacity: 0.6,
    },
    registerButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginRight: 10,
    },
    signInContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    signInText: {
        fontSize: 13,
        color: '#000',
    },
    signInLink: {
        fontSize: 13,
        color: '#4CAF50',
        fontWeight: '600',
    },
});
export default Register;