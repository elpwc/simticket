import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import App from './app';
import { LocaleProvider } from '@/utils/hooks/useLocale';
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

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="zh">
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<LocaleProvider>
					<App>{children}</App>
				</LocaleProvider>
				<GoogleAnalytics gaId="G-M3D0Z0VV1D" />
			</body>
		</html>
	);
}
