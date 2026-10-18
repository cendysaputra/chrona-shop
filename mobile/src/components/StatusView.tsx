import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, space } from '@/theme';

import Button from './Button';

type Props = {
  tone?: 'loading' | 'error' | 'info';
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

// Loading / error / empty
export default function StatusView({ tone = 'info', message, actionLabel, onAction }: Props) {
  if (tone === 'loading') {
    return (
      <View style={styles.center} accessibilityLiveRegion="polite">
        <ActivityIndicator color={colors.ink} />
        {message ? <Text style={styles.loadingText}>{message}</Text> : null}
      </View>
    );
  }

  return (
    <View style={[styles.box, tone === 'error' ? styles.error : styles.info]} accessibilityLiveRegion="polite">
      <Text style={[styles.text, tone === 'error' && styles.errorText]}>{message}</Text>
      {actionLabel && onAction ? <Button title={actionLabel} variant={tone === 'error' ? 'light' : 'outline'} size="sm" onPress={onAction} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  center: {
    paddingVertical: space.section,
    alignItems: 'center',
    gap: space.md,
  },
  loadingText: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  box: {
    paddingVertical: space.xl,
    paddingHorizontal: space.xxl,
    borderRadius: radius.sm,
    gap: space.lg,
    alignItems: 'flex-start',
  },
  info: {
    backgroundColor: colors.gray50,
  },
  error: {
    backgroundColor: colors.dangerBg,
  },
  text: {
    fontFamily: fonts.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.gray600,
  },
  errorText: {
    color: colors.danger,
  },
});
