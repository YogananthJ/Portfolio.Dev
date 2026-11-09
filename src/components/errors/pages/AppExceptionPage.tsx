import React, { useState } from 'react';
import { Home, RefreshCw, Terminal, CheckCircle2 } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { AppExceptionIllustration } from '../illustrations/AppExceptionIllustration';

interface AppExceptionPageProps {
  onReload?: () => void;
  onReturnHome?: () => void;
  errorId?: string;
}

export const AppExceptionPage: React.FC<AppExceptionPageProps> = ({
  onReload,
  onReturnHome,
  errorId = 'ERR_REACT_RUNTIME_TRAP',
}) => {
  const [isReloading, setIsReloading] = useState<boolean>(false);
  const [incidentCode] = useState<string>(() => {
    return `INC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
  });

  const handleReload = () => {
    setIsReloading(true);
    if (onReload) {
      onReload();
    } else {
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
  };

  const handleReturnHome = () => {
    if (onReturnHome) {
      onReturnHome();
    } else {
      window.location.href = '/';
    }
  };

  return (
    <ErrorPageLayout
      details={{
        code: 'CRASH',
        badge: 'REACT BOUNDARY CAUGHT',
        title: 'Application Error',
        subtitle: 'Something unexpected happened.',
        description: 'A component rendering exception triggered the global client fail-safe trap. Uncaught render exceptions are isolated here to protect application integrity without compromising visitor privacy.',
        protocolCode: 'ERR_CLIENT_RUNTIME_TRAP',
      }}
      illustration={<AppExceptionIllustration />}
      primaryAction={{
        label: isReloading ? 'Reloading...' : 'Reload Application',
        onClick: handleReload,
        icon: <RefreshCw className={`w-4 h-4 ${isReloading ? 'animate-spin' : ''}`} />,
        variant: 'primary',
        shortcut: 'R',
        loading: isReloading,
      }}
      secondaryAction={{
        label: 'Return Home',
        onClick: handleReturnHome,
        icon: <Home className="w-4 h-4" />,
        variant: 'secondary',
        shortcut: 'H',
      }}
      systemTip={`Incident ID: ${incidentCode} logged to browser diagnostics. No sensitive traces exposed.`}
    >
      <div className="p-3 bg-[#0C101A] border border-white/10 rounded-xs font-mono text-[11px] text-zinc-400 space-y-1.5">
        <div className="flex items-center justify-between text-zinc-500 pb-1 border-b border-white/5 text-[10px]">
          <span>FAIL_SAFE_CONTAINER</span>
          <span className="text-rose-400">STATE: ISOLATED</span>
        </div>
        <div className="text-zinc-300 flex items-center justify-between">
          <span>Incident Reference:</span>
          <span className="font-bold text-rose-400">{incidentCode}</span>
        </div>
        <div className="text-zinc-400 text-[10px]">
          All application state was cleanly isolated. Reloading resets volatile component state safely.
        </div>
      </div>
    </ErrorPageLayout>
  );
};
