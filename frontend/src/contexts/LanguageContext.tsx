import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'English' | 'नेपाली (Nepali)';

type Translations = {
    [key: string]: {
        [key in Language]: string;
    };
};

const translations: Translations = {
    // Navigation
    'dashboard': { 'English': 'Dashboard', 'नेपाली (Nepali)': 'ड्यासबोर्ड' },
    'users': { 'English': 'Users', 'नेपाली (Nepali)': 'उपयोगकर्ताहरू' },
    'menu': { 'English': 'Menu', 'नेपाली (Nepali)': 'मेनु' },

    // Dashboard Page
    'welcomeBack': { 'English': 'Welcome Back', 'नेपाली (Nepali)': 'स्वागत छ' },
    'quickOverview': { 'English': 'Quick overview of your school', 'नेपाली (Nepali)': 'तपाईंको विद्यालयको द्रुत सारांश' },
    'totalStudents': { 'English': 'Total Students', 'नेपाली (Nepali)': 'कुल विद्यार्थीहरू' },
    'totalTeachers': { 'English': 'Total Teachers', 'नेपाली (Nepali)': 'कुल शिक्षकहरू' },
    'totalParents': { 'English': 'Total Parents', 'नेपाली (Nepali)': 'कुल अभिभावकहरू' },
    'activeClasses': { 'English': 'Active Classes', 'नेपाली (Nepali)': 'सक्रिय कक्षाहरू' },
    'statistics': { 'English': 'Statistics', 'नेपाली (Nepali)': 'तथ्याङ्क' },
    'quickActions': { 'English': 'Quick Actions', 'नेपाली (Nepali)': 'द्रुत कार्यहरू' },
    'addNewUser': { 'English': 'Add New User', 'नेपाली (Nepali)': 'नयाँ उपयोगकर्ता थप्नुहोस्' },
    'manageClasses': { 'English': 'Manage Classes', 'नेपाली (Nepali)': 'कक्षाहरू व्यवस्थापन गर्नुहोस्' },
    'viewReports': { 'English': 'View Reports', 'नेपाली (Nepali)': 'रिपोर्टहरू हेर्नुहोस्' },
    'recentActivity': { 'English': 'Recent Activity', 'नेपाली (Nepali)': 'हालैका गतिविधिहरू' },

    // Users Page
    'allUsers': { 'English': 'All Users', 'नेपाली (Nepali)': 'सबै उपयोगकर्ताहरू' },
    'manageUsers': { 'English': 'Manage all school users', 'नेपाली (Nepali)': 'सबै विद्यालय उपयोगकर्ताहरू व्यवस्थापन गर्नुहोस्' },
    'all': { 'English': 'All', 'नेपाली (Nepali)': 'सबै' },
    'teachers': { 'English': 'Teachers', 'नेपाली (Nepali)': 'शिक्षकहरू' },
    'students': { 'English': 'Students', 'नेपाली (Nepali)': 'विद्यार्थीहरू' },
    'parents': { 'English': 'Parents', 'नेपाली (Nepali)': 'अभिभावकहरू' },
    'teacher': { 'English': 'Teacher', 'नेपाली (Nepali)': 'शिक्षक' },
    'student': { 'English': 'Student', 'नेपाली (Nepali)': 'विद्यार्थी' },
    'parent': { 'English': 'Parent', 'नेपाली (Nepali)': 'अभिभावक' },
    'admin': { 'English': 'Admin', 'नेपाली (Nepali)': 'प्रशासक' },
    'viewDetails': { 'English': 'View Details', 'नेपाली (Nepali)': 'विवरण हेर्नुहोस्' },
    'edit': { 'English': 'Edit', 'नेपाली (Nepali)': 'सम्पादन गर्नुहोस्' },
    'delete': { 'English': 'Delete', 'नेपाली (Nepali)': 'मेटाउनुहोस्' },
    'previous': { 'English': 'Previous', 'नेपाली (Nepali)': 'अघिल्लो' },
    'next': { 'English': 'Next', 'नेपाली (Nepali)': 'अर्को' },
    'page': { 'English': 'Page', 'नेपाली (Nepali)': 'पृष्ठ' },
    'of': { 'English': 'of', 'नेपाली (Nepali)': 'को' },
    'loading': { 'English': 'Loading...', 'नेपाली (Nepali)': 'लोड हुँदैछ...' },
    'noUsersFound': { 'English': 'No users found', 'नेपाली (Nepali)': 'कुनै उपयोगकर्ता फेला परेन' },

    // Profile Page
    'profile': { 'English': 'Profile', 'नेपाली (Nepali)': 'प्रोफाइल' },
    'manageAccount': { 'English': 'Manage your account', 'नेपाली (Nepali)': 'आफ्नो खाता व्यवस्थापन गर्नुहोस्' },
    'administrator': { 'English': 'Administrator', 'नेपाली (Nepali)': 'प्रशासक' },
    'joined': { 'English': 'Joined', 'नेपाली (Nepali)': 'सामेल' },
    'active': { 'English': 'Active', 'नेपाली (Nepali)': 'सक्रिय' },
    'status': { 'English': 'Status', 'नेपाली (Nepali)': 'स्थिति' },

    // Account Section
    'account': { 'English': 'Account', 'नेपाली (Nepali)': 'खाता' },
    'editProfile': { 'English': 'Edit Profile', 'नेपाली (Nepali)': 'प्रोफाइल सम्पादन गर्नुहोस्' },
    'changePassword': { 'English': 'Change Password', 'नेपाली (Nepali)': 'पासवर्ड परिवर्तन गर्नुहोस्' },
    'notifications': { 'English': 'Notifications', 'नेपाली (Nepali)': 'सूचनाहरू' },

    // Preferences Section
    'preferences': { 'English': 'Preferences', 'नेपाली (Nepali)': 'प्राथमिकताहरू' },
    'settings': { 'English': 'Settings', 'नेपाली (Nepali)': 'सेटिङहरू' },
    'language': { 'English': 'Language', 'नेपाली (Nepali)': 'भाषा' },

    // Support Section
    'support': { 'English': 'Support', 'नेपाली (Nepali)': 'समर्थन' },
    'helpSupport': { 'English': 'Help & Support', 'नेपाली (Nepali)': 'मद्दत र समर्थन' },
    'about': { 'English': 'About', 'नेपाली (Nepali)': 'बारेमा' },

    // Actions
    'logout': { 'English': 'Logout', 'नेपाली (Nepali)': 'लगआउट' },
    'cancel': { 'English': 'Cancel', 'नेपाली (Nepali)': 'रद्द गर्नुहोस्' },
    'save': { 'English': 'Save', 'नेपाली (Nepali)': 'सुरक्षित गर्नुहोस्' },
    'close': { 'English': 'Close', 'नेपाली (Nepali)': 'बन्द गर्नुहोस्' },
    'change': { 'English': 'Change', 'नेपाली (Nepali)': 'परिवर्तन गर्नुहोस्' },

    // Edit Profile Modal
    'fullName': { 'English': 'Full Name', 'नेपाली (Nepali)': 'पूरा नाम' },
    'email': { 'English': 'Email', 'नेपाली (Nepali)': 'इमेल' },
    'phoneNumber': { 'English': 'Phone Number', 'नेपाली (Nepali)': 'फोन नम्बर' },

    // Change Password Modal
    'currentPassword': { 'English': 'Current Password', 'नेपाली (Nepali)': 'हालको पासवर्ड' },
    'newPassword': { 'English': 'New Password', 'नेपाली (Nepali)': 'नयाँ पासवर्ड' },
    'confirmNewPassword': { 'English': 'Confirm New Password', 'नेपाली (Nepali)': 'नयाँ पासवर्ड पुष्टि गर्नुहोस्' },

    // Notification Settings
    'notificationSettings': { 'English': 'Notification Settings', 'नेपाली (Nepali)': 'सूचना सेटिङहरू' },
    'emailNotifications': { 'English': 'Email Notifications', 'नेपाली (Nepali)': 'इमेल सूचनाहरू' },
    'pushNotifications': { 'English': 'Push Notifications', 'नेपाली (Nepali)': 'पुश सूचनाहरू' },
    'smsNotifications': { 'English': 'SMS Notifications', 'नेपाली (Nepali)': 'एसएमएस सूचनाहरू' },

    // Language Modal
    'selectLanguage': { 'English': 'Select Language', 'नेपाली (Nepali)': 'भाषा चयन गर्नुहोस्' },

    // About Modal
    'developer': { 'English': 'Developer:', 'नेपाली (Nepali)': 'विकासकर्ता:' },
    'website': { 'English': 'Website:', 'नेपाली (Nepali)': 'वेबसाइट:' },
    'vidhyaTrackTeam': { 'English': 'VidhyaTrack Team', 'नेपाली (Nepali)': 'विद्याट्र्याक टोली' },
    'appDescription': {
        'English': 'A comprehensive school management system designed to streamline administrative tasks, enhance communication, and improve the overall educational experience.',
        'नेपाली (Nepali)': 'प्रशासनिक कार्यहरू सुव्यवस्थित गर्न, संचार बढाउन र समग्र शैक्षिक अनुभव सुधार गर्न डिजाइन गरिएको एक व्यापक विद्यालय व्यवस्थापन प्रणाली।'
    },

    // Toast Messages
    'profileUpdated': { 'English': 'Profile updated successfully', 'नेपाली (Nepali)': 'प्रोफाइल सफलतापूर्वक अपडेट भयो' },
    'nameEmailRequired': { 'English': 'Name and email are required', 'नेपाली (Nepali)': 'नाम र इमेल आवश्यक छ' },
    'failedToUpdate': { 'English': 'Failed to update profile', 'नेपाली (Nepali)': 'प्रोफाइल अपडेट गर्न असफल' },
    'allFieldsRequired': { 'English': 'All fields are required', 'नेपाली (Nepali)': 'सबै फिल्डहरू आवश्यक छन्' },
    'passwordsDoNotMatch': { 'English': 'Passwords do not match', 'नेपाली (Nepali)': 'पासवर्डहरू मिल्दैनन्' },
    'passwordMinLength': { 'English': 'Password must be at least 6 characters', 'नेपाली (Nepali)': 'पासवर्ड कम्तिमा ६ अक्षरको हुनुपर्छ' },
    'passwordChanged': { 'English': 'Password changed successfully', 'नेपाली (Nepali)': 'पासवर्ड सफलतापूर्वक परिवर्तन भयो' },
    'failedToChangePassword': { 'English': 'Failed to change password', 'नेपाली (Nepali)': 'पासवर्ड परिवर्तन गर्न असफल' },
    'notificationSettingsSaved': { 'English': 'Notification settings saved', 'नेपाली (Nepali)': 'सूचना सेटिङहरू सुरक्षित भयो' },
    'failedToSaveSettings': { 'English': 'Failed to save settings', 'नेपाली (Nepali)': 'सेटिङहरू सुरक्षित गर्न असफल' },
    'languageChanged': { 'English': 'Language changed to', 'नेपाली (Nepali)': 'भाषा परिवर्तन भयो' },

    // Logout Confirmation
    'logoutConfirmTitle': { 'English': 'Logout', 'नेपाली (Nepali)': 'लगआउट' },
    'logoutConfirmMessage': { 'English': 'Are you sure you want to logout?', 'नेपाली (Nepali)': 'के तपाईं निश्चित रूपमा लगआउट गर्न चाहनुहुन्छ?' },
};

type LanguageContextType = {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => string;
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
    const [language, setLanguageState] = useState<Language>('English');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLanguage = await AsyncStorage.getItem('selectedLanguage');
            if (savedLanguage && (savedLanguage === 'English' || savedLanguage === 'नेपाली (Nepali)')) {
                setLanguageState(savedLanguage as Language);
            }
        } catch (error) {
            console.error('Error loading language:', error);
        }
    };

    const setLanguage = async (lang: Language) => {
        try {
            await AsyncStorage.setItem('selectedLanguage', lang);
            setLanguageState(lang);
        } catch (error) {
            console.error('Error saving language:', error);
        }
    };

    const t = (key: string): string => {
        return translations[key]?.[language] || key;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within LanguageProvider');
    }
    return context;
};
