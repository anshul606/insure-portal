import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { BrandingData } from "../types/models";
import { api } from "../services/api";
import { getAssetUrl } from "../services/apiClient";
import { getOrgCodeFromLocation, setStoredOrgCode } from "../utils/orgUtils";

interface BrandingContextType {
  orgCode: string;
  setOrgCode: (code: string) => void;
  branding: BrandingData | null;
  loading: boolean;
  getLogoUrl: (path?: string) => string;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

function updateFavicon(iconUrl?: string) {
  let link = document.querySelector<HTMLLinkElement>("link[rel*='icon']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "shortcut icon";
    document.head.appendChild(link);
  }
  if (iconUrl) {
    link.href = iconUrl;
    if (iconUrl.endsWith(".svg")) {
      link.type = "image/svg+xml";
    } else if (iconUrl.endsWith(".png")) {
      link.type = "image/png";
    } else {
      link.type = "image/x-icon";
    }
  } else {
    link.href = "/favicon.svg";
    link.type = "image/svg+xml";
  }
}

function updateDynamicManifest(appName: string, iconUrl?: string) {
  const name = appName || "InsurePortal";
  const manifestObj = {
    name: name,
    short_name: name,
    description: `${name} Client Portal`,
    start_url: "/",
    display: "standalone",
    background_color: "#F7F6F3",
    theme_color: "#1456A0",
    orientation: "portrait",
    icons: iconUrl
      ? [
          {
            src: iconUrl,
            sizes: "192x192 512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ]
      : [
          {
            src: "/icons/icon-192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "/icons/icon-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
  };

  const stringManifest = JSON.stringify(manifestObj);
  const blob = new Blob([stringManifest], { type: "application/json" });
  const manifestUrl = URL.createObjectURL(blob);

  let link = document.querySelector<HTMLLinkElement>("link[rel='manifest']");
  if (!link) {
    link = document.createElement("link");
    link.rel = "manifest";
    document.head.appendChild(link);
  }
  link.href = manifestUrl;

  let appleTitle = document.querySelector<HTMLMetaElement>("meta[name='apple-mobile-web-app-title']");
  if (appleTitle) {
    appleTitle.content = name;
  }
  if (iconUrl) {
    let appleIcon = document.querySelector<HTMLLinkElement>("link[rel='apple-touch-icon']");
    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.rel = "apple-touch-icon";
      document.head.appendChild(appleIcon);
    }
    appleIcon.href = iconUrl;
  }
}

export const BrandingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [orgCode, setOrgCodeState] = useState<string>(() => getOrgCodeFromLocation());
  const [branding, setBranding] = useState<BrandingData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const setOrgCode = useCallback((code: string) => {
    const clean = code.trim().toLowerCase();
    setStoredOrgCode(clean);
    setOrgCodeState(clean);
  }, []);

  useEffect(() => {
    const handleLocationChange = () => {
      const codeFromUrl = getOrgCodeFromLocation();
      if (codeFromUrl && codeFromUrl !== orgCode) {
        setOrgCodeState(codeFromUrl);
      }
    };
    window.addEventListener("popstate", handleLocationChange);
    return () => window.removeEventListener("popstate", handleLocationChange);
  }, [orgCode]);

  useEffect(() => {
    let active = true;
    async function loadBranding() {
      setLoading(true);
      try {
        const data = await api.getBranding(orgCode);
        if (active) {
          setBranding(data);
          if (data.name) {
            document.title = `${data.name} — Customer Portal`;
          }
          const squareUrl = data.squareIconUrl || data.loginLogoUrl;
          const fullIconUrl = squareUrl ? getAssetUrl(squareUrl) : "";
          if (squareUrl) {
            updateFavicon(fullIconUrl);
          } else {
            updateFavicon("/favicon.svg");
          }
          updateDynamicManifest(data.name, fullIconUrl);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (active) setLoading(false);
      }
    }

    loadBranding();
    return () => {
      active = false;
    };
  }, [orgCode]);

  const getLogoUrl = useCallback((path?: string) => {
    if (!path) return "";
    return getAssetUrl(path);
  }, []);

  return (
    <BrandingContext.Provider value={{ orgCode, setOrgCode, branding, loading, getLogoUrl }}>
      {children}
    </BrandingContext.Provider>
  );
};

export function useBranding(): BrandingContextType {
  const context = useContext(BrandingContext);
  if (!context) {
    throw new Error("useBranding must be used within a BrandingProvider");
  }
  return context;
}
