'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface SidebarProps {
    onNewPostClick?: () => void;
}

export const Sidebar = ({ onNewPostClick }: SidebarProps) => {
    const pathname = usePathname();

    const isActive = (href: string) => {
        return pathname === href || pathname?.startsWith(href);
    };

    const getLinkClass = (href: string, isButton = false) => {
        const baseClass =
            'px-4 py-3 text-sm font-bold rounded-md transition-colors';

        if (href === '#' || isButton) {
            return `${baseClass} text-gray-600 hover:bg-gray-50 cursor-pointer`;
        }

        if (isActive(href)) {
            return `${baseClass} bg-[#ECECEC] text-black`;
        }

        return `${baseClass} text-gray-600 hover:bg-gray-50`;
    };

    const handleNewPostClick = () => {
        if (onNewPostClick) {
            onNewPostClick();
        }
    };

    return (
        <aside className="w-64 p-6 border-r border-gray-100 flex flex-col gap-4 h-[calc(100vh-5rem)] sticky top-20 overflow-y-auto">
            <button
                onClick={handleNewPostClick}
                className="w-full bg-[#4A4A4A] text-white py-3 rounded-md font-bold text-sm mb-4 hover:bg-black transition-colors"
            >
                Nueva publicación
            </button>

            <div className="flex flex-col gap-1">
                <Link href="/feed" className={getLinkClass('/feed')}>
                    Inicio
                </Link>

                <Link
                    href="/profile/my-posts"
                    className={getLinkClass('/profile/my-posts')}
                >
                    Mis publicaciones
                </Link>

                <Link
                    href="/profile/settings"
                    className={getLinkClass('/profile/settings')}
                >
                    Mi Perfil
                </Link>
            </div>

            <div className="mt-auto border-t border-gray-100 pt-6">
                <h3 className="font-bold text-lg mb-4">Filtros</h3>

                <div className="flex flex-col gap-4 text-sm font-bold text-gray-600">
                    <button className="text-left hover:text-black">
                        Ubicación
                    </button>

                    <Link
                        href="/categories"
                        className={getLinkClass('/categories')}
                    >
                        Categorías
                    </Link>

                    <button className="text-left hover:text-black">
                        Rango de precio
                    </button>
                </div>
            </div>
        </aside>
    );
};