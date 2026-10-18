import { forwardRef, useState } from 'react';
import { StyleSheet, Text, TextInput, View, type TextInputProps } from 'react-native';

import { colors, fonts, radius, space, type } from '@/theme';

type Props = TextInputProps & {
  label: string;
  error?: string;
  hint?: string;
};

// Label + input + error
const Field = forwardRef<TextInput, Props>(({ label, error, hint, style, onFocus, onBlur, ...rest }, ref) => {
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <Text style={type.label}>{label}</Text>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        placeholderTextColor={colors.muted}
        style={[styles.input, focused && styles.focused, error ? styles.invalid : null, rest.multiline && styles.multiline, style]}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
        {...rest}
      />
      {error ? <Text style={styles.error}>{error}</Text> : hint ? <Text style={styles.hint}>{hint}</Text> : null}
    </View>
  );
});

Field.displayName = 'Field';
export default Field;

const styles = StyleSheet.create({
  field: {
    gap: space.sm,
  },
  input: {
    minHeight: 52,
    paddingHorizontal: space.lg,
    borderWidth: 1.5,
    borderColor: 'transparent',
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.ink,
  },
  multiline: {
    minHeight: 104,
    paddingTop: 14,
    textAlignVertical: 'top',
  },
  focused: {
    borderColor: colors.ink,
    backgroundColor: colors.white,
  },
  invalid: {
    borderColor: colors.danger,
  },
  error: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.danger,
  },
  hint: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
});
