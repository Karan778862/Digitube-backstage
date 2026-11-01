'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ReleaseItem,
  WalletBalance,
  PayoutRequestItem,
  RoyaltyStatementPeriod,
  RoyaltyLineDetail,
  SupportTicket,
  SystemAuditItem,
  StaffMember,
  LabelArtistItem,
  SmartLinkItem,
  TrackItem,
  UserRole,
} from './types';
import {
  INITIAL_USER,
  INITIAL_RELEASES,
  INITIAL_WALLET,
  INITIAL_PAYOUTS,
  INITIAL_STATEMENTS,
  INITIAL_ROYALTY_LINES,
  INITIAL_TICKETS,
  INITIAL_AUDIT_LOGS,
  INITIAL_STAFF,
  INITIAL_LABEL_ARTISTS,
  INITIAL_SMART_LINKS,
} from './mockData';

interface ActiveAudioState {
  isOpen: boolean;
  track?: TrackItem;
  releaseTitle?: string;
  artistName?: string;
  artworkUrl?: string;
}

export interface DigiTubeContextType {
  // Current user & active context
  currentUser: any;
  setCurrentUser: React.Dispatch<React.SetStateAction<any>>;
  isAuthenticated: boolean;
  isAuthLoading: boolean;
  loginUser: (user: any) => void;
  logoutUser: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  activeContext: 'ARTIST' | 'LABEL' | 'ADMIN';
  setActiveContext: (ctx: 'ARTIST' | 'LABEL' | 'ADMIN') => void;

  // Releases
  releases: ReleaseItem[];
  addRelease: (newRel: ReleaseItem) => void;
  updateReleaseStatus: (id: string, status: ReleaseItem['status'], notes?: string) => void;
  requestTakedown: (id: string) => void;
  updateDspStatus: (releaseId: string, store: string, status: any, url?: string) => void;

  // Wallet & Payouts
  wallet: WalletBalance;
  payouts: PayoutRequestItem[];
  requestPayout: (amount: number, method: string) => boolean;
  approvePayout: (payoutId: string, txnRef: string) => void;
  rejectPayout: (payoutId: string, reason: string) => void;
  updateBankDetails: (details: Partial<WalletBalance['bankAccount']>) => void;

  // Royalties & Statements
  statements: RoyaltyStatementPeriod[];
  royaltyLines: RoyaltyLineDetail[];
  importRoyaltyStatement: (newStmt: RoyaltyStatementPeriod, lines: RoyaltyLineDetail[]) => void;

  // Support
  tickets: SupportTicket[];
  createTicket: (ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>, initialMessage: string) => void;
  replyToTicket: (ticketId: string, message: string, isStaff?: boolean) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Staff & Admin
  staff: StaffMember[];
  addStaffMember: (member: Omit<StaffMember, 'id' | 'lastLogin'>) => void;
  updateStaffMember: (id: string, updates: Partial<StaffMember>) => void;
  auditLogs: SystemAuditItem[];
  logAuditAction: (action: string, resource: string, reason?: string, details?: string) => void;

  // Label roster
  labelArtists: LabelArtistItem[];
  inviteLabelArtist: (stageName: string, legalName: string, email: string) => void;

  // Smart links
  smartLinks: SmartLinkItem[];
  createSmartLink: (link: Omit<SmartLinkItem, 'id' | 'clicks' | 'createdAt'>) => void;

  // Audio Preview Player
  audioState: ActiveAudioState;
  playAudioTrack: (track: TrackItem, releaseTitle: string, artistName: string, artworkUrl: string) => void;
  closeAudioPlayer: () => void;
}

const DigiTubeContext = createContext<DigiTubeContextType | undefined>(undefined);

export const EMPTY_USER = {
  id: '',
  fullName: '',
  stageName: '',
  email: '',
  role: 'GUEST' as UserRole,
  organizationName: '',
  isVerified: false,
  avatar: '',
  isDemo: false,
  isAuthenticated: false,
};

export const EMPTY_WALLET: WalletBalance = {
  availableBalance: 0,
  pendingRoyalty: 0,
  onHold: 0,
  lifetimeEarnings: 0,
  withdrawnTotal: 0,
  currency: 'INR',
  bankAccount: {
    holderName: '',
    bankName: '',
    accountNumberMasked: '',
    ifscSwift: '',
    upiId: '',
    panTaxId: '',
  },
};

