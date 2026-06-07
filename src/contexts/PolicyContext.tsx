import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { PolicyData } from "../types/models";
import { api } from "../services/api";

type PolicyContextType = {
  policies: PolicyData[];
  loading: boolean;
  getPoliciesByMember: (memberId: string) => PolicyData[];
  getClaimablePolicies: (memberId: string) => PolicyData[];
  getPolicyById: (id: string) => PolicyData | undefined;
  activePoliciesCount: number;
  expiringPoliciesCount: number;
};

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: ReactNode }) {
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getPolicies().then((data) => {
      setPolicies(data);
      setLoading(false);
    });
  }, []);

  const getPoliciesByMember = (memberId: string): PolicyData[] => {
    if (memberId === "all") return policies;
    return policies.filter(
      (policy) => policy.memberId === memberId || policy.memberId === "all"
    );
  };

  const getClaimablePolicies = (memberId: string): PolicyData[] => {
    const memberPolicies = getPoliciesByMember(memberId);
    return memberPolicies.filter(
      (policy) => policy.status === "active" || policy.status === "due"
    );
  };

  const getPolicyById = (id: string): PolicyData | undefined => {
    return policies.find((policy) => policy.id === id);
  };

  const activePoliciesCount = policies.filter(
    (p) => p.status === "active" || p.status === "due"
  ).length;

  const expiringPoliciesCount = policies.filter(
    (p) => p.status === "due"
  ).length;

  return (
    <PolicyContext.Provider
      value={{
        policies,
        loading,
        getPoliciesByMember,
        getClaimablePolicies,
        getPolicyById,
        activePoliciesCount,
        expiringPoliciesCount,
      }}
    >
      {children}
    </PolicyContext.Provider>
  );
}

export function usePolicy() {
  const context = useContext(PolicyContext);
  if (context === undefined) throw new Error("usePolicy must be used within a PolicyProvider");
  return context;
}
