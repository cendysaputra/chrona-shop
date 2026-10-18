import { StyleSheet, Text, type StyleProp, type TextStyle } from 'react-native';

import { colors, type } from '@/theme';

// Title + accent dot
export default function SectionTitle({ children, dot = true, style }: { children: string; dot?: boolean; style?: StyleProp<TextStyle> }) {
  return (
    <Text style={[type.title, style]} accessibilityRole="header">
      {children}
      {dot && <Text style={styles.dot}>.</Text>}
    </Text>
  );
}

const styles = StyleSheet.create({
  dot: {
    color: colors.accent,
  },
});
