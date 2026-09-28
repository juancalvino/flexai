/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1F1E1D",
          soft: "#292727",
          muted: "#3A3836",
        },
        cream: {
          DEFAULT: "#F3F1EB",
          light: "#FEFCF3",
          dark: "#E4E0D5",
        },
        brand: {
          yellow: {
            100: "#FFF6CF",
            300: "#FFE27A",
            500: "#FFCF15",
            600: "#E6B800",
            700: "#B38F00",
          },
          blue: {
            300: "#8FA9BF",
            500: "#0D395A",
            700: "#082236",
          },
        },
      },
      fontFamily: {
        sans: ["Inter Variable", ...defaultTheme.fontFamily.sans],
        display: ["Kanit", ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        "display-sm": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "0.95", letterSpacing: "-0.02em" }],
        "display-md": ["clamp(3rem, 8vw, 6.5rem)", { lineHeight: "0.92", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(3.25rem, 11vw, 9.5rem)", { lineHeight: "0.88", letterSpacing: "-0.035em" }],
      },
      letterSpacing: {
        eyebrow: "0.22em",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        "scroll-cue": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(200%)" },
        },
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "scroll-cue": "scroll-cue 1.8s cubic-bezier(0.65, 0, 0.35, 1) infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
