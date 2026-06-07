import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { ClaimData } from "../types/models";
import { api } from "../services/api";

export const statusMap = {
  pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
  "doc-requested": { label: "Doc Requested", color: "#854F0B", bg: "#FAEEDA" },
  "under-review": { label: "Under Review", color: "#1456A0", bg: "#EBF3FC" },
  approved: { label: "Approved", color: "#3B6D11", bg: "#EAF3DE" },
  settled: { label: "Settled", color: "#3B6D11", bg: "#EAF3DE" },
  rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

type ClaimContextType = {
  claims: ClaimData[];
  loading: boolean;
  getClaimsByMember: (memberId: string) => ClaimData[];
  getClaimById: (id: string) => ClaimData | undefined;
  pendingClaimsCount: number;
};

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

export function ClaimProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getClaims().then((data) => {
      setClaims(data);
      setLoading(false);
    });
  }, []);

  const getClaimsByMember = (memberId: string): ClaimData[] => {
    if (memberId === "all") return claims;
    return claims.filter((claim) => claim.memberId === memberId);
  };

  const getClaimById = (id: string): ClaimData | undefined => {
    return claims.find((claim) => claim.id === id);
  };

  const pendingClaimsCount = claims.filter(
    (c) => c.status === "pending" || c.status === "doc-requested" || c.status === "under-review"
  ).length;

  return (
    <ClaimContext.Provider value={{ claims, loading, getClaimsByMember, getClaimById, pendingClaimsCount }}>
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaim() {
  const context = useContext(ClaimContext);
  if (context === undefined) throw new Error("useClaim must be used within a ClaimProvider");
  return context;
}
