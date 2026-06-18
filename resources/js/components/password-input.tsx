import { Button, Input } from '@heroui/react';
import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function PasswordInput({
    className,
    ref,
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & { ref?: Ref<HTMLInputElement> }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative w-full">
            <Input
                type={showPassword ? 'text' : 'password'}
                className={cn('w-full pr-10', className)}
                ref={ref}
                {...props}
            />
            <Button
                onPress={() => setShowPassword((prev) => !prev)}
                className="focus:ring-primary data-[state=open]:bg-secondary absolute inset-y-0 right-0 flex items-center rounded-r-md px-3 backdrop-blur-sm hover:text-foreground focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:pointer-events-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
                {showPassword ? (
                    <EyeOff className="size-4" />
                ) : (
                    <Eye className="size-4" />
                )}
            </Button>
        </div>
    );
}
