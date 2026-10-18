import { router, useLocalSearchParams, type Href } from 'expo-router';
import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';

import { getErrorMessage, getFieldErrors } from '@/api/axiosClient';
import AuthShowcase from '@/components/AuthShowcase';
import Button from '@/components/Button';
import Field from '@/components/Field';
import SectionTitle from '@/components/SectionTitle';
import StatusView from '@/components/StatusView';
import { useAuth } from '@/context/AuthContext';
import { colors, fonts, space, type } from '@/theme';

export default function LoginScreen() {
  const { login } = useAuth();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const passwordRef = useRef<TextInput>(null);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Go back after login
  const finish = () => {
    if (redirect) router.replace(redirect as Href);
    else if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const onSubmit = async () => {
    setError('');
    setFieldErrors({});
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      finish();
    } catch (err) {
      setFieldErrors(getFieldErrors(err));
      setError(getErrorMessage(err));
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView keyboardShouldPersistTaps="handled">
        <AuthShowcase />

        <View style={styles.content}>
          <View style={styles.head}>
            <Text style={type.eyebrow}>Account</Text>
            <SectionTitle>Welcome back</SectionTitle>
            <Text style={styles.sub}>{redirect === '/checkout' ? 'Log in to finish your order.' : 'Log in to check out faster.'}</Text>
          </View>

          {!!error && <StatusView tone="error" message={error} />}

          <Field
            label="Email"
            value={email}
            onChangeText={setEmail}
            error={fieldErrors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
          <Field
            ref={passwordRef}
            label="Password"
            value={password}
            onChangeText={setPassword}
            error={fieldErrors.password}
            secureTextEntry
            autoComplete="current-password"
            textContentType="password"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
          />

          <Button title="Log in" size="lg" onPress={onSubmit} loading={submitting} style={styles.submit} />

          <View style={styles.switch}>
            <Text style={type.small}>New to Chrona?</Text>
            <Text
              style={styles.link}
              accessibilityRole="link"
              onPress={() => router.replace({ pathname: '/auth/register', params: redirect ? { redirect } : {} })}
            >
              Create an account
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.white,
  },
  content: {
    gap: space.xl,
    paddingHorizontal: space.xxl,
    paddingTop: space.section,
    paddingBottom: space.sectionLg,
  },
  head: {
    gap: space.md,
    marginBottom: space.md,
  },
  sub: {
    fontFamily: fonts.regular,
    fontSize: 16,
    color: colors.muted,
  },
  submit: {
    marginTop: space.sm,
  },
  switch: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.xs,
    paddingTop: space.xl,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  link: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
});
