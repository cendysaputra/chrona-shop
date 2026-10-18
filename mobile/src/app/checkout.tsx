import Ionicons from '@expo/vector-icons/Ionicons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import Button from '@/components/Button';
import Field from '@/components/Field';
import ProductImage from '@/components/ProductImage';
import SectionTitle from '@/components/SectionTitle';
import SummaryRows from '@/components/SummaryRows';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import { colors, fonts, radius, space, type } from '@/theme';
import { formatPrice } from '@/utils/format';

const PAYMENTS = [
  {
    value: 'bank',
    label: 'Bank transfer',
    logos: [
      { name: 'BCA', src: require('@/assets/images/payments/bca.svg') },
      { name: 'Mandiri', src: require('@/assets/images/payments/mandiri.svg') },
      { name: 'BNI', src: require('@/assets/images/payments/bni.svg') },
      { name: 'BRI', src: require('@/assets/images/payments/bri.svg') },
    ],
  },
  {
    value: 'ewallet',
    label: 'E-wallet',
    logos: [
      { name: 'GoPay', src: require('@/assets/images/payments/gopay.svg') },
      { name: 'OVO', src: require('@/assets/images/payments/ovo.svg') },
      { name: 'DANA', src: require('@/assets/images/payments/dana.svg') },
      { name: 'ShopeePay', src: require('@/assets/images/payments/shopeepay.svg') },
    ],
  },
  { value: 'cod', label: 'Cash on delivery', note: 'Pay when your watch arrives' },
];

type Form = { fullName: string; email: string; phone: string; address: string; city: string; postalCode: string; payment: string };
type Errors = Partial<Record<keyof Form, string>>;

// Form rules
const validate = (f: Form): Errors => {
  const e: Errors = {};
  if (f.fullName.trim().length < 2) e.fullName = "Enter the recipient's full name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) e.email = 'Enter a valid email address.';
  if (!/^(\+62|62|0)8\d{7,12}$/.test(f.phone.replace(/[\s-]/g, ''))) e.phone = 'Enter a valid Indonesian mobile number, e.g. 0812 3456 7890.';
  if (f.address.trim().length < 10) e.address = 'Enter the full street address.';
  if (!f.city.trim()) e.city = 'Enter the city.';
  if (!/^\d{5}$/.test(f.postalCode.trim())) e.postalCode = 'Postal code has 5 digits.';
  return e;
};

