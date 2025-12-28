import { Divider } from '@/components/InfrastructureCompo/Divider';
import PrettyInputRadioGroup from '@/components/InfrastructureCompo/PrettyInputRadioGroup/PrettyInputRadioGroup';
import TitleContainer from '@/components/InfrastructureCompo/TitleContainer';
import Toggle from '@/components/InfrastructureCompo/Toggle';
import { useEffect, useState } from 'react';
import { JRTicketTypesettingtype } from './type';
import { DescriptionButton } from '@/components/InfrastructureCompo/DescriptionButton';
import OuterLink from '@/components/InfrastructureCompo/OuterLink';
import { getJRTicketTypeInfoByTicketType, getJRPrintingTicketTitleUnchinkasanAsteriskNum } from './utils';

interface TypeComponentCommonProps {
	onChange: (title: string, titleEn: string) => void;
}

export const RegularForm = ({ onChange }: TypeComponentCommonProps) => {
	const [hasKan, setHasKan] = useState(false);
	const [seatType, setSeatType] = useState('普通乗車券');
	const [isOufukuKaeri, setisOufukuKaeri] = useState(false);
	const [renzokuNumber, setrenzokuNumber] = useState('1');

	const [expressFormAvailable, setexpressFormAvailable] = useState(false);
	const [expressFormTitle, setExpressFormTitle] = useState('');
	useEffect(() => {
		let title = '';
		// eslint-disable-next-line prefer-const

		switch (seatType) {
			case '普通乗車券':
				title += '';
				title += '乗車券' + (expressFormAvailable && expressFormTitle.length !== 0 ? '・' + expressFormTitle : '');

				break;
			case '往復乗車券':
				if (isOufukuKaeri) {
					title += '乗車券（かえり）';
				} else {
					title += '乗車券（ゆき）';
				}

				break;
			case '連続乗車券':
				title += `乗車券（連続${renzokuNumber}）`;

				break;
			default:
				break;
		}

		const resTitle = title.replaceAll('（', '(').replaceAll('）', ')');
		onChange(resTitle, getJRTicketTypeInfoByTicketType(resTitle).nameen);
	}, [hasKan, expressFormTitle, expressFormAvailable, seatType, isOufukuKaeri, renzokuNumber]);
	return (
		<div>
			<PrettyInputRadioGroup
				showAsRadioButton
				doNotShowInputBox
				list={[
					{ value: '普通乗車券' },
					{
						value: '往復乗車券',
						title: (
							<div className="flex items-center">
								往復乗車券
								<PrettyInputRadioGroup
									itemStyle={{ padding: '4px 2px' }}
									showAsButtonGroup
									doNotShowInputBox
									list={[
										{ title: 'ゆき', value: false },
										{ title: 'かえり', value: true },
									]}
									value={isOufukuKaeri}
									onChange={(value) => {
										setSeatType('往復乗車券');
										setisOufukuKaeri(value);
									}}
								/>
							</div>
						),
					},
					{
						value: '連続乗車券',
						title: (
							<div className="flex items-center">
								連続乗車券
								<PrettyInputRadioGroup
									itemStyle={{ padding: '4px 2px' }}
									showAsButtonGroup
									list={[
										{ title: '１', value: '1' },
										{ title: '２', value: '2' },
									]}
									value={renzokuNumber.toString()}
									onChange={(value: string) => {
										setSeatType('連続乗車券');
										setrenzokuNumber(value);
									}}
								/>
							</div>
						),
					},
				]}
				value={seatType}
				onChange={(value) => {
					setSeatType(value);
				}}
			/>

			<TitleContainer addCheckbox disabled={!expressFormAvailable} title={'特急券・急行券付き'} onCheckboxChange={setexpressFormAvailable}>
				<ExpressForm
					isInRegularForm
					onChange={(title) => {
						setExpressFormTitle(title);
					}}
				/>
			</TitleContainer>
		</div>
	);
};

