export declare const colors: {
    readonly primary: {
        readonly 50: "#FFF1F3";
        readonly 100: "#FFE4E8";
        readonly 200: "#FECDD6";
        readonly 300: "#FDA4B8";
        readonly 400: "#FB7199";
        readonly 500: "#F5447D";
        readonly 600: "#E31B64";
        readonly 700: "#BA3565";
        readonly 800: "#9F1853";
        readonly 900: "#881649";
        readonly 950: "#4C0826";
    };
    readonly secondary: {
        readonly 50: "#FEFCFC";
        readonly 100: "#FEF9F9";
        readonly 200: "#FFF0F0";
        readonly 300: "#FFE4E4";
        readonly 400: "#FFCFCF";
        readonly 500: "#FFB3B3";
        readonly 600: "#FF9494";
        readonly 700: "#E67373";
        readonly 800: "#CC5555";
        readonly 900: "#994040";
    };
    readonly neutral: {
        readonly 50: "#FAFAFA";
        readonly 100: "#F5F5F5";
        readonly 200: "#E5E5E5";
        readonly 300: "#D4D4D4";
        readonly 400: "#A3A3A3";
        readonly 500: "#737373";
        readonly 600: "#525252";
        readonly 700: "#404040";
        readonly 800: "#262626";
        readonly 900: "#171717";
    };
    readonly accent: {
        readonly gold: "#D4AF37";
        readonly peach: "#FFAB9D";
        readonly lavender: "#E8D5E8";
        readonly mint: "#D4F1E8";
    };
    readonly success: {
        readonly light: "#D1FAE5";
        readonly DEFAULT: "#10B981";
        readonly dark: "#065F46";
    };
    readonly warning: {
        readonly light: "#FEF3C7";
        readonly DEFAULT: "#F59E0B";
        readonly dark: "#92400E";
    };
    readonly error: {
        readonly light: "#FEE2E2";
        readonly DEFAULT: "#EF4444";
        readonly dark: "#991B1B";
    };
    readonly info: {
        readonly light: "#DBEAFE";
        readonly DEFAULT: "#3B82F6";
        readonly dark: "#1E40AF";
    };
    readonly text: {
        readonly primary: "#171717";
        readonly secondary: "#525252";
        readonly tertiary: "#A3A3A3";
        readonly disabled: "#D4D4D4";
        readonly inverse: "#FFFFFF";
    };
    readonly background: {
        readonly primary: "#FFFFFF";
        readonly secondary: "#FAFAFA";
        readonly tertiary: "#FFF0F0";
        readonly accent: "#FFE4E4";
        readonly dark: "#171717";
    };
    readonly border: {
        readonly light: "#F5F5F5";
        readonly DEFAULT: "#E5E5E5";
        readonly medium: "#D4D4D4";
        readonly dark: "#A3A3A3";
    };
    readonly overlay: "rgba(0, 0, 0, 0.5)";
    readonly backdrop: "rgba(186, 53, 101, 0.1)";
    readonly gradient: {
        readonly primary: "linear-gradient(135deg, #BA3565 0%, #E31B64 100%)";
        readonly secondary: "linear-gradient(135deg, #FFE4E4 0%, #FFF0F0 100%)";
        readonly sunset: "linear-gradient(135deg, #FFAB9D 0%, #BA3565 100%)";
        readonly rose: "linear-gradient(135deg, #FFF1F3 0%, #FFE4E4 50%, #FECDD6 100%)";
    };
};
export declare const cssVariables: {
    readonly "--color-primary": "#BA3565";
    readonly "--color-primary-light": "#FFE4E8";
    readonly "--color-primary-dark": "#881649";
    readonly "--color-secondary": "#FFE4E4";
    readonly "--color-secondary-light": "#FEF9F9";
    readonly "--color-accent-gold": "#D4AF37";
    readonly "--color-background": "#FFFFFF";
    readonly "--color-text": "#171717";
    readonly "--color-border": "#E5E5E5";
};
export declare const brandColors: {
    readonly primary: "#BA3565";
    readonly secondary: "#FFE4E4";
    readonly accent: "#D4AF37";
};
export type ColorPalette = typeof colors;
export type BrandColors = typeof brandColors;
//# sourceMappingURL=colors.d.ts.map