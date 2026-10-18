import { JetBrainsMono_400Regular, JetBrainsMono_500Medium } from '@expo-google-fonts/jetbrains-mono';
import {
  Manrope_300Light,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
  Manrope_800ExtraBold,
  useFonts,
} from '@expo-google-fonts/manrope';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import { colors, fonts } from '@/theme';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    Manrope_300Light,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
    Manrope_800ExtraBold,
    JetBrainsMono_400Regular,
    JetBrainsMono_500Medium,
  });

  if (!loaded && !error) return null;

  return (
    <AuthProvider>
      <CartProvider>
        <StatusBar style="dark" />
        <RootStack />
      </CartProvider>
    </AuthProvider>
  );
}

function RootStack() {
  const { isLoggedIn, checking } = useAuth();

  // Hide splash after session check
  useEffect(() => {
    if (!checking) SplashScreen.hideAsync();
  }, [checking]);

  if (checking) return null;

  return (
    <Stack
      screenOptions={{
        headerTintColor: colors.ink,
        headerTitleStyle: { fontFamily: fonts.bold, fontSize: 17 },
        headerStyle: { backgroundColor: colors.white },
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.white },
      }}
    >
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="products/[slug]" options={{ title: '' }} />

      {/* Login required */}
      <Stack.Protected guard={isLoggedIn}>
        <Stack.Screen name="checkout" options={{ title: 'Checkout' }} />
      </Stack.Protected>

      <Stack.Screen name="auth/login" options={{ title: 'Log in' }} />
      <Stack.Screen name="auth/register" options={{ title: 'Create account' }} />
    </Stack>
  );
}
