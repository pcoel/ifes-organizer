import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ifes: {
          green: '#006633',
          'green-dark': '#004d26',
          'green-light': '#008542',
          red: '#c8102e',
          'red-dark': '#a30c25',
        },
      },
    },
  },
  plugins: [],
};

export default config;
