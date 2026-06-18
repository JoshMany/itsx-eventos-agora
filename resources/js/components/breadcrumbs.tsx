import { Breadcrumbs as HeroBreadcrumbs, BreadcrumbsItem } from '@heroui/react';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

export function Breadcrumbs({
    breadcrumbs,
}: {
    breadcrumbs: BreadcrumbItemType[];
}) {
    return (
        <>
            {breadcrumbs.length > 0 && (
                <HeroBreadcrumbs>
                    {breadcrumbs.map((item, index) => {
                        const isLast = index === breadcrumbs.length - 1;

                        return (
                            <BreadcrumbsItem
                                key={index}
                                href={isLast ? undefined : String(item.href)}
                            >
                                {item.title}
                            </BreadcrumbsItem>
                        );
                    })}
                </HeroBreadcrumbs>
            )}
        </>
    );
}
