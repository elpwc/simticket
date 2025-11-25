import { useState, useRef, useEffect, JSX, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

export interface PrettyDropdownOption {
  value: string | number;
  /**
   * caption factory
   * @param isShownOnTop 是否是显示在外侧的主体上的部分的option
   * @param isSelected
   * @returns 返回变化过的option
   */
  getCaption: (isShownOnTop?: boolean, isSelected?: boolean) => string | JSX.Element;
}

type PrettyDropdownProps = {
  options: PrettyDropdownOption[];
  value: string | number | null;
  onChange: (val: string | number) => void;
  placeholder?: string;
  mainStyle?: React.CSSProperties;
  dropdownStyle?: React.CSSProperties;
  optionStyle?: React.CSSProperties;
  mainClassname?: string;
  dropdownClassname?: string;
  optionClassname?: string;
  /** 是否显示边框 + padding */
  bordered?: boolean;
  /** 是否显示下拉箭头 */
  showArrow?: boolean;
};

export default function PrettyDropdown({
  options,
  value,
  onChange,
  placeholder = '',
  mainStyle,
  dropdownStyle,
  optionStyle,
  mainClassname,
  dropdownClassname,
  optionClassname,
  bordered = true,
  showArrow = true,
}: PrettyDropdownProps) {
  const [open, setOpen] = useState(false);
  const [positionUp, setPositionUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find(opt => opt.value === value);

  // positionを判断
  useEffect(() => {
    if (open && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      const menuHeight = Math.min(options.length * 36, 300);
      if (spaceBelow < menuHeight + 10) {
        setPositionUp(true);
      } else {
        setPositionUp(false);
      }
    }
  }, [open, options.length]);

  return (
    <div className={`pretty-dropdown ${bordered ? 'bordered' : 'unbordered'}`} ref={containerRef} style={bordered ? {} : { display: 'inline-block' }}>
      <button
        className={'pretty-dropdown-button ' + mainClassname}
        onClick={() => setOpen(prev => !prev)}
        style={bordered ? { ...mainStyle } : { ...mainStyle, padding: 0, border: 'none', background: 'none' }}
      >
        <span className="pretty-dropdown-selected">{selectedOption ? selectedOption.getCaption(true, false) : <span className="pretty-dropdown-placeholder">{placeholder}</span>}</span>
        {bordered && showArrow && <span className="pretty-dropdown-arrow">▼</span>}
      </button>

      <AnimatePresence>
        {open && (
          <motion.ul
            className={'pretty-dropdown-menu ' + dropdownClassname}
            style={{
              ...dropdownStyle,
              top: positionUp ? 'auto' : '100%',
              bottom: positionUp ? '100%' : 'auto',
              width: bordered ? '100%' : 'auto',
              padding: bordered ? '4px 0' : 0,
              border: bordered ? undefined : 'none',
              boxShadow: bordered ? undefined : 'none',
              maxHeight: '100vh',
            }}
            initial={{ opacity: 0, y: positionUp ? 10 : -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: positionUp ? 10 : -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            {options.map(option => (
              <motion.li
                key={option.value}
                className={'pretty-dropdown-option ' + (optionClassname ?? '')}
                style={{
                  ...optionStyle,
                  padding: bordered ? '8px 12px' : 0,
                  cursor: 'pointer',
                }}
                whileHover={bordered ? { backgroundColor: '#f0f0f0' } : {}}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
              >
                {option.getCaption(false, selectedOption?.value === option.value)}
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
