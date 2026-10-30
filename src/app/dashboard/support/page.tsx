'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import {
  HelpCircle,
  Plus,
  Send,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Clock,
  ShieldAlert,
  X,
  User,
} from 'lucide-react';

export default function SupportPage() {
  const { tickets, createTicket, replyToTicket, currentUser } = useDigiTube();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [replyMessage, setReplyMessage] = useState('');

  // New ticket state
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<any>('COPYRIGHT_DISPUTE');
  const [priority, setPriority] = useState<any>('MEDIUM');
  const [initialMessage, setInitialMessage] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !initialMessage) return;

    createTicket(
      {
        userId: currentUser.id,
        userName: currentUser.stageName || currentUser.fullName,
        title,
        category,
        priority,
        status: 'NEW',
      },
      initialMessage
    );

    setShowNewTicketModal(false);
    setTitle('');
    setInitialMessage('');
  };

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    replyToTicket(selectedTicket.id, replyMessage, false);
    setReplyMessage('');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
            Support Desk & Case Triage
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Section 17: Direct communication with DigiTube quality compliance, royalty accounts, and catalog operations teams.
          </p>
        </div>

        <button
          onClick={() => setShowNewTicketModal(true)}
          className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-sm hover:shadow flex items-center gap-2 self-start sm:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Open Support Ticket</span>
        </button>
      </div>

      {/* Main Two-Pane Support Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Ticket List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            Active Tickets ({tickets.length})
          </div>

          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedTicket?.id === t.id
                    ? 'bg-blue-50/60 dark:bg-slate-800 border-blue-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/80 px-2 py-0.5 rounded font-semibold border border-blue-200 dark:border-blue-800/60">
                    {t.ticketNumber}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : t.status === 'IN_PROGRESS'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {t.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                  <span>{t.category.replace(/_/g, ' ')}</span>
                  <span>{formatDate(t.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: Message Thread */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Ticket Details Bar */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-blue-600 dark:text-blue-400">{selectedTicket.ticketNumber}</span>
                    <span className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-full font-mono border border-slate-200 dark:border-slate-700">
                      Priority: {selectedTicket.priority}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">{selectedTicket.title}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Category: {selectedTicket.category.replace(/_/g, ' ')}
                  </p>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isStaff ? 'items-start' : 'items-end'}`}
                  >
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 px-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{m.senderName}</span>
                      {m.isStaff && (
                        <span className="bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 px-1 rounded text-[9px] font-semibold">
                          STAFF
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatDate(m.timestamp)}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed shadow-sm ${
                        m.isStaff
                          ? 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none'
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Input Form */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Type your response to support staff..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a ticket on the left to view message history
            </div>
          )}
        </div>
      </div>

      {/* CREATE TICKET MODAL */}
      {showNewTicketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 space-y-5 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                <span>Open New Support Case</span>
              </h3>
              <button onClick={() => setShowNewTicketModal(false)} className="text-slate-400 hover:text-slate-600 dark:hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Issue Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                >
                  <option value="COPYRIGHT_DISPUTE">Copyright Clearance & Dispute</option>
                  <option value="RELEASE_REJECTION">Release Rejection Appeal</option>
                  <option value="METADATA_CORRECTION">Metadata / Store URL Correction</option>
                  <option value="STORE_TAKEDOWN">Store Takedown Request</option>
                  <option value="ROYALTY_INQUIRY">Royalty Statement Discrepancy</option>
                  <option value="PAYOUT_HELP">Bank Payout Assistance</option>
                  <option value="TECHNICAL_ERROR">Upload / Audio Technical Error</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Subject Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Splice sample license attachment for track 1"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-700 dark:text-slate-300 font-medium mb-1">Initial Message & Details</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Describe your issue with release code, ISRC, or license keys..."
                  value={initialMessage}
                  onChange={(e) => setInitialMessage(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl p-3 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewTicketModal(false)}
                  className="px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
