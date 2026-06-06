'use client';

import { useRef } from 'react';
import { UserProfile } from '@/lib/types';
import { Edit2 } from 'lucide-react';

interface SettingsProfileHeaderProps {
    profile: UserProfile;
    avatarPreview?: string;
    onAvatarChange: (file: File) => void;
    onAvatarClick?: () => void;
}

export const SettingsProfileHeader = ({
    profile,
    avatarPreview,
    onAvatarChange,
}: SettingsProfileHeaderProps) => {
    const fileRef = useRef<HTMLInputElement>(null);

    const handleClick = () => {
        fileRef.current?.click();
    };

    const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onAvatarChange(file);
        e.target.value = '';
    };

    const avatarSrc = avatarPreview || profile.avatar;

    return (
        <div className="border border-[#D9D9D9] rounded-lg p-8 bg-white">
            <div className="flex items-center gap-8">
                <div className="relative flex-shrink-0">
                    {avatarSrc ? (
                        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-white">
                            <img src={avatarSrc} alt={profile.username} className="w-full h-full object-cover" />
                        </div>
                    ) : (
                        <div className="w-40 h-40 rounded-full bg-[#E5D9F2] flex items-center justify-center text-6xl font-black text-[#6000FF] border-4 border-white">
                            {profile.username.charAt(0).toUpperCase()}
                        </div>
                    )}

                    <button
                        onClick={handleClick}
                        className="absolute bottom-2 right-2 bg-[#6000FF] text-white rounded-full p-2 hover:bg-[#5000DD] transition-colors shadow-md"
                        title="Cambiar foto de perfil"
                    >
                        <Edit2 size={16} />
                    </button>

                    <input
                        ref={fileRef}
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        className="hidden"
                        onChange={handleFile}
                    />
                </div>

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
