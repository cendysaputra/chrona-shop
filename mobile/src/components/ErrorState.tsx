import { getErrorMessage, isNetworkError } from '@/api/axiosClient';
import useOnline from '@/hooks/useOnline';

import StatusView from './StatusView';

// Offline / gagal muat
export default function ErrorState({ error, onRetry }: { error: unknown; onRetry: () => void }) {
  const online = useOnline();

  if (!online) {
    return (
      <StatusView
        icon="cloud-offline-outline"
        title="You're offline"
        message="Check your internet connection. This will reload once you're back online."
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  }

  if (isNetworkError(error)) {
    return (
      <StatusView
        icon="cloud-outline"
        title="Can't load right now"
        message="Please try again in a moment."
        actionLabel="Try again"
        onAction={onRetry}
      />
    );
  }

  return <StatusView tone="error" message={getErrorMessage(error)} actionLabel="Try again" onAction={onRetry} />;
}
