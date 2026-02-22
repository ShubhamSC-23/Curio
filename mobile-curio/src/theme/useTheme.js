import { useThemeStore } from '../store/themeStore';
import { lightColors, darkColors } from './colors';

export const useTheme = () => {
    const isDarkMode = useThemeStore((state) => state.isDarkMode);
    return isDarkMode ? darkColors : lightColors;
};
