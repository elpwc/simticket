import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import App from './app';
import { LocaleProvider } from '@/utils/hooks/useLocale';
import { ThemeProvider } from '@/utils/hooks/useTheme';
import { GoogleAnalytics } from '@next/third-parties/google';

const geistSans = Geist({
	variable: '--font-geist-sans',
	subsets: ['latin'],
});

const geistMono = Geist_Mono({
	variable: '--font-geist-mono',
	subsets: ['latin'],
});

export const metadata: Metadata = {
	title: 'simticket',
	description: 'simticket',
};

const themeInitScript = `(function(){try{var t=localStorage.getItem('theme');var dark=t==='dark'||(t!=='light'&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',dark);document.documentElement.style.colorScheme=dark?'dark':'light';}catch(e){}})();`;

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh" suppressHydrationWarning>
			<head>
				<script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
			</head>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider>
					<LocaleProvider>
						<App>{children}</App>
					</LocaleProvider>
				</ThemeProvider>
				<GoogleAnalytics gaId="G-2QPFFFRRK3" />
			</body>
		</html>
	);
}
