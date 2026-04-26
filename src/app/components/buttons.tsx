'use client';

interface CustomButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'outline' | 'error' | 'link';
    className?: string;
    isLoading?: boolean;
}

export const CustomButton = ({
    children,
    onClick,
    type = 'button',
    variant = 'primary',
    className = '',
    isLoading = false,
}: CustomButtonProps) => {
    const variants = {
        primary: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        error: 'btn-error',
        link: 'btn-link',
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={isLoading}
            className={`btn ${variants[variant]} ${className} ${isLoading ? 'btn-disabled' : ''}`}
        >
            {isLoading && <span className="loading loading-spinner"></span>}
            {children}
        </button>
    );
};
