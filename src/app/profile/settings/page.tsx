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
import { updateUserProfile } from '@/lib/api/users';

export default function SettingsPage() {
    const [isLoading, setIsLoading] = useState(true);
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [formData, setFormData] = useState<UserSettings>({
        fullName: '',
        username: '',
        profession: '',
        bio: '',
        email: '',
        website: '',
        location: '',
        linkedin: '',
        behance: '',
        instagram: '',
        portfolio: '',
    });

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            const user = JSON.parse(storedUser);
            setUserProfile(user);
            setFormData({
                fullName: user.name || '',
                username: user.username || '',
                profession: user.profession || '',
                bio: user.bio || '',
                email: user.email || '',
                website: user.website || '',
                location: user.location || '',
                linkedin: user.linkedin || '',
                behance: user.behance || '',
                instagram: user.instagram || '',
                portfolio: user.portfolio || '',
            });
        } else {
            const username = localStorage.getItem('username') || 'Usuario';
            setUserProfile({
                id: '',
                name: username,
                username,
                email: '',
                profession: '',
                location: '',
                totalPosts: 0,
            });
        }
        setIsLoading(false);
    }, []);

    const handleFieldChange = (
        field: keyof UserSettings,
        value: string
    ) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const [isSaving, setIsSaving] = useState(false);

    const handleSaveChanges = async () => {
        setIsSaving(true);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Token no disponible');
                return;
            }

            const payload: Record<string, any> = {};
            if (formData.fullName) payload.name = formData.fullName;
            if (formData.username) payload.username = formData.username;
            if (formData.profession) payload.profession = formData.profession;
            if (formData.bio) payload.bio = formData.bio;
            if (formData.email) payload.email = formData.email;
            if (formData.website) payload.website = formData.website;
            if (formData.location) payload.location = formData.location;
            if (formData.linkedin) payload.linkedin = formData.linkedin;
            if (formData.behance) payload.behance = formData.behance;
            if (formData.instagram) payload.instagram = formData.instagram;
            if (formData.portfolio) payload.portfolio = formData.portfolio;

            await updateUserProfile(payload, token);

            localStorage.setItem('username', formData.username);
            if (formData.location) localStorage.setItem('location', formData.location);
            if (formData.profession) localStorage.setItem('profession', formData.profession);
            localStorage.setItem('user', JSON.stringify({
                ...userProfile,
                name: formData.fullName,
                username: formData.username,
                profession: formData.profession,
                bio: formData.bio,
                email: formData.email,
                website: formData.website,
                location: formData.location,
                linkedin: formData.linkedin,
                behance: formData.behance,
                instagram: formData.instagram,
                portfolio: formData.portfolio,
            }));

            setUserProfile((prev) =>
                prev
                    ? {
                          ...prev,
                          name: formData.fullName,
                          username: formData.username,
                          profession: formData.profession,
                          bio: formData.bio,
                          email: formData.email,
                          website: formData.website,
                          location: formData.location,
                          linkedin: formData.linkedin,
                          behance: formData.behance,
                          instagram: formData.instagram,
                          portfolio: formData.portfolio,
                      }
                    : prev
            );

            alert('Cambios guardados con éxito');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Error al guardar cambios. Intenta nuevamente.');
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        if (userProfile) {
            setFormData({
                fullName: userProfile.name || '',
                username: userProfile.username || '',
                profession: userProfile.profession || '',
                bio: userProfile.bio || '',
                email: userProfile.email || '',
                website: userProfile.website || '',
                location: userProfile.location || '',
                linkedin: userProfile.linkedin || '',
                behance: userProfile.behance || '',
                instagram: userProfile.instagram || '',
                portfolio: userProfile.portfolio || '',
            });
        }
    };

    const handleAvatarChange = () => {
        console.log('Cambiar foto de perfil');
        // Implementar lógica de cambio de avatar
    };

    const handleChangePassword = () => {
        console.log('Cambiar contraseña');
        // Implementar lógica de cambio de contraseña
    };

    const handleLogout = () => {
        console.log('Cerrar sesión');
        // Implementar lógica de cierre de sesión
        localStorage.removeItem('user');
        localStorage.removeItem('token');
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
                            <p className="text-gray-600 font-medium">
                                Cargando configuración...
                            </p>
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
                        {/* Profile Header */}
                        <SettingsProfileHeader
                            profile={userProfile}
                            onAvatarChange={handleAvatarChange}
                        />

                        {/* Información del Perfil */}
                        <SettingsSection
                            title="Información del perfil"
                            description="Actualiza la información que será visible para otros usuarios."
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField
                                    label="Nombre completo"
                                    placeholder="Tu nombre completo"
                                    value={formData.fullName}
                                    onChange={(value) =>
                                        handleFieldChange('fullName', value)
                                    }
                                />
                                <SettingsFormField
                                    label="Nombre de usuario"
                                    placeholder="tunombredeusuario"
                                    value={formData.username}
                                    onChange={(value) =>
                                        handleFieldChange('username', value)
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField
                                    label="Profesión"
                                    placeholder="Ej: Diseñadora Digital"
                                    value={formData.profession}
                                    onChange={(value) =>
                                        handleFieldChange('profession', value)
                                    }
                                />
                            </div>

                            <SettingsFormField
                                label="Descripción"
                                placeholder="Cuéntanos sobre ti..."
                                value={formData.bio}
                                onChange={(value) =>
                                    handleFieldChange('bio', value)
                                }
                                type="textarea"
                                maxLength={500}
                                showCharCount
                            />
                        </SettingsSection>

                        {/* Información de Contacto */}
                        <SettingsSection
                            title="Información de contacto"
                            description="Esta información no será visible para otros usuarios."
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField
                                    label="Correo electrónico"
                                    placeholder="tu@email.com"
                                    value={formData.email}
                                    onChange={(value) =>
                                        handleFieldChange('email', value)
                                    }
                                    type="email"
                                />
                                <SettingsFormField
                                    label="Sitio web"
                                    placeholder="https://tuportafolio.com"
                                    value={formData.website}
                                    onChange={(value) =>
                                        handleFieldChange('website', value)
                                    }
                                    type="url"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SettingsFormField
                                    label="Ubicación"
                                    placeholder="Ciudad, País"
                                    value={formData.location}
                                    onChange={(value) =>
                                        handleFieldChange('location', value)
                                    }
                                />
                            </div>
                        </SettingsSection>

                        {/* Redes Sociales */}
                        <SettingsSection
                            title="Redes sociales"
                            description="Comparte tus perfiles de redes sociales."
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SocialMediaField
                                    label="LinkedIn"
                                    placeholder="https://linkedin.com/in/tunombre"
                                    value={formData.linkedin}
                                    onChange={(value) =>
                                        handleFieldChange('linkedin', value)
                                    }
                                />
                                <SocialMediaField
                                    label="Behance"
                                    placeholder="https://behance.net/tunombre"
                                    value={formData.behance}
                                    onChange={(value) =>
                                        handleFieldChange('behance', value)
                                    }
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <SocialMediaField
                                    label="Instagram"
                                    placeholder="https://instagram.com/tunombre"
                                    value={formData.instagram}
                                    onChange={(value) =>
                                        handleFieldChange('instagram', value)
                                    }
                                />
                                <SocialMediaField
                                    label="Portafolio"
                                    placeholder="https://miportafolio.com"
                                    value={formData.portfolio}
                                    onChange={(value) =>
                                        handleFieldChange('portfolio', value)
                                    }
                                />
                            </div>
                        </SettingsSection>

                        {/* Cuenta */}
                        <SettingsSection
                            title="Cuenta"
                            description="Gestiona tu cuenta y seguridad."
                        >
                            <div className="flex flex-col gap-4">
                                <AccountOption
                                    icon="lock"
                                    title="Cambiar contraseña"
                                    description="Actualiza tu contraseña actual."
                                    onClick={handleChangePassword}
                                />
                                <AccountOption
                                    icon="logout"
                                    title="Cerrar sesión"
                                    description="Cerrar sesión en este dispositivo."
                                    isDestructive
                                    onClick={handleLogout}
                                />
                            </div>
                        </SettingsSection>

                        {/* Botones de Acción */}
                        <div className="flex justify-end gap-4 pb-8">
                            <button
                                onClick={handleCancel}
                                className="px-6 py-3 border-2 border-[#D9D9D9] rounded-md font-bold text-black hover:border-black transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleSaveChanges}
                                disabled={isSaving}
                                className="px-8 py-3 bg-black text-white rounded-md font-bold hover:bg-[#333] transition-colors disabled:opacity-50"
                            >
                                {isSaving ? 'Guardando...' : 'Guardar cambios'}
                            </button>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
