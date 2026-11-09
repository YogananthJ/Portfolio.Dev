import React from 'react';
import { Home, ArrowLeft, ShieldX } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { RestrictedZone403Illustration } from '../illustrations/RestrictedZone403Illustration';

interface AccessDeniedPageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
}

export const AccessDeniedPage: React.FC<AccessDeniedPageProps> = ({ onReturnHome, onGoBack }) => {
  return (
    <ErrorPageLayout
      details={{
        code: '403',
        badge: 'SECURITY PERIMETER ACTIVE',
        title: 'Access Denied',
        subtitle: "You don't have permission to access this resource.",
        description: 'Biometric authorization credentials or administrative cryptographic tokens were missing or insufficient to bypass this sector security bulkhead.',
        protocolCode: 'HTTP_403_FORBIDDEN',
      }}
      illustration={<RestrictedZone403Illustration />}
      primaryAction={{
        label: 'Return Home',
        onClick: onReturnHome || (() => { window.location.href = '/'; }),
        icon: <Home className="w-4 h-4" />,
        variant: 'primary',
        shortcut: 'H',
      }}
      secondaryAction={{
        label: 'Go Back',
        onClick: onGoBack || (() => {
          if (typeof window !== 'undefined' && window.history.length > 1) {
            window.history.back();
          } else {
            window.location.href = '/';
          }
        }),
        icon: <ArrowLeft className="w-4 h-4" />,
        variant: 'secondary',
        shortcut: 'Esc',
      }}
      systemTip="Verify your cryptographic authorization credentials or return to public clearance sectors."
    />
  );
};
