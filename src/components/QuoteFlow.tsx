"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowLeft, ArrowRight, Check } from "@phosphor-icons/react/dist/ssr";
import { quoteOptions, business, type QuotePayload } from "@/lib/site";
import { submitQuote } from "@/lib/cms";

const STEPS = ["Service", "Your home", "Frequency", "Your details", "Review"] as const;
const EASE = [0.16, 1, 0.3, 1] as const;

const empty: QuotePayload = {
  services: [],
  propertyType: "",
  bedrooms: "",
  bathrooms: "",
  frequency: "",
  name: "",
  email: "",
  phone: "",
  address: "",
  notes: "",
};

type Status = "idle" | "sending" | "done" | "error";

const fieldClass =
  "w-full rounded-lg border border-line-strong bg-bg px-3.5 py-2.5 text-ink outline-none transition-colors focus:border-brand-600";

function Choice({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`rounded-xl border px-4 py-3 text-left text-[0.95rem] font-medium transition-colors ${
        selected
          ? "border-brand-700 bg-brand-50 text-brand-800"
          : "border-line-strong bg-surface text-ink hover:border-brand-400"
      }`}
    >
      {children}
    </button>
  );
}

export function QuoteFlow() {
  const reduce = useReducedMotion();
  const [step, setStep] = useState(0);
  const [data, setData] = useState<QuotePayload>(empty);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  const set = (patch: Partial<QuotePayload>) => setData((d) => ({ ...d, ...patch }));

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email.trim());
  const phoneOk = data.phone.replace(/\D/g, "").length >= 7;

  const valid: boolean[] = [
    data.services.length > 0,
    Boolean(data.propertyType && data.bedrooms && data.bathrooms),
    Boolean(data.frequency),
    data.name.trim().length >= 2 && emailOk && phoneOk && data.address.trim().length >= 4,
    true,
  ];

  const last = step === STEPS.length - 1;

  async function submit() {
    setStatus("sending");
    setError("");
    try {
      await submitQuote(data);
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="card p-8 text-center sm:p-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brand-50 text-brand-800">
          <Check className="h-7 w-7" weight="bold" />
        </div>
        <h2 className="h3 mt-5">Your request is in</h2>
        <p className="lead mt-3">
          Thanks, {data.name.trim().split(" ")[0] || "there"}. We will review your details and reply
          with clear, no-pressure pricing. For anything urgent, call us any time.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
          <Link href="/" className="btn btn-secondary">
            Back to home
          </Link>
          <a href={business.phoneHref} className="btn btn-primary">
            Call {business.phone}
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-6 sm:p-8">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <span className="label-mono">
          Step {String(step + 1).padStart(2, "0")} / {String(STEPS.length).padStart(2, "0")}
        </span>
        <span className="label-mono text-brand-700">{STEPS[step]}</span>
      </div>
      <div className="mt-3 h-[3px] w-full overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand-600 transition-[width] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
        />
      </div>

      {/* Step body */}
      <motion.div
        key={step}
        initial={reduce ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: EASE }}
        className="mt-8 min-h-[16rem]"
      >
        {step === 0 && (
          <fieldset>
            <legend className="text-lg font-semibold text-ink">What can we clean for you?</legend>
            <p className="mt-1 text-sm text-muted">Choose the service you are interested in.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              {quoteOptions.services.map((s) => (
                <Choice
                  key={s}
                  selected={data.services[0] === s}
                  onClick={() => set({ services: [s] })}
                >
                  {s}
                </Choice>
              ))}
            </div>
          </fieldset>
        )}

        {step === 1 && (
          <fieldset>
            <legend className="text-lg font-semibold text-ink">Tell us about your home</legend>
            <p className="mt-1 text-sm text-muted">This helps us estimate time and pricing.</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {quoteOptions.propertyTypes.map((t) => (
                <Choice
                  key={t}
                  selected={data.propertyType === t}
                  onClick={() => set({ propertyType: t })}
                >
                  {t}
                </Choice>
              ))}
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Bedrooms</span>
                <select
                  className={fieldClass}
                  value={data.bedrooms}
                  onChange={(e) => set({ bedrooms: e.target.value })}
                >
                  <option value="">Select</option>
                  {quoteOptions.bedrooms.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Bathrooms</span>
                <select
                  className={fieldClass}
                  value={data.bathrooms}
                  onChange={(e) => set({ bathrooms: e.target.value })}
                >
                  <option value="">Select</option>
                  {quoteOptions.bathrooms.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </fieldset>
        )}

        {step === 2 && (
          <fieldset>
            <legend className="text-lg font-semibold text-ink">How often?</legend>
            <p className="mt-1 text-sm text-muted">
              One-time or on a recurring plan, whatever suits you.
            </p>
            <div className="mt-5 grid gap-3 sm:grid-cols-4">
              {quoteOptions.frequency.map((f) => (
                <Choice key={f} selected={data.frequency === f} onClick={() => set({ frequency: f })}>
                  {f}
                </Choice>
              ))}
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <fieldset>
            <legend className="text-lg font-semibold text-ink">Your details</legend>
            <p className="mt-1 text-sm text-muted">So we can send your quote and confirm a time.</p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Full name</span>
                <input
                  className={fieldClass}
                  value={data.name}
                  onChange={(e) => set({ name: e.target.value })}
                  autoComplete="name"
                  placeholder="Your name"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Email</span>
                <input
                  className={fieldClass}
                  type="email"
                  value={data.email}
                  onChange={(e) => set({ email: e.target.value })}
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Phone</span>
                <input
                  className={fieldClass}
                  type="tel"
                  value={data.phone}
                  onChange={(e) => set({ phone: e.target.value })}
                  autoComplete="tel"
                  placeholder="(437) 000 0000"
                />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-ink">Address</span>
                <input
                  className={fieldClass}
                  value={data.address}
                  onChange={(e) => set({ address: e.target.value })}
                  autoComplete="street-address"
                  placeholder="Street, city"
                />
              </label>
            </div>
          </fieldset>
        )}

        {step === 4 && (
          <div>
            <h3 className="text-lg font-semibold text-ink">Anything else we should know?</h3>
            <p className="mt-1 text-sm text-muted">
              Optional. Access notes, pets, priorities, or specific requests.
            </p>
            <textarea
              className={`${fieldClass} mt-4 resize-y`}
              rows={3}
              value={data.notes}
              onChange={(e) => set({ notes: e.target.value })}
              placeholder="Add any details..."
            />
            <dl className="mt-6 grid gap-x-6 gap-y-2 rounded-xl border border-line bg-surface-muted p-5 text-sm sm:grid-cols-2">
              <Summary label="Service" value={data.services.join(", ")} />
              <Summary label="Property" value={data.propertyType} />
              <Summary label="Bedrooms" value={data.bedrooms} />
              <Summary label="Bathrooms" value={data.bathrooms} />
              <Summary label="Frequency" value={data.frequency} />
              <Summary label="Name" value={data.name} />
              <Summary label="Email" value={data.email} />
              <Summary label="Phone" value={data.phone} />
              <Summary label="Address" value={data.address} />
            </dl>
          </div>
        )}
      </motion.div>

      {status === "error" && <p className="mt-4 text-sm text-[var(--color-error)]">{error}</p>}

      {/* Controls */}
      <div className="mt-8 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          className={`btn btn-ghost ${step === 0 ? "invisible" : ""}`}
        >
          <ArrowLeft className="h-4 w-4" weight="bold" />
          Back
        </button>

        {last ? (
          <button
            type="button"
            onClick={submit}
            disabled={status === "sending"}
            className="btn btn-primary disabled:opacity-60"
          >
            {status === "sending" ? "Sending..." : "Submit request"}
          </button>
        ) : (
          <button
            type="button"
            onClick={() => valid[step] && setStep((s) => s + 1)}
            disabled={!valid[step]}
            className="btn btn-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue
            <ArrowRight className="h-4 w-4" weight="bold" />
          </button>
        )}
      </div>
    </div>
  );
}

function Summary({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/70 pb-2">
      <dt className="text-muted">{label}</dt>
      <dd className="text-right font-medium text-ink">{value || "Not set"}</dd>
    </div>
  );
}
