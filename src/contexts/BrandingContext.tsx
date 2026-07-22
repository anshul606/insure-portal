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
          if (squareUrl) {
            updateFavicon(getAssetUrl(squareUrl));
          } else {
            updateFavicon("/favicon.svg");
          }
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
