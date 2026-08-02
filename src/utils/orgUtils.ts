const STORAGE_KEY = "portal_org_code";
const DEFAULT_ORG_CODE = import.meta.env.VITE_DEFAULT_ORG_CODE || "marsh";

const RESERVED_SUBDOMAINS = new Set([
  "localhost",
  "127",
  "www",
  "app",
  "portal",
  "customer",
  "customer-portal",
  "insure-portal",
  "preview",
  "vercel",
  "leadcrm",
  "api",
  "dev",
  "staging",
  "test",
  "demo",
  "admin",
  "dashboard",
]);

export function getOrgCodeFromLocation(): string {
  if (typeof window !== "undefined" && window.location.search) {
    const rawSearch = window.location.search.trim();
    const searchParams = new URLSearchParams(rawSearch);
    const paramOrg =
      searchParams.get("orgcode") ||
      searchParams.get("orgCode") ||
      searchParams.get("org") ||
      searchParams.get("");

    if (paramOrg && paramOrg.trim().length > 0) {
      const cleanOrg = paramOrg.trim().toLowerCase();
      setStoredOrgCode(cleanOrg);
      return cleanOrg;
    }

    const firstKey = Array.from(searchParams.keys())[0];
    if (
      firstKey &&
      firstKey.trim().length > 0 &&
      !firstKey.includes("/") &&
      !firstKey.includes("=")
    ) {
      const cleanOrg = firstKey.trim().toLowerCase();
      setStoredOrgCode(cleanOrg);
      return cleanOrg;
    }

    const stripped = rawSearch
      .replace(/^\?=?/, "")
      .split("&")[0]
      .split("=")[0]
      .trim()
      .toLowerCase();
    if (stripped && !stripped.includes("/") && stripped.length > 0) {
      setStoredOrgCode(stripped);
      return stripped;
    }
  }

  if (typeof window !== "undefined" && window.location.hostname) {
    const parts = window.location.hostname.split(".");
    if (parts.length >= 3) {
      const sub = parts[0].toLowerCase();
      if (!RESERVED_SUBDOMAINS.has(sub) && !/^\d+$/.test(sub)) {
        setStoredOrgCode(sub);
        return sub;
      }
    } else if (parts.length === 2) {
      const sub = parts[0].toLowerCase();
      const tld = parts[1].toLowerCase();
      const commonTlds = new Set([
        "com",
        "in",
        "org",
        "net",
        "co",
        "io",
        "dev",
        "app",
      ]);
      if (
        !RESERVED_SUBDOMAINS.has(sub) &&
        !commonTlds.has(tld) &&
        !/^\d+$/.test(sub)
      ) {
        setStoredOrgCode(sub);
        return sub;
      }
    }
  }

  if (typeof localStorage !== "undefined") {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && saved.trim().length > 0) {
      return saved.trim().toLowerCase();
    }
  }

  return DEFAULT_ORG_CODE;
}

export function setStoredOrgCode(orgCode: string): void {
  if (typeof localStorage !== "undefined" && orgCode) {
    localStorage.setItem(STORAGE_KEY, orgCode.trim().toLowerCase());
  }
}
