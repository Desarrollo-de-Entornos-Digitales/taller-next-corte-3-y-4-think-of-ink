'use client';

import { ExternalLink } from 'lucide-react';

interface SocialMediaFieldProps {
    label: string;
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
}

export const SocialMediaField = ({
    label,
    placeholder,
    value,
    onChange,
}: SocialMediaFieldProps) => {
    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">{label}</label>

            <div className="flex items-center gap-2">
                <input
                    type="url"
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="flex-1 px-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none font-medium text-sm transition-all duration-200 bg-white"
                />
                {value && (
                    <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#474747] hover:text-black transition-colors flex-shrink-0"
                        title="Abrir enlace"
                    >
                        <ExternalLink size={20} />
                    </a>
                )}
            </div>
        </div>
    );
};
