import React, { useState } from 'react';
import { Home, RefreshCw, AlertTriangle } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { ServerCoreFailure500Illustration } from '../illustrations/ServerCoreFailure500Illustration';

interface ServerErrorPageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

export const ServerErrorPage: React.FC<ServerErrorPageProps> = ({ onReturnHome, onGoBack, onRetry }) => {
  const [isRetrying, setIsRetrying] = useState<boolean>(false);

  const handleRetry = async () => {
    setIsRetrying(true);
    if (onRetry) {
      await onRetry();
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 600);
    }
  };

  return (
    <ErrorPageLayout
      details={{
        code: '500',
        badge: 'CENTRAL CORE BREACH',
        title: 'CORE MALFUNCTION',
        subtitle: 'Something went wrong inside the system core.',
        description: 'The central intelligence core has malfunctioned. Mechanical containment systems have isolated the fault to prevent cascading system anomalies while automated recovery sequences initialize.',
        protocolCode: 'HTTP_500_CORE_FAULT',
      }}
      illustration={<ServerCoreFailure500Illustration />}
      primaryAction={{
        label: isRetrying ? 'Rebooting Core...' : 'Reboot Core',
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
      systemTip="Core services are undergoing automated fail-safe isolation. Try re-executing your operation in a few seconds."
    />
  );
};
