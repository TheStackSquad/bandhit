// src/utils/useCharacterCount.jsx
import { useState, useEffect } from 'react';
import { countCharacters } from '@/utils/otherUtils/textUtils';

/**
 * Hook that tracks and provides character count stats for form inputs
 */
export const useCharacterCount = (value, maxLength) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        // Use the shared counting function from textUtils
        setCount(countCharacters(value));
    }, [value]);

    // Determine status based on character count relative to limit
    const getStatus = () => {
        if (count === 0) return 'empty';
        if (count > maxLength) return 'exceeded';
        if (count >= maxLength * 0.9) return 'warning';
        return 'normal';
    };

    // Map status to appropriate color classes for visual feedback
    const getColorClass = () => {
        const status = getStatus();
        switch (status) {
            case 'exceeded':
                return 'text-red-500 dark:text-red-400';
            case 'warning':
                return 'text-amber-500 dark:text-amber-400';
            case 'normal':
                return 'text-gray-500 dark:text-gray-400';
            default:
                return 'text-gray-400 dark:text-gray-500';
        }
    };

    return {
        count,
        remaining: maxLength - count,
        status: getStatus(),
        colorClass: getColorClass()
    };
};

/**
 * Formats character count for consistent display in UI
 */
export const formatCharacterCount = (count, maxLength) => {
    return `${count}/${maxLength} characters`;
};

