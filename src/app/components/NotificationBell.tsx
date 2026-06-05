'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import { Notification } from '@/lib/types';
import { NotificationDropdown } from './NotificationDropdown';

const MOCK_NOTIFICATIONS: Notification[] = [
    {
        id: '1',
        username: 'Ana López',
        action: 'comentó tu publicación.',
        avatar: 'A',
        time: new Date(Date.now() - 5 * 60 * 1000),
        read: false,
    },
    {
        id: '2',
        username: 'Black Ink Studio',
        action: 'comenzó a seguirte.',
        avatar: 'B',
        time: new Date(Date.now() - 2 * 60 * 60 * 1000),
        read: false,
    },
    {
        id: '3',
        username: '',
        action: 'Tu publicación recibió',
        target: '15 likes.',
        avatar: '❤',
        time: new Date(Date.now() - 5 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: '4',
        username: 'Sofía Toro',
        action: 'respondió tu comentario.',
        avatar: 'S',
        time: new Date(Date.now() - 24 * 60 * 60 * 1000),
        read: true,
    },
    {
        id: '5',
        username: 'Ink Master',
        action: 'publicó un nuevo tatuaje.',
        avatar: 'I',
        time: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        read: true,
    },
];

export const NotificationBell = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div ref={dropdownRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative text-[#474747] hover:text-black transition-colors"
                title="Notificaciones"
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-[#6000FF] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <NotificationDropdown notifications={MOCK_NOTIFICATIONS} />
            )}
        </div>
    );
};
