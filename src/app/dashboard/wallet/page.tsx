'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatCurrencyINR, formatDate } from '@/lib/utils';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Wallet,
  ArrowUpRight,
  Building,
  CheckCircle2,
  Clock,
  ShieldCheck,
  AlertCircle,
  X,
  CreditCard,
  Edit2,
  Sparkles,
  Lock,
} from 'lucide-react';

export default function WalletPage() {
  const { wallet, payouts, requestPayout, updateBankDetails } = useDigiTube();

  const [payoutAmount, setPayoutAmount] = useState<string>('1000');
  const [payoutMethod, setPayoutMethod] = useState<'BANK_NEFT_RTGS' | 'UPI_DIRECT'>('BANK_NEFT_RTGS');
  const [showPayoutModal, setShowPayoutModal] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);
  const [payoutSuccessMsg, setPayoutSuccessMsg] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Bank Form State
  const [holderName, setHolderName] = useState(wallet.bankAccount.holderName || '');
  const [bankName, setBankName] = useState(wallet.bankAccount.bankName || '');
  const [accountNumber, setAccountNumber] = useState(wallet.bankAccount.accountNumberMasked || '');
  const [ifsc, setIfsc] = useState(wallet.bankAccount.ifscSwift || '');
  const [upi, setUpi] = useState(wallet.bankAccount.upiId || '');
  const [pan, setPan] = useState(wallet.bankAccount.panTaxId || '');

  const handleRequestWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    const amt = parseFloat(payoutAmount);

    if (isNaN(amt) || amt < 1000) {
      setErrorMessage('Minimum payout withdrawal amount is ₹1,000.');
      return;
    }

    if (amt > wallet.availableBalance) {
      setErrorMessage('Requested amount exceeds your available balance.');
      return;
    }

    const success = requestPayout(
      amt,
      payoutMethod === 'BANK_NEFT_RTGS' ? 'Bank Transfer (NEFT/RTGS)' : `UPI (${wallet.bankAccount.upiId})`
    );

    if (success) {
      setPayoutSuccessMsg(true);
      setShowPayoutModal(false);
      setTimeout(() => setPayoutSuccessMsg(false), 5000);
    }
  };

  const handleSaveBankDetails = (e: React.FormEvent) => {
    e.preventDefault();
    const masked = '••••••••' + accountNumber.slice(-4);
    updateBankDetails({
      holderName,
      bankName,
      accountNumberMasked: masked,
      ifscSwift: ifsc.toUpperCase(),
      upiId: upi,
      panTaxId: pan.toUpperCase(),
    });
    setShowBankModal(false);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Artist Wallet & Payout Settlement
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 13 Compliant: Atomic balance separation (Available, Pending, Held, and Settled) with direct Indian banking integration.
          </p>
        </div>

        <button
          onClick={() => setShowPayoutModal(true)}
          disabled={wallet.availableBalance < 1000}
          className="btn-primary px-4 py-2 text-xs flex items-center gap-2 self-start sm:self-auto disabled:opacity-50"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Request Payout</span>
        </button>
      </div>

      {payoutSuccessMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-3 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <strong className="font-semibold text-emerald-900 dark:text-emerald-200">Withdrawal Initiated:</strong> Funds have been atomically reserved from your available balance. The request is now queued for finance reviewer verification and automated NEFT/RTGS batch transfer.
          </div>
        </div>
      )}

      {/* 4-Tier Balance Cards (Section 13) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Available Balance */}
        <div className="card-executive p-5 space-y-2 relative overflow-hidden border-blue-500/40 dark:border-blue-500/40 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 dark:text-blue-400 text-xs font-semibold">
            <span>Available to Withdraw</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {formatCurrencyINR(wallet.availableBalance)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Reconciled royalties cleared for immediate payout
          </p>
        </div>

        {/* Pending Balance */}
        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
            Pending Statements
          </span>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {formatCurrencyINR(wallet.pendingRoyalty)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Awaiting store close & distribution partner settlement
          </p>
        </div>

        {/* On Hold / Reserved */}
        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            Reserved / In Transit
          </span>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {formatCurrencyINR(wallet.onHold)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Held during compliance check or pending bank dispatch
          </p>
        </div>

        {/* Lifetime Earnings */}
        <div className="card-executive p-5 space-y-2 shadow-xs">
          <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
            Lifetime Accrued
          </span>
          <div className="text-3xl font-display font-bold tabular-nums text-slate-900 dark:text-white">
            {formatCurrencyINR(wallet.lifetimeEarnings)}
          </div>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Total historical artist royalties credited to account
          </p>
        </div>
      </div>

      {/* Linked Bank & Payee Account */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Settlement Bank Account & Tax Identity</h3>
          </div>
          <button
            onClick={() => setShowBankModal(true)}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 flex items-center gap-1.5 transition-colors"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>Update Details</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Beneficiary Name</span>
            <div className="font-bold text-slate-900 dark:text-white">{wallet.bankAccount.holderName}</div>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> KYC & PAN Verified
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">Bank & Account Number</span>
            <div className="font-bold text-slate-900 dark:text-white">{wallet.bankAccount.bankName}</div>
            <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">
              A/C: {wallet.bankAccount.accountNumberMasked} • IFSC: {wallet.bankAccount.ifscSwift}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200 dark:border-slate-800/80 space-y-1">
            <span className="text-slate-500 dark:text-slate-400 text-[11px]">UPI & Tax Identification</span>
            <div className="font-mono font-bold text-blue-600 dark:text-blue-400">{wallet.bankAccount.upiId || 'Not Configured'}</div>
            <div className="font-mono text-slate-600 dark:text-slate-400 text-[11px]">PAN: {wallet.bankAccount.panTaxId}</div>
          </div>
        </div>
      </div>

      {/* Payout Transactions History Table */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Withdrawal & Payout History</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Automated NEFT / RTGS / UPI settlement log</p>
          </div>
          <span className="text-[11px] text-slate-600 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full">
            Total Settled: {formatCurrencyINR(wallet.withdrawnTotal)}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="text-[11px] uppercase tracking-wider text-slate-500 dark:text-slate-400 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50">
              <tr>
                <th className="py-3 px-4 font-semibold">Payout ID</th>
                <th className="py-3 px-4 font-semibold">Request Date</th>
                <th className="py-3 px-4 font-semibold">Payment Method</th>
                <th className="py-3 px-4 font-semibold">Bank Reference (Txn ID)</th>
                <th className="py-3 px-4 font-semibold text-right">Amount</th>
                <th className="py-3 px-4 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-slate-900 dark:text-white">{p.payoutNumber}</td>
                  <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400">{formatDate(p.requestDate)}</td>
                  <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">{p.paymentMethod}</td>
                  <td className="py-3.5 px-4 font-mono text-slate-500 dark:text-slate-400 text-[11px]">
                    {p.transactionRef || <span className="text-amber-600 dark:text-amber-400 italic">Processing Verification</span>}
                  </td>
                  <td className="py-3.5 px-4 text-right font-mono font-bold text-slate-900 dark:text-white">
                    {formatCurrencyINR(p.amount)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* REQUEST PAYOUT MODAL */}
      {showPayoutModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Request Payout Settlement</span>
              </h3>
              <button onClick={() => setShowPayoutModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRequestWithdrawal} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Withdrawal Amount (INR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-xs font-bold text-slate-400">₹</span>
                  <input
                    type="number"
                    min={1000}
                    max={wallet.availableBalance}
                    step={100}
                    value={payoutAmount}
                    onChange={(e) => setPayoutAmount(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl py-2.5 pl-8 pr-3 text-sm text-slate-900 dark:text-white font-mono font-bold focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  <span>Available: {formatCurrencyINR(wallet.availableBalance)}</span>
                  <button
                    type="button"
                    onClick={() => setPayoutAmount(wallet.availableBalance.toString())}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-medium"
                  >
                    Withdraw Max
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Payout Method</label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setPayoutMethod('BANK_NEFT_RTGS')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      payoutMethod === 'BANK_NEFT_RTGS'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold">Bank Transfer</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">NEFT / RTGS to HDFC</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPayoutMethod('UPI_DIRECT')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      payoutMethod === 'UPI_DIRECT'
                        ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 text-blue-900 dark:text-blue-200'
                        : 'bg-slate-50 dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <div className="font-bold">UPI Direct</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                      {wallet.bankAccount?.upiId || 'Verified UPI ID'}
                    </div>
                  </button>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 text-rose-700 dark:text-rose-300 text-xs">
                  {errorMessage}
                </div>
              )}

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 space-y-1">
                <div className="flex justify-between">
                  <span>Atomic Balance Reservation:</span>
                  <span className="font-mono text-emerald-600 dark:text-emerald-400 font-semibold">Enabled</span>
                </div>
                <div className="flex justify-between">
                  <span>Processing SLA:</span>
                  <span className="text-slate-800 dark:text-slate-300">Within 24 Hours (Banking Days)</span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowPayoutModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Confirm Withdrawal
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE BANK DETAILS MODAL */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Update Bank & Tax Information</span>
              </h3>
              <button onClick={() => setShowBankModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveBankDetails} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Account Holder Legal Name</label>
                <input
                  type="text"
                  value={holderName}
                  onChange={(e) => setHolderName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Bank Name</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Bank Account Number</label>
                <input
                  type="text"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">IFSC Code</label>
                  <input
                    type="text"
                    value={ifsc}
                    onChange={(e) => setIfsc(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">PAN / Tax ID</label>
                  <input
                    type="text"
                    value={pan}
                    onChange={(e) => setPan(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono uppercase focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">UPI ID (VPA)</label>
                <input
                  type="text"
                  value={upi}
                  onChange={(e) => setUpi(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-mono focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowBankModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Save Bank Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
