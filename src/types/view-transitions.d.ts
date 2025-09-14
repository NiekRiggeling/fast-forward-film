// Global type declarations for View Transition API
declare global {
  interface Document {
    startViewTransition?: (callback: () => void) => ViewTransition;
  }

  interface ViewTransition {
    updateCallbackDone: Promise<void>;
    ready: Promise<void>;
    finished: Promise<void>;
    skipTransition(): void;
  }
}

export {};
