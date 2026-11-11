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
        badge: 'RESTRICTED ZONE',
        title: 'SECURITY LOCKDOWN',
        subtitle: 'This sector is protected. Access has been denied.',
        description: 'An unauthorized visitor has reached a restricted digital zone. Security scanners have engaged, forcefield barriers are active, and access to this sector is locked.',
        protocolCode: 'HTTP_403_LOCKDOWN',
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
