import { createContext, useState, type Ref } from 'react';
import { ScrollView, type ScrollViewProps } from 'react-native';

type Listener = () => void;

export type ScrollSignal = { subscribe: (fn: Listener) => () => void };

export const ScrollSignalContext = createContext<ScrollSignal | null>(null);

// Sinyal scroll untuk lazy
export default function LazyScrollView({ onScroll, ref, ...props }: ScrollViewProps & { ref?: Ref<ScrollView> }) {
  const [signal] = useState(() => {
    const listeners = new Set<Listener>();
    return {
      subscribe: (fn: Listener) => {
        listeners.add(fn);
        return () => {
          listeners.delete(fn);
        };
      },
      emit: () => listeners.forEach((fn) => fn()),
    };
  });

  return (
    <ScrollSignalContext.Provider value={signal}>
      <ScrollView
        ref={ref}
        scrollEventThrottle={100}
        {...props}
        onScroll={(e) => {
          signal.emit();
          onScroll?.(e);
        }}
      />
    </ScrollSignalContext.Provider>
  );
}
