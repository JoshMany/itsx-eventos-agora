'use client';
import {
    Award,
    BarChart3,
    CalendarDays,
    ClipboardList,
    LayoutDashboard,
    Shield,
    Users,
} from 'lucide-react';

import * as React from 'react';

import AppLogo from '@/components/AppLogo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
} from '@/components/ui/sidebar';

const data = {
    navMain: [
        {
            title: 'Dashboard',
            url: '/admin',
            icon: LayoutDashboard,
        },
        {
            title: 'Eventos',
            url: '/admin/events',
            icon: CalendarDays,
        },
        {
            title: 'Participantes',
            url: '/admin/participants',
            icon: Users,
        },
        {
            title: 'Constancias',
            url: '/admin/certificates',
            icon: Award,
        },
        {
            title: 'Encuestas',
            url: '/admin/surveys',
            icon: ClipboardList,
        },
        {
            title: 'Reportes',
            url: '/admin/reports',
            icon: BarChart3,
        },
        {
            title: 'Administración',
            url: '/admin/administration',
            icon: Shield,
            items: [
                {
                    title: 'Usuarios',
                    url: '/admin/administration/users',
                },
                {
                    title: 'Roles',
                    url: '/admin/administration/roles',
                },
                {
                    title: 'Catálogos',
                    url: '/admin/administration/catalogs',
                },
                {
                    title: 'Auditoría',
                    url: '/admin/administration/audit',
                },
            ],
        },
    ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            size="lg"
                            className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                        >
                            <AppLogo />
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={data.navMain} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}