export function DigiTubeProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<any>(EMPTY_USER);
  const [isAuthLoading, setIsAuthLoading] = useState<boolean>(true);
  const [activeContext, setActiveContext] = useState<'ARTIST' | 'LABEL' | 'ADMIN'>('ARTIST');

  // Real accounts start with empty catalog and empty ledger
  const [releases, setReleases] = useState<ReleaseItem[]>([]);
  const [wallet, setWallet] = useState<WalletBalance>(EMPTY_WALLET);
  const [payouts, setPayouts] = useState<PayoutRequestItem[]>([]);
  const [statements, setStatements] = useState<RoyaltyStatementPeriod[]>([]);
  const [royaltyLines, setRoyaltyLines] = useState<RoyaltyLineDetail[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [auditLogs, setAuditLogs] = useState<SystemAuditItem[]>([]);
  const [staff, setStaff] = useState<StaffMember[]>(INITIAL_STAFF);
  const [labelArtists, setLabelArtists] = useState<LabelArtistItem[]>([]);
  const [smartLinks, setSmartLinks] = useState<SmartLinkItem[]>([]);

  const [audioState, setAudioState] = useState<ActiveAudioState>({ isOpen: false });

  const loginUser = (user: any) => {
    const isDemo = Boolean(user.isDemo);

    setCurrentUser({
      id: user.id || user._id || 'usr_' + Date.now(),
      fullName: user.fullName || user.stageName || 'Artist',
      stageName: user.stageName || user.fullName || 'Artist',
      email: user.email || '',
      role: user.role || 'ARTIST',
      organizationName: user.organizationName || (user.role === 'RECORD_LABEL' ? 'Record Label' : 'Independent Artist'),
      isVerified: true,
      avatar: user.avatarUrl || user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      isDemo,
      isAuthenticated: true,
    });

    if (isDemo) {
      setReleases(INITIAL_RELEASES);
      setWallet(INITIAL_WALLET);
      setPayouts(INITIAL_PAYOUTS);
      setStatements(INITIAL_STATEMENTS);
      setRoyaltyLines(INITIAL_ROYALTY_LINES);
    } else {
      // Real registered user: strictly load user's own data or all for admin
      const userReleasesKey = `digitube_releases_${user.email}`;
      const savedUserReleases = localStorage.getItem(userReleasesKey);
      if (savedUserReleases) {
        try {
          setReleases(JSON.parse(savedUserReleases));
        } catch {
          setReleases([]);
        }
      } else {
        setReleases([]);
      }

      const isAdminRole = [
        'SUPER_ADMIN',
        'COMPANY_ADMIN',
        'RELEASE_MANAGER',
        'CATALOG_STAFF',
        'ACCOUNTS_STAFF',
        'SUPPORT_STAFF',
      ].includes(user.role);

      const endpoint = isAdminRole
        ? '/api/releases?all=true'
        : `/api/releases?email=${encodeURIComponent(user.email)}`;

      fetch(endpoint, { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          let list = Array.isArray(data?.releases) ? data.releases.filter(Boolean) : [];
          try {
            const local = JSON.parse(localStorage.getItem('digitube_all_submitted_releases') || '[]');
            if (Array.isArray(local) && local.length > 0) {
              const map = new Map(list.filter((r: any) => r && r.id).map((r: any) => [r.id, r]));
              for (const item of local) {
                if (item && item.id) {
                  const matchArtist =
                    item.artistId &&
                    user?.email &&
                    item.artistId.toLowerCase() === user.email.toLowerCase();
                  if (isAdminRole || matchArtist) {
                    if (!map.has(item.id)) {
                      list.unshift(item);
                      map.set(item.id, item);
                    }
                  }
                }
              }
            }
          } catch {}
          if (list.length > 0) {
            setReleases(list.filter(Boolean));
          }
        })
        .catch(() => {});

      const userWalletKey = `digitube_wallet_${user.email}`;
      const savedUserWallet = localStorage.getItem(userWalletKey);
      if (savedUserWallet) {
        try {
          setWallet(JSON.parse(savedUserWallet));
        } catch {
          setWallet(EMPTY_WALLET);
        }
      } else {
        setWallet(EMPTY_WALLET);
      }

      setPayouts([]);
      setStatements([]);
      setRoyaltyLines([]);
      setSmartLinks([]);

      // Clean up legacy mock data from browser localStorage if present
      localStorage.removeItem('digitube_releases');
      localStorage.removeItem('digitube_wallet');
      localStorage.removeItem('digitube_payouts');
    }

    setActiveContext(user.role === 'RECORD_LABEL' ? 'LABEL' : user.role === 'SUPER_ADMIN' ? 'ADMIN' : 'ARTIST');
  };

  const logoutUser = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch {}
    setCurrentUser(EMPTY_USER);
    setReleases([]);
    setWallet(EMPTY_WALLET);
    setPayouts([]);
    setActiveContext('ARTIST');
  };

  // Check active session on initial load
  useEffect(() => {
    let isMounted = true;
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        if (data?.authenticated && data?.user) {
          loginUser(data.user);
        } else {
          setCurrentUser(EMPTY_USER);
        }
      })
      .catch(() => {
        if (isMounted) setCurrentUser(EMPTY_USER);
      })
      .finally(() => {
        if (isMounted) setIsAuthLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  // Save changes for real user
  useEffect(() => {
    if (currentUser?.email && !currentUser?.isDemo) {
      try {
        localStorage.setItem(`digitube_releases_${currentUser.email}`, JSON.stringify(releases));
      } catch {}
    }
  }, [releases, currentUser]);

  useEffect(() => {
    if (currentUser?.email && !currentUser?.isDemo) {
      try {
        localStorage.setItem(`digitube_wallet_${currentUser.email}`, JSON.stringify(wallet));
      } catch {}
    }
  }, [wallet, currentUser]);

  const switchRole = (role: UserRole) => {
    if (role === 'SUPER_ADMIN' || role === 'RELEASE_MANAGER' || role === 'ACCOUNTS_STAFF' || role === 'CATALOG_STAFF') {
      setCurrentUser({
        id: 'usr_staff_001',
        fullName: 'Dev Sharma (Platform Admin)',
        stageName: 'Super Admin',
        email: 'dev@digitubenetwork.com',
        role,
        organizationName: 'DigiTube HQ (Internal Operations)',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        isDemo: true,
        isAuthenticated: true,
      });
      setActiveContext('ADMIN');

      // Fetch all releases for admin inspection
      fetch('/api/releases?all=true', { cache: 'no-store' })
        .then((res) => res.json())
        .then((data) => {
          let list = Array.isArray(data?.releases) ? data.releases.filter(Boolean) : [];
          try {
            const local = JSON.parse(localStorage.getItem('digitube_all_submitted_releases') || '[]');
            if (Array.isArray(local) && local.length > 0) {
              const map = new Map(list.filter((r: any) => r && r.id).map((r: any) => [r.id, r]));
              for (const item of local) {
                if (item && item.id && !map.has(item.id)) {
                  list.unshift(item);
                  map.set(item.id, item);
                }
              }
            }
          } catch {}
          if (list.length > 0) setReleases(list.filter(Boolean));
        })
        .catch(() => {});
    } else if (role === 'RECORD_LABEL') {
      setCurrentUser({
        id: 'usr_label_001',
        fullName: 'Desi Beats Music Pvt Ltd',
        stageName: 'Desi Beats Records',
        email: 'ops@desibeats.com',
        role: 'RECORD_LABEL',
        organizationName: 'Desi Beats Records (Label Tier)',
        isVerified: true,
        avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=200&auto=format&fit=crop&q=80',
        isDemo: true,
        isAuthenticated: true,
      });
      setActiveContext('LABEL');
    } else {
      setCurrentUser({
        ...INITIAL_USER,
        isDemo: true,
        isAuthenticated: true,
      });
      setReleases(INITIAL_RELEASES);
      setWallet(INITIAL_WALLET);
      setPayouts(INITIAL_PAYOUTS);
      setStatements(INITIAL_STATEMENTS);
      setRoyaltyLines(INITIAL_ROYALTY_LINES);
      setActiveContext('ARTIST');
    }
  };

  const logAuditAction = (action: string, resource: string, reason?: string, details?: string) => {
    const newLog: SystemAuditItem = {
      id: `aud_${Date.now()}`,
      timestamp: new Date().toISOString(),
      actorName: currentUser.fullName,
      actorRole: currentUser.role,
      action,
      resource,
      ipAddress: '103.21.244.18',
      reason,
      details,
    };
    setAuditLogs((prev) => [newLog, ...prev]);
  };

  const addRelease = (newRel: ReleaseItem) => {
    setReleases((prev) => [newRel, ...prev]);
    try {
      const local = JSON.parse(localStorage.getItem('digitube_all_submitted_releases') || '[]');
      const filtered = Array.isArray(local) ? local.filter((r: any) => r.id !== newRel.id) : [];
      localStorage.setItem('digitube_all_submitted_releases', JSON.stringify([newRel, ...filtered]));
    } catch {}
    logAuditAction('RELEASE_SUBMITTED', `Release: ${newRel.releaseCode} (${newRel.title})`, 'Artist submitted new release for automated and QA review.');
  };

  const updateReleaseStatus = (id: string, status: ReleaseItem['status'], notes?: string) => {
    setReleases((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = {
            ...r,
            status,
            reviewNotes: notes || r.reviewNotes,
            updatedAt: new Date().toISOString(),
          };
          if (status === 'LIVE') {
            // Update DSP statuses to live
            updated.dspStatuses = updated.dspStatuses.map((d) => ({
              ...d,
              status: 'LIVE',
              url: d.url || `https://${d.store}.com/track/${r.releaseCode}`,
            }));
          }
          return updated;
        }
        return r;
      })
    );
    logAuditAction(`RELEASE_${status}`, `Release ID: ${id}`, notes || `Status changed to ${status}`);
  };

  const requestTakedown = (id: string) => {
    updateReleaseStatus(id, 'TAKEDOWN_PENDING', 'Takedown requested by rights holder. Transmitting takedown notices to DSPs.');
  };

  const updateDspStatus = (releaseId: string, store: string, status: any, url?: string) => {
    setReleases((prev) =>
      prev.map((r) => {
        if (r.id === releaseId) {
          return {
            ...r,
            dspStatuses: r.dspStatuses.map((ds) =>
              ds.store === store ? { ...ds, status, url: url || ds.url, updatedAt: new Date().toISOString() } : ds
            ),
          };
        }
        return r;
      })
    );
    logAuditAction('DSP_STATUS_UPDATE', `Release ${releaseId} - ${store}`, `Updated to ${status}`);
  };

  const requestPayout = (amount: number, method: string): boolean => {
    if (amount > wallet.availableBalance || amount <= 0) return false;

    // Atomically reserve funds
    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance - amount,
      onHold: prev.onHold + amount,
    }));

    const newPayout: PayoutRequestItem = {
      id: `pay_${Date.now()}`,
      payoutNumber: `PAY-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      userId: currentUser.id,
      artistName: currentUser.stageName || currentUser.fullName,
      amount,
      currency: 'INR',
      status: 'PENDING_REVIEW',
      paymentMethod: method,
      requestDate: new Date().toISOString(),
      destinationAccountMasked: wallet.bankAccount.accountNumberMasked || '••••8921',
    };

    setPayouts((prev) => [newPayout, ...prev]);
    logAuditAction('PAYOUT_REQUESTED', newPayout.payoutNumber, `Withdrawal request for ₹${amount} via ${method}`);
    return true;
  };

  const approvePayout = (payoutId: string, txnRef: string) => {
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) return;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'SETTLED',
              transactionRef: txnRef,
              settledDate: new Date().toISOString(),
              reviewerNote: 'Approved and settled via automated banking gateway.',
            }
          : p
      )
    );

    setWallet((prev) => ({
      ...prev,
      onHold: Math.max(0, prev.onHold - payout.amount),
      withdrawnTotal: prev.withdrawnTotal + payout.amount,
    }));

    logAuditAction('PAYOUT_SETTLED', payout.payoutNumber, `Settled ₹${payout.amount} with TxnRef ${txnRef}`);
  };

  const rejectPayout = (payoutId: string, reason: string) => {
    const payout = payouts.find((p) => p.id === payoutId);
    if (!payout) return;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === payoutId
          ? {
              ...p,
              status: 'REVERSED',
              reviewerNote: reason,
              settledDate: new Date().toISOString(),
            }
          : p
      )
    );

    // Reversal to available balance
    setWallet((prev) => ({
      ...prev,
      onHold: Math.max(0, prev.onHold - payout.amount),
      availableBalance: prev.availableBalance + payout.amount,
    }));

    logAuditAction('PAYOUT_REVERSED', payout.payoutNumber, `Reversed ₹${payout.amount}. Reason: ${reason}`);
  };

  const updateBankDetails = (details: Partial<WalletBalance['bankAccount']>) => {
    setWallet((prev) => ({
      ...prev,
      bankAccount: { ...prev.bankAccount, ...details },
    }));
    logAuditAction('BANK_DETAILS_UPDATED', 'Wallet Bank Profile', 'Payout beneficiary account details updated.');
  };

  const importRoyaltyStatement = (newStmt: RoyaltyStatementPeriod, lines: RoyaltyLineDetail[]) => {
    setStatements((prev) => [newStmt, ...prev]);
    setRoyaltyLines((prev) => [...lines, ...prev]);

    // Credit artist wallet
    setWallet((prev) => ({
      ...prev,
      availableBalance: prev.availableBalance + newStmt.netArtistShareInr,
      lifetimeEarnings: prev.lifetimeEarnings + newStmt.netArtistShareInr,
    }));

    logAuditAction(
      'ROYALTY_STATEMENT_IMPORTED',
      newStmt.batchCode,
      `Imported statement for ${newStmt.period}. Credited net artist share ₹${newStmt.netArtistShareInr}.`
    );
  };

  const createTicket = (
    ticketData: Omit<SupportTicket, 'id' | 'ticketNumber' | 'createdAt' | 'updatedAt' | 'messages'>,
    initialMessage: string
  ) => {
    const newTicket: SupportTicket = {
      ...ticketData,
      id: `tkt_${Date.now()}`,
      ticketNumber: `TKT-${Math.floor(1000 + Math.random() * 9000)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      messages: [
        {
          id: `msg_${Date.now()}`,
          senderName: currentUser.stageName || currentUser.fullName,
          isStaff: false,
          content: initialMessage,
          timestamp: new Date().toISOString(),
        },
      ],
    };
    setTickets((prev) => [newTicket, ...prev]);
    logAuditAction('SUPPORT_TICKET_CREATED', newTicket.ticketNumber, ticketData.title);
  };

  const replyToTicket = (ticketId: string, message: string, isStaff = false) => {
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: isStaff ? 'WAITING_ON_ARTIST' : 'IN_PROGRESS',
            updatedAt: new Date().toISOString(),
            messages: [
              ...t.messages,
              {
                id: `msg_${Date.now()}`,
                senderName: isStaff ? 'Support Specialist' : currentUser.stageName || currentUser.fullName,
                isStaff,
                content: message,
                timestamp: new Date().toISOString(),
              },
            ],
          };
        }
        return t;
      })
    );
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) => prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t)));
  };

  const addStaffMember = (member: Omit<StaffMember, 'id' | 'lastLogin'>) => {
    const newStaff: StaffMember = {
      ...member,
      id: `stf_${Date.now()}`,
      lastLogin: 'Never',
    };
    setStaff((prev) => [...prev, newStaff]);
    logAuditAction('STAFF_INVITED', member.email, `Assigned role ${member.role}`);
  };

  const updateStaffMember = (id: string, updates: Partial<StaffMember>) => {
    setStaff((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
    logAuditAction('STAFF_UPDATED', id, 'Permissions or profile updated.');
  };

  const inviteLabelArtist = (stageName: string, legalName: string, email: string) => {
    const newArtist: LabelArtistItem = {
      id: `la_${Date.now()}`,
      stageName,
      legalName,
      email,
      totalReleases: 0,
      totalStreams: 0,
      totalRevenueInr: 0,
      status: 'INVITED',
      joinedDate: new Date().toISOString().split('T')[0],
    };
    setLabelArtists((prev) => [...prev, newArtist]);
    logAuditAction('LABEL_ARTIST_INVITED', email, `Invited ${stageName} to label roster.`);
  };

  const createSmartLink = (link: Omit<SmartLinkItem, 'id' | 'clicks' | 'createdAt'>) => {
    const newLink: SmartLinkItem = {
      ...link,
      id: `sl_${Date.now()}`,
      clicks: 0,
      createdAt: new Date().toISOString(),
    };
    setSmartLinks((prev) => [newLink, ...prev]);
  };

  const playAudioTrack = (track: TrackItem, releaseTitle: string, artistName: string, artworkUrl: string) => {
    setAudioState({
      isOpen: true,
      track,
      releaseTitle,
      artistName,
      artworkUrl,
    });
  };

  const closeAudioPlayer = () => {
    setAudioState({ isOpen: false });
  };

  const isAuthenticated = Boolean(
    currentUser?.isAuthenticated ||
    currentUser?.isDemo ||
    (currentUser?.email && currentUser?.email.length > 0 && currentUser?.role !== 'GUEST')
  );

  return (
    <DigiTubeContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        isAuthenticated,
        isAuthLoading,
        loginUser,
        logoutUser,
        switchRole,
        activeContext,
        setActiveContext,
        releases,
        addRelease,
        updateReleaseStatus,
        requestTakedown,
        updateDspStatus,
        wallet,
        payouts,
        requestPayout,
        approvePayout,
        rejectPayout,
        updateBankDetails,
        statements,
        royaltyLines,
        importRoyaltyStatement,
        tickets,
        createTicket,
        replyToTicket,
        updateTicketStatus,
        staff,
        addStaffMember,
        updateStaffMember,
        auditLogs,
        logAuditAction,
        labelArtists,
        inviteLabelArtist,
        smartLinks,
        createSmartLink,
        audioState,
        playAudioTrack,
        closeAudioPlayer,
      }}
    >
      {children}
    </DigiTubeContext.Provider>
  );
}

export function useDigiTube() {
  const context = useContext(DigiTubeContext);
  if (!context) {
    throw new Error('useDigiTube must be used within a DigiTubeProvider');
  }
  return context;
}
