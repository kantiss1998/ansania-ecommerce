/**
 * Color Palette - Ansania E-commerce
 * Base colors: #FFE4E4 (Blush) & #BA3565 (Deep Rose)
 */

export const colors = {
  // Primary - Deep Rose shades (from #BA3565)
  primary: {
    50: "#FFF1F3", // Very light rose
    100: "#FFE4E8", // Light rose
    200: "#FECDD6", // Soft rose
    300: "#FDA4B8", // Medium light rose
    400: "#FB7199", // Medium rose
    500: "#F5447D", // Bright rose
    600: "#E31B64", // Vivid rose
    700: "#BA3565", // Base Deep Rose ⭐
    800: "#9F1853", // Dark rose
    900: "#881649", // Very dark rose
    950: "#4C0826", // Almost black rose
  },

  // Secondary - Blush shades (from #FFE4E4)
  secondary: {
    50: "#FEFCFC", // Almost white
    100: "#FEF9F9", // Very light blush
    200: "#FFF0F0", // Light blush
    300: "#FFE4E4", // Base Blush ⭐
    400: "#FFCFCF", // Medium blush
    500: "#FFB3B3", // Warm blush
    600: "#FF9494", // Rose blush
    700: "#E67373", // Deep blush
    800: "#CC5555", // Dark blush
    900: "#994040", // Very dark blush
  },

  // Neutral - Warm grays to complement pink tones
  neutral: {
    50: "#FAFAFA", // Off white
    100: "#F5F5F5", // Very light gray
    200: "#E5E5E5", // Light gray
    300: "#D4D4D4", // Medium light gray
    400: "#A3A3A3", // Medium gray
    500: "#737373", // Gray
    600: "#525252", // Dark gray
    700: "#404040", // Very dark gray
    800: "#262626", // Almost black
    900: "#171717", // Black
  },

  // Accent - Complementary colors
  accent: {
    gold: "#D4AF37", // Luxury gold
    peach: "#FFAB9D", // Soft peach
    lavender: "#E8D5E8", // Soft lavender
    mint: "#D4F1E8", // Soft mint
  },

  // Semantic colors
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

  // Text colors
  text: {
    primary: "#171717", // Almost black
    secondary: "#525252", // Dark gray
    tertiary: "#A3A3A3", // Medium gray
    disabled: "#D4D4D4", // Light gray
    inverse: "#FFFFFF", // White for dark backgrounds
  },

  // Background colors
  background: {
    primary: "#FFFFFF", // White
    secondary: "#FAFAFA", // Off white
    tertiary: "#FFF0F0", // Very light blush
    accent: "#FFE4E4", // Blush
    dark: "#171717", // Dark mode bg
  },

  // Border colors
  border: {
    light: "#F5F5F5",
    DEFAULT: "#E5E5E5",
    medium: "#D4D4D4",
    dark: "#A3A3A3",
  },

  // Special purpose
  overlay: "rgba(0, 0, 0, 0.5)",
  backdrop: "rgba(186, 53, 101, 0.1)", // Primary with opacity

  // Gradients
  gradient: {
    primary: "linear-gradient(135deg, #BA3565 0%, #E31B64 100%)",
    secondary: "linear-gradient(135deg, #FFE4E4 0%, #FFF0F0 100%)",
    sunset: "linear-gradient(135deg, #FFAB9D 0%, #BA3565 100%)",
    rose: "linear-gradient(135deg, #FFF1F3 0%, #FFE4E4 50%, #FECDD6 100%)",
  },
} as const;

// CSS Variables export for direct use
export const cssVariables = {
  "--color-primary": colors.primary[700],
  "--color-primary-light": colors.primary[100],
  "--color-primary-dark": colors.primary[900],
  "--color-secondary": colors.secondary[300],
  "--color-secondary-light": colors.secondary[100],
  "--color-accent-gold": colors.accent.gold,
  "--color-background": colors.background.primary,
  "--color-text": colors.text.primary,
  "--color-border": colors.border.DEFAULT,
} as const;

// Brand colors (for consistency)
export const brandColors = {
  primary: "#BA3565", // Deep Rose (main brand color)
  secondary: "#FFE4E4", // Blush (secondary brand color)
  accent: "#D4AF37", // Gold (luxury accent)
} as const;

export type ColorPalette = typeof colors;
export type BrandColors = typeof brandColors;
