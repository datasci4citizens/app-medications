import { useState, useEffect } from 'react';

type ModalVariant = 'danger' | 'warning' | 'info' | 'success' | 'question';
type IconName = 'alert' | 'warning' | 'info' | 'check' | 'question';

interface ThemeConfig {
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  haloBg: string;
  washTop: string;
  confirmBg: string;
  confirmColor: string;
  confirmShadow: string;
  iconName: IconName;
}

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: ModalVariant;
  destructive?: boolean;
  icon?: React.ReactNode;
  dark?: boolean;
}

const THEMES: Record<ModalVariant, ThemeConfig> = {
  danger: {
    iconBg: '#fff', iconBorder: '#fecaca', iconColor: '#dc2626',
    haloBg: 'rgba(220,38,38,0.18)', washTop: 'rgba(220,38,38,0.10)',
    confirmBg: '#dc2626', confirmColor: '#fff', confirmShadow: 'rgba(220,38,38,0.35)',
    iconName: 'alert',
  },
  warning: {
    iconBg: '#fff', iconBorder: '#fde68a', iconColor: '#d97706',
    haloBg: 'rgba(245,158,11,0.20)', washTop: 'rgba(245,158,11,0.10)',
    confirmBg: '#f59e0b', confirmColor: '#fff', confirmShadow: 'rgba(245,158,11,0.35)',
    iconName: 'warning',
  },
  info: {
    iconBg: '#fff', iconBorder: 'rgba(91,42,120,0.22)', iconColor: 'var(--color-darkpurple)',
    haloBg: 'rgba(91,42,120,0.20)', washTop: 'rgba(91,42,120,0.10)',
    confirmBg: 'var(--color-darkpurple)', confirmColor: '#fff', confirmShadow: 'rgba(91,42,120,0.40)',
    iconName: 'info',
  },
  success: {
    iconBg: '#fff', iconBorder: 'rgba(36,189,118,0.30)', iconColor: 'var(--color-green-take)',
    haloBg: 'rgba(36,189,118,0.22)', washTop: 'rgba(36,189,118,0.10)',
    confirmBg: 'var(--color-green-take)', confirmColor: '#fff', confirmShadow: 'rgba(36,189,118,0.40)',
    iconName: 'check',
  },
  question: {
    iconBg: '#fff', iconBorder: 'rgba(91,42,120,0.22)', iconColor: 'var(--color-darkpurple)',
    haloBg: 'rgba(91,42,120,0.20)', washTop: 'rgba(91,42,120,0.10)',
    confirmBg: 'var(--color-darkpurple)', confirmColor: '#fff', confirmShadow: 'rgba(91,42,120,0.40)',
    iconName: 'question',
  },
};

function ModalIcon({ name, color }: { name: IconName; color: string }) {
  const drawStyle = { animation: 'modalDraw 520ms ease-out forwards' };
  switch (name) {
    case 'alert':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <path d="M24 6 L44 40 L4 40 Z" stroke={color} strokeWidth="3.4" strokeLinejoin="round"
            strokeDasharray="140" strokeDashoffset="140" style={drawStyle}/>
          <path d="M24 19 V28" stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
          <circle cx="24" cy="34" r="1.8" fill={color}/>
        </svg>
      );
    case 'warning':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" stroke={color} strokeWidth="3.4"
            strokeDasharray="120" strokeDashoffset="120" style={drawStyle}/>
          <path d="M24 14 V26" stroke={color} strokeWidth="3.4" strokeLinecap="round"/>
          <circle cx="24" cy="33" r="1.8" fill={color}/>
        </svg>
      );
    case 'info':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" stroke={color} strokeWidth="3.4"/>
          <circle cx="24" cy="15" r="2" fill={color}/>
          <path d="M24 21 V33" stroke={color} strokeWidth="3.4" strokeLinecap="round"
            strokeDasharray="14" strokeDashoffset="14" style={drawStyle}/>
        </svg>
      );
    case 'check':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" stroke={color} strokeWidth="3.4"/>
          <path d="M15 24 L22 31 L34 18" stroke={color} strokeWidth="3.6"
            strokeLinecap="round" strokeLinejoin="round"
            strokeDasharray="40" strokeDashoffset="40" style={drawStyle}/>
        </svg>
      );
    case 'question':
      return (
        <svg width="44" height="44" viewBox="0 0 48 48" fill="none">
          <circle cx="24" cy="24" r="19" stroke={color} strokeWidth="3.4"/>
          <path d="M18 19 Q18 13 24 13 Q30 13 30 19 Q30 23 24 26 V30" stroke={color}
            strokeWidth="3.4" strokeLinecap="round" fill="none"
            strokeDasharray="36" strokeDashoffset="36" style={drawStyle}/>
          <circle cx="24" cy="35" r="1.8" fill={color}/>
        </svg>
      );
  }
}

