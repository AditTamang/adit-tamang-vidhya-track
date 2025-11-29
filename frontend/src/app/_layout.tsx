import { Stack } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack screenOptions={{ headerShown: false }} />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}




// import { Stack } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import 'react-native-reanimated';

// import { useColorScheme } from '@/hooks/use-color-scheme';
// import { SafeAreaView } from 'react-native-safe-area-context';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();

//   return (
//     <SafeAreaView>
//       <Stack>
//         <Stack.Screen name="index" options={{ title: 'Index', headerShown: false }} />
//         <Stack.Screen name='login' options={{ title: 'Login', headerShown: false }} />
//         <Stack.Screen name='register' options={{ title: 'Register', headerShown: false }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </SafeAreaView>
//   );
// }
