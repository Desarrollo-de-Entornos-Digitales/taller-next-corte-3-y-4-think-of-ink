export function resolveImageUrl(url: string | null | undefined): string {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    if (url.startsWith('data:')) return url;
    if (url.startsWith('blob:')) return url;
    // Mock/public images served by Next.js directly
    if (url.startsWith('/images/')) return url;
    // API-uploaded images need base URL
    const base = process.env.NEXT_PUBLIC_API_URL || '';
    const separator = url.startsWith('/') ? '' : '/';
    return `${base}${separator}${url}`;
}

export const PLACEHOLDER_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22300%22%20viewBox%3D%220%200%20400%20300%22%3E%3Crect%20fill%3D%22%23f3f4f6%22%20width%3D%22400%22%20height%3D%22300%22%2F%3E%3Cpath%20d%3D%22M160%20120h80v60h-80z%22%20fill%3D%22%23d1d5db%22%2F%3E%3Ccircle%20cx%3D%22200%22%20cy%3D%22150%22%20r%3D%2220%22%20fill%3D%22%239ca3af%22%2F%3E%3C%2Fsvg%3E';

export const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();

    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);

    if (diffInSeconds < 60) return 'Hace unos segundos';
    if (diffInMinutes < 60) return `Hace ${diffInMinutes}m`;
    if (diffInHours < 24) return `Hace ${diffInHours}h`;
    if (diffInDays < 30) return `Hace ${diffInDays}d`;
    if (diffInMonths < 12) return `Hace ${diffInMonths}mes`;

    const formatter = new Intl.DateTimeFormat('es-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    });

    return formatter.format(date);
};
