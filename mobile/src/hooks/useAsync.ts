import { addNetworkStateListener } from 'expo-network';
import { useCallback, useEffect, useRef, useState } from 'react';

import { isNetworkError } from '@/api/axiosClient';

type State<T> = { data: T | null; loading: boolean; error: unknown };

// Fetch on key change
export default function useAsync<T>(fn: () => Promise<T>, key: string) {
  const fnRef = useRef(fn);
  const [state, setState] = useState<State<T>>({ data: null, loading: true, error: null });
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fnRef.current = fn;
  });

  const run = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setState((s) => ({ ...s, loading: true, error: null }));
    try {
      const data = await fnRef.current();
      setState({ data, loading: false, error: null });
    } catch (error) {
      setState((s) => ({ data: isRefresh ? s.data : null, loading: false, error }));
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    run();
  }, [key, run]);

  // Ulang saat online
  useEffect(() => {
    if (!isNetworkError(state.error)) return;
    const sub = addNetworkStateListener(({ isConnected, isInternetReachable }) => {
      if (isConnected && isInternetReachable !== false) run();
    });
    return () => sub.remove();
  }, [state.error, run]);

  return { ...state, refreshing, reload: () => run(false), refresh: () => run(true) };
}
