/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--bg-primary)',
        secondary: 'var(--bg-secondary)',
        glass: 'var(--bg-tertiary)',
        elevated: 'var(--bg-elevated)',
        accent: {
          blue: 'var(--accent-blue)',
          'blue-light': 'var(--accent-blue-light)',
          purple: 'var(--accent-purple)',
          orange: 'var(--accent-orange)',
          green: 'var(--accent-green)',
          red: 'var(--accent-red)',
          yellow: 'var(--accent-yellow)',
        }
      },
      boxShadow: {
        'glow-blue': 'var(--glow-blue)',
        'glow-purple': 'var(--glow-purple)',
        'glow-green': 'var(--glow-green)',
        'glow-orange': 'var(--glow-orange)',
        'glow-red': 'var(--glow-red)',
        'glass': '0 4px 24px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      borderRadius: {
        'glass': '16px',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'SF Pro Display', 'SF Pro Text', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        mono: ['SF Mono', 'Fira Code', 'JetBrains Mono', 'Consolas', 'Monaco', 'monospace'],
      },
    },
  },
  plugins: [],
}
