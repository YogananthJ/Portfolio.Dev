/**
 * Global Application Error Monitoring Utility
 *
 * Captures unhandled runtime errors, promise rejections, and asset load failures
 * while filtering out noisy browser-extension and ResizeObserver warnings.
 * Keeps a bounded diagnostic buffer without exposing stack traces to visitors.
 */

export type MonitoredErrorSource =
  | 'runtime'
  | 'unhandledrejection'
  | 'asset'
  | 'boundary'
  | 'handled';

export interface MonitoredErrorRecord {
  id: string;
  source: MonitoredErrorSource;
  message: string;
  timestamp: string;
}

const MAX_RECORDS = 25;
const errorLog: MonitoredErrorRecord[] = [];
const listeners = new Set<(record: MonitoredErrorRecord) => void>();

const EXTENSION_PREFIXES = [
  'chrome-extension://',
  'moz-extension://',
  'safari-extension://',
  'safari-web-extension://',
];

const IGNORED_MESSAGES = [
  'ResizeObserver loop limit exceeded',
  'ResizeObserver loop completed with undelivered notifications',
  'Script error.',
];

export function shouldIgnoreError(message: string, filename?: string): boolean {
  const safeMsg = (message || '').trim();
  const safeFile = (filename || '').trim();

  if (!safeMsg && !safeFile) {
    return true;
  }

  for (const prefix of EXTENSION_PREFIXES) {
    if (safeFile.startsWith(prefix) || safeMsg.includes(prefix)) {
      return true;
    }
  }

  for (const ignored of IGNORED_MESSAGES) {
    if (safeMsg === ignored || safeMsg.startsWith(ignored)) {
      return true;
    }
  }

  return false;
}

export function sanitizeUserMessage(source: MonitoredErrorSource): string {
  switch (source) {
    case 'asset':
      return 'A media asset failed to load. Fallback content is displayed.';
    case 'boundary':
      return 'A section encountered a display issue and was safely isolated.';
    case 'unhandledrejection':
      return 'A background request could not be completed. Cached content remains active.';
    default:
      return 'A minor runtime interruption was handled automatically.';
  }
}

export function recordMonitoredError(
  source: MonitoredErrorSource,
  rawMessage: string,
  filename?: string
): MonitoredErrorRecord | null {
  if (shouldIgnoreError(rawMessage, filename)) {
    return null;
  }

  const record: MonitoredErrorRecord = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    source,
    message: rawMessage.slice(0, 240),
    timestamp: new Date().toISOString(),
  };

  errorLog.push(record);
  if (errorLog.length > MAX_RECORDS) {
    errorLog.shift();
  }

  listeners.forEach((cb) => {
    try {
      cb(record);
    } catch {
      // Prevent listener errors from cascading
    }
  });

  return record;
}

export function subscribeToMonitoredErrors(
  listener: (record: MonitoredErrorRecord) => void
): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getRecordedErrors(): MonitoredErrorRecord[] {
  return [...errorLog];
}
