import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { COLORS } from '@/constants/Colors';

export default function TeacherDashboard() {
    const router = useRouter();
    const [userName, setUserName] = useState('Teacher');

    useEffect(() => {
        const loadUser = async () => {
            try {
                const AsyncStorage = require('@react-native-async-storage/async-storage').default;
                const userData = await AsyncStorage.getItem('userData');
                if (userData) {
                    const user = JSON.parse(userData);
                    setUserName(user.name || 'Teacher');
                }
            } catch (e) { }
        };
        loadUser();
    }, []);

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hi, {userName}!</Text>
                    <Text style={styles.subGreeting}>How Are you Today?</Text>
                </View>
                <View style={styles.headerIcons}>
                    <TouchableOpacity><Ionicons name="search" size={24} color="#333" /></TouchableOpacity>
                    <TouchableOpacity><Ionicons name="notifications-outline" size={24} color="#333" /></TouchableOpacity>
                </View>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Banner */}
                <View style={styles.banner}>
                    <Image source={require('../../../assets/graduation.png')} style={styles.bannerImage} />
                    <View style={styles.bannerText}>
                        <Text style={styles.bannerTitle}>Stay connected</Text>
                        <Text style={styles.bannerTitle}>with your school life</Text>
                        <TouchableOpacity style={styles.bannerBtn}>
                            <Text style={styles.bannerBtnText}>Find Nearby</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Features */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Features</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>

                <View style={styles.featuresGrid}>
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}><Ionicons name="home" size={28} color="#333" /></View>
                        <Text style={styles.featureText}>Dashboard</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}><Ionicons name="school" size={28} color="#333" /></View>
                        <Text style={styles.featureText}>Classes</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}><Ionicons name="checkbox" size={28} color="#333" /></View>
                        <Text style={styles.featureText}>Attendance</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.featureCard}>
                        <View style={styles.iconCircle}><Ionicons name="document-text" size={28} color="#333" /></View>
                        <Text style={styles.featureText}>Homework</Text>
                    </TouchableOpacity>
                </View>

                {/* Recommendation */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Recommendation</Text>
                    <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
                </View>
                <View style={styles.recommendCard}><Text style={styles.recommendText}>Mark today's attendance</Text></View>
                <View style={styles.recommendCard}><Text style={styles.recommendText}>Review pending assignments</Text></View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#C5D3D8' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 50, paddingBottom: 15 },
    greeting: { fontSize: 22, fontWeight: '700', color: '#333' },
    subGreeting: { fontSize: 14, color: '#666' },
    headerIcons: { flexDirection: 'row', gap: 15 },
    content: { flex: 1, paddingHorizontal: 20 },
    banner: { backgroundColor: '#E8EDF0', borderRadius: 16, padding: 20, flexDirection: 'row', marginBottom: 20 },
    bannerImage: { width: 100, height: 120, resizeMode: 'contain' },
    bannerText: { flex: 1, justifyContent: 'center', marginLeft: 15 },
    bannerTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
    bannerBtn: { backgroundColor: '#333', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, marginTop: 10, alignSelf: 'flex-start' },
    bannerBtnText: { color: '#fff', fontSize: 12, fontWeight: '600' },
    sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
    sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333' },
    seeAll: { fontSize: 14, color: COLORS.primary },
    featuresGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20 },
    featureCard: { width: '47%', backgroundColor: '#fff', borderRadius: 12, padding: 15, alignItems: 'center' },
    iconCircle: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#E8EDF0', justifyContent: 'center', alignItems: 'center', marginBottom: 8 },
    featureText: { fontSize: 13, fontWeight: '600', color: '#333' },
    recommendCard: { backgroundColor: '#E8EDF0', borderRadius: 12, padding: 20, marginBottom: 12 },
    recommendText: { fontSize: 14, color: '#666' },
});

