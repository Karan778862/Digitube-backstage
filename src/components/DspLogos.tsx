import React from 'react';

interface DspLogoProps {
  className?: string;
  size?: number;
  colored?: boolean;
}

export const SpotifyLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#1DB954' : 'currentColor'}
  >
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.503 17.306c-.218.358-.68.472-1.038.254-2.846-1.738-6.428-2.13-10.65-1.166-.407.094-.816-.162-.909-.57-.094-.407.162-.816.57-.91 4.622-1.056 8.583-.611 11.77 1.348.358.219.473.68.257 1.044zm1.47-3.262c-.275.446-.86.588-1.306.313-3.259-2.003-8.227-2.583-12.083-1.413-.5.152-1.035-.133-1.187-.633-.152-.5.133-1.035.633-1.187 4.41-1.338 9.9-1.338 13.63 1.62.446.275.588.86.313 1.306zm.126-3.411c-3.908-2.321-10.347-2.535-14.072-1.404-.6.182-1.242-.16-1.424-.76-.182-.6.16-1.242.76-1.424 4.29-1.302 11.393-1.056 15.86 1.597.54.321.717 1.026.396 1.566-.321.54-1.026.717-1.566.396z" />
  </svg>
);

export const AppleMusicLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#FA2D48' : 'currentColor'}
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.84c.64-.78 1.08-1.86.96-2.95-.93.04-2.07.62-2.73 1.4-.58.67-1.09 1.76-.95 2.83 1.05.08 2.11-.53 2.72-1.28" />
  </svg>
);

export const YouTubeMusicLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#FF0000' : 'currentColor'}
  >
    <path d="M12 0C5.376 0 0 5.376 0 12s5.376 12 12 12 12-5.376 12-12S18.624 0 12 0zm0 19c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7zm0-11.5c-2.49 0-4.5 2.01-4.5 4.5s2.01 4.5 4.5 4.5 4.5-2.01 4.5-4.5-2.01-4.5-4.5-4.5zm-1.5 6.5V10l3 2-3 2z" />
  </svg>
);

export const AmazonMusicLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#00A8E1' : 'currentColor'}
  >
    <path d="M13.88 15.65c-2.41 1.78-5.91 2.73-8.89 2.73-4.18 0-7.95-1.55-10.79-4.14-.22-.2-.04-.51.22-.38 3.07 1.55 6.64 2.47 10.3 2.47 2.64 0 5.6-.53 8.3-1.63.41-.17.75.25.38.56l.48.39zM14.93 14.52c-.31-.4-.73-1.46-.73-2.06 0-.85.45-1.41 1.15-1.41.6 0 1.05.41 1.05 1.25 0 1.2-.84 2.22-1.47 2.22zm2.74 1.45c-.21.24-.51.29-.75.14-.54-.34-.64-.81-.64-1.26v-3.77c0-1.78-1.27-2.85-3.04-2.85-1.74 0-3.17 1.01-3.48 2.61-.06.31.13.5.42.56.28.06.49-.12.57-.4.23-1.04 1.12-1.65 2.37-1.65 1.23 0 2.04.72 2.04 2.01v.42c-2.86.12-4.8 1.15-4.8 3.1 0 1.58 1.15 2.54 2.64 2.54 1.5 0 2.49-.69 3.02-1.78.25.64.79 1.15 1.54 1.15.65 0 1.17-.3 1.5-.78.21-.3.12-.55-.13-.71-.24-.16-.46-.08-.7.21l-.76.63z" />
  </svg>
);

export const JioSaavnLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#2BC5B4' : 'currentColor'}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5c0 .83-.67 1.5-1.5 1.5S10 17.33 10 16.5V10c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v6.5zm4-2c0 .83-.67 1.5-1.5 1.5s-1.5-.67-1.5-1.5V12c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v2.5zm-8-1c0 .83-.67 1.5-1.5 1.5S6 14.33 6 13.5V11c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v2.5z" />
  </svg>
);

export const MetaInstagramLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#E1306C' : 'currentColor'}
  >
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

export const TikTokLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#00F2FE' : 'currentColor'}
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.29 0 .58.04.86.12V9.42a6.34 6.34 0 0 0-.86-.06 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V9.07a8.28 8.28 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.5z" />
  </svg>
);

export const DeezerLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#FEAA2D' : 'currentColor'}
  >
    <path d="M18.8 9.3h4.4V14h-4.4zm-6.2 2.3h4.4V14h-4.4zm-6.3 2.4h4.4V14H6.3zm12.5 4.7h4.4v4.7h-4.4zm-6.2 0h4.4v4.7h-4.4zm-6.3 0h4.4v4.7H6.3zm-6.3 0H4.4v4.7H0zm0-4.7H4.4V14H0zm18.8-9.4h4.4v4.7h-4.4z" />
  </svg>
);

export const TidalLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#000000' : 'currentColor'}
  >
    <path d="M12.012 3.992L8.008 7.996 4.004 3.992 0 7.996l4.004 4.004 4.004-4.004 4.004 4.004 4.004-4.004L12.012 3.992zm7.984 0l-4.004 4.004 4.004 4.004 4.004-4.004-4.004-4.004zm-7.984 8.008l-4.004 4.004 4.004 4.004 4.004-4.004-4.004-4.004z" />
  </svg>
);

export const WynkLogo: React.FC<DspLogoProps> = ({ className = 'w-4 h-4', size, colored = true }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill={colored ? '#ED1B24' : 'currentColor'}
  >
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" fill="none" />
    <path d="M8 8l8 4-8 4V8z" />
  </svg>
);

export const DspLogoMap: Record<string, React.FC<DspLogoProps>> = {
  SPOTIFY: SpotifyLogo,
  APPLE_MUSIC: AppleMusicLogo,
  YOUTUBE_MUSIC: YouTubeMusicLogo,
  AMAZON_MUSIC: AmazonMusicLogo,
  JIOSAAVN: JioSaavnLogo,
  INSTAGRAM_META: MetaInstagramLogo,
  TIKTOK_BYTEDANCE: TikTokLogo,
  DEEZER: DeezerLogo,
  TIDAL: TidalLogo,
  WYNK: WynkLogo,
};

export const getDspIconComponent = (dspKey: string) => {
  const normalized = dspKey.toUpperCase().replace(/\s+/g, '_').replace('&', '');
  return DspLogoMap[normalized] || SpotifyLogo;
};