export default function CheckoutScreen() {
  const { user } = useAuth();
  const { items, subtotal, clearCart } = useCart();
  const scrollRef = useRef<ScrollView>(null);

  const [form, setForm] = useState<Form>({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    payment: 'bank',
  });
  const [errors, setErrors] = useState<Errors>({});
  const [order, setOrder] = useState<{ number: string; total: number; name: string; city: string } | null>(null);

  const emailRef = useRef<TextInput>(null);
  const phoneRef = useRef<TextInput>(null);
  const addressRef = useRef<TextInput>(null);
  const cityRef = useRef<TextInput>(null);
  const postalRef = useRef<TextInput>(null);

  const set = (key: keyof Form) => (value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const placeOrder = () => {
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      scrollRef.current?.scrollTo({ y: 0, animated: true });
      return;
    }
    setOrder({
      number: `CHR-${Date.now().toString().slice(-8)}`,
      total: subtotal,
      name: form.fullName.trim(),
      city: form.city.trim(),
    });
    clearCart();
  };

  // Confirmation
  if (order) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={[styles.content, styles.done]}>
        <View style={styles.doneIcon}>
          <Ionicons name="checkmark" size={28} color={colors.ink} />
        </View>
        <View style={styles.doneCopy}>
          <Text style={type.eyebrow}>Order {order.number}</Text>
          <SectionTitle>Almost yours</SectionTitle>
          <Text style={type.body}>
            Thank you, {order.name.split(' ')[0]}. Your order of <Text style={styles.strong}>{formatPrice(order.total)}</Text> has been placed and will be
            shipped to {order.city}.
          </Text>
        </View>
        <Button title="Continue shopping" onPress={() => router.dismissTo('/shop')} style={styles.inlineBtn} />
      </ScrollView>
    );
  }

  if (items.length === 0) {
    return (
      <ScrollView style={styles.screen} contentContainerStyle={[styles.content, styles.done]}>
        <View style={styles.doneCopy}>
          <Text style={type.eyebrow}>Checkout</Text>
          <SectionTitle>Nothing to check out</SectionTitle>
          <Text style={type.body}>Your cart is empty. Add a watch first.</Text>
        </View>
        <Button title="Shop watches" onPress={() => router.dismissTo('/shop')} style={styles.inlineBtn} />
      </ScrollView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <ScrollView ref={scrollRef} contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <Text style={type.eyebrow}>Checkout</Text>
        <SectionTitle style={styles.title}>Almost yours</SectionTitle>

        {/* Shipping */}
        <View style={styles.group}>
          <Text style={[type.eyebrow, styles.legend]}>Shipping details</Text>
          <Field
            label="Full name"
            value={form.fullName}
            onChangeText={set('fullName')}
            error={errors.fullName}
            autoComplete="name"
            returnKeyType="next"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
          <Field
            ref={emailRef}
            label="Email"
            value={form.email}
            onChangeText={set('email')}
            error={errors.email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            placeholder="you@example.com"
            returnKeyType="next"
            onSubmitEditing={() => phoneRef.current?.focus()}
          />
          <Field
            ref={phoneRef}
            label="Phone number"
            value={form.phone}
            onChangeText={set('phone')}
            error={errors.phone}
            keyboardType="phone-pad"
            autoComplete="tel"
            placeholder="0812 3456 7890"
            returnKeyType="next"
            onSubmitEditing={() => addressRef.current?.focus()}
          />
          <Field
            ref={addressRef}
            label="Street address"
            value={form.address}
            onChangeText={set('address')}
            error={errors.address}
            autoComplete="street-address"
            multiline
          />
          <Field
            ref={cityRef}
            label="City"
            value={form.city}
            onChangeText={set('city')}
            error={errors.city}
            returnKeyType="next"
            onSubmitEditing={() => postalRef.current?.focus()}
          />
          <Field
            ref={postalRef}
            label="Postal code"
            value={form.postalCode}
            onChangeText={set('postalCode')}
            error={errors.postalCode}
            keyboardType="number-pad"
            maxLength={5}
            autoComplete="postal-code"
          />
        </View>

        {/* Payment */}
        <View style={styles.group}>
          <Text style={[type.eyebrow, styles.legend]}>Payment method</Text>
          <View style={styles.payments}>
            {PAYMENTS.map((p) => {
              const active = form.payment === p.value;
              return (
                <Pressable
                  key={p.value}
                  onPress={() => set('payment')(p.value)}
                  style={({ pressed }) => [styles.payment, active ? styles.paymentActive : pressed && styles.paymentPressed]}
                  accessibilityRole="radio"
                  accessibilityState={{ checked: active }}
                  accessibilityLabel={[p.label, ...(p.logos?.map((l) => l.name) ?? [])].join(', ')}
                >
                  <View style={[styles.radio, active && styles.radioActive]}>{active && <View style={styles.radioDot} />}</View>
                  <View style={styles.paymentBody}>
                    <Text style={[styles.paymentLabel, active && styles.onDark]}>{p.label}</Text>
                    {p.note && <Text style={[type.small, active && styles.onDarkMuted]}>{p.note}</Text>}
                    {p.logos && (
                      <View style={styles.logos}>
                        {p.logos.map((l) => (
                          <View key={l.name} style={styles.logo}>
                            <Image source={l.src} style={styles.logoImage} contentFit="contain" accessible={false} />
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.summary}>
          <Text style={type.eyebrow}>Your order</Text>
          <View style={styles.items}>
            {items.map((i) => (
              <View key={i.slug} style={styles.item}>
                <View>
                  <ProductImage path={i.image} style={styles.thumb} />
                  <Text style={styles.qtyBadge}>{i.qty}</Text>
                </View>
                <Text style={styles.itemName} numberOfLines={2}>
                  {i.name}
                </Text>
                <Text style={styles.itemPrice}>{formatPrice(i.price * i.qty)}</Text>
              </View>
            ))}
          </View>
          <SummaryRows subtotal={subtotal} />
          <Button title="Place order" size="lg" onPress={placeOrder} />
          <Text style={styles.link} onPress={() => router.navigate('/cart')} accessibilityRole="link">
            Back to cart
          </Text>
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
    paddingHorizontal: space.lg,
    paddingTop: 28,
    paddingBottom: space.sectionLg,
  },
  title: {
    marginTop: space.lg,
  },
  group: {
    gap: space.xl,
    marginTop: space.section,
  },
  legend: {
    marginBottom: space.xs,
    paddingBottom: space.lg,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  payments: {
    gap: 10,
  },
  payment: {
    flexDirection: 'row',
    gap: space.lg,
    paddingVertical: space.lg,
    paddingHorizontal: space.xl,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  paymentPressed: {
    backgroundColor: colors.surfacePressed,
  },
  paymentActive: {
    backgroundColor: colors.ink,
  },
  radio: {
    width: 18,
    height: 18,
    marginTop: space.xxs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    borderWidth: 1.5,
    borderColor: colors.gray300,
    backgroundColor: colors.white,
  },
  radioActive: {
    borderColor: colors.accent,
  },
  radioDot: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  paymentBody: {
    flex: 1,
    gap: space.xxs,
  },
  paymentLabel: {
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.ink,
  },
  onDark: {
    color: colors.white,
  },
  onDarkMuted: {
    color: colors.onDarkMuted,
  },
  logos: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: space.md,
  },
  logo: {
    width: 56,
    height: 32,
    padding: 6,
    borderRadius: radius.xs,
    backgroundColor: colors.white,
  },
  logoImage: {
    width: '100%',
    height: '100%',
  },
  summary: {
    gap: space.xl,
    marginTop: space.xxxl,
    paddingVertical: space.xxl,
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  items: {
    gap: space.lg,
    paddingBottom: space.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    padding: 6,
    backgroundColor: colors.white,
  },
  qtyBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 6,
    borderRadius: radius.pill,
    overflow: 'hidden',
    backgroundColor: colors.ink,
    color: colors.white,
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 20,
    textAlign: 'center',
  },
  itemName: {
    flex: 1,
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: colors.ink,
  },
  itemPrice: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.ink,
  },
  link: {
    alignSelf: 'center',
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.ink,
  },
  done: {
    gap: space.xxl,
  },
  doneIcon: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
  doneCopy: {
    gap: space.lg,
  },
  strong: {
    fontFamily: fonts.semibold,
    color: colors.ink,
  },
  inlineBtn: {
    alignSelf: 'flex-start',
  },
});
