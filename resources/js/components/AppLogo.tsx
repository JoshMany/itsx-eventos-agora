import { useState } from 'react';
import { motion } from 'motion/react';

const DURATION = 0.15;
const STAGGER = 0.05;

function RevealLink({
    children,
    isHovered,
}: {
    children: string;
    isHovered: boolean;
}) {
    const letters = children.split('');

    return (
        <span className="relative inline-block h-fit overflow-hidden leading-tight">
            {letters.map((char, i) => {
                const delay = isHovered
                    ? STAGGER * i
                    : STAGGER * (letters.length - 1 - i);

                return (
                    <span key={i} className="relative inline-block h-fit">
                        <motion.span
                            className="block h-fit"
                            initial={{ y: 0 }}
                            animate={isHovered ? { y: '-100%' } : { y: 0 }}
                            transition={{
                                duration: DURATION,
                                ease: 'easeInOut',
                                delay,
                            }}
                        >
                            {char}
                        </motion.span>
                        <motion.span
                            className="absolute inset-0 block h-fit"
                            initial={{ y: '100%' }}
                            animate={isHovered ? { y: 0 } : { y: '100%' }}
                            transition={{
                                duration: DURATION,
                                ease: 'easeInOut',
                                delay,
                            }}
                            aria-hidden
                        >
                            {char}
                        </motion.span>
                    </span>
                );
            })}
        </span>
    );
}

export default function AppLogo() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="rounded-sm border-2 border-foreground px-3 py-2"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <span className="flex h-min text-lg font-bold uppercase md:hidden">
                <RevealLink isHovered={isHovered}>Á</RevealLink>
            </span>
            <span className="hidden h-min text-lg font-bold uppercase md:flex">
                <RevealLink isHovered={isHovered}>ÁGORA</RevealLink>
            </span>
        </div>
    );
}
