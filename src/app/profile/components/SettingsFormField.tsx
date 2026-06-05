'use client';

interface FormFieldProps {
    label: string;
    type?: 'text' | 'email' | 'url' | 'textarea';
    placeholder?: string;
    value: string;
    onChange: (value: string) => void;
    maxLength?: number;
    showCharCount?: boolean;
}

export const SettingsFormField = ({
    label,
    type = 'text',
    placeholder,
    value,
    onChange,
    maxLength,
    showCharCount = false,
}: FormFieldProps) => {
    const isTextarea = type === 'textarea';

    return (
        <div className="flex flex-col gap-2">
            <label className="text-sm font-bold text-black">{label}</label>

            {isTextarea ? (
                <div className="flex flex-col gap-1">
                    <textarea
                        placeholder={placeholder}
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        maxLength={maxLength}
                        rows={4}
                        className="px-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none font-medium text-sm resize-none transition-all duration-200 bg-white"
                    />
                    {showCharCount && maxLength && (
                        <span className="text-xs text-[#474747] text-right font-medium">
                            {value.length}/{maxLength} caracteres
                        </span>
                    )}
                </div>
            ) : (
                <input
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="px-4 py-3 border-2 border-[#D9D9D9] rounded-lg focus:border-black focus:ring-1 focus:ring-black focus:outline-none font-medium text-sm transition-all duration-200 bg-white"
                />
            )}
        </div>
    );
};
