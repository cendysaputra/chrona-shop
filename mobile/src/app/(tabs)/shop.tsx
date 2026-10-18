import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, RefreshControl, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { getErrorMessage } from '@/api/axiosClient';
import { getProducts } from '@/api/productApi';
import { HeroBackground, HeroFade } from '@/components/HeroGradient';
import ProductCard from '@/components/ProductCard';
import SectionTitle from '@/components/SectionTitle';
import Select from '@/components/Select';
import StatusView from '@/components/StatusView';
import { SERIES, SORT_OPTIONS, type SortValue } from '@/config';
import useAsync from '@/hooks/useAsync';
import type { Product } from '@/types';
import { colors, fonts, radius, space, type } from '@/theme';

const shopWatch = require('@/assets/images/hero-img-shop.png');
const HERO_HEIGHT = 430;

const FILTER_OPTIONS = [{ value: '', label: 'All series' }, ...SERIES.map((s) => ({ value: s, label: s }))];

type Filters = { series?: string; sort?: string };

export default function ShopScreen() {
  const params = useLocalSearchParams<Filters>();
  const series = SERIES.find((s) => s === params.series) ?? '';
  const sort: SortValue = SORT_OPTIONS.find((o) => o.value === params.sort)?.value ?? 'newest';

  const list = useAsync(() => getProducts(series ? { series, sort } : { sort }), `${series}|${sort}`);

  // Filters in params
  const setFilters = (next: Filters) => router.setParams(next);

  // Pairs per row
  const rows: Product[][] = [];
  const products = list.loading ? [] : (list.data ?? []);
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));

  const header = (
    <View>
      <Hero />

      <View style={styles.catalog}>
        <SectionTitle>{series ? `Chrona ${series}` : 'All watches'}</SectionTitle>
        <View style={styles.toolbar}>
          <Select label="Filter" value={series} options={FILTER_OPTIONS} onChange={(value) => setFilters({ series: value })} />
          <Select label="Sort by" value={sort} options={SORT_OPTIONS} onChange={(value) => setFilters({ sort: value })} />
        </View>

        {list.loading && <StatusView tone="loading" message="Loading watches…" />}
        {!!list.error && <StatusView tone="error" message={getErrorMessage(list.error)} actionLabel="Try again" onAction={list.reload} />}
        {!list.loading && list.data?.length === 0 && (
          <StatusView message="No watches in this series yet." actionLabel="Show all watches" onAction={() => setFilters({ series: '' })} />
        )}
      </View>
    </View>
  );

  return (
    <FlatList
      style={styles.screen}
      data={rows}
      keyExtractor={(row) => row[0].slug}
      renderItem={({ item }) => (
        <View style={styles.row}>
          {item.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
          {item.length === 1 && <View style={styles.spacer} />}
        </View>
      )}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View style={styles.rowGap} />}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={list.refreshing} onRefresh={list.refresh} tintColor={colors.ink} />}
      showsVerticalScrollIndicator={false}
    />
  );
}

function Hero() {
  const { width } = useWindowDimensions();
  const panel = width - space.sm * 2;
  const watchWidth = width * 0.55;

  return (
    <View style={styles.hero}>
      <HeroBackground />
      <View style={styles.heroCopy}>
        <Text style={type.micro}>The Chrona collection</Text>
        <Text style={styles.heroTitle}>
          Made for every{'\n'}
          <Text style={styles.heroTitleSoft}>moment.</Text>
        </Text>
        <Text style={styles.heroText}>Find the watch that fits the way you move.</Text>
      </View>
      <Image
        source={shopWatch}
        style={[styles.heroWatch, { width: watchWidth, height: watchWidth * 1.04, left: (panel - watchWidth) / 2 }]}
        contentFit="contain"
        accessible={false}
      />
      <HeroFade />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.white,
  },
  content: {
    paddingHorizontal: space.lg,
    paddingBottom: space.sectionLg,
  },
  hero: {
    height: HERO_HEIGHT,
    marginHorizontal: -space.sm,
    marginTop: space.sm,
    overflow: 'hidden',
    borderRadius: radius.xs,
    backgroundColor: colors.heroBottom,
  },
  heroCopy: {
    alignItems: 'center',
    gap: space.md,
    paddingTop: space.xxl,
    paddingHorizontal: space.lg,
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
  heroText: {
    fontFamily: fonts.regular,
    fontSize: 12,
    color: colors.soft,
  },
  heroWatch: {
    position: 'absolute',
    bottom: -space.xxxl,
  },
  catalog: {
    gap: space.lg,
    paddingTop: space.sectionLg,
    paddingBottom: space.huge,
  },
  toolbar: {
    flexDirection: 'row',
    gap: space.md,
    marginBottom: space.xxl,
  },
  row: {
    flexDirection: 'row',
    gap: space.md,
  },
  spacer: {
    flex: 1,
  },
  rowGap: {
    height: space.huge,
  },
});
