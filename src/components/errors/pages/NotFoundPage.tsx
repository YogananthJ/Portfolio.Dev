import React from 'react';
import { Home, ArrowLeft } from 'lucide-react';
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
        badge: 'DIMENSIONAL DRIFT',
        title: 'LOST IN SPACE',
        subtitle: "You've travelled beyond the boundaries of this website.",
        description: 'A digital explorer has drifted past the outer sector coordinates into an unknown dimension. The page you are looking for has been fractured, relocated, or lost among the digital stars.',
        protocolCode: 'HTTP_404_VOID',
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
      systemTip="The coordinates you entered do not exist in this sector. Verify the URL or return to the verified project directory."
    />
  );
};
