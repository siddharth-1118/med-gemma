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
                // Medical Brand Colors
                brand: {
                    primary: '#1F4FD8',   // Clinical Authority
                    secondary: '#4F8CFF', // Interactive
                    accent: '#2EC4B6',    // Success / Highlights
                    warning: '#FF9F1C',   // Attention / ROI
                },
                // Semantic Tokens (Light/Dark adaptive)
                medical: {
                    bg: {
                        light: '#F4F7FB',
                        dark: '#0B1220', // Deep Radiology Blue
                    },
                    card: {
                        light: '#FFFFFF',
                        dark: '#121A2F', // Card Dark
                    },
                    text: {
                        primary: {
                            light: '#1F2937',
                            dark: '#E5E7EB', // High contrast for dark mode
                        },
                        secondary: {
                            light: '#6B7280',
                            dark: '#9CA3AF',
                        }
                    },
                    border: {
                        light: '#E5E7EB',
                        dark: '#1F2937',
                    }
                }
            },
            boxShadow: {
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glow-blue': '0 0 20px rgba(31, 79, 216, 0.3)',
                'glow-orange': '0 0 20px rgba(255, 159, 28, 0.4)',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                }
            }
        },
    },
    plugins: [],
}
