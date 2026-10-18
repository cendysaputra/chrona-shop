import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { getErrorMessage, getStatus } from '@/api/axiosClient';
import { getProduct, getProducts } from '@/api/productApi';
import Badge from '@/components/Badge';
import Button from '@/components/Button';
import ProductGrid from '@/components/ProductGrid';
import ProductImage from '@/components/ProductImage';
import QtyStepper from '@/components/QtyStepper';
import SectionTitle from '@/components/SectionTitle';
import StatusView from '@/components/StatusView';
import { SPEC_LABELS } from '@/config';
import { useCart } from '@/context/CartContext';
import useAsync from '@/hooks/useAsync';
import type { Product, ProductSpecs } from '@/types';
import { colors, fonts, radius, space, type } from '@/theme';
import { formatPrice, stockLabel, tagLabel } from '@/utils/format';

const HIGHLIGHT_KEYS: (keyof ProductSpecs)[] = ['battery', 'waterResistance', 'gps'];

const PERKS = [
  { title: 'Free shipping', text: 'Delivered across Indonesia', icon: 'truck-outline' },
  { title: '1-year warranty', text: 'Official Chrona coverage', icon: 'shield-check-outline' },
  { title: '30-day returns', text: 'Easy returns, no hassle', icon: 'undo-variant' },
] as const;

export default function ProductDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const { data: product, loading, error, reload } = useAsync(() => getProduct(slug), slug);

  if (loading) return <StatusView tone="loading" message="Loading watch…" />;

  if (error || !product) {
    const notFound = getStatus(error) === 404;
    return (
      <View style={styles.padded}>
        <StatusView
          tone={notFound ? 'info' : 'error'}
          message={notFound ? "This watch isn't available." : getErrorMessage(error)}
          actionLabel={notFound ? 'Back to shop' : 'Try again'}
          onAction={notFound ? () => router.navigate('/shop') : reload}
        />
      </View>
    );
  }

  return <Detail key={product.slug} product={product} />;
}

