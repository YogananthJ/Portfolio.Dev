import React, { useState } from 'react';
import { Home, RefreshCw, Clock } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { SignalInterrupted408Illustration } from '../illustrations/SignalInterrupted408Illustration';

interface RequestTimeoutPageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

export const RequestTimeoutPage: React.FC<RequestTimeoutPageProps> = ({ onReturnHome, onGoBack, onRetry }) => {
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
        code: '408',
        badge: 'CHRONO THRESHOLD EXCEEDED',
        title: 'Request Timeout',
        subtitle: 'The request took longer than expected.',
        description: 'The server waited for your transmission packet, but the allotted connection window expired before transmission finished. High network congestion or packet latency may be stalling the transfer.',
        protocolCode: 'HTTP_408_REQUEST_TIMEOUT',
      }}
      illustration={<SignalInterrupted408Illustration />}
      primaryAction={{
        label: isRetrying ? 'Retransmitting...' : 'Retry Request',
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
      systemTip="Verify your current uplink bandwidth or retry with an extended timeout threshold."
    />
  );
};
