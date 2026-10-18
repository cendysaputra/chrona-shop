import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import Button from '@/components/Button';
import LazyScrollView from '@/components/LazyScrollView';
import ProductImage from '@/components/ProductImage';
import QtyStepper from '@/components/QtyStepper';
import SectionTitle from '@/components/SectionTitle';
import SummaryRows from '@/components/SummaryRows';
import { useAuth } from '@/context/AuthContext';
import { useCart } from '@/context/CartContext';
import type { CartItem } from '@/types';
import { colors, fonts, radius, space, type } from '@/theme';
import { formatPrice } from '@/utils/format';

export default function CartScreen() {
  const { items, subtotal, updateQty, removeItem } = useCart();
  const { isLoggedIn } = useAuth();

  const goCheckout = () => {
    if (isLoggedIn) router.push('/checkout');
    else router.push({ pathname: '/auth/login', params: { redirect: '/checkout' } });
  };

  if (items.length === 0) {
    return (
      <LazyScrollView style={styles.screen} contentContainerStyle={styles.content}>
        <View style={styles.emptyCopy}>
          <Text style={type.eyebrow}>Cart</Text>
          <SectionTitle>Your cart is empty</SectionTitle>
          <Text style={type.body}>Find a watch you like and it will show up here.</Text>
        </View>
        <Button title="Shop watches" onPress={() => router.navigate('/shop')} style={styles.emptyBtn} />
      </LazyScrollView>
    );
  }

  return (
    <LazyScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={type.eyebrow}>Cart</Text>
      <SectionTitle style={styles.title}>Your cart</SectionTitle>

      {/* Cart items */}
      <View style={styles.list}>
        {items.map((item) => (
          <Row key={item.slug} item={item} onQty={(q) => updateQty(item.slug, q)} onRemove={() => removeItem(item.slug)} />
        ))}
      </View>

      {/* Order summary */}
      <View style={styles.summary}>
        <Text style={type.eyebrow}>Order summary</Text>
        <SummaryRows subtotal={subtotal} />
        <Button title="Checkout" size="lg" onPress={goCheckout} />
        {!isLoggedIn && <Text style={styles.note}>{"You'll be asked to log in before checkout."}</Text>}
        <Text style={styles.link} onPress={() => router.navigate('/shop')} accessibilityRole="link">
          Continue shopping
        </Text>
      </View>
    </LazyScrollView>
  );
}

function Row({ item, onQty, onRemove }: { item: CartItem; onQty: (q: number) => void; onRemove: () => void }) {
  const open = () => router.push({ pathname: '/products/[slug]', params: { slug: item.slug } });

  return (
    <View style={styles.row}>
      <Pressable onPress={open} accessibilityRole="link" accessibilityLabel={`View ${item.name}`}>
        <ProductImage path={item.image} style={styles.thumb} />
      </Pressable>

      <View style={styles.info}>
        <Text style={type.eyebrow}>{item.series}</Text>
        <Text style={styles.name} numberOfLines={2} onPress={open}>
          {item.name}
        </Text>
        <Text style={styles.unit}>{formatPrice(item.price)}</Text>

        <View style={styles.controls}>
          <QtyStepper size="sm" value={item.qty} max={item.stock} onChange={onQty} />
          <Pressable onPress={onRemove} hitSlop={8} accessibilityRole="button" accessibilityLabel={`Remove ${item.name}`}>
            <Text style={styles.remove}>Remove</Text>
          </Pressable>
        </View>
        <Text style={styles.lineTotal}>{formatPrice(item.price * item.qty)}</Text>
      </View>
    </View>
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
  emptyCopy: {
    gap: space.lg,
  },
  emptyBtn: {
    alignSelf: 'flex-start',
    marginTop: space.xxl,
  },
  title: {
    marginTop: space.lg,
  },
  list: {
    marginTop: space.section,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  row: {
    flexDirection: 'row',
    gap: space.lg,
    paddingVertical: space.xxl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  thumb: {
    width: 88,
    height: 88,
    borderRadius: radius.sm,
    padding: space.md,
  },
  info: {
    flex: 1,
    gap: space.xs,
  },
  name: {
    marginTop: space.xxs,
    fontFamily: fonts.semibold,
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  unit: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  controls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    marginTop: space.md,
  },
  remove: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  lineTotal: {
    marginTop: space.sm,
    fontFamily: fonts.semibold,
    fontSize: 15,
    color: colors.ink,
  },
  summary: {
    gap: space.xl,
    marginTop: space.xxxl,
    paddingVertical: space.xxl,
    paddingHorizontal: space.xl,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  note: {
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
  },
  link: {
    alignSelf: 'center',
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.ink,
  },
});
