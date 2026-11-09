import React, { useState } from 'react';
import { Home, RefreshCw, Network } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { BadGateway502Illustration } from '../illustrations/BadGateway502Illustration';

interface BadGatewayPageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

export const BadGatewayPage: React.FC<BadGatewayPageProps> = ({ onReturnHome, onGoBack, onRetry }) => {
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
        code: '502',
        badge: 'UPSTREAM COLLISION',
        title: 'Bad Gateway',
        subtitle: 'The server received an invalid response.',
        description: 'While acting as a gateway or proxy, the server received an invalid, malformed, or dropped response from the upstream daemon. Communication conduits between edge and backend nodes severed prematurely.',
        protocolCode: 'HTTP_502_BAD_GATEWAY',
      }}
      illustration={<BadGateway502Illustration />}
      primaryAction={{
        label: isRetrying ? 'Reconnecting Node...' : 'Try Again',
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
      systemTip="The edge proxy is online, but the backend microservice returned an invalid response code."
    />
  );
};
