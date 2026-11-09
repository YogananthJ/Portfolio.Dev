import React, { useState } from 'react';
import { Home, RefreshCw, Wrench } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { ServiceMaintenance503Illustration } from '../illustrations/ServiceMaintenance503Illustration';

interface ServiceUnavailablePageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
  onRetry?: () => void;
}

export const ServiceUnavailablePage: React.FC<ServiceUnavailablePageProps> = ({ onReturnHome, onGoBack, onRetry }) => {
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
        code: '503',
        badge: 'SCHEDULED MAINTENANCE',
        title: 'Service Temporarily Unavailable',
        subtitle: "We're working on getting things back online.",
        description: 'System infrastructure is undergoing active firmware deployment, load rebalancing, or scheduled telemetry calibration. Normal service operations will resume momentarily.',
        protocolCode: 'HTTP_503_SERVICE_UNAVAILABLE',
      }}
      illustration={<ServiceMaintenance503Illustration />}
      primaryAction={{
        label: isRetrying ? 'Checking Maintenance...' : 'Retry',
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
      systemTip="Technician drones and automated CI/CD pipelines are currently rolling out system calibrations."
    />
  );
};
