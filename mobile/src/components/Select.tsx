import Ionicons from '@expo/vector-icons/Ionicons';
import { useRef, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, space } from '@/theme';

type Option<T extends string> = { readonly value: T; readonly label: string };

type Props<T extends string> = {
  label: string;
  value: T;
  options: readonly Option<T>[];
  onChange: (value: T) => void;
};

type Anchor = { x: number; y: number; width: number };

// Pill dropdown
export default function Select<T extends string>({ label, value, options, onChange }: Props<T>) {
  const triggerRef = useRef<View>(null);
  const [anchor, setAnchor] = useState<Anchor | null>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  const open = () => {
    triggerRef.current?.measureInWindow((x, y, width, height) => setAnchor({ x, y: y + height + space.sm, width }));
  };

  const pick = (next: T) => {
    setAnchor(null);
    onChange(next);
  };

  return (
    <>
      <Pressable
        ref={triggerRef}
        onPress={open}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${current.label}`}
        accessibilityState={{ expanded: !!anchor }}
        style={({ pressed }) => [styles.trigger, pressed && styles.pressed]}
      >
        <Text style={styles.value} numberOfLines={1}>
          {current.label}
        </Text>
        <Ionicons name="chevron-down" size={14} color={colors.ink} />
      </Pressable>

      <Modal visible={!!anchor} transparent animationType="fade" statusBarTranslucent navigationBarTranslucent onRequestClose={() => setAnchor(null)}>
        <Pressable style={StyleSheet.absoluteFill} onPress={() => setAnchor(null)} accessibilityLabel="Close menu" />
        {anchor && (
          <View style={[styles.menu, { top: anchor.y, left: anchor.x, minWidth: anchor.width }]} accessibilityRole="menu">
            {options.map((o) => {
              const active = o.value === value;
              return (
                <Pressable
                  key={o.value}
                  onPress={() => pick(o.value)}
                  accessibilityRole="menuitem"
                  accessibilityState={{ selected: active }}
                  style={({ pressed }) => [styles.option, pressed && styles.optionPressed]}
                >
                  <Text style={[styles.optionText, active && styles.optionActive]}>{o.label}</Text>
                  {active && <Ionicons name="checkmark" size={16} color={colors.accent} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  trigger: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.md,
    minHeight: 40,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    backgroundColor: colors.surface,
  },
  pressed: {
    backgroundColor: colors.surfacePressed,
  },
  value: {
    flexShrink: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.ink,
  },
  menu: {
    position: 'absolute',
    padding: 6,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
    boxShadow: '0 14px 35px rgba(0, 0, 0, 0.12)',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
    paddingVertical: 10,
    paddingHorizontal: space.md,
    borderRadius: 6,
  },
  optionPressed: {
    backgroundColor: colors.gray50,
  },
  optionText: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.ink,
  },
  optionActive: {
    fontFamily: fonts.semibold,
  },
});
