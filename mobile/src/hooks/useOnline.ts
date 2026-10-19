import { useNetworkState } from 'expo-network';

// Status koneksi
export default function useOnline() {
  const { isConnected, isInternetReachable } = useNetworkState();
  return isConnected !== false && isInternetReachable !== false;
}
