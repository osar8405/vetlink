import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  // DaisyUI config should be exported separately or configured via plugin options if supported
}

export default config;

// If you want to configure daisyUI themes, create a daisyui.config.js file or use plugin options if supported.
