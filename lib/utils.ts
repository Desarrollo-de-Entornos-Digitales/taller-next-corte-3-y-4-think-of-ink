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
