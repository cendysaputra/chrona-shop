import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';

import { getErrorMessage } from '@/api/axiosClient';
import Button from '@/components/Button';
import SectionTitle from '@/components/SectionTitle';
import StatusView from '@/components/StatusView';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { colors, fonts, radius, space, type } from '@/theme';

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

// ISO -> October 2026
const formatMonth = (iso?: string) => {
  if (!iso) return '';
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? '' : `${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

export default function AccountScreen() {
  const { user, checking, logout, refresh } = useAuth();
  const { count } = useCart();
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Pull to refresh
  const onRefresh = async () => {
    setRefreshing(true);
    setError('');
    try {
      await refresh();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setRefreshing(false);
    }
  };

  if (checking) return <StatusView tone="loading" message="Checking your session…" />;

  // Logged out
  if (!user) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.guest}>
          <Text style={type.eyebrow}>Account</Text>
          <SectionTitle>Log in to Chrona</SectionTitle>
          <Text style={type.body}>One account for the Chrona web store and app. Log in to check out and see your profile.</Text>
        </View>
        <View style={styles.actions}>
          <Button title="Log in" size="lg" onPress={() => router.push('/auth/login')} />
          <Button title="Create account" size="lg" variant="outline" onPress={() => router.push('/auth/register')} />
        </View>
      </ScrollView>
    );
  }

  const firstName = user.name?.trim().split(' ')[0];
  const details = [
    ['Name', user.name],
    ['Email', user.email],
    ['Member since', formatMonth(user.createdAt)],
  ].filter(([, value]) => value);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.ink} />}
    >
      <Text style={type.eyebrow}>Account</Text>
      <SectionTitle style={styles.title}>{firstName ? `Hi, ${firstName}` : 'Hi there'}</SectionTitle>

      {!!error && <StatusView tone="error" message={error} />}

      {/* Account details */}
      <View style={styles.details}>
        <Text style={[type.eyebrow, styles.legend]}>Account details</Text>
        {details.map(([label, value]) => (
          <View key={label} style={styles.row}>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}
      </View>

      {/* Shortcuts */}
      <View style={styles.panel}>
        <ShortcutLink title="Continue shopping" onPress={() => router.navigate('/shop')} />
        <ShortcutLink title="View cart" note={`${count} ${count === 1 ? 'item' : 'items'}`} onPress={() => router.navigate('/cart')} />
        <Button title="Log out" size="lg" variant="light" onPress={logout} style={styles.logout} />
      </View>
    </ScrollView>
  );
}

function ShortcutLink({ title, note, onPress }: { title: string; note?: string; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} accessibilityRole="link" style={({ pressed }) => [styles.link, pressed && styles.linkPressed]}>
      {({ pressed }) => (
        <>
          <View>
            <Text style={[styles.linkTitle, pressed && styles.linkTitlePressed]}>{title}</Text>
            {note && <Text style={styles.linkNote}>{note}</Text>}
          </View>
          <Ionicons name="arrow-forward" size={18} color={pressed ? colors.accent : colors.ink} />
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: space.lg,
    paddingTop: 28,
    paddingBottom: space.sectionLg,
  },
  guest: {
    gap: space.lg,
  },
  actions: {
    gap: space.md,
    marginTop: space.xxl,
  },
  title: {
    marginTop: space.lg,
  },
  details: {
    marginTop: space.section,
  },
  legend: {
    paddingBottom: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.xxl,
    paddingVertical: space.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  rowLabel: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.gray600,
  },
  rowValue: {
    flexShrink: 1,
    fontFamily: fonts.semibold,
    fontSize: 14,
    textAlign: 'right',
    color: colors.ink,
  },
  panel: {
    gap: 10,
    marginTop: space.xxxl,
    padding: space.lg,
    borderRadius: radius.md,
    backgroundColor: colors.gray50,
  },
  link: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
    minHeight: 56,
    paddingVertical: 14,
    paddingHorizontal: space.xl,
    borderRadius: radius.sm,
    backgroundColor: colors.white,
  },
  linkPressed: {
    backgroundColor: colors.gray25,
  },
  linkTitle: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.ink,
  },
  linkTitlePressed: {
    color: colors.accent,
  },
  linkNote: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.gray600,
  },
  logout: {
    marginTop: 10,
  },
});
