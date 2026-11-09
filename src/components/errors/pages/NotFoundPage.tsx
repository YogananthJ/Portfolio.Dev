import React from 'react';
import { Home, ArrowLeft, Search } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { AstronautVoid404Illustration } from '../illustrations/AstronautVoid404Illustration';

interface NotFoundPageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onReturnHome, onGoBack }) => {
  return (
    <ErrorPageLayout
      details={{
        code: '404',
        badge: 'DIGITAL VOID DETECTED',
        title: 'Page Not Found',
        subtitle: 'Looks like this page disappeared into another dimension.',
        description: 'The requested route coordinates do not match any published neural node or project dossier. It may have been relocated, unmounted, or sucked into the digital void.',
        protocolCode: 'HTTP_404_NOT_FOUND',
      }}
      illustration={<AstronautVoid404Illustration />}
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
      systemTip="The path may have expired. Verify spelling or jump back to the verified projects directory."
    />
  );
};
