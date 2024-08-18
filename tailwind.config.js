/** @type {import('tailwindcss').Config} */
import flowbite from 'flowbite-react/tailwind';

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
    },
    plugins: [
        flowbite.plugin(),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/typography'),
    ],
};
