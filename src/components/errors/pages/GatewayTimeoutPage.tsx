import React, { useState } from 'react';
import { Home, RefreshCw, Hourglass } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { GatewayTimeout504Illustration } from '../illustrations/GatewayTimeout504Illustration';

interface GatewayTimeoutPageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

export const GatewayTimeoutPage: React.FC<GatewayTimeoutPageProps> = ({ onReturnHome, onGoBack, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 700);
    }
  };

  return (
    <ErrorPageLayout
      details={{
        code: '504',
        badge: 'UPSTREAM SILENCE',
        title: 'Gateway Timeout',
        subtitle: 'The upstream server did not respond in time.',
        description: 'The edge reverse proxy dispatched the request packet into the remote cluster, but the upstream host failed to send an acknowledgment within the allotted round-trip timeframe.',
        protocolCode: 'HTTP_504_GATEWAY_TIMEOUT',
      }}
      illustration={<GatewayTimeout504Illustration />}
      primaryAction={{
        label: isRetrying ? 'Retransmitting Syn...' : 'Try Again',
        onClick: handleRetry,
        icon: <RefreshCw className={`w-4 h-4 ${isRetrying ? 'animate-spin' : ''}`} />,
        variant: 'primary',
        shortcut: 'R',
        loading: isRetrying,
      }}
      secondaryAction={{
        label: 'Return Home',
        onClick: onReturnHome || (() => { window.location.href = '/'; }),
        icon: <Home className="w-4 h-4" />,
        variant: 'secondary',
        shortcut: 'H',
      }}
      systemTip="The transmission TTL expired before receiving an HTTP ACK from the upstream cluster."
    />
  );
};