function Detail({ product }: { product: Product }) {
  const { addItem } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  const soldOut = product.stock <= 0;
  const badge = tagLabel(product.tags);
  const specs = Object.keys(SPEC_LABELS).filter((k) => product.specs?.[k as keyof ProductSpecs]);
  const highlights = HIGHLIGHT_KEYS.filter((k) => product.specs?.[k]);
  const stockStyle = soldOut ? styles.out : product.stock <= 5 ? styles.low : styles.inStock;

  const related = useAsync(
    () => getProducts({ sort: 'best-selling' }).then((l) => l.filter((p) => p.slug !== product.slug).slice(0, 4)),
    product.slug
  );

  const handleAdd = () => {
    addItem(product, qty);
    setAdded(true);
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ title: `Chrona ${product.series}` }} />

      <View>
        <ProductImage path={product.image} style={styles.image} />
        {badge && (
          <View style={styles.badge}>
            <Badge label={badge} />
          </View>
        )}
      </View>

      {/* Product info */}
      <View style={styles.info}>
        <Text style={type.eyebrow}>Chrona {product.series}</Text>
        <Text style={styles.name}>{product.name}</Text>
        <Text style={styles.tagline}>{product.tagline}</Text>
        <Text style={styles.price}>{formatPrice(product.price)}</Text>
        <Text style={[styles.stock, stockStyle]}>{stockLabel(product.stock)}</Text>

        <View style={styles.buy}>
          {!soldOut && (
            <QtyStepper
              value={qty}
              max={product.stock}
              onChange={(v) => {
                setQty(v);
                setAdded(false);
              }}
            />
          )}
          <Button title={soldOut ? 'Sold out' : 'Add to cart'} size="lg" onPress={handleAdd} disabled={soldOut} style={styles.addBtn} />
        </View>

        {added && (
          <View style={styles.added}>
            <Text style={styles.addedText}>Added to your cart.</Text>
            <Text style={styles.addedLink} onPress={() => router.navigate('/cart')} accessibilityRole="link">
              View cart
            </Text>
          </View>
        )}
      </View>

      {/* Overview */}
      <View style={styles.overview}>
        <Text style={type.eyebrow}>Overview</Text>
        <Text style={styles.description}>{product.description}</Text>

        {highlights.length > 0 && (
          <View style={styles.highlights}>
            {highlights.map((k) => (
              <View key={k} style={styles.highlight}>
                <Text style={styles.highlightLabel}>{SPEC_LABELS[k]}</Text>
                <Text style={styles.highlightValue}>{product.specs[k]}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.perks}>
          {PERKS.map((p) => (
            <View key={p.title} style={styles.perk}>
              <View style={styles.perkIcon}>
                <MaterialCommunityIcons name={p.icon} size={19} color={colors.white} />
              </View>
              <View>
                <Text style={styles.perkTitle}>{p.title}</Text>
                <Text style={type.small}>{p.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Tech specs */}
      {specs.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Tech specs</SectionTitle>
          <View style={styles.specs}>
            {specs.map((k) => (
              <View key={k} style={styles.specRow}>
                <Text style={styles.specLabel}>{SPEC_LABELS[k]}</Text>
                <Text style={styles.specValue}>{product.specs[k as keyof ProductSpecs]}</Text>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Related */}
      {related.data && related.data.length > 0 && (
        <View style={styles.section}>
          <SectionTitle>Other watches</SectionTitle>
          <ProductGrid products={related.data} />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  padded: {
    padding: space.lg,
  },
  content: {
    paddingHorizontal: space.lg,
    paddingTop: space.xxl,
    paddingBottom: space.sectionLg,
  },
  image: {
    aspectRatio: 1,
    borderRadius: radius.sm,
    padding: '6%',
  },
  badge: {
    position: 'absolute',
    top: space.xl,
    left: space.xl,
  },
  info: {
    marginTop: space.xxxl,
  },
  name: {
    marginTop: space.lg,
    fontFamily: fonts.light,
    fontSize: 34,
    lineHeight: 37,
    letterSpacing: -0.7,
    color: colors.ink,
  },
  tagline: {
    marginTop: space.lg,
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  price: {
    marginTop: space.xxxl,
    fontFamily: fonts.semibold,
    fontSize: 22,
    letterSpacing: -0.2,
    color: colors.ink,
  },
  stock: {
    marginTop: space.xs,
    fontFamily: fonts.semibold,
    fontSize: 13,
  },
  inStock: {
    color: colors.success,
  },
  low: {
    color: colors.warning,
  },
  out: {
    color: colors.gray600,
  },
  buy: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    marginTop: space.section,
  },
  addBtn: {
    flex: 1,
  },
  added: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    marginTop: space.lg,
  },
  addedText: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.success,
  },
  addedLink: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.ink,
    textDecorationLine: 'underline',
  },
  overview: {
    gap: space.lg,
    marginTop: space.sectionLg,
    paddingTop: space.xxl,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  description: {
    fontFamily: fonts.light,
    fontSize: 18,
    lineHeight: 26,
    color: colors.ink,
  },
  highlights: {
    gap: 10,
    marginTop: space.xxl,
  },
  highlight: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: space.lg,
    paddingVertical: space.xl,
    paddingHorizontal: 22,
    borderRadius: radius.sm,
    backgroundColor: colors.surface,
  },
  highlightLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  highlightValue: {
    flexShrink: 1,
    fontFamily: fonts.light,
    fontSize: 24,
    letterSpacing: -0.5,
    textAlign: 'right',
    color: colors.ink,
  },
  perks: {
    gap: space.lg,
    marginTop: space.md,
  },
  perk: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  perkIcon: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
    backgroundColor: colors.ink,
  },
  perkTitle: {
    fontFamily: fonts.semibold,
    fontSize: 14,
    color: colors.ink,
  },
  section: {
    gap: space.xxl,
    marginTop: space.sectionLg,
  },
  specs: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  specRow: {
    flexDirection: 'row',
    gap: space.lg,
    paddingVertical: space.xl,
    borderBottomWidth: 1,
    borderBottomColor: colors.gray200,
  },
  specLabel: {
    flex: 1,
    fontFamily: fonts.regular,
    fontSize: 13,
    color: colors.muted,
  },
  specValue: {
    flex: 1.4,
    fontFamily: fonts.semibold,
    fontSize: 13,
    lineHeight: 19,
    color: colors.ink,
  },
});
