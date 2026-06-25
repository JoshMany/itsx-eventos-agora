import { usePage, router } from '@inertiajs/react';
import { ChevronsUpDown, LogOut, Moon, Sun } from 'lucide-react';
import {
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { useAppearance } from '@/hooks/use-appearance';
import { useIsDark } from '@/hooks/use-is-dark';

export function NavUser() {
    const { auth } = usePage().props;
    const { isMobile } = useSidebar();
    const { updateAppearance } = useAppearance();
    const isDark = useIsDark();

    if (!auth.user) {
        return null;
    }

    return (
        <SidebarMenu>
            <SidebarMenuItem>
                <DropdownMenu>
                    <DropdownMenuTrigger
                        render={
                            <SidebarMenuButton
                                size="lg"
                                className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                            />
                        }
                    >
                        <Avatar className="h-8 w-8 rounded-lg">
                            <AvatarImage
                                src={auth.user.avatar}
                                alt={auth.user.name}
                            />
                            <AvatarFallback className="rounded-lg">
                                {auth.user.name
                                    .split(' ', 2)
                                    .map((word) => word.charAt(0))}
                            </AvatarFallback>
                        </Avatar>
                        <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">
                                {auth.user.name}
                            </span>
                            <span className="truncate text-xs">
                                {auth.user.email}
                            </span>
                        </div>
                        <ChevronsUpDown className="ml-auto size-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                        side={isMobile ? 'bottom' : 'right'}
                        align="end"
                        sideOffset={4}
                    >
                        <DropdownMenuGroup>
                            <DropdownMenuItem
                                onClick={() =>
                                    updateAppearance(isDark ? 'light' : 'dark')
                                }
                            >
                                <span className="relative flex h-5 w-5 items-center justify-center">
                                    <Sun
                                        size={18}
                                        className={`absolute transition-all duration-300 ${isDark ? 'scale-0 rotate-90 opacity-0' : 'scale-100 rotate-0 opacity-100'}`}
                                    />
                                    <Moon
                                        size={18}
                                        className={`absolute transition-all duration-300 ${isDark ? 'scale-100 rotate-0 opacity-100' : 'scale-0 -rotate-90 opacity-0'}`}
                                    />
                                </span>
                                Switch theme
                            </DropdownMenuItem>
                        </DropdownMenuGroup>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                            onClick={() => router.post('/logout')}
                            className="hover:bg-danger"
                        >
                            <LogOut />
                            Log out
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </SidebarMenuItem>
        </SidebarMenu>
    );
}
