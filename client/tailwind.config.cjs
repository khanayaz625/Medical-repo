/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: {
                    DEFAULT: '#8b5cf6',
                    dark: '#7c3aed',
                    light: '#a78bfa',
                },
                secondary: {
                    DEFAULT: '#0ea5e9',
                    dark: '#0284c7',
                    light: '#38bdf8',
                },
                background: '#0b0f1a',
                surface: '#161b2e',
                'surface-hover': '#1f2937',
                border: 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Poppins', 'sans-serif'],
            },
            boxShadow: {
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
                'cyan': '0 0 15px rgba(14, 165, 233, 0.4)',
                'violet': '0 0 15px rgba(139, 92, 246, 0.4)',
            }
        },
    },
    plugins: [],
}
