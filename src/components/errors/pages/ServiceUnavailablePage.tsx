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
        badge: 'SYSTEM CALIBRATION',
        title: 'UNDER MAINTENANCE',
        subtitle: "We're repairing this part of the digital universe. Please return shortly.",
        description: 'The digital universe is undergoing repairs. Automated maintenance drones and diagnostic systems are currently recalibrating circuit panels, upgrading firmware matrices, and tightening memory conduits.',
        protocolCode: 'HTTP_503_MAINTENANCE',
      }}
      illustration={<ServiceMaintenance503Illustration />}
      primaryAction={{
        label: isRetrying ? 'Checking Status...' : 'Check Status',
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
