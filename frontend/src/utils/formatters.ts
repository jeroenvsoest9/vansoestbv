/**
 * Format a number as currency (EUR)
 */
export const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('nl-NL', {
        style: 'currency',
        currency: 'EUR',
    }).format(amount);
};

/**
 * Format a date string or Date object to a localized date string
 */
export const formatDate = (date: string | Date): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
};

/**
 * Format a date string or Date object to a localized date and time string
 */
export const formatDateTime = (date: string | Date): string => {
    if (!date) return '';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('nl-NL', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
    });
};

/**
 * Format a number as a percentage
 */
export const formatPercentage = (value: number): string => {
    return new Intl.NumberFormat('nl-NL', {
        style: 'percent',
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
    }).format(value / 100);
};

/**
 * Format a number with thousand separators
 */
export const formatNumber = (value: number): string => {
    return new Intl.NumberFormat('nl-NL').format(value);
}; 