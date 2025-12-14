/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./services/**/*.{js,ts,jsx,tsx}"
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#135bec",
                "background-light": "#f6f6f8",
                "background-dark": "#101622",
                "surface-dark": "#1c222e",
                "surface-light": "#ffffff",
                "text-secondary": "#9da6b9",
                "zenith-bg": "#0f111a",
                "zenith-card": "#1c1f2e",
                "zenith-border": "#2d3142",
                "zenith-primary": "#6366f1",
                "zenith-accent": "#818cf8",
                "board-light": "#94a3b8",
                "board-dark": "#334155",
            },
            fontFamily: {
                "display": ["Inter", "sans-serif"]
            },
            borderRadius: {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "2xl": "1rem",
                "full": "9999px"
            },
            boxShadow: {
                'glow': '0 0 20px rgba(99, 102, 241, 0.15)',
            }
        },
    },
    plugins: [],
}
