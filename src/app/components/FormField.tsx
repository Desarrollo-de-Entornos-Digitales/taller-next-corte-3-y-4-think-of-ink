'use client';

import React from 'react';

import { Input } from './input';
import { CustomButton } from './buttons';

// Definimos la interfaz del campo individual con el tipo de evento correcto
interface FormField {
    label: string;
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}

interface AuthFormProps {
    title: string;
    subtitle: string;
    fields: FormField[];
    buttonText: string;
    onSubmit: (e: React.FormEvent) => void;
    footer?: React.ReactNode;
}

export const AuthForm = ({ title, subtitle, fields, buttonText, onSubmit, footer }: AuthFormProps) => {
    return (
        <div className="max-w-md w-full mx-auto">
            <header className="mb-12">
                <h2 className="text-4xl font-black mb-3 tracking-tighter uppercase">{title}</h2>
                <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">{subtitle}</p>
            </header>

            <form onSubmit={onSubmit} className="space-y-6">
                {fields.map((field, index) => (
                    <Input
                        key={index}
                        label={field.label}
                        type={field.type}
                        placeholder={field.placeholder}
                        value={field.value}
                        onChange={field.onChange}
                        required={field.required}
                    />
                ))}

                <CustomButton
                    type="submit"
                    className="w-full bg-black text-white py-5 font-black tracking-[0.2em] uppercase text-xs hover:bg-[#333] transition-all shadow-xl active:scale-[0.98] rounded-md border-none"
                >
                    {buttonText}
                </CustomButton>
            </form>

            {footer && <div className="mt-8">{footer}</div>}
        </div>
    );
};
