import { router, Stack } from 'expo-router';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import Button from '@/components/Button';
import ClockPattern from '@/components/ClockPattern';
import { HeroBackground } from '@/components/HeroGradient';
import { colors, fonts, radius, space, type } from '@/theme';

export default function NotFoundScreen() {
  const { width } = useWindowDimensions();
  const clock = Math.min(790, width * 0.9);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Stack.Screen options={{ title: 'Not found' }} />

      <View style={styles.panel}>
        <HeroBackground />
        <ClockPattern size={clock} style={styles.clock} />
        <Text style={type.micro}>Error 404</Text>
        <Text style={styles.code} accessibilityElementsHidden importantForAccessibility="no">
          404
        </Text>
        <Text style={styles.title} accessibilityRole="header">
          {"This page doesn't exist"}
          <Text style={styles.dot}>.</Text>
        </Text>
        <Text style={styles.message}>The link may be broken, or the watch is no longer available.</Text>
        <Button title="Shop watches" onPress={() => router.replace('/shop')} style={styles.button} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  content: {
    padding: space.sm,
  },
  panel: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 64,
    paddingHorizontal: space.lg,
    overflow: 'hidden',
    borderRadius: radius.xs,
    backgroundColor: colors.heroBottom,
  },
  clock: {
    position: 'absolute',
  },
  code: {
    marginTop: space.sm,
    fontFamily: fonts.light,
    fontSize: 88,
    lineHeight: 92,
    letterSpacing: -1.8,
    color: colors.ink,
  },
  title: {
    marginTop: space.lg,
    fontFamily: fonts.light,
    fontSize: 24,
    lineHeight: 28,
    letterSpacing: -0.2,
    textAlign: 'center',
    color: colors.ink,
  },
  dot: {
    color: colors.accent,
  },
  message: {
    marginTop: space.lg,
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 21,
    textAlign: 'center',
    color: colors.soft,
  },
  button: {
    marginTop: space.xxxl,
  },
});
