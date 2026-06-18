import { useCallback, useSyncExternalStore } from 'react';

/**
 * Reads dark mode directly from the <html data-theme> attribute.
 *
 * Immune to SSR hydration mismatches because initializeTheme()
 * sets data-theme BEFORE React hydrates.
 *
 * @example
 * const isDark = useIsDark();
 * return isDark ? <Moon /> : <Sun />;
 */
export function useIsDark(): boolean {
    const subscribe = useCallback((onStoreChange: () => void) => {
        const observer = new MutationObserver(() => onStoreChange());
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme'],
        });

        return () => observer.disconnect();
    }, []);

    const getSnapshot = useCallback(
        () => document.documentElement.getAttribute('data-theme') === 'dark',
        [],
    );

    const getServerSnapshot = useCallback(() => false, []);

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
