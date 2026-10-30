'use client';

import React, { useState } from 'react';
import { useDigiTube } from '@/lib/store';
import { formatDate } from '@/lib/utils';
import {
  LifeBuoy,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  User,
  ShieldCheck,
} from 'lucide-react';

export default function AdminSupportPage() {
  const { tickets, replyToTicket, updateTicketStatus } = useDigiTube();

  const [selectedTicketId, setSelectedTicketId] = useState<string>(tickets[0]?.id || '');
  const [replyMessage, setReplyMessage] = useState('');

  const selectedTicket = tickets.find((t) => t.id === selectedTicketId) || tickets[0];

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyMessage.trim() || !selectedTicket) return;

    replyToTicket(selectedTicket.id, replyMessage, true);
    setReplyMessage('');
  };

  const handleStatusChange = (status: any) => {
    if (!selectedTicket) return;
    updateTicketStatus(selectedTicket.id, status);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
          <LifeBuoy className="w-4 h-4" />
          <span>Staff Helpdesk Operations (Section 16 Blueprint)</span>
        </div>
        <h1 className="text-2xl font-display font-bold text-slate-900 dark:text-white tracking-tight">
          Artist Support & Copyright Triage
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Handle artist inquiry tickets, investigate copyright complaints, clarify metadata rejections, and verify profile links.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <div className="space-y-3">
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider px-1">
            All Incoming Tickets ({tickets.length})
          </div>

          <div className="space-y-2">
            {tickets.map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedTicketId(t.id)}
                className={`w-full p-4 rounded-xl border text-left transition-all ${
                  selectedTicket?.id === t.id
                    ? 'bg-amber-50/60 dark:bg-slate-800 border-amber-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] mb-1.5">
                  <span className="font-mono text-amber-800 dark:text-amber-400 bg-amber-100 dark:bg-amber-950 px-2 py-0.5 rounded font-semibold border border-amber-200 dark:border-amber-800/60">
                    {t.ticketNumber}
                  </span>
                  <span
                    className={`font-semibold px-2 py-0.5 rounded-full text-[10px] ${
                      t.status === 'RESOLVED'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800'
                    }`}
                  >
                    {t.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{t.title}</h4>
                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400 mt-2">
                  <span className="text-slate-700 dark:text-slate-300 font-medium">Artist: {t.userName}</span>
                  <span>{formatDate(t.updatedAt)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Conversation Thread */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[500px]">
          {selectedTicket ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              {/* Top Controls */}
              <div className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">{selectedTicket.ticketNumber}</span>
                    <span className="text-xs text-slate-900 dark:text-white font-bold">{selectedTicket.title}</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Raised by <strong className="text-slate-900 dark:text-slate-200">{selectedTicket.userName}</strong> • Category: {selectedTicket.category.replace(/_/g, ' ')}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 font-medium"
                  >
                    <option value="NEW">New</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="WAITING_ON_ARTIST">Waiting on Artist</option>
                    <option value="RESOLVED">Resolved</option>
                    <option value="CLOSED">Closed</option>
                  </select>
                </div>
              </div>

              {/* Message List */}
              <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2">
                {selectedTicket.messages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.isStaff ? 'items-end' : 'items-start'}`}
                  >
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 mb-1 px-1 flex items-center gap-1.5">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">{m.senderName}</span>
                      {m.isStaff && (
                        <span className="bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 px-1 rounded text-[9px] font-semibold">
                          STAFF REPLY
                        </span>
                      )}
                      <span>•</span>
                      <span>{formatDate(m.timestamp)}</span>
                    </div>

                    <div
                      className={`p-3.5 rounded-2xl text-xs max-w-lg leading-relaxed shadow-sm ${
                        m.isStaff
                          ? 'bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-500/30 text-amber-900 dark:text-amber-100 rounded-tr-none'
                          : 'bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-200 rounded-tl-none'
                      }`}
                    >
                      {m.content}
                    </div>
                  </div>
                ))}
              </div>

              {/* Reply Box */}
              <form onSubmit={handleSendReply} className="pt-4 border-t border-slate-100 dark:border-slate-800 flex gap-2">
                <input
                  type="text"
                  placeholder="Respond to artist as DigiTube Operations Specialist..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="submit"
                  disabled={!replyMessage.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50 shadow-sm"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Staff Reply</span>
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-xs text-slate-400">
              Select a ticket to open conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
