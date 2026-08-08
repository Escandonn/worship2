import type { FC } from 'react';
import logo from '../../assets/logo.png';

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
      <img
        src={logo.src}
        alt="WorshipSaint"
        style={{
          width: '34px',
          height: '34px',
          borderRadius: '999px',
          objectFit: 'cover',
          flexShrink: 0
        }}
      />
      <span>
        Worship<span style={{ color: 'var(--ws-accent)' }}>Saint</span>
      </span>
    </span>
  );
};

export default Logo;
