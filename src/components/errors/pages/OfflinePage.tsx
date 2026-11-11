import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Home, CheckCircle2 } from 'lucide-react';
import { ErrorPageLayout } from '../ErrorPageLayout';
import { SignalLostOfflineIllustration } from '../illustrations/SignalLostOfflineIllustration';
import { soundFX } from '../../../utils/soundEffects';

interface OfflinePageProps {
  onReturnHome?: () => void;
  onGoBack?: () => void;
}

export const OfflinePage: React.FC<OfflinePageProps> = ({ onReturnHome, onGoBack }) => {
  const [isOnline, setIsOnline] = useState<boolean>(() => typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [probeResult, setProbeResult] = useState<string | null>(null);

  // Real-time network status listeners
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setProbeResult('CONNECTION RESTORED. System re-synchronized.');
      soundFX.playSuccess();
      // Auto return home after brief confirmation
      setTimeout(() => {
        if (onReturnHome) {
          onReturnHome();
        } else {
          window.location.href = '/';
        }
      }, 1400);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setProbeResult('CARRIER LOST. Offline mode active.');
      soundFX.playWarning();
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [onReturnHome]);

  const handleRetryConnection = async () => {
    setIsChecking(true);
    setProbeResult('Pinging local gateway and neural endpoints...');
    soundFX.playPulse();

    try {
      // Probe network by checking navigator.onLine and probing a lightweight endpoint
      const onlineState = navigator.onLine;
      if (!onlineState) {
        throw new Error('Hardware reports offline');
      }

      const response = await fetch('/api/visitors', { method: 'HEAD', cache: 'no-store' });
      if (response.ok || response.status < 500) {
        setIsOnline(true);
        setProbeResult('CONNECTION VERIFIED! Telemetry stream online.');
        soundFX.playSuccess();
        setTimeout(() => {
          if (onReturnHome) {
            onReturnHome();
          } else {
            window.location.reload();
          }
        }, 1000);
      } else {
        throw new Error('Endpoint unreachable');
      }
    } catch {
      setIsOnline(false);
      setProbeResult('PROBE FAILED: No response from gateway. Check Wi-Fi or cellular signal.');
      soundFX.playWarning();
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <ErrorPageLayout
      details={{
        code: 'OFFLINE',
        badge: isOnline ? 'CARRIER RESTORED' : 'COMMUNICATION FAILURE',
        title: 'SIGNAL DISCONNECTED',
        subtitle: 'The connection to your digital universe has been interrupted.',
        description: 'Carrier signal lost across communication nodes. Local cached data remains accessible, but live neural simulators and remote data transmissions are paused until your uplink is restored.',
        protocolCode: 'NET_CARRIER_INTERRUPTED',
      }}
      illustration={<SignalLostOfflineIllustration />}
      primaryAction={{
        label: isChecking ? 'Testing Carrier...' : 'Retry Connection',
        onClick: handleRetryConnection,
        icon: isChecking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wifi className="w-4 h-4" />,
        variant: 'primary',
        shortcut: 'R',
        loading: isChecking,
      }}
      secondaryAction={{
        label: 'Return Home',
        onClick: onReturnHome || (() => { window.location.href = '/'; }),
        icon: <Home className="w-4 h-4" />,
        variant: 'secondary',
        shortcut: 'H',
      }}
      systemTip="The application automatically listens for browser online triggers. Plug in your ethernet cable or toggle Wi-Fi."
    >
      {/* Real-time Connection Status Indicator */}
      <div className="p-3 bg-[#0A0D15] border border-white/10 rounded-xs flex items-center justify-between font-mono text-xs">
        <div className="flex items-center gap-2">
          {isOnline ? (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
          ) : (
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-rose-500" />
            </span>
          )}
          <span className="text-zinc-300 font-bold uppercase text-[11px]">
            {isOnline ? 'Online Status: CONNECTED' : 'Online Status: DISCONNECTED'}
          </span>
        </div>
        <span className="text-[10px] text-zinc-500">
          PROBE: {isChecking ? 'ACTIVE' : 'IDLE'}
        </span>
      </div>

      {probeResult && (
        <div className={`p-2.5 text-xs font-mono rounded-xs border flex items-center gap-2 ${
          isOnline ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}>
          {isOnline ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> : <WifiOff className="w-3.5 h-3.5 shrink-0" />}
          <span>{probeResult}</span>
        </div>
      )}
    </ErrorPageLayout>
  );
};
