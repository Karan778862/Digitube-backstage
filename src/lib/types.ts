// DigiTube Network - Backstage Types
// Full types representing the 18-page distribution blueprint

export type UserRole =
  | 'SUPER_ADMIN'
  | 'COMPANY_ADMIN'
  | 'RELEASE_MANAGER'
  | 'CATALOG_STAFF'
  | 'ACCOUNTS_STAFF'
  | 'SUPPORT_STAFF'
  | 'ARTIST'
  | 'RECORD_LABEL';

export type ReleaseType = 'SINGLE' | 'EP' | 'ALBUM' | 'MUSIC_VIDEO';

export type ReleaseStatus =
  | 'DRAFT'
  | 'SUBMITTED'
  | 'VALIDATION'
  | 'IN_REVIEW'
  | 'CHANGES_REQUIRED'
  | 'REJECTED'
  | 'APPROVED'
  | 'QUEUED'
  | 'PROVIDER_PROCESSING'
  | 'DSP_PROCESSING'
  | 'LIVE'
  | 'TAKEDOWN_PENDING'
  | 'TAKEDOWN_COMPLETED';

export type DspStoreKey =
  | 'spotify'
  | 'apple_music'
  | 'youtube_music'
  | 'amazon_music'
  | 'jiosaavn'
  | 'wynk'
  | 'meta'
  | 'tiktok'
  | 'deezer'
  | 'tidal';

export type DspDeliveryStatus =
  | 'PENDING'
  | 'DELIVERED'
  | 'LIVE'
  | 'PROCESSING'
  | 'REJECTED'
  | 'TAKEDOWN_REQUESTED'
  | 'TAKEDOWN_COMPLETED';

export interface DspStoreStatusItem {
  store: DspStoreKey;
  name: string;
  status: DspDeliveryStatus;
  url?: string;
  externalId?: string;
  updatedAt?: string;
  error?: string;
}

export type ContributorRole =
  | 'MAIN_ARTIST'
  | 'FEATURED_ARTIST'
  | 'COMPOSER'
  | 'LYRICIST'
  | 'PRODUCER'
  | 'PERFORMER'
  | 'ARRANGER'
  | 'REMIXER'
  | 'MIXING_ENGINEER'
  | 'MASTERING_ENGINEER';

export interface ContributorCredit {
  id: string;
  name: string;
  role: ContributorRole;
  ipiCode?: string;
  isniCode?: string;
}

export interface TrackItem {
  id: string;
  trackNumber: number;
  discNumber: number;
  title: string;
  versionSubtitle?: string;
  isrcCode: string;
  durationSeconds: number;
  audioMasterUrl: string;
  audioFileName?: string;
  audioFormat: string; // WAV, FLAC
  audioBitrate: string; // 24-bit / 48kHz
  isExplicit: boolean;
  isInstrumental: boolean;
  language: string;
  bpm?: number;
  musicalKey?: string;
  previewStartTime: number;
  lyrics?: string;
  credits: ContributorCredit[];
}

export interface RoyaltySplitItem {
  id: string;
  payeeName: string;
  payeeEmail: string;
  percentageShare: number; // e.g. 70
  roleDescription: string;
  isConfirmed: boolean;
}

export interface ReleaseItem {
  id: string;
  releaseCode: string; // e.g. DGT-2026-8912
  organizationId: string;
  artistId: string;
  artistStageName: string;
  releaseType: ReleaseType;
  title: string;
  versionSubtitle?: string;
  recordLabel: string;
  primaryGenre: string;
  secondaryGenre?: string;
  primaryLanguage: string;
  targetReleaseDate: string; // YYYY-MM-DD
  releaseTimezone: string;
  originalReleaseDate?: string;
  upcEan: string;
  territoryType: 'WORLDWIDE' | 'RESTRICTED';
  restrictedCountries?: string[];
  artworkUrl: string;
  artworkChecksum?: string;
  pLineYear: number;
  pLineText: string;
  cLineYear: number;
  cLineText: string;
  workType: 'ORIGINAL' | 'COVER' | 'REMIX' | 'SAMPLE_DERIVATIVE';
  hasContentIdOptIn: boolean;
  status: ReleaseStatus;
  reviewNotes?: string;
  reviewedBy?: string;
  createdAt: string;
  updatedAt: string;
  tracks: TrackItem[];
  splits: RoyaltySplitItem[];
  dspStatuses: DspStoreStatusItem[];
  enabledDsps: DspStoreKey[];
}

