import type { FC } from 'react';

interface YouTubeRegisterButtonProps {
  onRegister?: () => void;
  label?: string;
  href?: string;
}

const YOUTUBE_BUTTON_STYLES = `
  .youtube-register-button {
    width: min(320px, 90%);
    max-width: 100%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 0.95rem 1.5rem;
    border-radius: var(--ws-radius-btn);
    border: 1px solid rgba(44,33,24,0.12);
    background: #fff;
    color: #2c2118;
    font-family: var(--ws-font);
    font-weight: 700;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: var(--ws-shadow-card);
    transition: transform 250ms ease, box-shadow 250ms ease;
    text-decoration: none;
    text-align: center;
  }

  .youtube-register-button:hover {
    transform: translateY(-2px) scale(1.01);
    box-shadow: 0 18px 40px rgba(44,33,24,0.14);
  }

  .youtube-register-button:active {
    transform: translateY(0) scale(1);
    box-shadow: var(--ws-shadow-card);
  }

  @media (max-width: 768px) {
    .youtube-register-button {
      width: min(300px, 82vw);
      max-width: 100%;
      background: linear-gradient(135deg, #c8a96a 0%, #d6c3a5 100%);
      color: #2c2118;
      border: 1px solid rgba(200,169,106,0.6);
      box-shadow: 0 12px 30px rgba(200,169,106,0.35);
      font-weight: 800;
    }

    .youtube-register-button:hover {
      box-shadow: 0 18px 40px rgba(200,169,106,0.45);
    }
  }
`;

const YouTubeRegisterButton: FC<YouTubeRegisterButtonProps> = ({
  onRegister,
  label = 'Visítanos en YouTube',
  href = 'https://www.youtube.com/@worship22'
}) => {
  const sharedProps = {
    className: 'youtube-register-button',
    'aria-label': label
  };

  const content = (
    <>
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        aria-hidden="true"
        style={{ flexShrink: 0 }}
      >
        <path
          d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          fill="#FF0000"
        />
      </svg>
      {label}
    </>
  );

  if (onRegister) {
    return (
      <>
        <style>{YOUTUBE_BUTTON_STYLES}</style>
        <button
          type="button"
          onClick={() => {
            console.log('[YouTubeRegisterButton] Clic en registro con YouTube.');
            onRegister();
          }}
          {...sharedProps}
        >
          {content}
        </button>
      </>
    );
  }

  return (
    <>
      <style>{YOUTUBE_BUTTON_STYLES}</style>
      <a href={href} target="_blank" rel="noopener noreferrer" {...sharedProps}>
        {content}
      </a>
    </>
  );
};

export default YouTubeRegisterButton;
