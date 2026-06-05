'use client';

import { ChevronRight, Lock, LogOut } from 'lucide-react';

interface AccountOptionProps {
    icon: 'lock' | 'logout';
    title: string;
    description: string;
    isDestructive?: boolean;
    onClick: () => void;
}

export const AccountOption = ({
    icon,
    title,
    description,
    isDestructive = false,
    onClick,
}: AccountOptionProps) => {
    const getIcon = () => {
        if (icon === 'lock') return <Lock size={20} />;
        if (icon === 'logout') return <LogOut size={20} />;
    };

    return (
        <button
            onClick={onClick}
            className={`flex items-center gap-4 p-4 rounded-md border-2 transition-colors hover:border-black ${
                isDestructive
                    ? 'border-red-200 hover:bg-red-50'
                    : 'border-[#D9D9D9] hover:bg-gray-50'
            }`}
        >
            <div
                className={`flex-shrink-0 ${
                    isDestructive ? 'text-red-500' : 'text-[#474747]'
                }`}
            >
                {getIcon()}
            </div>

            <div className="flex-1 text-left">
                <p
                    className={`text-sm font-bold ${
                        isDestructive ? 'text-red-600' : 'text-black'
                    }`}
                >
                    {title}
                </p>
                <p className="text-xs text-[#474747] font-medium">{description}</p>
            </div>

            <ChevronRight
                size={20}
                className={isDestructive ? 'text-red-500' : 'text-[#D9D9D9]'}
            />
        </button>
    );
};