export interface WalletBalance {
  availableBalance: number; // Immediately withdrawable
  pendingRoyalty: number; // Not yet finalized
  onHold: number; // In dispute or compliance check
  lifetimeEarnings: number; // Total gross accrued
  withdrawnTotal: number;
  currency: string;
  bankAccount: {
    holderName: string;
    bankName: string;
    accountNumberMasked: string;
    ifscSwift: string;
    upiId?: string;
    panTaxId: string;
  };
}

export interface PayoutRequestItem {
  id: string;
  payoutNumber: string; // e.g. PAY-2026-4412
  userId: string;
  artistName: string;
  amount: number;
  currency: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'IN_TRANSIT' | 'SETTLED' | 'REJECTED' | 'REVERSED';
  paymentMethod: string;
  transactionRef?: string;
  requestDate: string;
  settledDate?: string;
  reviewerNote?: string;
  destinationAccountMasked: string;
}

export interface RoyaltyStatementPeriod {
  id: string;
  batchCode: string; // STMT-2026-SEP
  period: string; // September 2026
  provider: string; // DigiTube DDEX Grid
  totalGrossInr: number;
  digiTubeCommissionInr: number; // 15%
  netArtistShareInr: number; // 85%
  totalStreams: number;
  status: 'RECONCILED' | 'PUBLISHED' | 'PENDING';
  downloadUrl?: string;
  lineItemsCount: number;
}

export interface RoyaltyLineDetail {
  id: string;
  statementId: string;
  releaseTitle: string;
  trackTitle: string;
  isrc: string;
  store: DspStoreKey;
  country: string;
  streamCount: number;
  grossInr: number;
  commissionInr: number;
  netInr: number;
  month: string;
}

export interface SupportTicket {
  id: string;
  ticketNumber: string; // TKT-7782
  userId: string;
  userName: string;
  title: string;
  category:
    | 'RELEASE_REJECTION'
    | 'METADATA_CORRECTION'
    | 'STORE_TAKEDOWN'
    | 'COPYRIGHT_DISPUTE'
    | 'ROYALTY_INQUIRY'
    | 'PAYOUT_HELP'
    | 'TECHNICAL_ERROR';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  status: 'NEW' | 'TRIAGED' | 'IN_PROGRESS' | 'WAITING_ON_ARTIST' | 'RESOLVED' | 'CLOSED';
  createdAt: string;
  updatedAt: string;
  messages: {
    id: string;
    senderName: string;
    isStaff: boolean;
    content: string;
    timestamp: string;
  }[];
}

export interface SystemAuditItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  resource: string;
  ipAddress: string;
  reason?: string;
  details?: string;
}

export interface StaffMember {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  assignedScope: 'ALL' | 'ASSIGNED_ARTISTS' | 'FINANCE_ONLY' | 'QA_ONLY';
  permissions: string[];
  isActive: boolean;
  mfaEnabled: boolean;
  lastLogin: string;
}

export interface LabelArtistItem {
  id: string;
  stageName: string;
  legalName: string;
  email: string;
  totalReleases: number;
  totalStreams: number;
  totalRevenueInr: number;
  status: 'ACTIVE' | 'INVITED' | 'PENDING_KYC';
  joinedDate: string;
}

export interface SmartLinkItem {
  id: string;
  releaseId: string;
  slug: string;
  title: string;
  artistName: string;
  artworkUrl: string;
  spotifyUrl?: string;
  appleMusicUrl?: string;
  youtubeUrl?: string;
  amazonUrl?: string;
  jiosaavnUrl?: string;
  clicks: number;
  createdAt: string;
}
