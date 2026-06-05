'use client';

import Link from 'next/link';

interface CategorySectionProps {
    title: string;
    children: React.ReactNode;
    seeAllHref?: string;
}

export const CategorySection = ({ title, children, seeAllHref }: CategorySectionProps) => {
    return (
        <section>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-black text-black tracking-tight">{title}</h2>
                {seeAllHref && (
                    <Link
                        href={seeAllHref}
                        className="text-sm font-bold text-[#474747] hover:text-black transition-colors"
                    >
                        Ver todo
                    </Link>
                )}
            </div>
            {children}
        </section>
    );
};
