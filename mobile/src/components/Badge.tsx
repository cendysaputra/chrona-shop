import { StyleSheet, Text } from 'react-native';

import { colors, fonts, radius, space } from '@/theme';

export default function Badge({ label }: { label: string }) {
  return <Text style={styles.badge}>{label}</Text>;
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: space.md,
    paddingVertical: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.accent,
    color: colors.ink,
    fontFamily: fonts.semibold,
    fontSize: 12,
    lineHeight: 14,
  },
});
