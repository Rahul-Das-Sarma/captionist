/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "dark-bg-primary": "#0B0B0B",
        "dark-bg-secondary": "#1A1A1A",
        "dark-bg-tertiary": "#2A2A2A",
        "dark-text-primary": "#F5F5F5",
        "dark-text-secondary": "#B0B0B0",
        "dark-text-muted": "#808080",
        "dark-accent-primary": "#00C6FF",
        "dark-accent-secondary": "#3A7BD5",
        "dark-border-subtle": "rgba(255, 255, 255, 0.1)",
        "dark-border-accent": "rgba(0, 198, 255, 0.3)",
      },
      boxShadow: {
        "dark-primary": "0 8px 32px rgba(0, 0, 0, 0.8)",
        "dark-glow": "0 0 20px rgba(0, 198, 255, 0.2)",
        "dark-glow-lg": "0 0 30px rgba(0, 198, 255, 0.3)",
        "dark-glow-xl": "0 0 40px rgba(0, 198, 255, 0.4)",
      },
      textShadow: {
        "dark-glow": "0 0 10px rgba(0, 198, 255, 0.3)",
        "dark-glow-lg": "0 0 20px rgba(0, 198, 255, 0.4)",
        "dark-glow-xl": "0 0 30px rgba(0, 198, 255, 0.5)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "reel-pulse": "reelPulse 2s ease-in-out infinite",
        "gradient-shift": "gradientShift 3s ease-in-out infinite",
      },
      keyframes: {
        reelPulse: {
          "0%, 100%": {
            transform: "scale(1)",
            boxShadow:
              "0 8px 32px rgba(0, 0, 0, 0.8), 0 0 20px rgba(0, 198, 255, 0.2)",
          },
          "50%": {
            transform: "scale(1.05)",
            boxShadow:
              "0 12px 40px rgba(0, 0, 0, 0.8), 0 0 30px rgba(0, 198, 255, 0.3)",
          },
        },
        gradientShift: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".text-shadow-dark-glow": {
          textShadow: "0 0 10px rgba(0, 198, 255, 0.3)",
        },
        ".text-shadow-dark-glow-lg": {
          textShadow: "0 0 20px rgba(0, 198, 255, 0.4)",
        },
        ".text-shadow-dark-glow-xl": {
          textShadow: "0 0 30px rgba(0, 198, 255, 0.5)",
        },
        ".bg-gradient-dark": {
          background: "linear-gradient(135deg, #0B0B0B 0%, #1A1A1A 100%)",
        },
        ".bg-gradient-dark-accent": {
          background: "linear-gradient(135deg, #00C6FF, #3A7BD5)",
        },
        ".bg-gradient-dark-radial": {
          background: `
            radial-gradient(circle at 20% 50%, rgba(0, 198, 255, 0.03) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(58, 123, 213, 0.02) 0%, transparent 50%),
            radial-gradient(circle at 40% 80%, rgba(0, 198, 255, 0.01) 0%, transparent 50%)
          `,
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
