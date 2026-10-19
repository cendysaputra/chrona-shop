import { Image } from 'expo-image';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { colors, radius, space } from '@/theme';

import ClockPattern from './ClockPattern';
import { HeroBackground, HeroFade } from './HeroGradient';

const watch = require('@/assets/images/hero-img.webp');
const PANEL_HEIGHT = 340;

// Login banner
export default function AuthShowcase() {
  const { width } = useWindowDimensions();
  const panel = width - space.sm * 2;
  const clock = Math.min(panel * 1.1, 640);
  const watchWidth = panel * 0.66;

  return (
    <View style={styles.panel} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <HeroBackground />
      <ClockPattern size={clock} style={[styles.clock, { left: (panel - clock) / 2, top: PANEL_HEIGHT * 0.78 - clock / 2 }]} />
      <Image source={watch} style={[styles.watch, { width: watchWidth, height: watchWidth * 1.04, left: (panel - watchWidth) / 2 }]} contentFit="contain" />
      <HeroFade height="14%" />
    </View>
  );
}

const styles = StyleSheet.create({
  panel: {
    height: PANEL_HEIGHT,
    marginHorizontal: space.sm,
    marginTop: space.sm,
    overflow: 'hidden',
    borderRadius: radius.xs,
    backgroundColor: colors.heroBottom,
  },
  clock: {
    position: 'absolute',
  },
  watch: {
    position: 'absolute',
    bottom: -PANEL_HEIGHT * 0.16,
  },
});
