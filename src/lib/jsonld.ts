/**
 * Serialize a JSON-LD object for safe insertion into a <script> tag via
 * dangerouslySetInnerHTML. JSON.stringify does NOT escape "<", ">", or "&", so a
 * value containing "</script>" would break out of the tag. Escaping them to
 * their \u forms keeps the JSON valid while making a breakout impossible.
 */
export function jsonLdScript(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026");
}
