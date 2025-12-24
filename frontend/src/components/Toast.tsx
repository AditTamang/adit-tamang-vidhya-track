import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Animated, Platform } from 'react-native';

interface ToastProps {
    message: string;
    visible: boolean;
    onHide: () => void;
    type?: 'success' | 'error' | 'info';
}
//
const Toast: React.FC<ToastProps> = ({ message, visible, onHide, type = 'info' }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 300,
                useNativeDriver: true,
            }).start();

            const timer = setTimeout(() => {
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }).start(() => {
                    onHide();
                });
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [visible, fadeAnim, onHide]);

    if (!visible) return null;

    const getBackgroundColor = () => {
        switch (type) {
            case 'success': return '#4CAF50';
            case 'error': return '#F44336';
            default: return '#333';
        }
    };

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor: getBackgroundColor() }]}>
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
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
        alignItems: 'center',
    },
    text: {
        color: 'white',
        fontSize: 14,
        fontWeight: '500',
        textAlign: 'center',
    },
});

export default Toast;
