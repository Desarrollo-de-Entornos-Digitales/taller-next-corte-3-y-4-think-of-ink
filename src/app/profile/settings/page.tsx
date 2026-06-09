'use client';

import { useState, useEffect } from 'react';
import { UserProfile, UserSettings } from '@/lib/types';
import { Sidebar } from '@/app/components/Sidebar';
import { Navbar } from '@/app/components/Navbar';
import { SettingsProfileHeader } from '../components/SettingsProfileHeader';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsFormField } from '../components/SettingsFormField';
import { SocialMediaField } from '../components/SocialMediaField';
import { AccountOption } from '../components/AccountOption';
import { getUserProfile, updateUserProfile, uploadAvatar } from '@/lib/api/users';
import { useUser } from '@/app/context/UserContext';
import { resolveImageUrl } from '@/lib/utils';

export default function SettingsPage() {
    const { refreshUser, updateAvatar } = useUser();
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | undefined>();
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<UserSettings>({
        fullName: '', username: '', profession: '', bio: '',
        email: '', website: '', location: '',
        linkedin: '', behance: '', instagram: '', portfolio: '',
        avatar: '',
    });

    useEffect(() => {
        const load = async () => {
            const token = localStorage.getItem('token');
            if (!token) { window.location.href = '/login'; return; }
            try {
                const data = await getUserProfile(token);
                const p = data.user || data.data || data;
                const apiAvatar = resolveImageUrl(p.avatar || p.avatarUrl || '');
                const stored = localStorage.getItem('user');
                let storedAvatar = '';
                if (stored) {
                    try { const parsed = JSON.parse(stored); if (parsed.avatar) storedAvatar = parsed.avatar; } catch {}
                }
                const profile: UserProfile = {
                    id: p.id || '', name: p.name || p.username || '',
                    username: p.username || 'Usuario', email: p.email || '',
                    profession: p.profession || '', bio: p.bio || '',
                    location: p.location || '', avatar: apiAvatar || storedAvatar,
                    website: p.website || '', linkedin: p.linkedin || '',
                    behance: p.behance || '', instagram: p.instagram || '',
                    portfolio: p.portfolio || '',
                    totalPosts: p.totalPosts ?? p._count?.posts ?? 0,
                };
                setUserProfile(profile);
                setFormData({
                    fullName: profile.name, username: profile.username,
                    profession: profile.profession || '', bio: profile.bio || '',
                    email: profile.email || '', website: profile.website || '',
                    location: profile.location || '', linkedin: profile.linkedin || '',
                    behance: profile.behance || '', instagram: profile.instagram || '',
                    portfolio: profile.portfolio || '', avatar: profile.avatar || '',
                });

                localStorage.setItem('user', JSON.stringify(profile));
                localStorage.setItem('username', profile.username);
                if (profile.location) localStorage.setItem('location', profile.location);
                if (profile.profession) localStorage.setItem('profession', profile.profession);
            } catch (err: any) {
                if (err?.message === 'Unauthorized' || err?.message?.includes('401')) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                    return;
                }
                const storedUsername = localStorage.getItem('username') || 'Usuario';
                setUserProfile({
                    id: '', name: storedUsername, username: storedUsername,
                    email: '', profession: '', location: '', totalPosts: 0,
                });
            } finally {
                setIsLoading(false);
            }
        };
        load();
    }, []);

    const handleFieldChange = (field: keyof UserSettings, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleAvatarChange = (file: File) => {
        setAvatarFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setAvatarPreview(e.target?.result as string);
        reader.readAsDataURL(file);
    };

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) { alert('Token no disponible'); return; }

            const payload: Record<string, any> = {
                name: formData.fullName || undefined,
                username: formData.username || undefined,
                profession: formData.profession || undefined,
                bio: formData.bio || undefined,
                email: formData.email || undefined,
                website: formData.website || undefined,
                location: formData.location || undefined,
                linkedin: formData.linkedin || undefined,
                behance: formData.behance || undefined,
                instagram: formData.instagram || undefined,
                portfolio: formData.portfolio || undefined,
            };

            // Clean undefined fields
            Object.keys(payload).forEach((k) => { if (payload[k] === undefined) delete payload[k]; });

            // Upload avatar first if a new file was selected
            let avatarUrlFromUpload = '';
            if (avatarFile) {
                try {
                    const uploadResult = await uploadAvatar(avatarFile, token);
                    avatarUrlFromUpload = uploadResult.url || uploadResult.avatarUrl || uploadResult.avatar || '';
                } catch (err) {
                    console.error('Error uploading avatar:', err);
                    alert('Error al subir la imagen de perfil. Intenta nuevamente.');
                    setIsSaving(false);
                    return;
                }
            }

            // Include avatar URL in profile update if we got one
            if (avatarUrlFromUpload) {
                payload.avatar = avatarUrlFromUpload;
            } else {
                const existingAvatar = formData.avatar || undefined;
                if (existingAvatar) payload.avatar = existingAvatar;
            }

            let updated: any = {};
            try {
                const result = await updateUserProfile(payload, token);
                updated = result?.user || result?.data || result;
            } catch (err) {
                throw err;
            }

            const apiAvatar = updated.avatar || updated.avatarUrl || '';
            const avatarUrl = resolveImageUrl(avatarUrlFromUpload || apiAvatar || formData.avatar || '');

            const merged: UserProfile = {
                ...(userProfile as UserProfile),
                name: updated.name || formData.fullName,
                username: updated.username || formData.username,
                email: updated.email || formData.email,
                profession: updated.profession || formData.profession,
                bio: updated.bio || formData.bio,
                location: updated.location || formData.location,
                website: updated.website || formData.website,
                linkedin: updated.linkedin || formData.linkedin,
                behance: updated.behance || formData.behance,
                instagram: updated.instagram || formData.instagram,
                portfolio: updated.portfolio || formData.portfolio,
                avatar: avatarUrl,
            };

            setUserProfile(merged);
            setAvatarPreview(avatarUrl);
            setAvatarFile(null);

            localStorage.setItem('user', JSON.stringify(merged));
            localStorage.setItem('username', merged.username);
            if (merged.location) localStorage.setItem('location', merged.location);
            if (merged.profession) localStorage.setItem('profession', merged.profession);

            updateAvatar(avatarUrl);
            refreshUser();

            alert('Cambios guardados con éxito');
        } catch (error: any) {
            console.error('Error saving profile:', error);
            if (error?.message === 'Unauthorized' || error?.message?.includes('401')) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('username');
                window.location.href = '/login';
                return;
            }
            alert('Error al guardar cambios. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.name || '', username: userProfile.username || '',
                profession: userProfile.profession || '', bio: userProfile.bio || '',
                email: userProfile.email || '', website: userProfile.website || '',
                location: userProfile.location || '', linkedin: userProfile.linkedin || '',
                behance: userProfile.behance || '', instagram: userProfile.instagram || '',
                portfolio: userProfile.portfolio || '', avatar: userProfile.avatar || '',
            });
            setAvatarPreview(undefined);
            setAvatarFile(null);
        }
    };

    const handleChangePassword = () => { console.log('Cambiar contraseña'); };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('username');
        localStorage.removeItem('location');
        localStorage.removeItem('profession');
        window.location.href = '/login';
    };

    if (isLoading || !userProfile) {
        return (
            <div className="flex h-screen bg-white">
                <Sidebar />
                <div className="flex-1 flex flex-col">
                    <Navbar />
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-gray-600 font-medium">Cargando configuración...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-white text-black">
            <Sidebar />
            <div className="flex-1 flex flex-col">
                <Navbar />
                <main className="flex-1 overflow-auto">
                    <div className="max-w-5xl mx-auto px-6 py-8 gap-8 flex flex-col">
                        <SettingsProfileHeader
                            profile={userProfile}
                            avatarPreview={avatarPreview}
                            onAvatarChange={handleAvatarChange}
                        />

                        <SettingsSection title="Información del perfil" description="Actualiza la información que será visible para otros usuarios.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField label="Nombre completo" placeholder="Tu nombre completo" value={formData.fullName} onChange={(v) => handleFieldChange('fullName', v)} />
                                <SettingsFormField label="Nombre de usuario" placeholder="tunombredeusuario" value={formData.username} onChange={(v) => handleFieldChange('username', v)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField label="Profesión" placeholder="Ej: Diseñadora Digital" value={formData.profession || ''} onChange={(v) => handleFieldChange('profession', v)} />
                            </div>
                            <SettingsFormField label="Descripción" placeholder="Cuéntanos sobre ti..." value={formData.bio || ''} onChange={(v) => handleFieldChange('bio', v)} type="textarea" maxLength={500} showCharCount />
                        </SettingsSection>

                        <SettingsSection title="Información de contacto" description="Esta información no será visible para otros usuarios.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField label="Correo electrónico" placeholder="tu@email.com" value={formData.email || ''} onChange={(v) => handleFieldChange('email', v)} type="email" />
                                <SettingsFormField label="Sitio web" placeholder="https://tuportafolio.com" value={formData.website || ''} onChange={(v) => handleFieldChange('website', v)} type="url" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField label="Ubicación" placeholder="Ciudad, País" value={formData.location || ''} onChange={(v) => handleFieldChange('location', v)} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title="Redes sociales" description="Comparte tus perfiles de redes sociales.">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SocialMediaField label="LinkedIn" placeholder="https://linkedin.com/in/tunombre" value={formData.linkedin || ''} onChange={(v) => handleFieldChange('linkedin', v)} />
                                <SocialMediaField label="Behance" placeholder="https://behance.net/tunombre" value={formData.behance || ''} onChange={(v) => handleFieldChange('behance', v)} />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SocialMediaField label="Instagram" placeholder="https://instagram.com/tunombre" value={formData.instagram || ''} onChange={(v) => handleFieldChange('instagram', v)} />
                                <SocialMediaField label="Portafolio" placeholder="https://miportafolio.com" value={formData.portfolio || ''} onChange={(v) => handleFieldChange('portfolio', v)} />
                            </div>
                        </SettingsSection>

                        <SettingsSection title="Cuenta" description="Gestiona tu cuenta y seguridad.">
                            <div className="flex flex-col gap-4">
                                <AccountOption icon="lock" title="Cambiar contraseña" description="Actualiza tu contraseña actual." onClick={handleChangePassword} />
                                <AccountOption icon="logout" title="Cerrar sesión" description="Cerrar sesión en este dispositivo." isDestructive onClick={handleLogout} />
                            </div>
                        </SettingsSection>

                        <div className="flex justify-end gap-4 pb-8">
                            <button onClick={handleCancel} className="px-6 py-3 border-2 border-[#D9D9D9] rounded-md font-bold text-black hover:border-black transition-colors">Cancelar</button>
                            <button onClick={handleSaveChanges} disabled={isSaving} className="px-8 py-3 bg-black text-white rounded-md font-bold hover:bg-[#333] transition-colors disabled:opacity-50">
                                {isSaving ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
