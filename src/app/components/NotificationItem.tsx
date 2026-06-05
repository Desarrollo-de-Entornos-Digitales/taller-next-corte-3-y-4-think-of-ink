'use client';

import { Notification } from '@/lib/types';

interface NotificationItemProps {
    notification: Notification;
}

function timeAgo(date: Date): string {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
    if (seconds < 60) return 'Ahora';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `Hace ${minutes} min`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `Hace ${days} día${days > 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    return `Hace ${months} mes${months > 1 ? 'es' : ''}`;
}

export const NotificationItem = ({ notification }: NotificationItemProps) => {
    return (
        <div className={`flex items-start gap-3 px-4 py-3 transition-colors hover:bg-gray-50 ${!notification.read ? 'bg-purple-50/40' : ''}`}>
            <div className="w-8 h-8 rounded-full bg-[#E5D9F2] flex items-center justify-center text-sm font-black text-[#6000FF] flex-shrink-0 mt-0.5">
                {notification.avatar}
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-sm text-black leading-relaxed">
                    <span className="font-bold">{notification.username}</span>
                    {' '}{notification.action}
                    {notification.target && (
                        <span className="font-medium"> {notification.target}</span>
                    )}
                </p>
                <p className="text-xs text-[#474747] font-medium mt-1">
                    {timeAgo(notification.time)}
                </p>
            </div>
            {!notification.read && (
                <div className="w-2 h-2 rounded-full bg-[#6000FF] flex-shrink-0 mt-2" />
            )}
        </div>
    );
};
