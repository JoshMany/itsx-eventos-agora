import { Dropdown, Label } from '@heroui/react';
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
            <Dropdown.Section>
                <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UserInfo user={user} showEmail={true} />
                </div>
            </Dropdown.Section>
            <Dropdown.Section>
                <Dropdown.Item
                    key="settings"
                    textValue="Settings"
                    onAction={() => {
                        cleanup();
                        router.visit(edit().url);
                    }}
                >
                    <Settings className="mr-2" />
                    <Label>Settings</Label>
                </Dropdown.Item>
            </Dropdown.Section>
            <Dropdown.Section>
                <Dropdown.Item
                    key="logout"
                    textValue="Log out"
                    onAction={handleLogout}
                    variant="danger"
                >
                    <LogOut className="mr-2" />
                    <Label>Log out</Label>
                </Dropdown.Item>
            </Dropdown.Section>
        </>
    );
}
