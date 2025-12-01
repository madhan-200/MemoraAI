import { useState } from 'react';
import { X, Sun, Moon, Palette, Type, MessageSquare, Layout, Sparkles, RotateCcw } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';
import { useTheme } from '../contexts/ThemeContext';

export const SettingsPanel = ({ isOpen, onClose }) => {
    const { settings, updateSettings, resetSettings, themePresets, getCurrentColors } = useTheme();
    const [showCustomPicker, setShowCustomPicker] = useState(false);
    const [customPrimary, setCustomPrimary] = useState(getCurrentColors().primary);
    const [customSecondary, setCustomSecondary] = useState(getCurrentColors().secondary);

    const handleApplyCustomColors = () => {
        updateSettings({
            customColors: { primary: customPrimary, secondary: customSecondary },
            colorTheme: 'custom'
        });
        setShowCustomPicker(false);
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            {/* Settings Panel */}
            <div className={`
        fixed right-0 top-0 bottom-0 w-full sm:w-96 bg-dark-900 border-l border-white/10 z-50
        transform transition-transform duration-300 ease-out overflow-y-auto
        ${isOpen ? 'translate-x-0' : 'translate-x-full'}
      `}>
                <div className="p-6 space-y-6">
                    {/* Header */}
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                            <Sparkles size={24} className="text-primary-400" />
                            Appearance
                        </h2>
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    {/* Mode Toggle */}
                    <Section icon={settings.mode === 'dark' ? <Moon size={18} /> : <Sun size={18} />} title="Theme Mode">
                        <div className="flex gap-2">
                            <ModeButton
                                active={settings.mode === 'dark'}
                                onClick={() => updateSettings({ mode: 'dark' })}
                                icon={<Moon size={16} />}
                                label="Dark"
                            />
                            <ModeButton
                                active={settings.mode === 'light'}
                                onClick={() => updateSettings({ mode: 'light' })}
                                icon={<Sun size={16} />}
                                label="Light"
                            />
                        </div>
                    </Section>

                    {/* Color Themes */}
                    <Section icon={<Palette size={18} />} title="Color Theme">
                        <div className="grid grid-cols-2 gap-2">
                            {Object.entries(themePresets).map(([key, theme]) => (
                                <ThemeCard
                                    key={key}
                                    name={theme.name}
                                    primary={theme.primary}
                                    secondary={theme.secondary}
                                    active={settings.colorTheme === key && !settings.customColors}
                                    onClick={() => updateSettings({ colorTheme: key, customColors: null })}
                                />
                            ))}
                            <button
                                onClick={() => setShowCustomPicker(!showCustomPicker)}
                                className={`p-3 rounded-xl border-2 transition-all ${settings.customColors
                                        ? 'border-white bg-white/10'
                                        : 'border-white/20 hover:border-white/40 hover:bg-white/5'
                                    }`}
                            >
                                <div className="flex items-center gap-2 text-sm font-medium">
                                    <Palette size={16} />
                                    <span>Custom</span>
                                </div>
                            </button>
                        </div>

                        {/* Custom Color Picker */}
                        {showCustomPicker && (
                            <div className="mt-4 p-4 bg-dark-800 rounded-xl space-y-4">
                                <div>
                                    <label className="text-xs text-dark-300 mb-2 block">Primary Color</label>
                                    <HexColorPicker color={customPrimary} onChange={setCustomPrimary} className="w-full" />
                                    <input
                                        type="text"
                                        value={customPrimary}
                                        onChange={(e) => setCustomPrimary(e.target.value)}
                                        className="mt-2 w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-dark-300 mb-2 block">Secondary Color</label>
                                    <HexColorPicker color={customSecondary} onChange={setCustomSecondary} className="w-full" />
                                    <input
                                        type="text"
                                        value={customSecondary}
                                        onChange={(e) => setCustomSecondary(e.target.value)}
                                        className="mt-2 w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                    />
                                </div>
                                <button onClick={handleApplyCustomColors} className="btn-primary w-full">
                                    Apply Custom Colors
                                </button>
                            </div>
                        )}
                    </Section>

                    {/* Font Size */}
                    <Section icon={<Type size={18} />} title="Font Size">
                        <div className="flex gap-2">
                            {['small', 'medium', 'large'].map((size) => (
                                <OptionButton
                                    key={size}
                                    active={settings.fontSize === size}
                                    onClick={() => updateSettings({ fontSize: size })}
                                    label={size.charAt(0).toUpperCase() + size.slice(1)}
                                />
                            ))}
                        </div>
                    </Section>

                    {/* Bubble Style */}
                    <Section icon={<MessageSquare size={18} />} title="Chat Bubble Style">
                        <div className="grid grid-cols-2 gap-2">
                            {[
                                { key: 'modern', label: 'Modern', desc: 'Gradients & shadows' },
                                { key: 'classic', label: 'Classic', desc: 'Simple & clean' },
                                { key: 'minimal', label: 'Minimal', desc: 'Flat design' },
                                { key: 'neumorphism', label: 'Neumorphism', desc: 'Soft depth' },
                            ].map((style) => (
                                <StyleCard
                                    key={style.key}
                                    active={settings.bubbleStyle === style.key}
                                    onClick={() => updateSettings({ bubbleStyle: style.key })}
                                    label={style.label}
                                    description={style.desc}
                                />
                            ))}
                        </div>
                    </Section>

                    {/* View Density */}
                    <Section icon={<Layout size={18} />} title="View Density">
                        <div className="flex gap-2">
                            <OptionButton
                                active={settings.viewDensity === 'compact'}
                                onClick={() => updateSettings({ viewDensity: 'compact' })}
                                label="Compact"
                            />
                            <OptionButton
                                active={settings.viewDensity === 'comfortable'}
                                onClick={() => updateSettings({ viewDensity: 'comfortable' })}
                                label="Comfortable"
                            />
                        </div>
                    </Section>

                    {/* Background Pattern */}
                    <Section icon={<Sparkles size={18} />} title="Background Pattern">
                        <div className="grid grid-cols-2 gap-2">
                            {['none', 'dots', 'hexagon', 'noise'].map((pattern) => (
                                <OptionButton
                                    key={pattern}
                                    active={settings.backgroundPattern === pattern}
                                    onClick={() => updateSettings({ backgroundPattern: pattern })}
                                    label={pattern.charAt(0).toUpperCase() + pattern.slice(1)}
                                />
                            ))}
                        </div>
                    </Section>

                    {/* Reset Button */}
                    <button
                        onClick={resetSettings}
                        className="w-full glass-button px-4 py-3 rounded-xl flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 hover:border-red-500/30"
                    >
                        <RotateCcw size={16} />
                        Reset to Defaults
                    </button>
                </div>
            </div>
        </>
    );
};

