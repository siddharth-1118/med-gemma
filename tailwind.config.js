/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace'],
                serif: ['Merriweather', 'serif'],
            },
            colors: {
                "primary": "#1fa5d6",
                "background-light": "#f6f7f8",
                "background-dark": "#0B1220",
                "accent-orange": "#ff8c00",
                // Legacy support if needed
                brand: {
                    primary: '#1fa5d6',
                    accent: '#2EC4B6',
                    warning: '#ff8c00',
                }
            },
            borderRadius: {
                "DEFAULT": "1rem",
                "lg": "2rem",
                "xl": "3rem",
                "full": "9999px"
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glow-blue': '0 0 20px rgba(31, 165, 214, 0.3)',
                'glow-orange': '0 0 20px rgba(255, 140, 0, 0.4)',
                'ai-glow': '0 0 15px rgba(255, 140, 0, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
                'scanning': 'scanning 2s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                scanning: {
                    '0%': { top: '0%', opacity: '0' },
                    '50%': { opacity: '1' },
                    '100%': { top: '100%', opacity: '0' }
                }
            }
        },
    },
    plugins: [],
}
