'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '@/lib/types';
import { getUserProfile } from '@/lib/api/users';
import { resolveImageUrl } from '@/lib/utils';

interface UserContextType {
    user: UserProfile | null;
    loading: boolean;
    refreshUser: () => Promise<void>;
    updateAvatar: (avatarUrl: string) => void;
    updateProfile: (profile: Partial<UserProfile>) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        try {
            const data = await getUserProfile(token);
            const p = data.user || data.data || data;
            const profile: UserProfile = {
                id: p.id || '',
                name: p.name || p.username || '',
                username: p.username || 'Usuario',
                email: p.email || '',
                profession: p.profession || '',
                bio: p.bio || '',
                location: p.location || '',
                avatar: p.avatar || '',
                website: p.website || '',
                linkedin: p.linkedin || '',
                behance: p.behance || '',
                instagram: p.instagram || '',
                portfolio: p.portfolio || '',
                totalPosts: p.totalPosts ?? p._count?.posts ?? 0,
            };
            setUser(profile);
            localStorage.setItem('user', JSON.stringify(profile));
            localStorage.setItem('username', profile.username);
            if (profile.location) localStorage.setItem('location', profile.location);
            if (profile.profession) localStorage.setItem('profession', profile.profession);
        } catch (err) {
            console.error('Error fetching user profile:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    const refreshUser = async () => {
        setLoading(true);
        await fetchUser();
    };

    const updateAvatar = (avatarUrl: string) => {
        const resolvedUrl = resolveImageUrl(avatarUrl);
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, avatar: resolvedUrl };
            localStorage.setItem('user', JSON.stringify(updated));
            return updated;
        });
    };

    const updateProfile = (profile: Partial<UserProfile>) => {
        setUser((prev) => {
            if (!prev) return prev;
            const updated = { ...prev, ...profile };
            localStorage.setItem('user', JSON.stringify(updated));
            if (profile.username) localStorage.setItem('username', profile.username);
            if (profile.location) localStorage.setItem('location', profile.location);
            if (profile.profession) localStorage.setItem('profession', profile.profession);
            return updated;
        });
    };

    return (
        <UserContext.Provider value={{ user, loading, refreshUser, updateAvatar, updateProfile }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
}