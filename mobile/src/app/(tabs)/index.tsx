import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { getErrorMessage } from '@/api/axiosClient';
import { getProduct, getProducts } from '@/api/productApi';
import Button from '@/components/Button';
import ClockPattern from '@/components/ClockPattern';
import { HeroBackground, HeroFade } from '@/components/HeroGradient';
import LazyScrollView from '@/components/LazyScrollView';
import ProductGrid from '@/components/ProductGrid';
import ProductImage from '@/components/ProductImage';
import SectionTitle from '@/components/SectionTitle';
import StatusView from '@/components/StatusView';
import { useCart } from '@/context/CartContext';
import useAsync from '@/hooks/useAsync';
import type { Product } from '@/types';
import { colors, fonts, radius, space, type } from '@/theme';
import { formatPrice } from '@/utils/format';

const heroWatch = require('@/assets/images/hero-img.png');
const HERO_HEIGHT = 430;
const TILE_HEIGHT = 480;

export default function HomeScreen() {
  const featured = useAsync(() => Promise.all([getProduct('chrona-pulse-45-silver'), getProduct('chrona-pulse-45-graphite')]), 'home-featured');
  const collection = useAsync(() => getProducts({ sort: 'best-selling', limit: 8 }), 'home-collection');

  const onRefresh = () => {
    featured.refresh();
    collection.refresh();
  };

  return (
    <LazyScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={featured.refreshing || collection.refreshing} onRefresh={onRefresh} tintColor={colors.ink} />}
      showsVerticalScrollIndicator={false}
    >
      <Hero />

      {/* New this season */}
      <View style={styles.section}>
        <SectionTitle>New this season</SectionTitle>
        {featured.loading && <StatusView tone="loading" message="Loading featured watches…" />}
        {!!featured.error && <StatusView tone="error" message={getErrorMessage(featured.error)} actionLabel="Try again" onAction={featured.reload} />}
        {featured.data && (
          <View style={styles.tiles}>
            <FeatureTile product={featured.data[0]} label="Featured" />
            <FeatureTile product={featured.data[1]} label="Best seller" dark />
          </View>
        )}
      </View>

      {/* Collection */}
      <View style={styles.section}>
        <View style={styles.collectionHead}>
          <SectionTitle dot={false} style={styles.collectionTitle}>
            Shop the collection
          </SectionTitle>
          <Button title="Shop now" size="sm" onPress={() => router.navigate('/shop')} />
        </View>
        {collection.loading && <StatusView tone="loading" message="Loading watches…" />}
        {!!collection.error && <StatusView tone="error" message={getErrorMessage(collection.error)} actionLabel="Try again" onAction={collection.reload} />}
        {collection.data && <ProductGrid products={collection.data} />}
      </View>
    </LazyScrollView>
  );
}

function Hero() {
  const { width } = useWindowDimensions();
  const panel = width - space.sm * 2;
  const clock = width * 1.1;
  const watchWidth = width * 0.65;

  return (
    <View style={styles.hero}>
      <HeroBackground />
      <ClockPattern size={clock} style={[styles.clock, { left: (panel - clock) / 2 }]} />
      <View style={styles.heroCopy}>
        <Text style={type.micro}>Smartwatch for every moment</Text>
        <Text style={styles.heroTitle}>
          Everything You Need,{'\n'}
          <Text style={styles.heroTitleSoft}>One Glance Away</Text>
        </Text>
      </View>
      <Image
        source={heroWatch}
        style={[styles.heroWatch, { width: watchWidth, height: watchWidth * 1.04, left: (panel - watchWidth) / 2 }]}
        contentFit="contain"
        accessibilityLabel="Silver Chrona smartwatch showing the time, heart rate, and activity"
      />
      <HeroFade />
    </View>
  );
}

function FeatureTile({ product, label, dark = false }: { product: Product; label: string; dark?: boolean }) {
  const { addItem } = useCart();
  const [added, setAdded] = useState(false);
  const soldOut = product.stock <= 0;
  const open = () => router.push({ pathname: '/products/[slug]', params: { slug: product.slug } });

  // Reset label
  useEffect(() => {
    if (!added) return;
    const timer = setTimeout(() => setAdded(false), 1600);
    return () => clearTimeout(timer);
  }, [added]);

  return (
    <View style={[styles.tile, dark && styles.tileDark]}>
      <View style={styles.tileCopy}>
        <Text style={[styles.tileLabel, dark && styles.tileLabelDark]}>{label}</Text>
        <Text style={[styles.tileName, dark && styles.onDark]}>Chrona {product.series}</Text>
        <Text style={[styles.tilePrice, dark && styles.tilePriceDark]}>{formatPrice(product.price)}</Text>
        <View style={styles.tileActions}>
          <Text style={[styles.learnMore, dark && styles.onDark]} onPress={open} accessibilityRole="link">
            Learn more
          </Text>
          <Button
            title={soldOut ? 'Sold out' : added ? 'Added' : 'Add to cart'}
            size="sm"
            variant={dark ? 'light' : 'primary'}
            disabled={soldOut}
            onPress={() => {
              addItem(product, 1);
              setAdded(true);
            }}
          />
        </View>
      </View>
      <ProductImage path={product.image} style={styles.tileImage} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  content: {
    paddingBottom: space.sectionLg,
  },
  hero: {
    height: HERO_HEIGHT,
    marginHorizontal: space.sm,
    marginTop: space.sm,
    overflow: 'hidden',
    borderRadius: radius.xs,
    backgroundColor: colors.heroBottom,
  },
  clock: {
    position: 'absolute',
    top: 0,
  },
  heroCopy: {
    alignItems: 'center',
    gap: space.md,
    paddingTop: space.huge,
    paddingHorizontal: space.md,
  },
  heroTitle: {
    fontFamily: fonts.light,
    fontSize: 40,
    lineHeight: 43,
    letterSpacing: -1,
    textAlign: 'center',
    color: colors.ink,
  },
  heroTitleSoft: {
    color: colors.inkMuted,
  },
  heroWatch: {
    position: 'absolute',
    bottom: -space.xxxl,
  },
  section: {
    gap: space.xxl,
    paddingTop: space.sectionLg,
    paddingHorizontal: space.lg,
  },
  tiles: {
    gap: space.md,
  },
  tile: {
    height: TILE_HEIGHT,
    overflow: 'hidden',
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  tileDark: {
    backgroundColor: colors.ink,
  },
  tileCopy: {
    zIndex: 1,
    alignItems: 'center',
    paddingTop: 30,
    paddingHorizontal: space.xl,
  },
  tileLabel: {
    fontFamily: fonts.bold,
    fontSize: 11,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
    color: colors.accent,
  },
  tileLabelDark: {
    color: colors.onDarkLabel,
  },
  tileName: {
    marginTop: space.sm,
    fontFamily: fonts.semibold,
    fontSize: 31,
    lineHeight: 36,
    letterSpacing: -0.8,
    color: colors.ink,
  },
  tilePrice: {
    marginTop: space.xs,
    fontFamily: fonts.regular,
    fontSize: 15,
    color: colors.muted,
  },
  tilePriceDark: {
    color: colors.onDarkMuted,
  },
  tileActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    marginTop: space.xxl,
  },
  learnMore: {
    fontFamily: fonts.semibold,
    fontSize: 13,
    color: colors.ink,
  },
  onDark: {
    color: colors.white,
  },
  tileImage: {
    position: 'absolute',
    right: 0,
    bottom: -100,
    left: 0,
    height: 410,
    backgroundColor: 'transparent',
  },
  collectionHead: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: space.lg,
  },
  collectionTitle: {
    flex: 1,
  },
});
