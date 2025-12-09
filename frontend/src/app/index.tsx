import { useRouter } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { View, ActivityIndicator, Image, Text, StyleSheet } from 'react-native'

type Props = {}

const index = (props: Props) => {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Simulate loading time for QR scan/initial load
        const timer = setTimeout(() => {
            setIsLoading(false);
            router.replace('/intro/onboard1');
        }, 2000); // 2 second loading animation

        return () => clearTimeout(timer);
    }, []);

    if (isLoading) {
        return (
            <View style={styles.container}>
                <View style={styles.logoContainer}>
                    <Image
                        source={require('../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.logoText}>
                        <Text style={styles.logoTextGreen}>Vidhya</Text>
                        <Text style={styles.logoTextBlack}>Track</Text>
                    </Text>
                </View>
                <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
                <Text style={styles.loadingText}>Loading...</Text>
            </View>
        );
    }

    return null;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#D1D5DB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 40,
    },
    logo: {
        width: 120,
        height: 120,
        marginBottom: 15,
    },
    logoText: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    logoTextGreen: {
        color: '#4CAF50',
    },
    logoTextBlack: {
        color: '#000',
    },
    loader: {
        marginTop: 20,
    },
    loadingText: {
        marginTop: 15,
        fontSize: 16,
        color: '#666',
    },
});

export default index