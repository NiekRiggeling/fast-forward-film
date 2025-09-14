/**
 * Utility function to handle view transitions consistently across the app
 */

export function navigateWithTransition(callback: () => void) {
  // Check if the browser supports view transitions
  if (document.startViewTransition) {
    document.startViewTransition(() => {
      callback();
    });
  } else {
    // Fallback for browsers that don't support view transitions
    callback();
  }
}

/**
 * Custom hook for router navigation with view transitions
 */
import { useRouter } from "next/navigation";

export function useTransitionRouter() {
  const router = useRouter();

  const pushWithTransition = (href: string) => {
    navigateWithTransition(() => {
        alert('push');
      router.push(href);
    });
  };

  const replaceWithTransition = (href: string) => {
    navigateWithTransition(() => {
        alert('replace');
      router.replace(href);
    });
  };

  const backWithTransition = () => {
    navigateWithTransition(() => {
      router.back();
    });
  };

  return {
    push: pushWithTransition,
    replace: replaceWithTransition,
    back: backWithTransition,
    // Include other router methods without modification
    forward: router.forward,
    refresh: router.refresh,
    prefetch: router.prefetch,
  };
}
