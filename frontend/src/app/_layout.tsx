import { ActionSheetIOS } from "react-native";
import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LanguageProvider } from "@/contexts/LanguageContext";

export default function RootLayout() {
  const segments = useSegments();
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken"); // Assuming 'authToken' is the key used in api.ts
        const inAuthGroup = segments[0] === "(auth)";
        const inIntro = segments[0] === "intro" || (segments as any).length === 0; // Root or intro

        if (!token && !inAuthGroup && !inIntro) {
          // No token and not in auth/intro -> Redirect to login
          router.replace("/(auth)/login");
        } else if (token && inAuthGroup) {
          // Token exists but user is in auth group (login/register) -> Redirect to dashboard
          // Note: Ideally we check role, but for now default to student or parent
          // This part might be tricky without role, so maybe just let them be or redirect to a default
          const userData = await AsyncStorage.getItem("userData");
          if (userData) {
            const user = JSON.parse(userData);
            router.replace(`/${user.role === 'admin' ? '(admin)' : user.role === 'teacher' ? '(teacher)' : user.role === 'student' ? '(student)' : '(parent)'}/dashboard`);
          }
        }
      } catch (e) {
        console.error("Auth check failed", e);
      }
    };

    checkAuth();
  }, [segments, isMounted]);

  return (
    <LanguageProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <Stack screenOptions={{ headerShown: false }} />
        <StatusBar style="auto" />
      </SafeAreaView>
    </LanguageProvider>
  );
}
