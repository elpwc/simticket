import { useIsMobile } from '@/utils/hooks';
import { ReactNode, useState } from 'react';
import clsx from 'clsx';
import './Tab.css';

interface Props {
	menu: { title: string | ReactNode | null; disabled?: boolean }[];
	pages: (ReactNode | null)[];
	defaultSelectedIndex: number;
	menuPosition?: 'top' | 'bottom' | 'left' | 'right' | 'hidden';
	tabClassName?: string;
	tabStyle?: React.CSSProperties;
	contentClassName?: string;
	contentStyle?: React.CSSProperties;
	menuClassName?: string;
	menuStyle?: React.CSSProperties;
	menuItemClassName?: string;
	menuItemStyle?: React.CSSProperties;
	onTabChange?: (newIndex: number) => void;
}

export const Tab = ({
	menu,
	pages,
	defaultSelectedIndex,
	menuPosition = 'top',
	tabClassName,
	tabStyle,
	contentClassName,
	contentStyle,
	menuClassName,
	menuStyle,
	menuItemClassName,
	menuItemStyle,
	onTabChange,
}: Props) => {
	const isMobile = useIsMobile();

	const [selectedIndex, setSelectedIndex] = useState(defaultSelectedIndex);

	const isHorizontal = menuPosition === 'top' || menuPosition === 'bottom' || menuPosition === 'hidden';
	const isMenuHidden = menuPosition === 'hidden';

	const menuNode = !isMenuHidden && (
		<div
			className={clsx(
				'flex border-[#ccc]',
				isHorizontal ? 'flex-row' : 'flex-col',
				' backdrop-blur-sm',
				menuPosition === 'top' && 'border-b',
				menuPosition === 'right' && 'border-l',
				menuPosition === 'bottom' && 'border-t',
				menuPosition === 'left' && 'border-r',
				menuClassName
			)}
			style={menuStyle}
		>
			{menu.map((item, idx) => {
				const active = idx === selectedIndex;
				const disabled = item.disabled;

				return (
					<button
						key={idx}
						disabled={disabled}
						onClick={() => {
							!disabled && setSelectedIndex(idx);
							onTabChange && onTabChange(idx);
						}}
						className={clsx(
							'px-2 py-1 text-sm transition-all select-none',
							'flex items-center justify-center',
							isMobile && !isHorizontal ? 'grow' : '',
							active
								? 'text-black dark:text-white bg-white dark:bg-neutral-900 hover:bg-white dark:hover:bg-neutral-900'
								: 'text-gray-600 dark:text-neutral-400 bg-[#f7f7f7] dark:bg-neutral-800 hover:text-black dark:hover:text-white hover:bg-gray-100/70 dark:hover:bg-neutral-700',
							disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer',
							' border-[#ccc]',
							menuPosition === 'top' && 'mb-0 border-b-0 rounded-[4px_4px_0_0]',
							menuPosition === 'right' && 'ml-0 border-l-0 rounded-[0_4px_4px_0]',
							menuPosition === 'bottom' && 'mt-0 border-t-0 rounded-[0_0_4px_4px]',
							menuPosition === 'left' && 'mr-0 border-r-0 rounded-[4px_0_0_4px]',
							menuItemClassName
						)}
						style={menuItemStyle}
					>
						{item.title}
					</button>
				);
			})}
		</div>
	);

	const contentNode = (
		<div className={clsx('w-full h-full p-2 overflow-auto', 'text-gray-900 dark:text-neutral-100 content-area', contentClassName)} style={contentStyle}>
			{pages[selectedIndex]}
		</div>
	);

	return (
		<div className={clsx('flex w-full h-full', isHorizontal ? 'flex-col' : 'flex-row', 'tab-container rounded-[4px] bg-white dark:bg-neutral-900 border border-[#ccc] dark:border-neutral-600', tabClassName)} style={tabStyle}>
			{menuPosition === 'bottom' || menuPosition === 'right' ? (
				<>
					{contentNode}
					{menuNode}
				</>
			) : (
				<>
					{menuNode}
					{contentNode}
				</>
			)}
		</div>
	);
};
