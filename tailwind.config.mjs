/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
	theme: {
		extend: {
			fontFamily: {
				sans: ['Space Grotesk', 'system-ui', 'sans-serif'],
			},
            colors: {
                // Add custom brutalist colors if needed
            }
		},
	},
	plugins: [
        require('@tailwindcss/typography'),
    ],
    darkMode: 'class', // We enforce dark mode in Layout, but this allows class strategy
}
