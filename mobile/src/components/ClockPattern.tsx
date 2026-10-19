import { Image } from 'expo-image';
import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Easing, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

const pattern = require('@/assets/images/pattern.svg');

// Rotating clock face
export default function ClockPattern({ size, style }: { size: number; style?: StyleProp<ViewStyle> }) {
  const [turn] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(Animated.timing(turn, { toValue: 1, duration: 60000, easing: Easing.linear, useNativeDriver: true }));
    let active = true;

    // Cek reduce motion
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (active && !reduce) loop.start();
    });

    return () => {
      active = false;
      loop.stop();
    };
  }, [turn]);

  const rotate = turn.interpolate({ inputRange: [0, 1], outputRange: ['0deg', '360deg'] });

  return (
    <Animated.View pointerEvents="none" style={[{ width: size, height: size }, style, { transform: [{ rotate }] }]}>
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
