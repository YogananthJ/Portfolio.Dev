import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
  getFirestore,
  initializeFirestore,
  type Firestore,
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase app singleton
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Use long-polling in browser environments to avoid WebChannel streaming hangs
// behind proxies, CDNs, or sandboxed iframes that trigger 10s backend timeouts.
function createFirestoreClient(): Firestore {
  if (typeof window !== 'undefined') {
    try {
      return initializeFirestore(
        app,
        {
          experimentalForceLongPolling: true,
        },
        firebaseConfig.firestoreDatabaseId
      );
    } catch {
      // Fallback if Firestore instance was already initialized (e.g. during HMR)
    }
  }
  return getFirestore(app, firebaseConfig.firestoreDatabaseId);
}

// Initialize Firestore with specific database ID from config
export const db = createFirestoreClient();
export const auth = getAuth(app);

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export function handleFirestoreError(
  error: unknown,
  operationType: OperationType,
  path: string | null
) {
  const errInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid ?? null,
      email: auth.currentUser?.email ?? null,
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
