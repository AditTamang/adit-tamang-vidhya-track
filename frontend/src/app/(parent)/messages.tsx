import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/Colors';
import { API_BASE_URL } from '@/services/api';

// Simple message interface
interface Message {
    id: number;
    senderName: string;
    senderRole: string;
    subject: string;
    preview: string;
    date: string;
    isRead: boolean;
}

export default function MessagesScreen() {
    const [loading, setLoading] = useState(true);
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        loadMessages();
    }, []);

    const loadMessages = async () => {
        try {
            // Sample messages data (will be replaced with API in Sprint 6)
            const sampleMessages: Message[] = [
                {
                    id: 1,
                    senderName: 'Mrs. Sharma',
                    senderRole: 'Class Teacher',
                    subject: 'Upcoming Parent Meeting',
                    preview: 'Dear Parent, Please attend the parent-teacher meeting on...',
                    date: 'Today',
                    isRead: false,
                },
                {
                    id: 2,
                    senderName: 'Mr. Thapa',
                    senderRole: 'Math Teacher',
                    subject: 'Math Homework Update',
                    preview: 'Your child has submitted the homework assignment...',
                    date: 'Yesterday',
                    isRead: true,
                },
                {
                    id: 3,
                    senderName: 'School Admin',
                    senderRole: 'Administration',
                    subject: 'Fee Payment Reminder',
                    preview: 'This is a gentle reminder for the pending fee payment...',
                    date: '25 Dec',
                    isRead: true,
                },
                {
                    id: 4,
                    senderName: 'Ms. Rai',
                    senderRole: 'Science Teacher',
                    subject: 'Science Project Update',
                    preview: 'Your child has shown great progress in the science project...',
                    date: '23 Dec',
                    isRead: true,
                },
            ];
            setMessages(sampleMessages);
        } catch (error) {
            console.log('Error loading messages:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.title}>Messages</Text>
                <TouchableOpacity style={styles.composeButton}>
                    <Ionicons name="create-outline" size={22} color={COLORS.primary} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* Info Banner */}
                <View style={styles.infoBanner}>
                    <Ionicons name="information-circle" size={20} color="#1976D2" />
                    <Text style={styles.infoText}>
                        Message teachers directly about your child's progress
                    </Text>
                </View>

                {/* Messages List */}
                {messages.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Ionicons name="chatbubbles-outline" size={50} color={COLORS.textLight} />
                        <Text style={styles.emptyText}>No messages yet</Text>
                        <Text style={styles.emptySubtext}>Your conversations will appear here</Text>
                    </View>
                ) : (
                    messages.map((message) => (
                        <TouchableOpacity key={message.id} style={styles.messageCard}>
                            {/* Unread Indicator */}
                            {!message.isRead && <View style={styles.unreadDot} />}

                            {/* Avatar */}
                            <View style={styles.avatar}>
                                <Text style={styles.avatarText}>
                                    {message.senderName.charAt(0)}
                                </Text>
                            </View>

                            {/* Message Content */}
                            <View style={styles.messageContent}>
                                <View style={styles.messageHeader}>
                                    <Text style={[styles.senderName, !message.isRead && styles.unreadText]}>
                                        {message.senderName}
                                    </Text>
                                    <Text style={styles.messageDate}>{message.date}</Text>
                                </View>
                                <Text style={styles.senderRole}>{message.senderRole}</Text>
                                <Text style={[styles.messageSubject, !message.isRead && styles.unreadText]}>
                                    {message.subject}
                                </Text>
                                <Text style={styles.messagePreview} numberOfLines={1}>
                                    {message.preview}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    ))
                )}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 15,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
        color: COLORS.textPrimary,
    },
    composeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: COLORS.white,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
    },
    infoBanner: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#E3F2FD',
        padding: 12,
        borderRadius: 10,
        marginBottom: 16,
        gap: 10,
    },
    infoText: {
        flex: 1,
        fontSize: 13,
        color: '#1976D2',
    },
    emptyContainer: {
        alignItems: 'center',
        paddingVertical: 50,
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: COLORS.textPrimary,
        marginTop: 12,
    },
    emptySubtext: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
    messageCard: {
        backgroundColor: COLORS.white,
        borderRadius: 12,
        padding: 16,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'flex-start',
        position: 'relative',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    unreadDot: {
        position: 'absolute',
        left: 8,
        top: 24,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: COLORS.primary,
    },
    avatar: {
        width: 45,
        height: 45,
        borderRadius: 23,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    avatarText: {
        fontSize: 18,
        fontWeight: '700',
        color: COLORS.white,
    },
    messageContent: {
        flex: 1,
    },
    messageHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    senderName: {
        fontSize: 15,
        fontWeight: '600',
        color: COLORS.textPrimary,
    },
    unreadText: {
        fontWeight: '700',
    },
    messageDate: {
        fontSize: 12,
        color: COLORS.textSecondary,
    },
    senderRole: {
        fontSize: 12,
        color: COLORS.textSecondary,
        marginTop: 2,
    },
    messageSubject: {
        fontSize: 14,
        fontWeight: '500',
        color: COLORS.textPrimary,
        marginTop: 6,
    },
    messagePreview: {
        fontSize: 13,
        color: COLORS.textSecondary,
        marginTop: 4,
    },
});