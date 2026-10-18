import { StyleSheet, View } from 'react-native';

import type { Product } from '@/types';
import { space } from '@/theme';

import ProductCard from './ProductCard';

// Two-column grid
export default function ProductGrid({ products }: { products: Product[] }) {
  const rows: Product[][] = [];
  for (let i = 0; i < products.length; i += 2) rows.push(products.slice(i, i + 2));

  return (
    <View style={styles.grid}>
      {rows.map((row) => (
        <View key={row[0].slug} style={styles.row}>
          {row.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
          {row.length === 1 && <View style={styles.spacer} />}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    gap: space.huge,
  },
  row: {
    flexDirection: 'row',
    gap: space.md,
  },
  spacer: {
    flex: 1,
  },
});
