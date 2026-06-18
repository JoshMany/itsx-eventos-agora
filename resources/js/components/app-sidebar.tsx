import { Link } from "@inertiajs/react";
import { LayoutGrid } from "lucide-react";
import AppLogo from "@/components/app-logo";
import { NavUser } from "@/components/nav-user";
import type { NavItem } from "@/types";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";

const mainNavItems: NavItem[] = [
    { title: "Dashboard", href: "/admin", icon: LayoutGrid },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/admin" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent />
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}