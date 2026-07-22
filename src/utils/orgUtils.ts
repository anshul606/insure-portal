const STORAGE_KEY = "portal_org_code";
const DEFAULT_ORG_CODE = "marsh";

const RESERVED_SUBDOMAINS = new Set([
  "localhost",
  "127",
  "www",
  "app",
  "portal",
  "customer-portal",
  "insure-portal",
  "preview",
  "vercel",
  "leadcrm",
  "api",
]);

export function getOrgCodeFromLocation(): string {
  if (typeof window !== "undefined") {
    const searchParams = new URLSearchParams(window.location.search);
    const paramOrg =
      searchParams.get("orgcode") ||
      searchParams.get("orgCode") ||
      searchParams.get("org");
    if (paramOrg && paramOrg.trim().length > 0) {
      const cleanOrg = paramOrg.trim().toLowerCase();
      setStoredOrgCode(cleanOrg);
      return cleanOrg;
    }
  }

  if (typeof window !== "undefined" && window.location.hostname) {
    const parts = window.location.hostname.split(".");
    if (parts.length >= 2) {
      const sub = parts[0].toLowerCase();
      if (!RESERVED_SUBDOMAINS.has(sub) && !/^\d+$/.test(sub)) {
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
