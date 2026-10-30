'use client';

import React from 'react';
import { ReleaseStatus, DspDeliveryStatus } from '@/lib/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: ReleaseStatus | DspDeliveryStatus | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md', className }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'LIVE':
        return {
          label: 'Live on Stores',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40',
          dot: 'bg-emerald-500',
        };
      case 'IN_REVIEW':
        return {
          label: 'In QA Review',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40',
          dot: 'bg-amber-500 animate-pulse',
        };
      case 'CHANGES_REQUIRED':
        return {
          label: 'Changes Required',
          bg: 'bg-rose-50 text-rose-700 border-rose-200/80 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-800/40',
          dot: 'bg-rose-500',
        };
      case 'PROVIDER_PROCESSING':
      case 'PROCESSING':
        return {
          label: 'Processing Ingestion',
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40',
          dot: 'bg-blue-500 animate-pulse',
        };
      case 'APPROVED':
        return {
          label: 'Approved for Delivery',
          bg: 'bg-blue-50 text-blue-700 border-blue-200/80 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-800/40',
          dot: 'bg-blue-600',
        };
      case 'SUBMITTED':
      case 'VALIDATION':
        return {
          label: 'Queued',
          bg: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/60',
          dot: 'bg-slate-400',
        };
      case 'DRAFT':
        return {
          label: 'Draft',
          bg: 'bg-slate-100 text-slate-600 border-slate-200/80 dark:bg-slate-800/50 dark:text-slate-400 dark:border-slate-700/60',
          dot: 'bg-slate-400',
        };
      case 'REJECTED':
        return {
          label: 'Rejected',
          bg: 'bg-red-50 text-red-700 border-red-200/80 dark:bg-red-950/30 dark:text-red-400 dark:border-red-800/40',
          dot: 'bg-red-500',
        };
      case 'TAKEDOWN_PENDING':
      case 'TAKEDOWN_REQUESTED':
        return {
          label: 'Takedown Pending',
          bg: 'bg-orange-50 text-orange-700 border-orange-200/80 dark:bg-orange-950/30 dark:text-orange-400 dark:border-orange-800/40',
          dot: 'bg-orange-500',
        };
      case 'SETTLED':
        return {
          label: 'Settled to Bank',
          bg: 'bg-emerald-50 text-emerald-700 border-emerald-200/80 dark:bg-emerald-950/30 dark:text-emerald-400 dark:border-emerald-800/40',
          dot: 'bg-emerald-500',
        };
      case 'PENDING_REVIEW':
        return {
          label: 'Pending Approval',
          bg: 'bg-amber-50 text-amber-700 border-amber-200/80 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-800/40',
          dot: 'bg-amber-500 animate-pulse',
        };
      default:
        return {
          label: status.replace(/_/g, ' '),
          bg: 'bg-slate-100 text-slate-700 border-slate-200/80 dark:bg-slate-800/50 dark:text-slate-300 dark:border-slate-700/60',
          dot: 'bg-slate-400',
        };
    }
  };

  const config = getBadgeConfig();

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1.5',
    md: 'text-[11px] px-2.5 py-0.5 gap-1.5',
    lg: 'text-xs px-3 py-1 gap-2',
  }[size];

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md border tracking-tight transition-colors',
        config.bg,
        sizeStyles,
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full shrink-0', config.dot)} />
      <span>{config.label}</span>
    </span>
  );
};
