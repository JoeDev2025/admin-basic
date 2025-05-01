import typography from "@tailwindcss/typography";
import type { Config } from "tailwindcss";

const config: Config = {
	content: [
		"./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/components/**/*.{js,ts,jsx,tsx,mdx}",
		"./src/app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: "var(--background)",
				foreground: "var(--foreground)",
			},
		},
	},
	plugins: [typography],
	safelist: [
		"w-4",
		"h-4",
		"w-6",
		"h-6",
		"w-10",
		"h-10",
		"w-16",
		"h-16",
		"w-32",
		"h-32",
	],
};
export default config;
