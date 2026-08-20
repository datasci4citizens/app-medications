import { useEffect } from 'react';
import { FiCheck } from 'react-icons/fi';

interface ToastProps {
  name: string;
  onUndo: () => void;
  onDismiss: () => void;
}

const DURATION_MS = 3200;

export function Toast({ name, onUndo, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, DURATION_MS);
    return () => clearTimeout(t);
  }, [onDismiss]);

  const bg = 'var(--color-green-taken)';
  const label = 'Dose registrada';

  return (
    <div
      style={{
        position: 'fixed',
        left: 16, right: 16,
        bottom: 120,
        zIndex: 50,
        background: bg,
        color: '#fff',
        borderRadius: 24,
        padding: '16px 18px',
        display: 'flex',
        alignItems: 'center',
        gap: 14,
        boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
        animation: 'fadeSlideUp 300ms ease-out',
      }}
    >
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.20)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <FiCheck size={22} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{
          fontFamily: 'Merriweather Sans',
          fontWeight: 800,
          fontSize: 17,
          lineHeight: 1.2,
        }}>
          {label}
        </div>
        <div style={{
          fontFamily: 'Inter',
          fontSize: 14,
          opacity: 0.80,
          marginTop: 2,
        }}>
          {name}
        </div>
      </div>

      <button
        onClick={() => { onUndo(); onDismiss(); }}
        style={{
          background: 'rgba(255,255,255,0.22)',
          color: '#fff',
          border: 'none',
          padding: '10px 18px',
          borderRadius: 14,
          fontFamily: 'Merriweather Sans',
          fontWeight: 800,
          fontSize: 16,
          cursor: 'pointer',
          flexShrink: 0,
        }}
      >
        Desfazer
      </button>
    </div>
  );
}
