import { Modal } from '../InfrastructureCompo/Modal';
import { useLocale } from '@/utils/hooks/useLocale';
import { JRStationNameType } from '../TicketEditors/JRWideTicket/type';
import { JRStationNameText } from '../InfrastructureCompo/JRStationNameText';
import { JRCompanies, JRStationNameTypeRadioboxItemData } from '../TicketEditors/JRWideTicket/value';
import Toggle from '../InfrastructureCompo/Toggle';
import { useState } from 'react';
import { useIsMobile } from '@/utils/hooks';

interface Props {
	show: boolean;
	onClose: () => void;
	onSelect: (selectedStationName: { type: JRStationNameType; company: string; name: string; areaChar: string; en?: string }) => void;
}

const JRPresetStationNames = [
	{ type: JRStationNameType.Normal, company: 'E', name: '東京山手線内', areaChar: '山', en: '' },
	{ type: JRStationNameType.Normal, company: 'E', name: '東京都区内', areaChar: '区' },
	{ type: JRStationNameType.Normal, company: 'H', name: '札幌市内', areaChar: '札' },
	{ type: JRStationNameType.Normal, company: 'E', name: '仙台市内', areaChar: '仙' },
	{ type: JRStationNameType.Normal, company: 'E', name: '横浜市内', areaChar: '浜' },
	{ type: JRStationNameType.Normal, company: 'C', name: '名古屋市内', areaChar: '名' },
	{ type: JRStationNameType.Normal, company: 'W', name: '京都市内', areaChar: '京' },
	{ type: JRStationNameType.Normal, company: 'W', name: '大阪市内', areaChar: '阪' },
	{ type: JRStationNameType.Normal, company: 'W', name: '神戸市内', areaChar: '神' },
	{ type: JRStationNameType.Normal, company: 'W', name: '広島市内', areaChar: '広' },
	{ type: JRStationNameType.Normal, company: 'K', name: '北九州市内', areaChar: '九' },
	{ type: JRStationNameType.Normal, company: 'K', name: '福岡市内', areaChar: '福' },
	{ type: JRStationNameType.Normal, company: 'E', name: '東京・品川', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'K', name: '小波瀬西工大前', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'K', name: '歓遊舎ひこさん', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'K', name: 'スペースワールド', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'O', name: '東京テレポート', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'E', name: '西仙台ハイランド', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'K', name: 'ハウステンボス', areaChar: '' },
	{ type: JRStationNameType.Small, company: 'W', name: 'りんくうタウン', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: 'あしかが/フラワーパーク', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'O', name: '浅草/（東武鉄道）', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'O', name: 'えちご押上/ひすい海岸', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'W', name: '黒部/宇奈月温泉', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: '越谷/レイクタウン', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: 'サンキューちば/フリーエリア', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: '上越国際/スキー場前', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: 'スカイアクセス/成田空港', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'O', name: 'とうきょう/スカイツリー', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: '成田空港/（成田第１）', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'E', name: '空港第２ビル/（成田第２）', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'O', name: '羽田空港国内線/ターミナル', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'O', name: '羽田空港国際線/ターミナル', areaChar: '' },
	{ type: JRStationNameType.UpAndDownAlignLeft, company: 'O', name: '羽田空港第１ビル/羽田空港第２ビル', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'O', name: '羽田空港/第２ビル', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'C', name: '池の浦/シーサイド', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'H', name: '奥津軽/いまべつ', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'S', name: 'オレンジ/タウン', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: 'さいたま/新都心', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: 'さくらんぼ/東根', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'O', name: '鈴鹿/サーキツト稲生', areaChar: '', en: 'Suzukasakittoinoo' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'O', name: '長者ヶ浜潮騒/はまなす公園前', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: '東京・品川/（山手線内）', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'O', name: '東武ワールド/スクウェア', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: '八王子/みなみ野', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: 'ひたち野/うしく', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'O', name: '南町田グラン/ベリーパーク', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: 'ヤナバ/スキー場前', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'W', name: 'ユニバーサル/シティ', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignCenter, company: 'E', name: 'ＢＲＴ/奇跡の一本松', areaChar: '' },
	{ type: JRStationNameType.UpAlignLeftAndDownAlignRight, company: 'H', name: 'サッポロ/ビール庭園', areaChar: '' },
	{ type: JRStationNameType.LeftVerticalAndRightLarge, company: 'E', name: '岩原/スキー場前', areaChar: '' },
	{ type: JRStationNameType.LeftVerticalAndRightLarge, company: 'E', name: '行川/アイランド', areaChar: '' },
	{ type: JRStationNameType.LeftVerticalAndRightLarge, company: 'O', name: '府中/競馬正門前', areaChar: '' },
	{ type: JRStationNameType.LeftLargeAndRightSmall, company: 'H', name: 'あいの里/教育大', areaChar: '' },
	{ type: JRStationNameType.LeftLargeAndRightSmall, company: 'O', name: '京王多摩/センター', areaChar: '' },
	{ type: JRStationNameType.LeftLargeAndRightSmall, company: 'E', name: '高輪/ゲートウェイ', areaChar: '' },
	{ type: JRStationNameType.LeftLargeAndRightSmall, company: 'H', name: '北海道/医療大学', areaChar: '' },
	{ type: JRStationNameType.LeftLargeAndRightSmall, company: 'E', name: '新宿/（都区内）', areaChar: '' },
	{ type: JRStationNameType.LeftLargeAndRightVertical, company: 'E', name: 'かみのやま/温泉', areaChar: '' },
	{ type: JRStationNameType.LeftSmallAndRightLarge, company: 'E', name: '（信）/横川', areaChar: '' },
	{ type: JRStationNameType.LeftSmallAndRightLarge, company: 'E', name: 'ＢＲＴ/祝原', areaChar: '' },
	{ type: JRStationNameType.LeftLargeRightUpAndDown, company: 'E', name: '鹿島/サッカー/スタジアム', areaChar: '' },
	{ type: JRStationNameType.LeftUpAndDownRightLarge, company: 'O', name: '運転/免許/試験場', areaChar: '' },
	{ type: JRStationNameType.LeftUpAndDownRightLarge, company: 'O', name: 'モノ/レール/浜松町', areaChar: '' },
];

