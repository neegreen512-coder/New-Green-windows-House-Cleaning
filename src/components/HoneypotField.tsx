/**
 * A honeypot field: hidden from real users but present in the DOM, so naive
 * bots that fill every input will fill it. The server silently drops any
 * submission where it is non-empty. Named "website" because bots target it.
 */
export function HoneypotField({
  value,
  onChange,
}: {
  // Controlled usage (e.g. the quote wizard, which reads state, not FormData).
  value?: string;
  onChange?: (value: string) => void;
}) {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-[-9999px] h-0 w-0 overflow-hidden">
      <label>
        Do not fill this in
        <input
          type="text"
          name="website"
          tabIndex={-1}
          autoComplete="off"
          {...(onChange ? { value: value ?? "", onChange: (e) => onChange(e.target.value) } : {})}
        />
      </label>
    </div>
  );
}
