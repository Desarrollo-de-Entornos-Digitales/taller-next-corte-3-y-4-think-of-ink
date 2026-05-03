'use client';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
}

export function Input({ label, error, ...props }: InputProps) {
    return (
        <div className="flex flex-col gap-2 w-full">
            {label && (
                <label className="text-[11px] font-black uppercase tracking-widest text-black ml-1">
                    {label}
                </label>
            )}
            <input
                {...props}
                className={`
                    w-full px-4 py-3 bg-white border-2 rounded-md
                    text-sm font-medium transition-all duration-200
                    placeholder:text-gray-300 outline-none
                    ${error 
                        ? 'border-red-500 focus:border-red-600' 
                        : 'border-[#ECECEC] focus:border-black focus:ring-1 focus:ring-black'
                    }
                    ${props.className || ''}
                `}
            />
            {error && (
                <span className="text-[10px] font-bold text-red-500 ml-1 uppercase">
                    {error}
                </span>
            )}
        </div>
    );
}