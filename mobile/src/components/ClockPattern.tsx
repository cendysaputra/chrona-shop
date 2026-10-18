import { Image } from 'expo-image';
import { useEffect } from 'react';
import { StyleSheet, type StyleProp, type ViewStyle } from 'react-native';
import Animated, { Easing, ReduceMotion, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';

const pattern = require('@/assets/images/pattern.svg');

// Rotating clock face
export default function ClockPattern({ size, style }: { size: number; style?: StyleProp<ViewStyle> }) {
  const turn = useSharedValue(0);

  useEffect(() => {
    turn.set(withRepeat(withTiming(360, { duration: 60000, easing: Easing.linear, reduceMotion: ReduceMotion.System }), -1, false));
  }, [turn]);

  const spin = useAnimatedStyle(() => ({ transform: [{ rotate: `${turn.get()}deg` }] }));

  return (
    <Animated.View pointerEvents="none" style={[{ width: size, height: size }, style, spin]}>
      <Image source={pattern} style={styles.image} contentFit="contain" accessible={false} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: '100%',
    opacity: 0.62,
  },
});
