import Image from 'next/image';
import mark_koujichu from '../../assets/img/mark_koujichu.png';

export const UnderConstruction = ({ size = 'center' }: { size?: 'small' | 'center' | 'large' }) => {
	let width = 100;
	switch (size) {
		case 'small':
			width = 60;
			break;
		case 'large':
			width = 120;
			break;
	}

	return (
		<div className="flex flex-wrap gap-4 justify-center items-center p-2">
			<img src={mark_koujichu.src} alt="工事中" width={width} height={width} />
			<div className="flex flex-col items-center">
				<p>工事中です</p>
				<p>Under Construction</p>
			</div>
		</div>
	);
};
