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
        badge: 'CORE SYSTEM EXCEPTION',
        title: 'Internal Server Error',
        subtitle: 'Something went wrong on our side.',
        description: 'An unexpected exception halted internal server execution. The server core encountered a condition that prevented it from fulfilling the incoming request.',
        protocolCode: 'HTTP_500_INTERNAL_SERVER_ERROR',
      }}
      illustration={<ServerCoreFailure500Illustration />}
      primaryAction={{
        label: isRetrying ? 'Rebooting Kernel...' : 'Try Again',
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
