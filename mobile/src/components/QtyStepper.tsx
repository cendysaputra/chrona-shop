import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius } from '@/theme';

type Props = {
  value: number;
  max: number;
  onChange: (value: number) => void;
  size?: 'md' | 'sm';
};

type StepProps = {
  icon: 'remove' | 'add';
  disabled: boolean;
  label: string;
  box: number;
  onPress: () => void;
};

function Step({ icon, disabled, label, box, onPress }: StepProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={6}
      style={({ pressed }) => [styles.btn, { width: box, height: box }, pressed && styles.pressed]}
    >
      <Ionicons name={icon} size={16} color={disabled ? colors.gray300 : colors.ink} />
    </Pressable>
  );
}

// Quantity stepper
export default function QtyStepper({ value, max, onChange, size = 'md' }: Props) {
  const box = size === 'sm' ? 36 : 48;

  return (
    <View style={styles.wrap} accessibilityLabel={`Quantity ${value}`}>
      <Step icon="remove" box={box} disabled={value <= 1} label="Decrease quantity" onPress={() => onChange(value - 1)} />
      <Text style={[styles.value, size === 'sm' && styles.valueSm]}>{value}</Text>
      <Step icon="add" box={box} disabled={value >= max} label="Increase quantity" onPress={() => onChange(value + 1)} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
  value: {
    minWidth: 32,
    textAlign: 'center',
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.ink,
  },
  valueSm: {
    minWidth: 24,
    fontSize: 14,
  },
});
