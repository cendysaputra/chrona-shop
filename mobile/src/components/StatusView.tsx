import Ionicons from '@expo/vector-icons/Ionicons';
import type { ComponentProps } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { colors, fonts, radius, space } from '@/theme';

import Button from './Button';

type Props = {
  tone?: 'loading' | 'error' | 'info';
  icon?: ComponentProps<typeof Ionicons>['name'];
  title?: string;
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

// Loading / error / empty
export default function StatusView({ tone = 'info', icon, title, message, actionLabel, onAction }: Props) {
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
      {icon ? <Ionicons name={icon} size={24} color={colors.ink} accessible={false} /> : null}
      {title || message ? (
        <View style={styles.copy}>
          {title ? <Text style={styles.title}>{title}</Text> : null}
          {message ? <Text style={[styles.text, tone === 'error' && styles.errorText]}>{message}</Text> : null}
        </View>
      ) : null}
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
  copy: {
    gap: space.xs,
  },
  title: {
    fontFamily: fonts.semibold,
    fontSize: 16,
    color: colors.ink,
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
