import React, { useEffect } from 'react';
import './index.css';

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onOk?: () => void;
  onCancel?: () => void;
  showOkButton?: boolean;
  showCancelButton?: boolean;
  okText?: string;
  cancelText?: string;
  title?: string;
  children: React.ReactNode;
  mobileMode?: 'fullscreen' | 'scroll' | 'center';
  showCloseButton?: boolean;
};

export const Modal: React.FC<Props> = ({
  isOpen,
  onClose,
  onOk,
  onCancel,
  showOkButton = false,
  showCancelButton = false,
  okText = 'OK',
  cancelText = 'キャンセル',
  title,
  children,
  mobileMode = 'fullscreen',
  showCloseButton = true,
}) => {


  if (!isOpen) return null;

  return (
    isOpen && (
      <div className="modal-overlay" onClick={onClose}>
        <div className={`modal-content mobile-${mobileMode}`} onClick={e => e.stopPropagation()}>
          {showCloseButton && (
            <button className="modal-close-btn" onClick={onClose}>
              ×
            </button>
          )}

          {title && <div className="modal-title">{title}</div>}

          <div className="modal-body">{children}</div>

          <div className="modal-footer">
            {showCancelButton && (
              <button className="modal-btn styled-button" onClick={onCancel || onClose}>
                {cancelText}
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
