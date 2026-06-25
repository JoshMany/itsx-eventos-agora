import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
                onClick={() => setShowPassword((prev) => !prev)}
                variant="ghost"
                size="icon"
                className="absolute inset-y-0 right-0 h-full rounded-l-none"
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
