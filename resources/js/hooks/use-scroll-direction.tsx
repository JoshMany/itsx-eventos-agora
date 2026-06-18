import { useEffect, useState } from 'react';

type ScrollDirection = 'up' | 'down';

export function useScrollDirection(threshold = 10) {
    const [direction, setDirection] = useState<ScrollDirection>('up');

    useEffect(() => {
        let lastScrollY = window.scrollY;

        const handleScroll = () => {
            const currentScrollY = window.scrollY;
            const difference = currentScrollY - lastScrollY;

            // Ignorar movimientos pequeños
            if (Math.abs(difference) < threshold) {
                return;
            }

            setDirection(difference > 0 ? 'down' : 'up');

            lastScrollY = currentScrollY;
        };

        window.addEventListener('scroll', handleScroll, {
            passive: true,
        });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [threshold]);

    return direction;
}
