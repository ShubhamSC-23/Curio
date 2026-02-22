const sharedColors = {
    primary: {
        50: '#eef2ff',
        100: '#e0e7ff',
        200: '#c7d2fe',
        300: '#a5b4fc',
        400: '#818cf8',
        500: '#6366f1',
        600: '#4f46e5',
        700: '#4338ca',
        800: '#3730a3',
        900: '#312e81',
    },
    status: {
        success: '#22c55e',
        warning: '#fb923c',
        error: '#ef4444',
        info: '#3b82f6',
    },
};

export const lightColors = {
    ...sharedColors,
    background: {
        primary: '#ffffff',
        secondary: '#f9fafb',
        tertiary: '#f3f4f6',
        elevated: '#ffffff',
    },
    text: {
        primary: '#111827',
        secondary: '#4b5563',
        tertiary: '#9ca3af',
        inverse: '#ffffff',
    },
    border: {
        primary: '#e5e7eb',
        secondary: '#d1d5db',
        focus: '#6366f1',
    },
};

export const darkColors = {
    ...sharedColors,
    background: {
        primary: '#111827',
        secondary: '#1f2937',
        tertiary: '#374151',
        elevated: '#1f2937',
    },
    text: {
        primary: '#f9fafb',
        secondary: '#d1d5db',
        tertiary: '#9ca3af',
        inverse: '#111827',
    },
    border: {
        primary: '#374151',
        secondary: '#4b5563',
        focus: '#818cf8',
    },
};

// Legacy export so existing imports don't break immediately
export const colors = lightColors;
