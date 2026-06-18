import { router } from '@inertiajs/react';
import { useEffect } from 'react';
import { toast } from '@heroui/react';
import type { FlashToast } from '@/types/ui';

const typeMap: Record<FlashToast['type'], (message: string) => void> = {
    success: toast.success,
    info: toast.info,
    warning: toast.warning,
    error: toast.danger,
};

export function useFlashToast(): void {
    useEffect(() => {
        return router.on('flash', (event) => {
            const flash = (event as CustomEvent).detail?.flash;
            const data = flash?.toast as FlashToast | undefined;

            if (!data) {
                return;
            }

            typeMap[data.type](data.message);
        });
    }, []);
}
