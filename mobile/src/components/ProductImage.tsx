import { Image } from 'expo-image';
import { useState } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { colors } from '@/theme';
import { imageUrl } from '@/utils/format';

// Image with fallback
export default function ProductImage({ path, style }: { path?: string; style?: StyleProp<ViewStyle> }) {
  const [failed, setFailed] = useState(!path);

  return (
    <View style={[styles.box, style]}>
      {failed ? (
        <View style={styles.mark} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <View style={[styles.strap, styles.strapTop]} />
          <View style={styles.case} />
          <View style={[styles.strap, styles.strapBottom]} />
        </View>
      ) : (
        <Image
          source={{ uri: imageUrl(path) }}
          style={styles.img}
          contentFit="contain"
          transition={200}
          onError={() => setFailed(true)}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.surface,
    overflow: 'hidden',
  },
  img: {
    width: '100%',
    height: '100%',
  },
  mark: {
    width: '34%',
    aspectRatio: 0.55,
    alignItems: 'center',
    justifyContent: 'center',
  },
  case: {
    width: '100%',
    aspectRatio: 0.8,
    borderRadius: 36,
    backgroundColor: colors.gray200,
  },
  strap: {
    width: '56%',
    flex: 1,
    backgroundColor: colors.gray100,
    borderRadius: 10,
  },
  strapTop: {
    marginBottom: -6,
  },
  strapBottom: {
    marginTop: -6,
  },
});
