'use client';

import { useEffect, useRef, useState } from 'react';
import cr_red from '../../assets/cr_red.png';
import './index.css';
import TicketEditorTemplate from '../TicketEditorTemplate';
import { drawQRCode } from '@/utils/utils';

export default function TrainTicket() {
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const ctxRef = useRef<CanvasRenderingContext2D | null>(null);
	const scaleXRef = useRef<(x: number) => number>(null);
	const scaleYRef = useRef<(y: number) => number>(null);
	const fontSizeRef = useRef<(size: number, isSerif?: boolean) => string>(null);

	const [ticketNo, setTicketNo] = useState('A000001');
	const [station1, setStation1] = useState('東京都区内');
	const [station2, setStation2] = useState('北京朝陽');
	const [station1en, setStation1en] = useState('Tokyo Ward Area');
	const [station2en, setStation2en] = useState('Beijingchaoyang');
	const [routeIdentifier, setRouteIdentifier] = useState('Z1140');
	const [date, setDate] = useState(new Date());
	const [time, setTime] = useState('11:55');
	const [carriage, setCarriage] = useState('04');
	const [seat1, setSeat1] = useState('12');
	const [seat2, setSeat2] = useState('F');
	const [seatClass, setSeatClass] = useState('二等座');
	const [price, setPrice] = useState('1540.0');
	const [idNumber, setIdNumber] = useState('1145141980****1919');
	const [passenger, setPassenger] = useState('田所浩二');
	const [soldplace, setSoldPlace] = useState('稚内');

	const canvasWidth = 322;
	const canvasHeight = (canvasWidth / 800) * 548;

	const drawTicket = () => {
		handleDraw(canvasRef.current, ctxRef.current, scaleXRef.current, scaleYRef.current, fontSizeRef.current);
	};

	const handleDraw = (
		canvas: HTMLCanvasElement | null,
		ctx: CanvasRenderingContext2D | null,
		scaleX: ((x: number) => number) | null,
		scaleY: ((y: number) => number) | null,
		fontSize: ((size: number, isSerif?: boolean) => string) | null
	) => {
		if (!ctx || !canvas || !scaleX || !scaleY || !fontSize) {
			return;
		}

		const w = canvas.width;
		const h = canvas.height;
		const backgroundEdgeHori = 0.04;
		const backgroundEdgeVert = 0.07;

		const bg = new Image();
		bg.src = cr_red.src;
		bg.onload = () => {
			ctx.fillStyle = 'white';
			ctx.fillRect(0, 0, w, h);
			// 底图
			ctx.drawImage(bg, w * backgroundEdgeHori, h * backgroundEdgeVert, w * (1 - 2 * backgroundEdgeHori), h * (1 - 2 * backgroundEdgeVert));

			// 票号
			ctx.fillStyle = '#f89c9c';
			ctx.font = `${fontSize(8)}`;
			ctx.fillText(ticketNo, scaleX(118), scaleY(224));

			// 票样
			ctx.beginPath();
			ctx.strokeStyle = '#ffbbbb';
			ctx.lineWidth = 1;
			ctx.font = `${fontSize(26)}`;
			//ctx.strokeText('票     样', scaleX(380), scaleY(670));
			ctx.closePath();

			// 售票点
			ctx.fillStyle = 'black';
			ctx.font = `${fontSize(6, true)}`;
			ctx.fillText(soldplace, scaleX(1315), scaleY(210));

			ctx.beginPath();
			ctx.arc(scaleX(1500), scaleY(185), scaleY(40), 0, 2 * Math.PI);
			ctx.strokeStyle = 'black';
			ctx.lineWidth = scaleX(5);
			ctx.stroke();
			ctx.closePath();

			ctx.font = `${fontSize(6, true)}`;
			ctx.fillStyle = 'black';
			ctx.fillText('售', scaleX(1468), scaleY(210));

			// 中文站名
			ctx.font = `${fontSize(5.5, true)}`;
			ctx.fillText('站', scaleX(538), scaleY(321));
			ctx.fillText('站', scaleX(1407), scaleY(321));

			ctx.font = `${fontSize(8.5)}`;
			ctx.fillText(station1, scaleX(197), scaleY(335), scaleX(322));
			ctx.fillText(station2, scaleX(1054), scaleY(335), scaleX(322));

			// 英文站名
			ctx.font = fontSize(4.5, true);
			ctx.fillText(station1en, scaleX(183), scaleY(397), scaleX(772));
			ctx.fillText(station2en, scaleX(1072), scaleY(397), scaleX(772));

			// 车次
			ctx.beginPath();
			ctx.strokeStyle = 'black';
			ctx.lineWidth = scaleY(6);
			ctx.moveTo(scaleX(716), scaleY(350));
			ctx.lineTo(scaleX(1006), scaleY(350));
			ctx.stroke();
			ctx.closePath();

			ctx.beginPath();
			ctx.lineWidth = scaleY(1);
			ctx.moveTo(scaleX(1006), scaleY(350));
			ctx.lineTo(scaleX(983), scaleY(350));
			ctx.lineTo(scaleX(964), scaleY(337));
			ctx.lineTo(scaleX(961), scaleY(333));
			ctx.lineTo(scaleX(979), scaleY(337));
			ctx.fill();
			ctx.closePath();

			ctx.font = `${fontSize(8, true)}`;
			ctx.fillText(routeIdentifier, scaleX(720), scaleY(332), scaleX(281));

			// 日期时间
			ctx.font = fontSize(4, true);
			ctx.fillText(`年          月         日                  开`, scaleX(310), scaleY(474));
			ctx.fillText(`车           号`, scaleX(1171), scaleY(484));

			ctx.font = fontSize(6);
			ctx.fillText(`${date.getFullYear()}     ${(date.getMonth() + 1).toString().padStart(2, '0')}     ${date.getDate().toString().padStart(2, '0')}      ${time}`, scaleX(148), scaleY(482));
			ctx.fillText(`${carriage}    ${seat1}`, scaleX(1096), scaleY(489));

			ctx.font = fontSize(5, true);
			ctx.fillText(`${seat2}`, scaleX(1308), scaleY(481));
			// 价格
			ctx.font = fontSize(4, true);
			ctx.fillText(`元`, scaleX(380), scaleY(561));
			ctx.font = fontSize(6);
			ctx.fillText(`￥${price}`, scaleX(163), scaleY(568), scaleX(216));

			// 车厢
			ctx.font = fontSize(6, true);
			ctx.fillText(`${seatClass}`, scaleX(1223), scaleY(579), scaleX(318));

			// 车厢
			ctx.font = fontSize(6, true);
			ctx.fillText(`限乘当日当次车`, scaleX(140), scaleY(730));

			// 身份证+姓名
			ctx.font = fontSize(6);
			ctx.fillText(idNumber, scaleX(133), scaleY(824));
			ctx.font = fontSize(6, true);
			ctx.fillText(passenger, scaleX(839), scaleY(824));

			// 说明
			ctx.strokeStyle = 'black';
			ctx.lineWidth = scaleX(4);
			ctx.setLineDash([scaleX(23), scaleX(10)]);
			ctx.strokeRect(scaleX(208), scaleY(850), scaleX(959), scaleY(150));
			ctx.setLineDash([]);

			ctx.font = fontSize(4.5, true);
			ctx.fillText('      买票请到12306 发货请到95306', scaleX(265), scaleY(908));
			ctx.fillText('            中国铁路祝您旅途愉快', scaleX(265), scaleY(979));

			//QR
			drawQRCode(
				ctx,
				scaleX(1223),
				scaleY(736),
				scaleX(380),
				`${station1}-${station2} No.${ticketNo} ${date.toISOString().slice(0, 10)} ${time} ${seatClass}车 ${carriage}${seat1}号 ￥${price}元`
			);

			// code
			ctx.font = fontSize(5.5, true);
			ctx.fillText('1145141919810', scaleX(133), scaleY(1080));
		};
	};

	useEffect(() => {
		drawTicket();
	}, [ticketNo, station1, station2, station1en, station2en, routeIdentifier, date, time, carriage, seat1, seat2, seatClass, price, idNumber, passenger]);

	return (
		<TicketEditorTemplate
			onCanvasLoad={function (
				canvas: HTMLCanvasElement,
				ctx: CanvasRenderingContext2D | null,
				scaleX: (x: number) => number,
				scaleY: (y: number) => number,
				fontSize: (size: number, isSerif?: boolean) => string
			): void {
				canvasRef.current = canvas;
				ctxRef.current = ctx;
				scaleXRef.current = scaleX;
				scaleYRef.current = scaleY;
				fontSizeRef.current = fontSize;
				drawTicket();
			}}
			canvasWidth={canvasWidth}
			canvasHeight={canvasHeight}
			scaleXWidth={1698}
			scaleYWidth={1162}
			saveFilename={`ticket_${station1}-${station2}`}
			form={
				<div className="flex flex-col gap-4 m-10">
					<label className="ticket-form-label">
						票号
						<input className="text-red-500" value={ticketNo} onChange={(e) => setTicketNo(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						出发
						<input value={station1} onChange={(e) => setStation1(e.target.value)} />
					</label>

					<label className="ticket-form-label">
						到达
						<input value={station2} onChange={(e) => setStation2(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						出发英文
						<input value={station1en} onChange={(e) => setStation1en(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						到达英文
						<input value={station2en} onChange={(e) => setStation2en(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						车次
						<input value={routeIdentifier} onChange={(e) => setRouteIdentifier(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						购票处
						<input className="" value={soldplace} onChange={(e) => setSoldPlace(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						發车日期
						<input type="date" value={date.toISOString().slice(0, 10)} onChange={(e) => setDate(new Date(e.target.value))} />
					</label>
					<label className="ticket-form-label">
						發车时间
						<input type="time" value={time} onChange={(e) => setTime(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						车厢
						<input value={carriage} onChange={(e) => setCarriage(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						座位1
						<input value={seat1} onChange={(e) => setSeat1(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						座位2
						<input value={seat2} onChange={(e) => setSeat2(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						座席
						<input value={seatClass} onChange={(e) => setSeatClass(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						价格
						<input value={price} onChange={(e) => setPrice(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						乘车人证件号
						<input value={idNumber} onChange={(e) => setIdNumber(e.target.value)} />
					</label>
					<label className="ticket-form-label">
						乘车人
						<input value={passenger} onChange={(e) => setPassenger(e.target.value)} />
					</label>
				</div>
			}
		/>
	);
}
