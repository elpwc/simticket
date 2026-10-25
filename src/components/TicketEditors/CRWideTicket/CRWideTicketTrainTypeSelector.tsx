'use client';

import { useEffect, useState } from 'react';
import PrettyInputRadioGroup from '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import { CR_TRAIN_TYPES, CR_TRAIN_TYPES_2026 } from './value';
import { useLocale } from '@/utils/hooks/useLocale';
import '../../InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup.css';

interface Props {
	value: string;
	onChange: (value: string) => void;
}

const oldValues = new Set(CR_TRAIN_TYPES.map((type) => type.value));
const newValues = new Set(CR_TRAIN_TYPES_2026.map((type) => type.value));

const toRadioList = (types: typeof CR_TRAIN_TYPES) =>
	types.map((type) => ({
		value: type.value,
		title: (
			<span>
				{type.value}
				<span className="text-[10px]">{type.desc}</span>
			</span>
		),
	}));

const resolveGroup = (value: string, current: 'old' | '2026' | ''): 'old' | '2026' | '' => {
	const inOld = oldValues.has(value);
	const inNew = newValues.has(value);
	if (inOld && inNew) {
		return current === '2026' ? '2026' : 'old';
	}
	if (inOld) return 'old';
	if (inNew) return '2026';
	return '';
};

export const CRWideTicketTrainTypeSelector = ({ value, onChange }: Props) => {
	const { t } = useLocale();
	const [selectedGroup, setSelectedGroup] = useState<'old' | '2026' | ''>(() => resolveGroup(value, 'old'));
	const [diyValue, setDiyValue] = useState('');

	useEffect(() => {
		setSelectedGroup((prev) => resolveGroup(value, prev));
	}, [value]);

	const isCustomActive = selectedGroup === '';

	return (
		<div className="flex flex-col gap-1 w-full">
			<div className="flex items-center gap-2 flex-wrap">
				<span className="shrink-0 text-[13px] font-medium w-14">{t('editor.cr.jisuanjikepiao2010.trainInfo.oldTrainTypes')}</span>
				<PrettyInputRadioGroup
					list={toRadioList(CR_TRAIN_TYPES)}
					value={selectedGroup === 'old' ? value : ''}
					onChange={(next: string) => {
						setSelectedGroup('old');
						onChange(next);
					}}
					doNotShowInputBox
				/>
			</div>
			<div className="flex items-center gap-2 flex-wrap">
				<span className="shrink-0 text-[13px] font-medium w-14">{t('editor.cr.jisuanjikepiao2010.trainInfo.newTrainTypes2026')}</span>
				<PrettyInputRadioGroup
					list={toRadioList(CR_TRAIN_TYPES_2026)}
					value={selectedGroup === '2026' ? value : ''}
					onChange={(next: string) => {
						setSelectedGroup('2026');
						onChange(next);
					}}
					doNotShowInputBox
				/>
			</div>
			<input
				type="text"
				className={`radio-diy-input ${isCustomActive ? 'active' : ''}`}
				placeholder={t('editor.cr.jisuanjikepiao2010.trainInfo.pukepukuaiOrCustom')}
				value={isCustomActive ? value || diyValue : diyValue}
				onClick={() => {
					setSelectedGroup('');
					onChange(diyValue);
				}}
				onChange={(e) => {
					const next = e.target.value;
					setDiyValue(next);
					setSelectedGroup('');
					onChange(next);
				}}
			/>
		</div>
	);
};
