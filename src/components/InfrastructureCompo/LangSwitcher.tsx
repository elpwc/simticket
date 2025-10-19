'use client';

import { LanguageList } from '@/i18n/routing';
import { useCurrentLanguage } from '@/utils/hooks/useCurrentLanguage';
import { useState } from 'react';

export default function LangSwitcher() {
	const { currentLang, switchLanguage } = useCurrentLanguage();
	const [open, setOpen] = useState(false);

	const currentLangName = LanguageList.find((l) => l.id === currentLang)?.name || '中文';

	return (
		<div className="relative inline-block text-left">
			<button
				onClick={() => setOpen(!open)}
				className="border-0 flex justify-center items-center px-0 py-0 bg-[transparent] dark:bg-gray-800 rounded hover:bg-[#2396e2] dark:hover:bg-gray-700 text-sm"
			>
				<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
					<path d="M4.545 6.714 4.11 8H3l1.862-5h1.284L8 8H6.833l-.435-1.286zm1.634-.736L5.5 3.956h-.049l-.679 2.022z" />
					<path d="M0 2a2 2 0 0 1 2-2h7a2 2 0 0 1 2 2v3h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-3H2a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v7a1 1 0 0 0 1 1h7a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zm7.138 9.995q.289.451.63.846c-.748.575-1.673 1.001-2.768 1.292.178.217.451.635.555.867 1.125-.359 2.08-.844 2.886-1.494.777.665 1.739 1.165 2.93 1.472.133-.254.414-.673.629-.89-1.125-.253-2.057-.694-2.82-1.284.681-.747 1.222-1.651 1.621-2.757H14V8h-3v1.047h.765c-.318.844-.74 1.546-1.272 2.13a6 6 0 0 1-.415-.492 2 2 0 0 1-.94.31" />
				</svg>
				{currentLangName}
				<span className="ml-1 text-xs">{open ? '▲' : '▼'}</span>
			</button>

			{open && (
				<div className="absolute mt-1 right-0 w-24 bg-[#007fd4] dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow">
					{LanguageList.map((lang) => (
						<button
							key={lang.id}
							onClick={() => {
								switchLanguage(lang.id);
								setOpen(false);
							}}
							className="border-0 !m-0 bg-[transparent] w-full text-left px-2 py-1 text-sm hover:bg-[#2396e2] dark:hover:bg-gray-700"
						>
							{lang.name}
						</button>
					))}
				</div>
			)}
		</div>
	);
}
