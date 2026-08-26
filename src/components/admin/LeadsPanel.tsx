"use client";

import { useEffect, useState } from "react";
import { adminApi, type AdminQuote, type AdminMessage } from "@/lib/adminClient";

function msg(e: unknown) {
  return e instanceof Error ? e.message : "Action failed";
}

function StatusPill({ status }: { status: string }) {
  return (
    <span className={`label-mono ${status === "new" ? "text-[var(--color-warning)]" : "text-brand-700"}`}>
      {status}
    </span>
  );
}

function Group({
  title,
  count,
  empty,
  children,
}: {
  title: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mt-4">
      <h4 className="mb-2 label-mono text-ink/60">
        {title} ({count})
      </h4>
      {count === 0 ? <p className="text-sm text-muted">{empty}</p> : <ul className="space-y-3">{children}</ul>}
    </div>
  );
}

export function LeadsPanel() {
  const [quotes, setQuotes] = useState<AdminQuote[] | null>(null);
  const [messages, setMessages] = useState<AdminMessage[] | null>(null);
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

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

  const renderQuote = (q: AdminQuote) => {
    const key = `q${q.id}`;
    return (
      <li key={q.id} className="card p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink">{q.name}</span>
              <StatusPill status={q.status} />
            </div>
            <div className="break-words text-xs text-muted">
              {[q.email, q.phone].filter(Boolean).join("  ·  ")}
            </div>
            <div className="mt-2 text-sm text-ink/85">
              {[
                q.services,
                q.property_type,
                q.bedrooms && `${q.bedrooms} bed`,
                q.bathrooms && `${q.bathrooms} bath`,
                q.frequency,
              ]
                .filter(Boolean)
                .join("  ·  ")}
            </div>
            {q.address && <div className="mt-1 text-sm text-muted">{q.address}</div>}
            {q.notes && <p className="mt-2 text-sm leading-relaxed text-ink/85">{q.notes}</p>}
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            {q.status === "new" ? (
              <button
                disabled={busy === key}
                onClick={() => act(() => adminApi.setQuoteStatus(q.id, "handled"), key)}
                className="btn btn-primary px-3 py-1.5 text-sm disabled:opacity-60"
              >
                Mark handled
              </button>
            ) : (
              <button
                disabled={busy === key}
                onClick={() => act(() => adminApi.setQuoteStatus(q.id, "new"), key)}
                className="btn btn-secondary px-3 py-1.5 text-sm disabled:opacity-60"
              >
                Reopen
              </button>
            )}
            <button
              disabled={busy === key}
              onClick={() => {
                if (window.confirm("Delete this request permanently?")) {
                  act(() => adminApi.deleteQuote(q.id), key);
                }
              }}
              className="btn btn-ghost px-3 py-1.5 text-sm text-[var(--color-error)] disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    );
  };

  const renderMessage = (m: AdminMessage) => {
    const key = `m${m.id}`;
    return (
      <li key={m.id} className="card p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-ink">{m.name}</span>
              <StatusPill status={m.status} />
            </div>
            <div className="break-words text-xs text-muted">
              {[m.email, m.phone].filter(Boolean).join("  ·  ")}
            </div>
            <p className="mt-2 text-sm leading-relaxed text-ink/85">{m.message}</p>
          </div>
          <div className="flex shrink-0 flex-col gap-2">
            {m.status === "new" ? (
              <button
                disabled={busy === key}
                onClick={() => act(() => adminApi.setMessageStatus(m.id, "handled"), key)}
                className="btn btn-primary px-3 py-1.5 text-sm disabled:opacity-60"
              >
                Mark handled
              </button>
            ) : (
              <button
                disabled={busy === key}
                onClick={() => act(() => adminApi.setMessageStatus(m.id, "new"), key)}
                className="btn btn-secondary px-3 py-1.5 text-sm disabled:opacity-60"
              >
                Reopen
              </button>
            )}
            <button
              disabled={busy === key}
              onClick={() => {
                if (window.confirm("Delete this message permanently?")) {
                  act(() => adminApi.deleteMessage(m.id), key);
                }
              }}
              className="btn btn-ghost px-3 py-1.5 text-sm text-[var(--color-error)] disabled:opacity-60"
            >
              Delete
            </button>
          </div>
        </div>
      </li>
    );
  };

  const newQuotes = quotes?.filter((q) => q.status === "new") ?? [];
  const handledQuotes = quotes?.filter((q) => q.status !== "new") ?? [];
  const newMsgs = messages?.filter((m) => m.status === "new") ?? [];
  const handledMsgs = messages?.filter((m) => m.status !== "new") ?? [];

  return (
    <div className="space-y-10">
      {err && <p className="text-sm text-[var(--color-error)]">{err}</p>}

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">
            Quote requests {quotes ? `(${quotes.length})` : ""}
          </h3>
          {newQuotes.length > 0 && <span className="tag">{newQuotes.length} new</span>}
        </div>

        {quotes === null ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <>
            <Group title="New — needs attention" count={newQuotes.length} empty="All caught up. Nothing new.">
              {newQuotes.map(renderQuote)}
            </Group>
            <Group
              title="Handled — history"
              count={handledQuotes.length}
              empty="Handled requests are kept here as a permanent record."
            >
              {handledQuotes.map(renderQuote)}
            </Group>
          </>
        )}
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-ink">
            Messages {messages ? `(${messages.length})` : ""}
          </h3>
          {newMsgs.length > 0 && <span className="tag">{newMsgs.length} new</span>}
        </div>

        {messages === null ? (
          <p className="text-sm text-muted">Loading...</p>
        ) : (
          <>
            <Group title="New — needs attention" count={newMsgs.length} empty="All caught up. Nothing new.">
              {newMsgs.map(renderMessage)}
            </Group>
            <Group
              title="Handled — history"
              count={handledMsgs.length}
              empty="Handled messages are kept here as a permanent record."
            >
              {handledMsgs.map(renderMessage)}
            </Group>
          </>
        )}
      </section>
    </div>
  );
}
