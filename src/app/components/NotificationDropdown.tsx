'use client';

import { Notification } from '@/lib/types';
import { NotificationItem } from './NotificationItem';
import { Bell } from 'lucide-react';

interface NotificationDropdownProps {
    notifications: Notification[];
}

export const NotificationDropdown = ({ notifications }: NotificationDropdownProps) => {
    return (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-[#D9D9D9] rounded-lg py-2 z-50">
            <div className="px-4 py-2 border-b border-[#D9D9D9]">
                <h3 className="text-sm font-black text-black">Notificaciones</h3>
            </div>

            <div className="max-h-80 overflow-y-auto">
                {notifications.length > 0 ? (
                    notifications.map((notification) => (
                        <NotificationItem
                            key={notification.id}
                            notification={notification}
                        />
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-10 px-4">
                        <Bell size={24} className="text-[#D9D9D9] mb-3" />
                        <p className="text-sm font-bold text-[#474747]">
                            No tienes notificaciones nuevas
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};
