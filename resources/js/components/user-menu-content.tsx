import {
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';
import { router } from '@inertiajs/react';
import { LogOut, Settings } from 'lucide-react';
import { UserInfo } from '@/components/user-info';
import { useMobileNavigation } from '@/hooks/use-mobile-navigation';
import { logout } from '@/routes';
import { edit } from '@/routes/profile';
import type { User } from '@/types';

type Props = {
    user: User;
};

export function UserMenuContent({ user }: Props) {
    const cleanup = useMobileNavigation();

    const handleLogout = () => {
        cleanup();
        router.flushAll();
        router.visit(logout().url);
    };

    return (
        <>
            <DropdownMenuGroup>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
                <DropdownMenuItem
                    onClick={() => {
                        cleanup();
                        router.visit(edit().url);
                    }}
                >
                    <Settings className="mr-2" />
                    <DropdownMenuLabel>Settings</DropdownMenuLabel>
                </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={handleLogout} variant="destructive">
                    <LogOut className="mr-2" />
                    <DropdownMenuLabel>Log out</DropdownMenuLabel>
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </>
    );
}
