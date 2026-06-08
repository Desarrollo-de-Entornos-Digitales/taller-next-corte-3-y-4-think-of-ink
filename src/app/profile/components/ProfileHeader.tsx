'use client';

import { UserProfile } from '@/lib/types';
import { useUser } from '@/app/context/UserContext';

interface ProfileHeaderProps {
    profile?: UserProfile;
}

export const ProfileHeader = ({ profile }: ProfileHeaderProps) => {
    const { user } = useUser();
    const displayProfile = profile || user;

    if (!displayProfile) return null;

    return (
        <div className="bg-white p-8 border-b border-gray-100">
            <div className="max-w-3xl mx-auto flex items-center gap-8">
                {/* Avatar Grande */}
                <div className="flex-shrink-0">
                    <div className="w-32 h-32 rounded-full bg-[#E5D9F2] flex items-center justify-center text-5xl font-bold text-[#6000FF] border-4 border-white shadow-lg overflow-hidden">
                        {displayProfile.avatar ? (
                            <img src={displayProfile.avatar} alt={displayProfile.username} className="w-full h-full object-cover" />
                        ) : (
                            displayProfile.username.charAt(0).toUpperCase()
                        )}
                    </div>
                </div>

                {/* Información de Perfil */}
                <div className="flex-1">
                    <h1 className="text-3xl font-black tracking-tight mb-2">
                        {displayProfile.username}
                    </h1>
                    <p className="text-lg text-gray-600 font-medium mb-3">
                        {displayProfile.profession || 'Creador Digital'}
                    </p>
                    <p className="text-sm font-bold text-gray-500">
                        {displayProfile.totalPosts} {displayProfile.totalPosts === 1 ? 'publicación' : 'publicaciones'}
                    </p>
                </div>
            </div>
        </div>
    );
};
