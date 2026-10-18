import { ActivityIndicator, Pressable, StyleSheet, Text, type PressableProps, type StyleProp, type ViewStyle } from 'react-native';

import { colors, fonts, radius, space } from '@/theme';

type Props = Omit<PressableProps, 'style' | 'children'> & {
  title: string;
  variant?: 'primary' | 'outline' | 'light';
  size?: 'lg' | 'md' | 'sm';
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
};

export default function Button({ title, variant = 'primary', size = 'md', loading = false, disabled, style, ...rest }: Props) {
  const isDisabled = disabled || loading;
  const baseText = isDisabled ? colors.gray600 : variant === 'primary' ? colors.white : colors.ink;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      style={({ pressed }) => [styles.base, styles[size], styles[variant], isDisabled && styles.disabled, pressed && !isDisabled && styles.pressed, style]}
      {...rest}
    >
      {({ pressed }) =>
        loading ? (
          <ActivityIndicator color={baseText} />
        ) : (
          <Text style={[styles.text, size === 'sm' && styles.textSm, { color: pressed && !isDisabled ? colors.ink : baseText }]}>{title}</Text>
        )
      }
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  lg: {
    minHeight: 52,
    paddingHorizontal: space.xxl,
  },
  md: {
    minHeight: 48,
    paddingHorizontal: space.xxl,
  },
  sm: {
    minHeight: 38,
    paddingHorizontal: space.lg,
  },
  primary: {
    backgroundColor: colors.ink,
  },
  outline: {
    backgroundColor: colors.gray100,
  },
  light: {
    backgroundColor: colors.white,
  },
  disabled: {
    backgroundColor: colors.gray200,
  },
  // Web hover sweep
  pressed: {
    backgroundColor: colors.accent,
  },
  text: {
    fontFamily: fonts.semibold,
    fontSize: 15,
  },
  textSm: {
    fontSize: 13,
  },
});
