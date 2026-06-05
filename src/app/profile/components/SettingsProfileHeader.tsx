'use client';

import { UserProfile } from '@/lib/types';
import { Edit2 } from 'lucide-react';

interface SettingsProfileHeaderProps {
    profile: UserProfile;
    onAvatarChange?: () => void;
}

export const SettingsProfileHeader = ({
    profile,
    onAvatarChange,
}: SettingsProfileHeaderProps) => {
    return (
        <div className="border border-[#D9D9D9] rounded-lg p-8 bg-white">
            <div className="flex items-center gap-8">
                {/* Avatar con botón */}
                <div className="relative flex-shrink-0">
                    <div className="w-40 h-40 rounded-full bg-[#E5D9F2] flex items-center justify-center text-6xl font-black text-[#6000FF] border-4 border-white">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>

                    <button
                        onClick={onAvatarChange}
                        className="absolute bottom-2 right-2 bg-[#6000FF] text-white rounded-full p-2 hover:bg-[#5000DD] transition-colors shadow-md"
                        title="Cambiar foto de perfil"
                    >
                        <Edit2 size={16} />
                    </button>
                </div>

                {/* Información */}
                <div className="flex-1">
                    <h1 className="text-3xl font-black tracking-tight text-black mb-2">
                        {profile.username}
                    </h1>
                    <p className="text-lg text-[#474747] font-medium mb-4">
                        {profile.profession || 'Creador Digital'}
                    </p>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#474747]">
                        <div className="w-4 h-4 border-2 border-[#D9D9D9] rounded-sm flex items-center justify-center">
                            <span className="text-xs">📋</span>
                        </div>
                        <span>
                            {profile.totalPosts}{' '}
                            {profile.totalPosts === 1
                                ? 'publicación'
                                : 'publicaciones'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};