export const JRPresetStationsModal = ({ show, onClose, onSelect }: Props) => {
	const { t, locale } = useLocale();
	const isMobile = useIsMobile();

	const [showAsCompany, setShowAsCompany] = useState(true);

	return (
		<Modal title={t('JRPresetStationsModal.title')} isOpen={show} onClose={onClose} style={{ maxWidth: isMobile ? '100%' : '60%' }}>
			<p className="ml-10">※{t('JRPresetStationsModal.tip')}</p>
			<div className="flex flex-row flex-wrap mb-10">
				{Object.entries(
					JRPresetStationNames.reduce<Record<string, { type: JRStationNameType; company: string; name: string; areaChar: string; en?: string }[]>>((acc, item) => {
						(acc[showAsCompany ? item.company : item.type] ||= []).push(item);
						return acc;
					}, {})
				).map(([type, items]) => (
					<div key={type} className="w-fit" style={{ marginLeft: isMobile ? '0' : '40px' }}>
						<div className="text-sm font-semibold mt-1 mb-0" style={{ color: showAsCompany ? JRCompanies.find((item) => item.value === type)?.color : 'black' }}>
							{showAsCompany ? JRCompanies.find((item) => item.value === type)?.name : JRStationNameTypeRadioboxItemData[Number(type)].name}
						</div>
						<div className="flex flex-wrap gap-1">
							{items.map((JRPresetStationNamesItem, index) => {
								return (
									<button
										key={index}
										className="min-h-[36px] bg-[#DDF6EE] hover:bg-[#8ce6cb]"
										onClick={() => {
											onSelect(JRPresetStationNamesItem);
										}}
									>
										<JRStationNameText
											stationName={JRPresetStationNamesItem.name}
											stationAreaChar={JRPresetStationNamesItem.areaChar}
											stationNameType={JRPresetStationNamesItem.type}
											className="min-w-[70px]"
										/>
									</button>
								);
							})}
						</div>
					</div>
				))}
			</div>
			<label className="ml-10">
				<span className="mr-2">{t('JRPresetStationsModal.showAsCompanyButton')}</span>
				<Toggle
					value={showAsCompany}
					onChange={(value) => {
						setShowAsCompany((prev) => !prev);
					}}
				/>
			</label>
		</Modal>
	);
};
