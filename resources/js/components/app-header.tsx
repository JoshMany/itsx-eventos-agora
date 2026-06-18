import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Folder, LayoutGrid, Menu, Search } from 'lucide-react';
import { useState } from 'react';
import AppLogo from '@/components/app-logo';
import AppLogoIcon from '@/components/app-logo-icon';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { UserMenuContent } from '@/components/user-menu-content';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { useInitials } from '@/hooks/use-initials';
import { cn, toUrl } from '@/lib/utils';
import { dashboard } from '@/routes';
import type { BreadcrumbItem, NavItem } from '@/types';
import { Avatar, Button, Dropdown } from '@heroui/react';

type Props = {
    breadcrumbs?: BreadcrumbItem[];
};

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
];

const rightNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

const activeItemStyles =
    'text-neutral-900 dark:bg-neutral-800 dark:text-neutral-100';

export function AppHeader({ breadcrumbs = [] }: Props) {
    const page = usePage();
    const { auth } = page.props;
    const getInitials = useInitials();
    const { isCurrentUrl, whenCurrentUrl } = useCurrentUrl();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    return (
        <>
            <div className="border-b border-sidebar-border/80">
                <div className="mx-auto flex h-16 items-center px-4 md:max-w-7xl">
                    {/* Mobile Menu */}
                    <div className="lg:hidden">
                        <Button
                            variant="ghost"
                            isIconOnly
                            className="mr-2 h-[34px] w-[34px]"
                            onPress={() => setIsDrawerOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        {isDrawerOpen && (
                            <>
                                <div
                                    className="fixed inset-0 z-50 bg-black/50"
                                    onClick={() => setIsDrawerOpen(false)}
                                />
                                <div className="fixed inset-y-0 left-0 z-50 flex h-full w-64 flex-col bg-sidebar shadow-lg">
                                    <div className="flex justify-start p-4 text-left">
                                        <AppLogoIcon className="h-6 w-6 fill-current text-black dark:text-white" />
                                    </div>
                                    <div className="flex h-full flex-1 flex-col space-y-4 p-4">
                                        <div className="flex h-full flex-col justify-between text-sm">
                                            <div className="flex flex-col space-y-4">
                                                {mainNavItems.map((item) => (
                                                    <Link
                                                        key={item.title}
                                                        href={item.href}
                                                        className="flex items-center space-x-2 font-medium"
                                                        onClick={() =>
                                                            setIsDrawerOpen(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-5 w-5" />
                                                        )}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </Link>
                                                ))}
                                            </div>

                                            <div className="flex flex-col space-y-4">
                                                {rightNavItems.map((item) => (
                                                    <a
                                                        key={item.title}
                                                        href={toUrl(item.href)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="flex items-center space-x-2 font-medium"
                                                    >
                                                        {item.icon && (
                                                            <item.icon className="h-5 w-5" />
                                                        )}
                                                        <span>
                                                            {item.title}
                                                        </span>
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <Link
                        href={dashboard()}
                        prefetch
                        className="flex items-center space-x-2"
                    >
                        <AppLogo />
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="ml-6 hidden h-full items-center space-x-6 lg:flex">
                        <nav className="flex h-full items-stretch">
                            <ul className="flex h-full items-stretch space-x-2">
                                {mainNavItems.map((item, index) => (
                                    <li
                                        key={index}
                                        className="relative flex h-full items-center"
                                    >
                                        <Link
                                            href={item.href}
                                            className={cn(
                                                'inline-flex h-9 items-center justify-center rounded-md bg-transparent px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground',
                                                whenCurrentUrl(
                                                    item.href,
                                                    activeItemStyles,
                                                ),
                                                'h-9 cursor-pointer px-3',
                                            )}
                                        >
                                            {item.icon && (
                                                <item.icon className="mr-2 h-4 w-4" />
                                            )}
                                            {item.title}
                                        </Link>
                                        {isCurrentUrl(item.href) && (
                                            <div className="absolute bottom-0 left-0 h-0.5 w-full translate-y-px bg-black dark:bg-white"></div>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>

                    <div className="ml-auto flex items-center space-x-2">
                        <div className="relative flex items-center space-x-1">
                            <Button
                                variant="ghost"
                                isIconOnly
                                className="group h-9 w-9 cursor-pointer"
                            >
                                <Search className="!size-5 opacity-80 group-hover:opacity-100" />
                            </Button>
                            <div className="ml-1 hidden gap-1 lg:flex">
                                {rightNavItems.map((item) => (
                                    <a
                                        key={item.title}
                                        href={toUrl(item.href)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        title={item.title}
                                        className="group inline-flex h-9 w-9 items-center justify-center rounded-md bg-transparent p-0 text-sm font-medium text-accent-foreground ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50"
                                    >
                                        <span className="sr-only">
                                            {item.title}
                                        </span>
                                        {item.icon && (
                                            <item.icon className="size-5 opacity-80 group-hover:opacity-100" />
                                        )}
                                    </a>
                                ))}
                            </div>
                        </div>
                        <Dropdown>
                            <Dropdown.Trigger>
                                <Button
                                    variant="ghost"
                                    className="size-10 rounded-full p-1"
                                >
                                    <Avatar className="size-8 overflow-hidden rounded-full">
                                        <Avatar.Image
                                            src={auth.user?.avatar}
                                            alt={auth.user?.name}
                                        />
                                        <Avatar.Fallback className="rounded-lg bg-neutral-200 text-black dark:bg-neutral-700 dark:text-white">
                                            {getInitials(auth.user?.name ?? '')}
                                        </Avatar.Fallback>
                                    </Avatar>
                                </Button>
                            </Dropdown.Trigger>
                            <Dropdown.Popover>
                                <Dropdown.Menu>
                                    {auth.user && (
                                        <UserMenuContent user={auth.user} />
                                    )}
                                </Dropdown.Menu>
                            </Dropdown.Popover>
                        </Dropdown>
                    </div>
                </div>
            </div>
            {breadcrumbs.length > 1 && (
                <div className="flex w-full border-b border-sidebar-border/70">
                    <div className="mx-auto flex h-12 w-full items-center justify-start px-4 text-neutral-500 md:max-w-7xl">
                        <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                </div>
            )}
        </>
    );
}
