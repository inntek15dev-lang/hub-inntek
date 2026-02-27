/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                google: {
                    blue: '#1a73e8',
                    blueHover: '#174ea6',
                    blueLight: '#e8f0fe',
                    gray: '#5f6368',
                    dark: '#202124',
                    border: '#dadce0',
                    bg: '#ffffff', // Pure white background
                    surface: '#ffffff',
                    hover: '#f1f3f4'
                }
            },
            fontFamily: {
                sans: ['Inter', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
            },
            boxShadow: {
                'google-sm': '0 1px 2px 0 rgba(60,64,67,0.3), 0 1px 3px 1px rgba(60,64,67,0.15)',
                'google-md': '0 1px 2px 0 rgba(60,64,67,0.3), 0 2px 6px 2px rgba(60,64,67,0.15)',
                'google-hover': '0 1px 3px 0 rgba(60,64,67,0.3), 0 4px 8px 3px rgba(60,64,67,0.15)',
            }
        },
    },
    plugins: [],
}
