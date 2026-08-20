interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  return (
    <div className="flex gap-1.5 px-5 pt-3">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className="flex-1 h-1.5 rounded-full transition-colors duration-300"
          style={{
            background: i <= current
              ? 'var(--color-darkpurple)'
              : 'rgba(91,42,120,0.15)',
          }}
        />
      ))}
    </div>
  );
}