export const ExpressForm = ({ onChange, isInRegularForm = false }: TypeComponentCommonProps & { isInRegularForm?: boolean }) => {
	const [isTokutei, setIsTokutei] = useState(false);
	const [isBTokyuuRyoukin, setIsBTokyuuRyoukini] = useState(false);
	const [expressType, setExpressType] = useState('特急券');
	const [seatType, setSeatType] = useState('指定席');
	const [sleepingSeatType, setSleepingSeatType] = useState(isInRegularForm ? '' : 'B寝台開放式');

	const [sleepingSeatTypeFormAvailable, setsleepingSeatTypeFormAvailable] = useState(false);
	useEffect(() => {
		let title = '';
		let type = JRTicketTypesettingtype.Fare;
		title += '';
		switch (expressType) {
			case '特急券':
			case '急行券':
				title += expressType;
				type = JRTicketTypesettingtype.Express;
				switch (seatType) {
					case '指定席':
						title = title;
						if (isBTokyuuRyoukin) {
							title = 'B' + title;
						}
						break;
					case '新幹線指定席':
						title = '新幹線特急券';
						break;
					case '立席':
						title = seatType + title;
						break;
					case '自由席':
						if (isTokutei) {
							title = '特定特急券';
						} else {
							title = seatType + title;
							if (isBTokyuuRyoukin) {
								title = 'B' + title;
							}
						}
						break;
					case '新幹線自由席':
						title = seatType + title;
						if (isTokutei) {
							title += '／特定特急券';
						}
						break;
					case '新幹線特定特急券立席':
						title = '新幹線特定特急券（立席）';
						break;
					case '座席未指定券':
						title = title + '（座席未指定）';
						break;
					default:
						break;
				}

				break;
			case '普通列車用グリーン券':
				title += '普通列車用グリーン券';

				break;
			case '寝台料金券':
				title += '寝台料金券';
				type = JRTicketTypesettingtype.Express;

				break;
			default:
				break;
		}
		if (sleepingSeatTypeFormAvailable) {
			switch (sleepingSeatType) {
				case 'A寝台開放式':
					title += '・A寝台';
					break;
				case 'B寝台開放式':
					title += '・B寝台';
					break;
				case 'A寝台個室':
					title += '・A寝台（個）';
					break;
				case 'B寝台個室':
					title += '・B寝台（個）';
					break;
				case 'グリーン券':
					title += '・グリーン券';

					break;
				default:
					break;
			}
		}
		const resTitle = title.replaceAll('（', '(').replaceAll('）', ')');
		onChange(resTitle, getJRTicketTypeInfoByTicketType(resTitle).nameen);
	}, [expressType, isTokutei, isBTokyuuRyoukin, seatType, sleepingSeatType, sleepingSeatTypeFormAvailable]);
	return (
		<div>
			<PrettyInputRadioGroup
				style={{ margin: '4px 0' }}
				itemStyle={{ padding: '4px 8px' }}
				doNotShowInputBox
				list={[{ value: '特急券' }, { value: '急行券' }, ...(isInRegularForm ? [] : [{ value: '普通列車用グリーン券' }, { value: '寝台料金券' }])]}
				value={expressType}
				onChange={(value) => {
					setExpressType(value);
				}}
			/>

			<PrettyInputRadioGroup
				disabled={expressType === '普通列車用グリーン券' || expressType === '寝台料金券'}
				showAsRadioButton
				doNotShowInputBox
				list={[
					{ value: '指定席' },
					{ value: '自由席' },
					{ value: '立席' },
					{ value: '新幹線指定席' },
					{ value: '新幹線自由席' },
					{
						value: '新幹線特定特急券立席',
						title: (
							<span>
								新幹線特定特急券立席
								<DescriptionButton title={'←なんですか？'} modalTitle="新幹線特定特急券立席とは？">
									　全車指定席の新幹線の一部区間（例：はやぶさの盛岡～新青森～新函館北斗区間）は、指定席券を買わなくても特定特急券で空席に座ることが可能です。
									<br />
									　そんな区間に乗車する時にお買い求めしたきっぷは「新幹線特定特急券（立席）」というタイトルです。
									<br />
									　「新幹線特定特急券（立席）」は普通の新幹線自由席券券面と違って、車両名が記載されて、発車時刻はありません。下に「当日の普通車空席にお座り下さい」の文が見えます。
								</DescriptionButton>
							</span>
						),
					},
					{
						value: '座席未指定券',
						title: <span>座席未指定券{/* <DescriptionButton title={'←なんですか？'}>あ</DescriptionButton> */}</span>,
					},
				]}
				value={seatType}
				onChange={(value) => {
					setSeatType(value);
				}}
			/>

			<Divider />
			<div className="flex flex-wrap">
				<Toggle
					size={0.8}
					value={isTokutei}
					onChange={setIsTokutei}
					disabled={expressType === '普通列車用グリーン券' || expressType === '寝台料金券' || (seatType !== '自由席' && seatType !== '新幹線自由席')}
				>
					特定特急券
					<DescriptionButton title={'なんですか？'} modalTitle="特定特急券の解説">
						特定区間の自由席特急列車に乗ると、やや安くなる特急券
					</DescriptionButton>
				</Toggle>
				<Toggle
					size={0.8}
					value={isBTokyuuRyoukin}
					onChange={setIsBTokyuuRyoukini}
					disabled={expressType === '普通列車用グリーン券' || expressType === '寝台料金券' || (seatType !== '自由席' && seatType !== '指定席')}
				>
					B特急料金
					<DescriptionButton title={'なんですか？'} modalTitle="B特急料金の解説">
						<div>
							<img src="https://railway.jr-central.co.jp/ticket-rule/_img/r34_01.gif" />
							<p>
								B特急料金は、上図区間内の特急列車に適用する特急料金。
								<br />
								普段の特急料金（A特急料金）よりはやや安く設定しています。
								<br />
								また、B特急料金は最繁忙期400円増し、繁忙期200円増し、閑散期（JR九以外）200円引きとなっています。
								<br />
							</p>
							<OuterLink link="https://railway.jr-central.co.jp/ticket-rule/rule34.html">https://railway.jr-central.co.jp/ticket-rule/rule34.html</OuterLink>
						</div>
					</DescriptionButton>
				</Toggle>
			</div>

			{!isInRegularForm && (
				<>
					<Divider />
					<TitleContainer
						addCheckbox={expressType !== '寝台料金券'}
						allDisabled={expressType === '普通列車用グリーン券'}
						disabled={!(expressType === '寝台料金券' || sleepingSeatTypeFormAvailable)}
						onCheckboxChange={setsleepingSeatTypeFormAvailable}
						title={expressType === '寝台料金券' ? '寝台席タイプ' : '寝台券・グリーン券付き特急券'}
					>
						<PrettyInputRadioGroup
							showAsRadioButton
							doNotShowInputBox
							list={[
								{ value: 'A寝台開放式' },
								{ value: 'B寝台開放式' },
								{ value: 'A寝台個室' },
								{ value: 'B寝台個室' },
								...(expressType === '寝台料金券' ? [] : [{ value: 'グリーン券' }]),
							]}
							value={sleepingSeatType}
							onChange={(value) => {
								setSleepingSeatType(value);
							}}
						/>
					</TitleContainer>
				</>
			)}
		</div>
	);
};

