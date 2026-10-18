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

export default function RegisterScreen() {
  const { register } = useAuth();
  const { redirect } = useLocalSearchParams<{ redirect?: string }>();
  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const finish = () => {
    if (redirect) router.replace(redirect as Href);
    else if (router.canGoBack()) router.back();
    else router.replace('/');
  };

  const onSubmit = async () => {
    setError('');
    setFieldErrors({});

    // Quick check
    if (password.length < 6) {
      setFieldErrors({ password: 'Use at least 6 characters.' });
      return;
    }

    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
      finish();
    } catch (err) {
      const fields = getFieldErrors(err);
      setFieldErrors(fields);
      if (!Object.keys(fields).length) setError(getErrorMessage(err));
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
            <SectionTitle>Create your account</SectionTitle>
            <Text style={styles.sub}>One account for the Chrona web store and app.</Text>
          </View>

          {!!error && <StatusView tone="error" message={error} />}

          <Field
            label="Full name"
            value={name}
            onChangeText={setName}
            error={fieldErrors.name}
            autoComplete="name"
            textContentType="name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <Field
            ref={emailRef}
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
            hint="At least 6 characters."
            secureTextEntry
            autoComplete="new-password"
            textContentType="newPassword"
            returnKeyType="go"
            onSubmitEditing={onSubmit}
          />

          <Button title="Create account" size="lg" onPress={onSubmit} loading={submitting} style={styles.submit} />

          <View style={styles.switch}>
            <Text style={type.small}>Already have an account?</Text>
            <Text
              style={styles.link}
              accessibilityRole="link"
              onPress={() => router.replace({ pathname: '/auth/login', params: redirect ? { redirect } : {} })}
            >
              Log in
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
