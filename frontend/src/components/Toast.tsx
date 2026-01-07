import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, Animated } from 'react-native';

interface ToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
    type?: 'success' | 'error' | 'info';
}

const Toast: React.FC<ToastProps> = ({ message, visible, onHide, type = 'info' }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            // Fade in
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            // Auto hide after 3 seconds
            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => onHide());
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible]);

    if (!visible) return null;

    // Simple color based on type
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#F44336' : '#333';

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: bgColor }]}>
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 50,
        left: 20,
        right: 20,
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        zIndex: 1000,
    },
    text: {
        color: 'white',
        fontSize: 14,
        textAlign: 'center',
    },
});

export default Toast;
