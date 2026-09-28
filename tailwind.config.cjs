/** @type {import('tailwindcss').Config} */
const defaultTheme = require("tailwindcss/defaultTheme");

const themeColor = (name) => `rgb(var(--color-${name}) / <alpha-value>)`;

module.exports = {
  content: ["./src/**/*.{astro,html,js,ts}"],
  theme: {
    extend: {
      // Colors come from CSS variables in src/styles/theme.css.
      colors: {
        ink: {
          DEFAULT: themeColor("ink"),
          soft: themeColor("ink-soft"),
          muted: themeColor("ink-muted"),
        },
        cream: {
          DEFAULT: themeColor("cream"),
          light: themeColor("cream-light"),
          dark: themeColor("cream-dark"),
        },
        accent: {
          DEFAULT: themeColor("accent"),
          contrast: themeColor("on-accent"),
        },
        secondary: themeColor("secondary"),
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
