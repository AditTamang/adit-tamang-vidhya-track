import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';
import { SafeAreaView } from 'react-native-safe-area-context';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    // <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
    <SafeAreaView>
      <Stack>
        <Stack.Screen name="index" options={{ title: 'Index', headerShown: false }} />
        <Stack.Screen name='(auth)/signIn' options={{ title: 'Sign In', headerShown: false }} />
        <Stack.Screen name='(auth)/signUp' options={{ title: 'Sign Up', headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </SafeAreaView>
    // </ThemeProvider>
  );
}
