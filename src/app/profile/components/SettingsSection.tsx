'use client';

interface SettingsSectionProps {
    title: string;
    description?: string;
    children: React.ReactNode;
}

export const SettingsSection = ({ title, description, children }: SettingsSectionProps) => {
    return (
        <div className="border border-[#D9D9D9] rounded-lg p-6 bg-white">
            <div className="mb-6">
                <h2 className="text-lg font-black tracking-tight text-black mb-2">{title}</h2>
                {description && (
                    <p className="text-sm text-[#474747] font-medium">{description}</p>
                )}
            </div>

            <div className="flex flex-col gap-6">{children}</div>
        </div>
    );
};
