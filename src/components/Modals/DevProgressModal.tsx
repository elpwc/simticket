import { useState } from 'react';
import { Modal } from '../InfrastructureCompo/Modal';
import OuterLink from '../InfrastructureCompo/OuterLink';
import { useLocale } from '@/utils/hooks/useLocale';

interface Props {
	show: boolean;
	onClose: () => void;
}

export const DevProgressModal = ({ show, onClose }: Props) => {
	const { t, locale } = useLocale();

	return (
		<Modal title={'声明'} isOpen={show} onClose={onClose} showOkButton onOk={onClose}>
			{locale === 'ja' ? (
				<div className="flex flex-col">
					<p>
						　simTicket <span className="font-bold">内部テスト版</span>へようこそ
					</p>
					<p>
						　simTicket は、2025年10月に CR（中国国家鉄路）が紙製乗車券（経費精算用領収書）を完全廃止したことをきっかけに、私（<OuterLink link="https://x.com/elpwc">うに＠elpwc</OuterLink>
						）が制作したオンライン乗車券生成ツールです
					</p>
					<p>　現在 simTicket はまだ開発途中の段階ですが、10月22日にテスト用URLが突然流出・拡散されたため、未完成ながらも内部テストという形で一般公開することにしました</p>
					<p>　そのため、未実装の機能や不具合が多く存在します。ぜひ皆さんのフィードバックをお寄せいただければ大変うれしいです</p>
					<p>　CRの乗車券以外にも、JR、TR、VNR、THSR など、私が実際に乗車した鉄道会社の乗車券ジェネレーターも提供していく予定です</p>
					<p>　切符に記載されるあらゆる要素をできる限り再現し、最も完成度の高いチケット生成ツールを目指します</p>
					<p>
						　開発の進捗は、Twitterアカウントで随時更新しています：<OuterLink link="https://x.com/elpwc">うに＠elpwc</OuterLink>
					</p>
					<br />
					<p className="w-full text-center">免責事項</p>
					<p>　simTicket は個人の娯楽および学習目的のみにご利用ください。生成された乗車券を商業目的または不正な用途で使用することは禁止されています。</p>
					<br />

					<p className="font-bold">TODO list:</p>
					<ul>
						<li>・JR MARS券対応</li>
						<li>・多言語対応</li>
						<li>・生成結果の共有ページ（他ユーザーが作成したチケットを閲覧できるギャラリー機能）</li>
					</ul>
					<br />

					<p>開発に際してご協力・助言をくださったすべての方に心より感謝いたします。</p>

					<br />
					<p className="text-right w-full">2025年 10月 23日 うに</p>
				</div>
			) : (
				<div className="flex flex-col">
					<p>
						　欢迎使用 simTicket <span className="font-bold">内部测试版本</span>
					</p>
					<p>
						　simTicket 是在2025年10月 CR（中国国铁）彻底废止纸质报销凭证之际，由我（<OuterLink link="https://x.com/elpwc">うに＠elpwc</OuterLink>）推出的在线票面生成工具
					</p>
					<p>　目前 simTicket 还在未完成的开發阶段。但是由于测试网址在10月22日突然被泄露和广泛传播，于是我决定以半成品的形式先行向大家以内部测试的形式公开网页。</p>
					<p>　所以会出现不少未完成的功能和问题，欢迎大家反馈</p>
					<p>　在 CR 车票样式以外，我也计划提供 JR，TR, VNR, THSR 等我坐过的铁道公司的车票制作器。</p>
					<p>　我会尽可能考虑、覆盖到票面上所有可能出现的情况，努力坐到最完美的车票制作器。</p>
					<br />
					<p>
						　可以前往我的推特关注开發进度：<OuterLink link="https://x.com/elpwc">うに＠elpwc</OuterLink>
					</p>
					<br />
					<p className="w-full text-center">免责声明</p>
					<p>　simTicket 仅供个人娱乐和学习用途，请勿将生成的车票用于商业用途或非法用途。</p>
					<br />

					<br />
					<p className="font-bold">TODO list:</p>
					<ul>
						<li>・JR MARS券対応</li>
						<li>・多语言对应</li>
						<li>・生成结果共享页，可以鉴赏其他人发布的自制车票</li>
					</ul>
					<br />

					<p>在此感谢在开發过程中所有对我提供过帮助的人。</p>

					<br />
					<p className="text-right w-full">2025年 10月 23日 うに</p>
				</div>
			)}
		</Modal>
	);
};
