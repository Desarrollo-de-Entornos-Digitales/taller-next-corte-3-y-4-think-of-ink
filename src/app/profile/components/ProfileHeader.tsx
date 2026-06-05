'use client';

import { UserProfile } from '@/lib/types';

interface ProfileHeaderProps {
    profile: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    return (
        <div className="bg-white p-8 border-b border-gray-100">
            <div className="max-w-3xl mx-auto flex items-center gap-8">
                {/* Avatar Grande */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-[#E5D9F2] flex items-center justify-center text-5xl font-bold text-[#6000FF] border-4 border-white shadow-lg">
                        {profile.username.charAt(0).toUpperCase()}
                    </div>
                </div>

                {/* Información de Perfil */}
                <div className="flex-1">
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        {profile.username}
                    </h1>
                    <p className="text-lg text-gray-600 font-medium mb-3">
                        {profile.profession || 'Creador Digital'}
                    </p>
                    <p className="text-sm font-bold text-gray-500">
                        {profile.totalPosts} {profile.totalPosts === 1 ? 'publicación' : 'publicaciones'}
                    </p>
                </div>
            </div>
        </div>
    );
};