const Section = ({ icon, title, children }) => (
    <div className="space-y-3">
        <h3 className="text-sm font-semibold text-dark-300 flex items-center gap-2">
            {icon}
            {title}
        </h3>
        {children}
    </div>
);

const ModeButton = ({ active, onClick, icon, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 p-3 rounded-xl border-2 transition-all flex items-center justify-center gap-2 ${active
                ? 'border-primary-500 bg-primary-500/20 text-white'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5 text-dark-300'
            }`}
    >
        {icon}
        <span className="font-medium">{label}</span>
    </button>
);

const ThemeCard = ({ name, primary, secondary, active, onClick }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl border-2 transition-all ${active ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
    >
        <div className="flex items-center gap-2 mb-2">
            <div className="w-4 h-4 rounded-full" style={{ background: primary }} />
            <div className="w-4 h-4 rounded-full" style={{ background: secondary }} />
        </div>
        <div className="text-xs font-medium text-left">{name}</div>
    </button>
);

const OptionButton = ({ active, onClick, label }) => (
    <button
        onClick={onClick}
        className={`flex-1 px-4 py-2 rounded-lg border transition-all text-sm font-medium ${active
                ? 'border-primary-500 bg-primary-500/20 text-white'
                : 'border-white/20 hover:border-white/40 hover:bg-white/5 text-dark-300'
            }`}
    >
        {label}
    </button>
);

const StyleCard = ({ active, onClick, label, description }) => (
    <button
        onClick={onClick}
        className={`p-3 rounded-xl border-2 transition-all text-left ${active ? 'border-white bg-white/10' : 'border-white/20 hover:border-white/40 hover:bg-white/5'
            }`}
    >
        <div className="text-sm font-medium mb-1">{label}</div>
        <div className="text-xs text-dark-400">{description}</div>
    </button>
);
