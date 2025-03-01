/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0071E3",
        "primary-dark": "#004FAA",
        "primary-light": "#42A5F5",
        secondary: "#5E5CE6",
        accent: "#FF375F",
        success: "#34C759",
        warning: "#FF9500",
        error: "#FF3B30",
        "base-50": "#F5F5F7",
        "base-100": "#FFFFFF",
        "base-200": "#FAFAFA",
        "base-300": "#E5E5EA",
        "base-content": "#1D1D1F",
        "base-content-light": "#86868B"
      },
      fontFamily: {
        sans: [
          '"SF Pro Display"',
          '"SF Pro Text"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Helvetica',
          'Arial',
          'sans-serif'
        ],
        mono: [
          '"SF Mono"',
          'SFMono-Regular',
          'Menlo',
          'Monaco',
          'Consolas',
          '"Liberation Mono"',
          'monospace'
        ]
      },
      backdropFilter: {
        'none': 'none',
        'blur': 'blur(20px)'
      }
    },
  },
  plugins: [
    require("daisyui"),
    // 添加自定义插件支持磨砂玻璃效果
    function({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur-sm': {
          backdropFilter: 'blur(4px)',
          '-webkit-backdrop-filter': 'blur(4px)',
        },
        '.backdrop-blur': {
          backdropFilter: 'blur(8px)',
          '-webkit-backdrop-filter': 'blur(8px)',
        },
        '.backdrop-blur-md': {
          backdropFilter: 'blur(12px)',
          '-webkit-backdrop-filter': 'blur(12px)',
        },
        '.backdrop-blur-lg': {
          backdropFilter: 'blur(16px)',
          '-webkit-backdrop-filter': 'blur(16px)',
        },
        '.backdrop-blur-xl': {
          backdropFilter: 'blur(24px)',
          '-webkit-backdrop-filter': 'blur(24px)',
        },
      }
      addUtilities(newUtilities)
    }
  ],
  daisyui: {
    themes: [
      {
        light: {
          ...require("daisyui/src/theming/themes")["light"],
          "primary": "#0071E3",
          "secondary": "#5E5CE6",
          "accent": "#FF375F",
          "success": "#34C759",
          "warning": "#FF9500",
          "error": "#FF3B30",
        },
        dark: {
          ...require("daisyui/src/theming/themes")["dark"],
          "primary": "#0A84FF",
          "secondary": "#5E5CE6",
          "accent": "#FF375F",
          "success": "#30D158",
          "warning": "#FF9F0A",
          "error": "#FF453A",
          "base-100": "#1D1D1F",
          "base-200": "#2C2C2E",
          "base-300": "#3A3A3C",
        }
      }
    ],
  },
}
