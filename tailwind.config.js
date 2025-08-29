import defaultTheme from 'tailwindcss/defaultTheme';
import typography from '@tailwindcss/typography';

/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],

	theme: {
		extend: {
			fontFamily: {
				sans: ['"Inter Variable"', ...defaultTheme.fontFamily.sans]
			},
			colors: {
				// White theme colors
				ConversationViewbg: '#ffffff',
				Sidebarbg: '#f8f9fa',
				SidebarHover: '#e9ecef',
				SidebarActive: '#dee2e6',
				Button: '#007bff',
				ButtonHover: '#0056b3',
				Font: '#212529',
				FontSecondary: '#6c757d',
				Border: '#dee2e6',
				MessageUser: '#f8f9fa',
				MessageAssistant: '#ffffff',
			},
			boxShadow: {
				'soft': '0 2px 8px rgba(0,0,0,0.08)',
				'card': '0 4px 6px rgba(0,0,0,0.05)',
			},
		}
	},

	plugins: [typography]
};
