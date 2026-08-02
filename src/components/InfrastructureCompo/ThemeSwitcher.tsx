'use client';

import { useState } from 'react';
import { ThemePreference, useTheme } from '@/utils/hooks/useTheme';
import { useLocale } from '@/utils/hooks/useLocale';

const OPTIONS: { id: ThemePreference; labelKey: string }[] = [
	{ id: 'light', labelKey: 'app.theme.light' },
	{ id: 'dark', labelKey: 'app.theme.dark' },
	{ id: 'system', labelKey: 'app.theme.system' },
];

export default function ThemeSwitcher() {
	const [open, setOpen] = useState(false);
	const { theme, resolvedTheme, setTheme } = useTheme();
	const { t } = useLocale();

	const isDarkIcon = resolvedTheme === 'dark';

	return (
		<div className="relative inline-block text-left">
			<div className="h-full flex items-center">
				<button
					type="button"
					onClick={() => setOpen(!open)}
					className="navitem border-0 bg-transparent text-inherit"
					aria-expanded={open}
					aria-haspopup="listbox"
					aria-label={t('app.theme.label')}
					title={t('app.theme.label')}
				>
					{isDarkIcon ? (
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
							<path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278" />
						</svg>
					) : (
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16" aria-hidden>
							<path d="M8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708" />
						</svg>
					)}
				</button>
			</div>

			{open && (
				<div className="theme-switcher-menu lang-switcher-menu absolute mt-1 right-0 w-28 bg-[#007fd4] dark:bg-[#0b4f7d] border border-gray-200 dark:border-gray-700 rounded shadow z-50">
					{OPTIONS.map((opt) => (
						<button
							type="button"
							key={opt.id}
							onClick={() => {
								setTheme(opt.id);
								setOpen(false);
							}}
							className="lang-switcher-option border-0 !m-0 bg-transparent w-full text-left px-2 py-1 text-sm text-white hover:bg-[#2396e2] focus:bg-[#2396e2] focus:outline-none"
							aria-selected={theme === opt.id}
						>
							{t(opt.labelKey)}
							{theme === opt.id ? ' ✓' : ''}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
