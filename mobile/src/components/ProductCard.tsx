import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, type StyleProp, type ViewStyle } from 'react-native';

import { useCart } from '@/context/CartContext';
import type { Product } from '@/types';
import { colors, fonts, radius, space } from '@/theme';
import { formatPrice } from '@/utils/format';

import ProductImage from './ProductImage';

export default function ProductCard({ product, style }: { product: Product; style?: StyleProp<ViewStyle> }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const open = () => router.push({ pathname: '/products/[slug]', params: { slug: product.slug } });

  // Reset tick
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  const handleAdd = () => {
    addItem(product, 1);
    setAdded(true);
  };

  return (
    <View style={[styles.card, style]}>
      <Pressable onPress={open} accessibilityRole="link" accessibilityLabel={product.name} style={({ pressed }) => pressed && styles.pressed}>
        <ProductImage path={product.image} style={styles.image} />
      </Pressable>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={2} onPress={open}>
          {product.name}
        </Text>
        <Text style={styles.tagline} numberOfLines={2}>
          {product.tagline}
        </Text>

        <View style={styles.footer}>
          <Text style={styles.price}>{formatPrice(product.price)}</Text>
          <Pressable
            onPress={handleAdd}
            disabled={soldOut}
            hitSlop={6}
            accessibilityRole="button"
            accessibilityLabel={soldOut ? `${product.name} sold out` : added ? `${product.name} added to cart` : `Add ${product.name} to cart`}
            style={({ pressed }) => [styles.cart, soldOut && styles.cartDisabled, pressed && !soldOut && styles.cartPressed]}
          >
            {({ pressed }) => (
              <Ionicons name={added ? 'checkmark' : 'bag-handle-outline'} size={16} color={pressed && !soldOut ? colors.ink : colors.white} />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
  },
  pressed: {
    opacity: 0.85,
  },
  image: {
    aspectRatio: 1,
    borderRadius: radius.sm,
    padding: '6%',
  },
  body: {
    flex: 1,
    paddingTop: space.lg,
  },
  name: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    lineHeight: 18,
    letterSpacing: -0.14,
    color: colors.ink,
  },
  tagline: {
    marginTop: space.sm,
    fontFamily: fonts.regular,
    fontSize: 11,
    lineHeight: 16,
    color: colors.muted,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.sm,
    marginTop: 'auto',
    paddingTop: space.lg,
  },
  price: {
    fontFamily: fonts.semibold,
    fontSize: 12,
    color: colors.ink,
  },
  cart: {
    width: 33,
    height: 33,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  cartPressed: {
    backgroundColor: colors.accent,
  },
  cartDisabled: {
    backgroundColor: colors.gray300,
  },
});