export const ReservedForm = ({ onChange }: TypeComponentCommonProps) => {
	const [seatType, setSeatType] = useState('指定券');
	const [isGreen, setIsGreen] = useState(false);
	const [sleepingSeatType, setSleepingSeatType] = useState('(B寝台)');

	useEffect(() => {
		let title = '';
		switch (seatType) {
			case '指定券':
				title += '指定券';
				if (isGreen) {
					title += '(グリーン)';
				}

				break;
			case '指定席券':
				title += '指定席券';

				break;
			case '新幹線指定券':
				title += '新幹線指定券';
				if (isGreen) {
					title += '(グリーン)';
				}

				break;
			case '寝台指定券':
				title += '寝台指定券' + sleepingSeatType;

				break;
			case 'バス指定券':
				title += 'バス指定券';

				break;
			default:
				break;
		}
		const resTitle = title.replaceAll('（', '(').replaceAll('）', ')');
		onChange(resTitle, getJRTicketTypeInfoByTicketType(resTitle).nameen);
	}, [seatType, sleepingSeatType, isGreen]);
	return (
		<div>
			<PrettyInputRadioGroup
				style={{ margin: '4px 0' }}
				itemStyle={{ padding: '4px 8px' }}
				doNotShowInputBox
				list={[{ value: '指定券' }, { value: '指定席券' }, { value: '新幹線指定券' }, { value: '寝台指定券' }, { value: 'バス指定券' }]}
				value={seatType}
				onChange={(value) => {
					setSeatType(value);
				}}
			/>
			<Divider />
			<Toggle size={0.8} value={isGreen} onChange={setIsGreen} disabled={seatType !== '指定券' && seatType !== '新幹線指定券'}>
				グリーン
			</Toggle>
			<TitleContainer allDisabled={seatType !== '寝台指定券'} title="寝台指定券">
				<PrettyInputRadioGroup
					showAsRadioButton
					doNotShowInputBox
					list={[
						{ value: '(A寝台)', title: 'A寝台開放式' },
						{ value: '(B寝台)', title: 'B寝台開放式' },
						{ value: '(A個)', title: 'A寝台個室' },
						{ value: '(B個)', title: 'B寝台個室' },
					]}
					value={sleepingSeatType}
					onChange={(value) => {
						setSleepingSeatType(value);
					}}
				/>
			</TitleContainer>
		</div>
	);
};

export const AdmissionForm = ({ onChange }: TypeComponentCommonProps) => {
	useEffect(() => {
		onChange('普通入場券', '');
	}, []);
	return <div></div>;
};

export const CustomForm = ({ onChange, ticketTitle, ticketTitleEn }: TypeComponentCommonProps & { ticketTitle: string; ticketTitleEn: string }) => {
	const [ticketNameTextboxText, setTicketNameTextboxText] = useState(ticketTitle);
	const [ticketNameEnTextboxText, setTicketNameEnTextboxText] = useState(ticketTitleEn);
	return (
		<div className="flex gap-2 flex-wrap">
			<label>
				券名
				<input
					value={ticketTitle}
					onChange={(e) => {
						setTicketNameTextboxText(e.target.value);
						onChange(e.target.value, ticketNameEnTextboxText);
					}}
				/>
			</label>
			<label>
				外国語券名
				<input
					value={ticketTitleEn}
					onChange={(e) => {
						setTicketNameEnTextboxText(e.target.value);
						onChange(ticketNameTextboxText, e.target.value);
					}}
				/>
			</label>
		</div>
	);
};
