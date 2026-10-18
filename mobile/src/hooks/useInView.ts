import { useContext, useEffect, useRef, useState } from 'react';
import { Dimensions, Platform, type View } from 'react-native';

import { ScrollSignalContext } from '@/components/LazyScrollView';

// Jarak preload
const MARGIN = 400;

// Cek dekat viewport
export default function useInView() {
  const signal = useContext(ScrollSignalContext);
  const ref = useRef<View>(null);
  // Lazy bawaan web
  const [inView, setInView] = useState(!signal || Platform.OS === 'web');
  const [laidOut, setLaidOut] = useState(false);

  useEffect(() => {
    if (inView || !laidOut || !signal) return;

    const check = () =>
      ref.current?.measureInWindow((_x, y) => {
        if (y < Dimensions.get('window').height + MARGIN) setInView(true);
      });

    check();
    return signal.subscribe(check);
  }, [inView, laidOut, signal]);

  return { ref, inView, onLayout: () => setLaidOut(true) };
}
