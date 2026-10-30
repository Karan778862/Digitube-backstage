import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrencyINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num: number): string {
  return new Intl.NumberFormat('en-IN').format(num);
}

export function formatCompactNumber(num: number): string {
  if (num >= 10000000) {
    return (num / 10000000).toFixed(2) + " Cr";
  }
  if (num >= 100000) {
    return (num / 100000).toFixed(1) + " L";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + " K";
  }
  return num.toString();
}

export function formatDate(dateString: string): string {
  try {
    const d = new Date(dateString);
    return new Intl.DateTimeFormat('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(d);
  } catch {
    return dateString;
  }
}

export function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

export function generateISRC(country = "IN", registrant = "DGT", year = "26"): string {
  const randomFive = Math.floor(10000 + Math.random() * 90000);
  return `${country}${registrant}${year}${randomFive}`;
}

export function generateUPC(): string {
  let upc = "890"; // India EAN prefix
  for (let i = 0; i < 9; i++) {
    upc += Math.floor(Math.random() * 10);
  }
  return upc;
}

export function getDspDisplayName(key: string): string {
  const map: Record<string, string> = {
    spotify: 'Spotify',
    apple_music: 'Apple Music',
    youtube_music: 'YouTube Music',
    amazon_music: 'Amazon Music',
    jiosaavn: 'JioSaavn',
    wynk: 'Wynk Music',
    meta: 'Meta (IG & FB)',
    tiktok: 'TikTok & Resso',
    deezer: 'Deezer',
    tidal: 'TIDAL',
  };
  return map[key] || key;
}

export function getDspColor(key: string): string {
  const map: Record<string, string> = {
    spotify: '#1DB954',
    apple_music: '#FC3C44',
    youtube_music: '#FF0000',
    amazon_music: '#00A8E1',
    jiosaavn: '#2BC5B4',
    wynk: '#ED1B24',
    meta: '#0668E1',
    tiktok: '#00F2FE',
    deezer: '#FEAA2D',
    tidal: '#000000',
  };
  return map[key] || '#6366F1';
}
