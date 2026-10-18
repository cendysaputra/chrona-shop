import { StyleSheet, Text, View } from 'react-native';

import { colors, fonts, space } from '@/theme';
import { formatPrice } from '@/utils/format';

// Subtotal / shipping / total
export default function SummaryRows({ subtotal }: { subtotal: number }) {
  return (
    <View>
      <View style={styles.row}>
        <Text style={styles.label}>Subtotal</Text>
        <Text style={styles.value}>{formatPrice(subtotal)}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Shipping</Text>
        <Text style={styles.value}>Free</Text>
      </View>
      <View style={[styles.row, styles.totalRow]}>
        <Text style={styles.total}>Total</Text>
        <Text style={styles.total}>{formatPrice(subtotal)}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: space.lg,
    paddingVertical: space.sm,
  },
  label: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.muted,
  },
  value: {
    fontFamily: fonts.regular,
    fontSize: 14,
    color: colors.ink,
  },
  totalRow: {
    marginTop: space.sm,
    paddingTop: space.lg,
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
  },
  total: {
    fontFamily: fonts.semibold,
    fontSize: 18,
    letterSpacing: -0.36,
    color: colors.ink,
  },
});
