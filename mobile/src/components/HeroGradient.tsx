import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, type DimensionValue } from 'react-native';

import { colors } from '@/theme';

// Panel background
export function HeroBackground() {
  return <LinearGradient pointerEvents="none" colors={[colors.heroTop, colors.heroBottom]} style={StyleSheet.absoluteFill} />;
}

// Bottom fade
export function HeroFade({ height = '25%' }: { height?: DimensionValue }) {
  return <LinearGradient pointerEvents="none" colors={[colors.heroFade, colors.heroBottom]} style={[styles.fade, { height }]} />;
}

const styles = StyleSheet.create({
  fade: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    left: 0,
  },
});
