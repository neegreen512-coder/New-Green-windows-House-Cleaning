"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Envelope,
  Phone,
  MapPin,
  DownloadSimple,
  Trash,
  MagnifyingGlass,
  ClipboardText,
  ChatCircle,
} from "@phosphor-icons/react/dist/ssr";
import { adminApi, type AdminQuote, type AdminMessage } from "@/lib/adminClient";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

/* --------------------------------------------------------------- Presentation */

const STATUS: Record<string, { label: string; color: string }> = {
  new: { label: "New", color: "var(--color-warning)" },
  handled: { label: "Handled", color: "var(--color-muted)" },
  won: { label: "Won", color: "var(--color-brand-700)" },
  lost: { label: "Lost", color: "var(--color-error)" },
};

function StatusBadge({ status }: { status: string }) {
  const s = STATUS[status] ?? { label: status, color: "var(--color-muted)" };
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-[family-name:var(--font-geist-mono)] text-[0.58rem] font-semibold uppercase tracking-[0.13em]"
      style={{ color: s.color, backgroundColor: `color-mix(in srgb, ${s.color} 13%, transparent)` }}
    >
      {s.label}
    </span>
  );
}

// Deterministic on-brand tint for a contact avatar.
const AVATAR_TINTS = [
  "var(--color-brand-700)",
  "var(--color-accent)",
  "var(--color-brand-500)",
  "#2f6d57",
];
function tintFor(name: string) {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_TINTS[h % AVATAR_TINTS.length];
}
function initials(name: string) {
  const p = (name || "").trim().split(/\s+/).filter(Boolean);
  if (!p.length) return "?";
  return (p[0][0] + (p[1]?.[0] ?? "")).toUpperCase();
}
function Avatar({ name }: { name: string }) {
  const c = tintFor(name || "?");
  return (
    <span
      className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-sm font-bold"
      style={{ color: c, backgroundColor: `color-mix(in srgb, ${c} 14%, transparent)` }}
      aria-hidden
    >
      {initials(name)}
    </span>
  );
}

function fmtDate(s?: string) {
  if (!s) return "";
  const d = new Date(s.includes("T") ? s : s.replace(" ", "T") + "Z");
  if (isNaN(d.getTime())) return s;
  return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
}

function ContactLinks({ email, phone }: { email?: string; phone?: string }) {
  return (
    <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
      {email && (
        <a href={`mailto:${email}`} className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-brand-700">
          <Envelope className="h-3.5 w-3.5" aria-hidden />
          <span className="break-all">{email}</span>
        </a>
      )}
      {phone && (
        <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-brand-700">
          <Phone className="h-3.5 w-3.5" aria-hidden />
          {phone}
        </a>
      )}
    </div>
  );
}

function Chips({ items }: { items: (string | false | undefined)[] }) {
  const list = items.filter(Boolean) as string[];
  if (!list.length) return null;
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {list.map((d, i) => (
        <span key={i} className="rounded-md bg-surface-muted px-2 py-0.5 text-[0.72rem] font-medium text-ink/75">
          {d}
        </span>
      ))}
    </div>
  );
}

function MiniStat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div className="card px-4 py-3">
      <div
        className={`font-[family-name:var(--font-bricolage)] text-xl font-bold leading-none ${
          accent && value > 0 ? "text-accent" : "text-brand-800"
        }`}
      >
        {value}
      </div>
      <div className="mt-1 text-[0.72rem] leading-snug text-muted">{label}</div>
    </div>
  );
}

function GroupHead({ label, n, className = "" }: { label: string; n: number; className?: string }) {
  return (
    <h4 className={`mb-2 font-[family-name:var(--font-geist-mono)] text-[0.62rem] uppercase tracking-[0.14em] text-ink/55 ${className}`}>
      {label} ({n})
    </h4>
  );
}
function Empty({ text }: { text: string }) {
  return (
    <p className="rounded-xl border border-dashed border-line px-4 py-6 text-center text-sm text-muted">{text}</p>
  );
}

