'use client';

import React, { ReactNode, useEffect } from 'react';
import './index.css';
import clsx from 'clsx';

type Props = {
	isOpen: boolean;
	onClose: () => void;
	onOk?: () => void;
	onCancel?: () => void;
	onCancel2?: () => void;
	showOkButton?: boolean;
	showCancelButton?: boolean;
	showCancel2Button?: boolean;
	okText?: string;
	cancelText?: string;
	cancel2Text?: string;
	title?: string | ReactNode;
	children: ReactNode;
	mobileMode?: 'fullscreen' | 'scroll' | 'center';
	showCloseButton?: boolean;
	className?: string;
	style?: React.CSSProperties;
	bodyClassName?: string;
	bodyStyle?: React.CSSProperties;
};

export const Modal: React.FC<Props> = ({
	isOpen,
	onClose,
	onOk,
	onCancel,
	onCancel2,
	showOkButton = false,
	showCancelButton = false,
	showCancel2Button = false,
	okText = 'OK',
	cancelText = 'キャンセル',
	cancel2Text = '取り消し',
	title,
	children,
	mobileMode = 'fullscreen',
	showCloseButton = true,
	className,
	style,
	bodyClassName,
	bodyStyle,
}) => {
	if (!isOpen) return null;

	return (
		isOpen && (
			<div
				className="modal-overlay"
				onClick={(e) => {
					e.preventDefault();
					onClose();
				}}
			>
				<div className={clsx(`modal-content mobile-${mobileMode}`, className)} style={style} onClick={(e) => e.stopPropagation()}>
					{showCloseButton && (
						<button
							className="modal-close-btn"
							onClick={(e) => {
								e.preventDefault();
								onClose();
							}}
						>
							×
						</button>
					)}

					{title && <div className="modal-title">{title}</div>}

					<div className={clsx('modal-body', bodyClassName)} style={bodyStyle}>
						{children}
					</div>

					<div className="modal-footer">
						{showCancelButton && (
							<button className="modal-btn styled-button" onClick={onCancel || onClose}>
								{cancelText}
							</button>
						)}
						{showCancel2Button && (
							<button className="modal-btn styled-button" onClick={onCancel2}>
								{cancel2Text}
							</button>
						)}
						{showOkButton && (
							<button className="modal-btn styled-button primary-button" onClick={onOk}>
								{okText}
							</button>
						)}
					</div>
				</div>
			</div>
		)
	);
};
