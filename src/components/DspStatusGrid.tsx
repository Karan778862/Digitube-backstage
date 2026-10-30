'use client';

import React from 'react';
import { DspStoreStatusItem } from '@/lib/types';
import { getDspDisplayName, getDspColor } from '@/lib/utils';
import { ExternalLink, CheckCircle, Clock, AlertTriangle, XCircle } from 'lucide-react';
import { getDspIconComponent } from '@/components/DspLogos';

interface DspStatusGridProps {
  dspStatuses: DspStoreStatusItem[];
  compact?: boolean;
}

export const DspStatusGrid: React.FC<DspStatusGridProps> = ({ dspStatuses, compact = false }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'LIVE':
        return <CheckCircle className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />;
      case 'PROCESSING':
      case 'DELIVERED':
        return <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />;
      case 'REJECTED':
        return <XCircle className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      default:
        return <Clock className="w-3.5 h-3.5 text-slate-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'LIVE':
        return 'Live';
      case 'PROCESSING':
        return 'Processing';
      case 'DELIVERED':
        return 'Delivered';
      case 'REJECTED':
        return 'Rejected';
      case 'PENDING':
        return 'Pending';
      default:
        return status;
    }
  };

  if (compact) {
    return (
      <div className="flex flex-wrap gap-1.5 items-center">
        {dspStatuses.map((dsp) => {
          const color = getDspColor(dsp.store);
          const isLive = dsp.status === 'LIVE';
          const LogoIcon = getDspIconComponent(dsp.store);
          return (
            <div
              key={dsp.store}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                isLive
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60 text-slate-600 dark:text-slate-400'
              }`}
              title={`${getDspDisplayName(dsp.store)}: ${getStatusLabel(dsp.status)}`}
            >
              <LogoIcon size={12} className="shrink-0" />
              <span className="font-semibold">{getDspDisplayName(dsp.store)}</span>
              {getStatusIcon(dsp.status)}
            </div>
          );
        })}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
      {dspStatuses.map((dsp) => {
        const color = getDspColor(dsp.store);
        const isLive = dsp.status === 'LIVE';

        const LogoIcon = getDspIconComponent(dsp.store);

        return (
          <div
            key={dsp.store}
            className={`p-3 rounded-xl border transition-all ${
              isLive
                ? 'bg-white dark:bg-[#0d1322] border-slate-200/90 dark:border-slate-800 shadow-sm'
                : 'bg-slate-50 dark:bg-[#0d1322]/50 border-slate-200 dark:border-slate-800/60'
            }`}
          >
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0">
                  <LogoIcon size={13} className="shrink-0" />
                </div>
                <span className="font-semibold text-xs text-slate-900 dark:text-slate-100">
                  {getDspDisplayName(dsp.store)}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[11px]">
                {getStatusIcon(dsp.status)}
                <span
                  className={
                    isLive
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                      : dsp.status === 'PROCESSING'
                      ? 'text-amber-600 dark:text-amber-400 font-medium'
                      : 'text-slate-500 dark:text-slate-400'
                  }
                >
                  {getStatusLabel(dsp.status)}
                </span>
              </div>
            </div>

            <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between pt-1.5 border-t border-slate-100 dark:border-slate-800/80">
              <span className="font-mono text-[10px] text-slate-400 dark:text-slate-500 truncate max-w-[140px]">
                {dsp.externalId || 'Auto-Allocated URI'}
              </span>

              {dsp.url ? (
                <a
                  href={dsp.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline font-medium transition-colors"
                >
                  <span>Open Store</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              ) : (
                <span className="text-slate-400 dark:text-slate-600 italic text-[10px]">Syncing</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};
