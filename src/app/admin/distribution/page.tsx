'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import {
  Send,
  RefreshCw,
  Server,
  CheckCircle2,
  AlertTriangle,
  Radio,
  ExternalLink,
  Sliders,
  Code2,
  Trash2,
  Check,
} from 'lucide-react';

export default function AdminDistributionPage() {
  const { releases, updateDspStatus, logAuditAction } = useDigiTube();

  const [activePartner, setActivePartner] = useState<'core_ddex' | 'direct_gateway' | 'fast_sync'>('core_ddex');
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncNotice, setSyncNotice] = useState<string | null>(null);

  const approvedReleases = releases.filter(
    (r) =>
      r.status === 'APPROVED' ||
      r.status === 'QUEUED' ||
      r.status === 'PROVIDER_PROCESSING' ||
      r.status === 'LIVE'
  );

  const handleSimulateSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncNotice('DigiTube DDEX adapter successfully polled global DSP endpoints. 6 store webhooks processed.');
      logAuditAction('DSP_GATEWAY_SYNC', 'DigiTube DDEX Core v3.8', 'Manual sync triggered by administrator.');
      setTimeout(() => setSyncNotice(null), 5000);
    }, 1200);
  };

  const handleForceStoreLive = (releaseId: string, store: string) => {
    updateDspStatus(releaseId, store, 'LIVE', `https://${store}.com/track/${Date.now()}`);
    setSyncNotice(`Updated store ${store} status to LIVE with verified store URL.`);
    setTimeout(() => setSyncNotice(null), 4000);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 dark:text-blue-400 mb-1">
            <Send className="w-4 h-4" />
            <span>Outbox Job Queue & Partner Adapters (Section 10 & 11)</span>
          </div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            DSP Distribution Partner Gateway
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Monitor DDEX batch queues, manage partner API credentials, and verify store-by-store ingestion.
          </p>
        </div>

        <button
          onClick={handleSimulateSync}
          disabled={isSyncing}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow flex items-center gap-2 self-start sm:self-auto transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>{isSyncing ? 'Synchronizing DSPs...' : 'Poll Partner Webhooks'}</span>
        </button>
      </div>

      {syncNotice && (
        <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-blue-900 dark:text-blue-300 text-xs flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
          <span className="font-medium">{syncNotice}</span>
        </div>
      )}

      {/* Partner Adapter Config Box (Section 10 & 11) */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <Server className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Active Distribution Partner Adapter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">White-label sound-recording delivery connection</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {(
              [
                { id: 'core_ddex', label: 'Primary DDEX Engine' },
                { id: 'direct_gateway', label: 'Direct DSP Grid' },
                { id: 'fast_sync', label: 'FastTrack Hub' },
              ] as const
            ).map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePartner(p.id)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activePartner === p.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Adapter Version:</span>
            <span className="font-mono text-slate-900 dark:text-white font-semibold">DigiTube DDEX Core v3.8 / Lossless Hi-Res</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Ingestion Mode:</span>
            <span className="font-mono text-amber-700 dark:text-amber-400 font-semibold">Sandbox (Pre-Production Mode)</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Webhook Signing Key:</span>
            <span className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">whsec_••••••••••••9812</span>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800">
            <span className="text-slate-500 dark:text-slate-400 text-[11px] block">Idempotency Bounded Retries:</span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Exponential Backoff (5 retries)</span>
          </div>
        </div>
      </div>

      {/* Outbox Delivery Queue Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Outbox Delivery Jobs & Store Statuses</h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">Total {approvedReleases.length} catalog items tracked</span>
        </div>

        <div className="space-y-4">
          {approvedReleases.map((rel) => (
            <div
              key={rel.id}
              className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800 space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-semibold text-blue-700 dark:text-blue-400 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded border border-blue-200 dark:border-blue-800/60">
                      {rel.releaseCode}
                    </span>
                    <span className="text-xs font-mono text-slate-600 dark:text-slate-400">UPC: {rel.upcEan}</span>
                    <span className="text-[10px] text-slate-500 uppercase font-semibold">{rel.releaseType}</span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {rel.title} <span className="text-slate-500 dark:text-slate-400 font-normal">by {rel.artistStageName}</span>
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Target Date: {rel.targetReleaseDate}
                  </span>
                </div>
              </div>

              {/* Per-Store Delivery Controls */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-xs">
                {rel.dspStatuses.map((dsp) => (
                  <div
                    key={dsp.store}
                    className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-col justify-between space-y-2 shadow-sm"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize truncate text-[11px]">
                        {dsp.store.replace('_', ' ')}
                      </span>
                      <span
                        className={`text-[9px] font-mono px-1 rounded font-semibold ${
                          dsp.status === 'LIVE'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                            : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                        }`}
                      >
                        {dsp.status}
                      </span>
                    </div>

                    {dsp.status !== 'LIVE' && (
                      <button
                        onClick={() => handleForceStoreLive(rel.id, dsp.store)}
                        className="w-full py-1 rounded bg-slate-100 dark:bg-slate-800 hover:bg-emerald-600 hover:text-white text-[10px] text-slate-600 dark:text-slate-400 font-medium transition-colors"
                      >
                        Simulate Store Live
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