export function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
  destructive,
  icon,
  dark = false,
}: ConfirmModalProps) {
  const [closing, setClosing] = useState(false);

  useEffect(() => { if (isOpen) setClosing(false); }, [isOpen]);

  if (!isOpen) return null;

  const theme = THEMES[variant];
  const cardBg = dark ? '#1e1230' : '#fff';
  const textColor = dark ? '#fff' : 'var(--color-inkblack)';
  const subColor = dark ? 'rgba(255,255,255,0.65)' : '#666';

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => onClose(), 200);
  };
  const handleConfirm = () => {
    setClosing(true);
    setTimeout(() => onConfirm(), 200);
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: 'fixed', inset: 0,
        background: closing ? 'rgba(12,6,20,0)' : 'rgba(12,6,20,0.55)',
        backdropFilter: 'blur(6px)', WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24, zIndex: 100,
        transition: 'background 200ms ease',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: '100%', maxWidth: 360,
          background: cardBg, borderRadius: 32,
          padding: '28px 24px 22px',
          boxShadow: '0 24px 60px rgba(0,0,0,0.30)',
          position: 'relative', overflow: 'hidden',
          animation: closing
            ? 'modalSheetOut 220ms cubic-bezier(.4,0,1,1) forwards'
            : 'modalSheetIn 320ms cubic-bezier(.32,.72,0,1) forwards',
        }}
      >
        {/* Accent wash */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 120,
          background: `radial-gradient(90% 100% at 50% 0%, ${theme.washTop}, transparent 70%)`,
          pointerEvents: 'none',
        }}/>

        {/* Icon medallion */}
        <div style={{ display: 'flex', justifyContent: 'center', position: 'relative', zIndex: 1 }}>
          <div style={{ position: 'relative', width: 92, height: 92, marginBottom: 18 }}>
            <span style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              background: theme.haloBg,
              animation: 'modalHalo 2.6s ease-in-out infinite',
              display: 'block',
            }}/>
            <span style={{
              position: 'absolute', inset: 6, borderRadius: '50%',
              background: theme.iconBg,
              border: `2px solid ${theme.iconBorder}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: theme.iconColor,
              boxShadow: `0 8px 24px ${theme.haloBg}`,
              animation: 'modalIconPop 460ms cubic-bezier(.32,.72,0,1.4)',
            }}>
              {icon ?? <ModalIcon name={theme.iconName} color={theme.iconColor}/>}
            </span>
          </div>
        </div>

        {/* Title */}
        <h3 style={{
          fontFamily: 'Merriweather Sans', fontWeight: 800, fontSize: 22,
          color: textColor, textAlign: 'center', margin: '0 0 8px',
          letterSpacing: '-0.01em', lineHeight: 1.25,
          position: 'relative', zIndex: 1,
        }}>{title}</h3>

        {/* Message */}
        {message && (
          <p style={{
            fontFamily: 'Inter', fontSize: 15, lineHeight: 1.5,
            color: subColor, textAlign: 'center', margin: '0 0 20px',
            position: 'relative', zIndex: 1,
          }}>{message}</p>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex', gap: 10,
          position: 'relative', zIndex: 1,
          marginTop: message ? 0 : 16,
        }}>
          <button
            onClick={handleClose}
            style={{
              flex: 1, height: 54, borderRadius: 999,
              border: `2px solid ${dark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.10)'}`,
              background: 'transparent', color: textColor,
              fontFamily: 'Merriweather Sans', fontWeight: 700, fontSize: 16,
              cursor: 'pointer', transition: 'background 150ms ease',
            }}
          >
            {cancelText}
          </button>
          <button
            onClick={handleConfirm}
            className="btn-shine"
            style={{
              flex: 1, height: 54, borderRadius: 999, border: 'none',
              background: destructive ? '#dc2626' : theme.confirmBg,
              color: theme.confirmColor,
              fontFamily: 'Merriweather Sans', fontWeight: 800, fontSize: 16,
              cursor: 'pointer',
              boxShadow: `0 10px 24px ${theme.confirmShadow}`,
              transition: 'transform 120ms ease',
            }}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
