import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Minimal config for a mostly-static marketing site. No R2 incremental cache
// or queue is configured because the site does not use ISR / on-demand
// revalidation; it reads live data from the CMS worker over HTTP at runtime.
export default defineCloudflareConfig({});
