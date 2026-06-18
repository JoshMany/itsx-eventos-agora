import { Dropdown } from '@heroui/react';
import { usePage } from '@inertiajs/react';
import { ChevronsUpDown } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { UserInfo } from '@/components/user-info';
import { UserMenuContent } from '@/components/user-menu-content';
import { useIsMobile } from '@/hooks/use-mobile';

export function NavUser() {
    const { auth } = usePage().props;
    const { state } = useSidebar();
    const isMobile = useIsMobile();

    if (!auth.user) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <Dropdown>
                    <Dropdown.Trigger>
                        <SidebarMenuButton
                            size="lg"
                            className="group text-sidebar-accent-foreground data-[state=open]:bg-sidebar-accent"
                            data-test="sidebar-menu-button"
                        >
                            <UserInfo user={auth.user} />
                            <ChevronsUpDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                    </Dropdown.Trigger>
                    <Dropdown.Popover
                        placement={
                            isMobile
                                ? 'bottom'
                                : state === 'collapsed'
                                  ? 'left'
                                  : 'bottom'
                        }
                    >
                        <Dropdown.Menu className="min-w-56">
                            <UserMenuContent user={auth.user} />
                        </Dropdown.Menu>
                    </Dropdown.Popover>
                </Dropdown>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
