/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/client" />

interface WakeLockSentinel extends EventTarget {
    readonly released: boolean;
    readonly type: 'screen';
    release(): Promise<void>;
    onrelease: ((this: WakeLockSentinel, ev: Event) => any) | null;
}

interface WakeLock {
    request(type: 'screen'): Promise<WakeLockSentinel>;
}

interface Navigator {
    readonly wakeLock: WakeLock;
}

