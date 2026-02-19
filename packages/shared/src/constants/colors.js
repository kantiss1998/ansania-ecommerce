"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.brandColors = exports.cssVariables = exports.colors = void 0;
exports.colors = {
    primary: {
        50: "#FFF1F3",
        100: "#FFE4E8",
        200: "#FECDD6",
        300: "#FDA4B8",
        400: "#FB7199",
        500: "#F5447D",
        600: "#E31B64",
        700: "#BA3565",
        800: "#9F1853",
        900: "#881649",
        950: "#4C0826",
    },
    secondary: {
        50: "#FEFCFC",
        100: "#FEF9F9",
        200: "#FFF0F0",
        300: "#FFE4E4",
        400: "#FFCFCF",
        500: "#FFB3B3",
        600: "#FF9494",
        700: "#E67373",
        800: "#CC5555",
        900: "#994040",
    },
    neutral: {
        50: "#FAFAFA",
        100: "#F5F5F5",
        200: "#E5E5E5",
        300: "#D4D4D4",
        400: "#A3A3A3",
        500: "#737373",
        600: "#525252",
        700: "#404040",
        800: "#262626",
        900: "#171717",
    },
    accent: {
        gold: "#D4AF37",
        peach: "#FFAB9D",
        lavender: "#E8D5E8",
        mint: "#D4F1E8",
    },
    success: {
        light: "#D1FAE5",
        DEFAULT: "#10B981",
        dark: "#065F46",
    },
    warning: {
        light: "#FEF3C7",
        DEFAULT: "#F59E0B",
        dark: "#92400E",
    },
    error: {
        light: "#FEE2E2",
        DEFAULT: "#EF4444",
        dark: "#991B1B",
    },
    info: {
        light: "#DBEAFE",
        DEFAULT: "#3B82F6",
        dark: "#1E40AF",
    },
    text: {
        primary: "#171717",
        secondary: "#525252",
        tertiary: "#A3A3A3",
        disabled: "#D4D4D4",
        inverse: "#FFFFFF",
    },
    background: {
        primary: "#FFFFFF",
        secondary: "#FAFAFA",
        tertiary: "#FFF0F0",
        accent: "#FFE4E4",
        dark: "#171717",
    },
    border: {
        light: "#F5F5F5",
        DEFAULT: "#E5E5E5",
        medium: "#D4D4D4",
        dark: "#A3A3A3",
    },
    overlay: "rgba(0, 0, 0, 0.5)",
    backdrop: "rgba(186, 53, 101, 0.1)",
    gradient: {
        primary: "linear-gradient(135deg, #BA3565 0%, #E31B64 100%)",
        secondary: "linear-gradient(135deg, #FFE4E4 0%, #FFF0F0 100%)",
        sunset: "linear-gradient(135deg, #FFAB9D 0%, #BA3565 100%)",
        rose: "linear-gradient(135deg, #FFF1F3 0%, #FFE4E4 50%, #FECDD6 100%)",
    },
};
exports.cssVariables = {
    "--color-primary": exports.colors.primary[700],
    "--color-primary-light": exports.colors.primary[100],
    "--color-primary-dark": exports.colors.primary[900],
    "--color-secondary": exports.colors.secondary[300],
    "--color-secondary-light": exports.colors.secondary[100],
    "--color-accent-gold": exports.colors.accent.gold,
    "--color-background": exports.colors.background.primary,
    "--color-text": exports.colors.text.primary,
    "--color-border": exports.colors.border.DEFAULT,
};
exports.brandColors = {
    primary: "#BA3565",
    secondary: "#FFE4E4",
    accent: "#D4AF37",
};
//# sourceMappingURL=colors.js.map