/* CSV export (formula-injection safe). */
function csvCell(v: unknown) {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = "'" + s;
  return `"${s.replace(/"/g, '""')}"`;
}
function downloadCsv(name: string, rows: unknown[][]) {
  const content = rows.map((r) => r.map(csvCell).join(",")).join("\r\n");
  const blob = new Blob(["﻿" + content], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

/* -------------------------------------------------------------------- Panel */

export function LeadsPanel() {
  const [quotes, setQuotes] = useState<AdminQuote[] | null>(null);
  const [messages, setMessages] = useState<AdminMessage[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  async function load() {
    setErr("");
    try {
      const [q, m] = await Promise.all([adminApi.listQuotes(), adminApi.listMessages()]);
      setQuotes(q);
      setMessages(m);
    } catch (e) {
      setErr(msg(e));
      setQuotes([]);
      setMessages([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function act(fn: () => Promise<unknown>, key: string) {
    setBusy(key);
    setErr("");
    try {
      await fn();
      await load();
    } catch (e) {
      setErr(msg(e));
    } finally {
      setBusy(null);
    }
  }

  function exportCsv() {
    const header = ["Type", "Date", "Name", "Email", "Phone", "Status", "Details", "Address", "Visitor notes", "Owner notes"];
    const qRows = (quotes || []).map((q) => [
      "Quote",
      q.created_at || "",
      q.name,
      q.email,
      q.phone,
      q.status,
      [q.services, q.property_type, q.bedrooms && `${q.bedrooms} bed`, q.bathrooms && `${q.bathrooms} bath`, q.frequency]
        .filter(Boolean)
        .join(" | "),
      q.address,
      q.notes,
      q.admin_notes || "",
    ]);
    const mRows = (messages || []).map((m) => [
      "Message",
      m.created_at || "",
      m.name,
      m.email,
      m.phone,
      m.status,
      m.message,
      "",
      "",
      m.admin_notes || "",
    ]);
    downloadCsv(`newgreen-leads-${new Date().toISOString().slice(0, 10)}.csv`, [header, ...qRows, ...mRows]);
  }

  const q = query.trim().toLowerCase();
  const matches = (lead: { name?: string; email?: string; phone?: string }) =>
    !q || [lead.name, lead.email, lead.phone].some((v) => (v || "").toLowerCase().includes(q));

  const fQuotes = useMemo(() => (quotes ?? []).filter(matches), [quotes, q]); // eslint-disable-line react-hooks/exhaustive-deps
  const fMsgs = useMemo(() => (messages ?? []).filter(matches), [messages, q]); // eslint-disable-line react-hooks/exhaustive-deps

  const ActionBar = ({
    isNew,
    onHandled,
    onReopen,
    onWon,
    onLost,
    onDelete,
    disabled,
    showOutcome,
  }: {
    isNew: boolean;
    onHandled: () => void;
    onReopen: () => void;
    onWon?: () => void;
    onLost?: () => void;
    onDelete: () => void;
    disabled: boolean;
    showOutcome: boolean;
  }) => (
    <div className="flex flex-wrap items-center gap-2 border-t border-line bg-surface-muted/40 px-4 py-2.5">
      {isNew ? (
        <button disabled={disabled} onClick={onHandled} className="btn btn-primary btn-sm disabled:opacity-60">
          Mark handled
        </button>
      ) : (
        <button disabled={disabled} onClick={onReopen} className="btn btn-secondary btn-sm disabled:opacity-60">
          Reopen
        </button>
      )}
      {showOutcome && (
        <>
          <button disabled={disabled} onClick={onWon} className="btn btn-secondary btn-sm disabled:opacity-60">
            Won
          </button>
          <button
            disabled={disabled}
            onClick={onLost}
            className="btn btn-ghost btn-sm text-[var(--color-error)] disabled:opacity-60"
          >
            Lost
          </button>
        </>
      )}
      <button
        disabled={disabled}
        onClick={onDelete}
        aria-label="Delete"
        className="btn btn-ghost btn-sm ml-auto gap-1.5 text-muted hover:text-[var(--color-error)] disabled:opacity-60"
      >
        <Trash className="h-4 w-4" aria-hidden />
        Delete
      </button>
    </div>
  );

  const NotesField = ({ value, onSave }: { value: string; onSave: (v: string) => void }) => (
    <textarea
      defaultValue={value}
      onBlur={(e) => {
        if (e.target.value !== value) onSave(e.target.value);
      }}
      placeholder="Private notes for your team..."
      rows={2}
      className="mt-3 w-full rounded-lg border border-line-strong bg-bg px-3 py-2 text-xs text-ink outline-none transition-colors focus:border-brand-600"
    />
  );

  const renderQuote = (item: AdminQuote) => {
    const key = `q${item.id}`;
    return (
      <li key={item.id} className="card overflow-hidden p-0">
        <div className="flex gap-3.5 p-4">
          <Avatar name={item.name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-ink">{item.name || "Unknown"}</span>
              <StatusBadge status={item.status} />
              <span className="ml-auto inline-flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-[0.65rem] text-muted">
                <ClipboardText className="h-3.5 w-3.5" aria-hidden />
                Quote · {fmtDate(item.created_at)}
              </span>
            </div>
            <ContactLinks email={item.email} phone={item.phone} />
            <Chips
              items={[
                item.services,
                item.property_type,
                item.bedrooms && `${item.bedrooms} bed`,
                item.bathrooms && `${item.bathrooms} bath`,
                item.frequency,
              ]}
            />
            {item.address && (
              <div className="mt-2 inline-flex items-center gap-1.5 text-xs text-muted">
                <MapPin className="h-3.5 w-3.5" aria-hidden />
                {item.address}
              </div>
            )}
            {item.notes && (
              <p className="mt-2.5 rounded-lg bg-surface-muted/70 p-2.5 text-sm leading-relaxed text-ink/85">
                {item.notes}
              </p>
            )}
            <NotesField value={item.admin_notes || ""} onSave={(v) => act(() => adminApi.setQuoteNotes(item.id, v), key)} />
          </div>
        </div>
        <ActionBar
          isNew={item.status === "new"}
          showOutcome
          disabled={busy === key}
          onHandled={() => act(() => adminApi.setQuoteStatus(item.id, "handled"), key)}
          onReopen={() => act(() => adminApi.setQuoteStatus(item.id, "new"), key)}
          onWon={() => act(() => adminApi.setQuoteStatus(item.id, "won"), key)}
          onLost={() => act(() => adminApi.setQuoteStatus(item.id, "lost"), key)}
          onDelete={() => {
            if (window.confirm("Delete this request permanently?")) act(() => adminApi.deleteQuote(item.id), key);
          }}
        />
      </li>
    );
  };

  const renderMessage = (item: AdminMessage) => {
    const key = `m${item.id}`;
    return (
      <li key={item.id} className="card overflow-hidden p-0">
        <div className="flex gap-3.5 p-4">
          <Avatar name={item.name} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
              <span className="font-semibold text-ink">{item.name || "Unknown"}</span>
              <StatusBadge status={item.status} />
              <span className="ml-auto inline-flex items-center gap-1 font-[family-name:var(--font-geist-mono)] text-[0.65rem] text-muted">
                <ChatCircle className="h-3.5 w-3.5" aria-hidden />
                Message · {fmtDate(item.created_at)}
              </span>
            </div>
            <ContactLinks email={item.email} phone={item.phone} />
            <p className="mt-2.5 rounded-lg bg-surface-muted/70 p-2.5 text-sm leading-relaxed text-ink/85">
              {item.message}
            </p>
            <NotesField value={item.admin_notes || ""} onSave={(v) => act(() => adminApi.setMessageNotes(item.id, v), key)} />
          </div>
        </div>
        <ActionBar
          isNew={item.status === "new"}
          showOutcome={false}
          disabled={busy === key}
          onHandled={() => act(() => adminApi.setMessageStatus(item.id, "handled"), key)}
          onReopen={() => act(() => adminApi.setMessageStatus(item.id, "new"), key)}
          onDelete={() => {
            if (window.confirm("Delete this message permanently?")) act(() => adminApi.deleteMessage(item.id), key);
          }}
        />
      </li>
    );
  };

  const newQuotes = fQuotes.filter((x) => x.status === "new");
  const handledQuotes = fQuotes.filter((x) => x.status !== "new");
  const newMsgs = fMsgs.filter((x) => x.status === "new");
  const handledMsgs = fMsgs.filter((x) => x.status !== "new");
  const wonCount = (quotes ?? []).filter((x) => x.status === "won").length;
  const loading = quotes === null || messages === null;

  return (
    <div className="space-y-8">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}

      {/* KPI strip */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <MiniStat label="New quote requests" value={newQuotes.length} accent />
        <MiniStat label="New messages" value={newMsgs.length} accent />
        <MiniStat label="Total leads" value={(quotes?.length ?? 0) + (messages?.length ?? 0)} />
        <MiniStat label="Marked won" value={wonCount} />
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="relative flex-1 sm:max-w-xs">
          <MagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" aria-hidden />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, email, or phone"
            className="w-full rounded-lg border border-line-strong bg-bg py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors focus:border-brand-600"
          />
        </label>
        <button
          type="button"
          onClick={exportCsv}
          disabled={loading}
          className="btn btn-secondary btn-sm shrink-0 gap-1.5 disabled:opacity-60"
        >
          <DownloadSimple className="h-4 w-4" aria-hidden />
          Export CSV
        </button>
      </div>

      {loading ? (
        <p className="text-sm text-muted">Loading your leads...</p>
      ) : (
        <div className="space-y-10">
          <section>
            <h3 className="text-sm font-semibold text-ink">Quote requests</h3>
            <div className="mt-3">
              <GroupHead label="Needs attention" n={newQuotes.length} />
              {newQuotes.length === 0 ? (
                <Empty text={q ? "No quote requests match your search." : "All caught up. No new quote requests."} />
              ) : (
                <ul className="space-y-3">{newQuotes.map(renderQuote)}</ul>
              )}
            </div>
            {handledQuotes.length > 0 && (
              <div className="mt-6">
                <GroupHead label="Handled" n={handledQuotes.length} />
                <ul className="space-y-3">{handledQuotes.map(renderQuote)}</ul>
              </div>
            )}
          </section>

          <section>
            <h3 className="text-sm font-semibold text-ink">Messages</h3>
            <div className="mt-3">
              <GroupHead label="Needs attention" n={newMsgs.length} />
              {newMsgs.length === 0 ? (
                <Empty text={q ? "No messages match your search." : "All caught up. No new messages."} />
              ) : (
                <ul className="space-y-3">{newMsgs.map(renderMessage)}</ul>
              )}
            </div>
            {handledMsgs.length > 0 && (
              <div className="mt-6">
                <GroupHead label="Handled" n={handledMsgs.length} />
                <ul className="space-y-3">{handledMsgs.map(renderMessage)}</ul>
              </div>
            )}
          </section>
        </div>
      )}
    </div>
  );
}
