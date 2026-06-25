import { router, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Calendar,
    Users,
    Award,
    ClipboardList,
    Handshake,
    DollarSign,
    BarChart3,
    Settings,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Landmark,
} from 'lucide-react';
import { useState } from 'react';
import { home } from '@/routes';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger,
} from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/app-sidebar';
import { Separator } from '@/components/ui/separator';
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

type NavGroup = {
    label: string;
    items: {
        label: string;
        href: string;
        icon: React.ElementType;
        badge?: number;
    }[];
};

export default function AdminLayout({
    children,
    header,
}: {
    children: React.ReactNode;
    header?: string;
}) {
    const { props } = usePage();
    const [collapsed, setCollapsed] = useState(false);
    const [collapsedGroups, setCollapsedGroups] = useState<
        Record<string, boolean>
    >({});

    const toggleGroup = (label: string) =>
        setCollapsedGroups((prev) => ({ ...prev, [label]: !prev[label] }));

    const navGroups: NavGroup[] = [
        {
            label: 'Principal',
            items: [
                { label: 'Dashboard', href: '/admin', icon: LayoutGrid },
                { label: 'Eventos', href: '/admin/events', icon: Calendar },
                {
                    label: 'Participantes',
                    href: '/admin/participants',
                    icon: Users,
                },
            ],
        },
        {
            label: 'Operaciones',
            items: [
                {
                    label: 'Constancias',
                    href: '/admin/certificates',
                    icon: Award,
                },
                {
                    label: 'Encuestas',
                    href: '/admin/surveys',
                    icon: ClipboardList,
                },
            ],
        },
        {
            label: 'Finanzas',
            items: [
                {
                    label: 'Patrocinadores',
                    href: '/admin/sponsors',
                    icon: Handshake,
                },
                {
                    label: 'Presupuestos',
                    href: '/admin/budgets',
                    icon: DollarSign,
                },
            ],
        },
        {
            label: 'Sistema',
            items: [
                { label: 'Reportes', href: '/admin/reports', icon: BarChart3 },
                {
                    label: 'Administracion',
                    href: '/admin/administration',
                    icon: Settings,
                },
            ],
        },
    ];

    const handleLogout = () => {
        router.post('/logout');
    };

    return (
        <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-990">
            {/* Sidebar */}
            {/* <aside
                className={`flex flex-col border-r border-gray-200 bg-white transition-all duration-200 dark:border-gray-800 dark:bg-gray-900 ${collapsed ? 'w-16' : 'w-60'}`}
            >
                <div className="flex h-14 items-center gap-3 border-b border-gray-200 px-3 dark:border-gray-800">
                    <Link href={home()} className="flex items-center gap-2">
                        <Landmark className="size-7 shrink-0 fill-[#001e38] dark:fill-[#dcc355]" />
                        {!collapsed && (
                            <span className="text-sm font-semibold text-[#001e38] dark:text-[#dcc355]">
                                AGORA
                            </span>
                        )}
                    </Link>
                    <Button
                        onClick={() => setCollapsed(!collapsed)}
                        variant="default"
                        size="icon"
                        className={`z-10 m-0 p-0`}
                    >
                        {collapsed ? (
                            <ChevronRight size={16} />
                        ) : (
                            <ChevronLeft size={16} />
                        )}
                    </Button>
                </div>
                <nav className="flex-1 space-y-4 overflow-y-auto px-2 py-3">
                    {navGroups.map((group) => (
                        <div key={group.label}>
                            {!collapsed && (
                                <button
                                    onClick={() => toggleGroup(group.label)}
                                    className="mb-1 flex w-full items-center gap-1 px-2 text-[10px] font-semibold tracking-widest text-gray-400 uppercase dark:text-gray-500"
                                >
                                    {group.label}
                                    <ChevronDown
                                        size={10}
                                        className={
                                            collapsedGroups[group.label]
                                                ? '-rotate-90'
                                                : ''
                                        }
                                    />
                                </button>
                            )}
                            <div
                                className={
                                    collapsedGroups[group.label] && !collapsed
                                        ? 'hidden'
                                        : ''
                                }
                            >
                                {group.items.map((item) => {
                                    const href = item.badge
                                        ? item.href.split('?')[0]
                                        : item.href;
                                    const active =
                                        href === '/admin'
                                            ? window.location.pathname ===
                                              '/admin'
                                            : window.location.pathname.startsWith(
                                                  href,
                                              );

                                    return (
                                        <Link
                                            key={item.href}
                                            href={item.href}
                                            className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${active ? 'bg-[#001e38] text-white dark:bg-[#dcc355] dark:text-black' : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'}`}
                                        >
                                            <item.icon size={18} />
                                            {!collapsed && (
                                                <span className="flex-1 truncate">
                                                    {item.label}
                                                </span>
                                            )}
                                            {!collapsed && item.badge && (
                                                <span className="ml-auto rounded-full bg-red-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
                                                    {item.badge}
                                                </span>
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </nav>
                <div className="border-t border-gray-200 p-3 dark:border-gray-800">
                    <Dropdown>
                        <Tooltip delay={0} isDisabled={!collapsed}>
                            <Tooltip.Trigger className="w-full cursor-pointer rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                <Dropdown.Trigger className="flex w-full items-center gap-2">
                                    <Avatar>
                                        <Avatar.Image
                                            src={
                                                (props.auth?.user as any)
                                                    ?.avatar_url
                                            }
                                            alt="User Avatar"
                                        />
                                        <Avatar.Fallback delayMs={600}>
                                            {(props.auth?.user as any)
                                                ?.name?.[0] ?? 'U'}
                                        </Avatar.Fallback>
                                    </Avatar>
                                    {!collapsed && (
                                        <span className="ml-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {(props.auth?.user as any)?.name ??
                                                'Usuario'}
                                        </span>
                                    )}
                                </Dropdown.Trigger>
                            </Tooltip.Trigger>
                            <Tooltip.Content showArrow placement="left">
                                <p>
                                    {(props.auth?.user as any)?.name ?? 'User'}
                                </p>
                            </Tooltip.Content>
                        </Tooltip>
                        <Dropdown.Popover>
                            <Dropdown.Menu
                                selectionMode="none"
                                onAction={(key) => {
                                    if (key === 'logout') {
                                        handleLogout();
                                    }
                                }}
                            >
                                <Dropdown.Item
                                    id="logout"
                                    textValue="Cerrar Sesión"
                                >
                                    <Label className="text-danger">
                                        Cerrar Sesión
                                    </Label>
                                </Dropdown.Item>
                            </Dropdown.Menu>
                        </Dropdown.Popover>
                    </Dropdown>
                </div>
            </aside> */}

            {/* Content */}
            {/* <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
                {header && (
                    <div className="border-b border-gray-200 bg-white px-6 py-3 dark:border-gray-800 dark:bg-gray-900">
                        <h1 className="text-lg font-semibold">{header}</h1>
                    </div>
                )}
                <div className="flex-1 overflow-y-auto p-6">{children}</div>
            </main> */}

            <SidebarProvider>
                <AppSidebar />
                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
                        <div className="flex items-center gap-2 px-4">
                            <SidebarTrigger className="-ml-1" />
                            <Separator
                                orientation="vertical"
                                className="mr-2 data-[orientation=vertical]:h-4"
                            />
                            <Breadcrumb>
                                <BreadcrumbList>
                                    <BreadcrumbItem className="hidden md:block">
                                        <BreadcrumbLink href="#">
                                            Build Your Application
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator className="hidden md:block" />
                                    <BreadcrumbItem>
                                        <BreadcrumbPage>
                                            Data Fetching
                                        </BreadcrumbPage>
                                    </BreadcrumbItem>
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>
                    </header>
                    <div className="flex flex-1 flex-col gap-4 overflow-auto p-4 pt-0">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </div>
    );
}
