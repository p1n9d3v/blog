/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite-react/tailwind';
import colors from 'tailwindcss/colors';

module.exports = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        flowbite.content(),
    ],
    theme: {
        extend: {
            fontFamily: {
                nanum: ['var(--font-nanum)'],
            },
        },
        container: {
            center: true,
        },
        colors: {
            ...colors,
            deepOceanBlue: '#29558a',
            skylineBlue: '#4c84b7',
            mistyCloud: '#d5dbe6',
            coolSteel: '#6b8bb5',
            softBlue: '#9aafcc',
            frostedWhite: '#f6f5fa',
            crispAqua: '#d5e8f2',
            lavenderHaze: '#9ba9d0',
            midnightNavy: '#004681',
        },
    },
    plugins: [
        flowbite.plugin(),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
    ],
};
