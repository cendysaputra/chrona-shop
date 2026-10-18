import { StyleSheet, Text } from 'react-native';

import { colors, fonts } from '@/theme';

export default function Logo({ size = 22, color = colors.ink }: { size?: number; color?: string }) {
  return (
    <Text style={[styles.logo, { fontSize: size, letterSpacing: size * 0.08, color }]} accessibilityRole="header" accessibilityLabel="Chrona">
      CHRONA
      <Text style={styles.dot}>.</Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: fonts.medium,
  },
  dot: {
    color: colors.accent,
  },
});
