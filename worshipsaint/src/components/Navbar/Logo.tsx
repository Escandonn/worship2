import type { FC } from 'react';

/**
 * Logotipo de WorshipSaint — estilo premium cálido.
 */
const Logo: FC<{ className?: string }> = ({ className }) => {
  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.6rem',
        fontFamily: 'var(--ws-font)',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        fontSize: '1.3rem',
        lineHeight: 1,
        color: 'var(--ws-text)',
        textDecoration: 'none'
      }}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 30 30"
        fill="none"
        aria-hidden="true"
        focusable="false"
      >
        <circle cx="15" cy="15" r="14" stroke="var(--ws-accent)" strokeWidth="1.5" />
        <path
          d="M10 20V10l5 6 5-6v10"
          stroke="var(--ws-accent)"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <span>
        Worship<span style={{ color: 'var(--ws-accent)' }}>Saint</span>
      </span>
    </span>
  );
};

export default Logo;
