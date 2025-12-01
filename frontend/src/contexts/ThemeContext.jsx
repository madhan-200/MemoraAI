import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

const THEME_PRESETS = {
    deepspace: { primary: '#8b5cf6', secondary: '#22d3ee', name: 'Deep Space' },
    ocean: { primary: '#3b82f6', secondary: '#06b6d4', name: 'Ocean Blue' },
    forest: { primary: '#10b981', secondary: '#84cc16', name: 'Forest Green' },
    sunset: { primary: '#f97316', secondary: '#fb923c', name: 'Sunset Orange' },
    rose: { primary: '#ec4899', secondary: '#f472b6', name: 'Rose Pink' },
};

const DEFAULT_SETTINGS = {
    mode: 'dark', // 'dark' | 'light'
    colorTheme: 'deepspace',
    customColors: null, // { primary: '#...', secondary: '#...' }
    fontSize: 'medium', // 'small' | 'medium' | 'large'
    bubbleStyle: 'modern', // 'modern' | 'classic' | 'minimal' | 'neumorphism'
    viewDensity: 'comfortable', // 'compact' | 'comfortable'
    backgroundPattern: 'none', // 'none' | 'dots' | 'hexagon' | 'noise'
};

export const ThemeProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('memora_theme_settings');
        return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    });

    useEffect(() => {
        localStorage.setItem('memora_theme_settings', JSON.stringify(settings));
        applyTheme(settings);
    }, [settings]);

    const applyTheme = (settings) => {
        const root = document.documentElement;
        const colors = settings.customColors || THEME_PRESETS[settings.colorTheme];

        // Apply CSS variables
        root.style.setProperty('--color-primary', colors.primary);
        root.style.setProperty('--color-secondary', colors.secondary);
        root.setAttribute('data-theme', settings.mode);
        root.setAttribute('data-bubble-style', settings.bubbleStyle);
        root.setAttribute('data-view-density', settings.viewDensity);
        root.setAttribute('data-font-size', settings.fontSize);
        root.setAttribute('data-bg-pattern', settings.backgroundPattern);
    };

    const updateSettings = (newSettings) => {
        setSettings(prev => ({ ...prev, ...newSettings }));
    };

    const resetSettings = () => {
        setSettings(DEFAULT_SETTINGS);
    };

    const getCurrentColors = () => {
        return settings.customColors || THEME_PRESETS[settings.colorTheme];
    };

    return (
        <ThemeContext.Provider value={{
            settings,
            updateSettings,
            resetSettings,
            getCurrentColors,
            themePresets: THEME_PRESETS,
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
