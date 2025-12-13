/** @type {import('tailwindcss').Config} */
import sharedConfig from '../../packages/ui/tailwind.config.js';

export default {
    presets: [sharedConfig],
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "../../packages/ui/src/**/*.{js,ts,jsx,tsx}"
    ],
    theme: {
        extend: {},
    },
    plugins: [],
}
