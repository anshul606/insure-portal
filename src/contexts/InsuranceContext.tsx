import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type {
  PolicyData,
  ClaimData,
  EndorsementData,
  RequirementData,
  TicketData,
  VehicleData,
  AlertData,
  InsuranceEntity,
} from "../types/models";
import { api } from "../services/api";
import { hasValidToken } from "../services/apiClient";
import { useMember } from "./MemberContext";

export const claimStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  "doc-requested": { label: "Doc Requested", color: "#854F0B", bg: "#FAEEDA" },
  "under-review": { label: "Under Review", color: "#1456A0", bg: "#EBF3FC" },
  approved: { label: "Approved", color: "#3B6D11", bg: "#EAF3DE" },
  settled: { label: "Settled", color: "#3B6D11", bg: "#EAF3DE" },
};

export const endorsementStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
  "in-progress": { label: "In Progress", color: "#1456A0", bg: "#EBF3FC" },
  completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
  rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

export const requirementStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: "New", color: "#854F0B", bg: "#FAEEDA" },
  "quote-shared": { label: "Quote Shared", color: "#1456A0", bg: "#EBF3FC" },
  "policy-issued": { label: "Policy Issued", color: "#3B6D11", bg: "#EAF3DE" },
};

export const ticketStatusMap: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: "Open", color: "#854F0B", bg: "#FAEEDA" },
  "in-progress": { label: "In Progress", color: "#1456A0", bg: "#EBF3FC" },
  resolved: { label: "Resolved", color: "#3B6D11", bg: "#EAF3DE" },
};

type InsuranceContextType = {
  entities: InsuranceEntity[];
  loading: boolean;

  policies: PolicyData[];
  claims: ClaimData[];
  endorsements: EndorsementData[];
  requirements: RequirementData[];
  tickets: TicketData[];
  vehicles: VehicleData[];
  alerts: AlertData[];

  getPoliciesByMember: (memberId: string) => PolicyData[];
  getClaimsByMember: (memberId: string) => ClaimData[];
  getEndorsementsByMember: (memberId: string) => EndorsementData[];
  getRequirementsByMember: (memberId: string) => RequirementData[];
  getTicketsByMember: (memberId: string) => TicketData[];
  getVehiclesByMember: (memberId: string) => VehicleData[];

  getClaimablePolicies: (memberId: string) => PolicyData[];
  getPolicyById: (id: string) => PolicyData | undefined;
  getClaimById: (id: string) => ClaimData | undefined;
  getEndorsementById: (id: string) => EndorsementData | undefined;
  getTicketById: (id: string) => TicketData | undefined;

  getClaimsByPolicyId: (policyId: string) => ClaimData[];
  getEndorsementsByPolicyId: (policyId: string) => EndorsementData[];
  getTicketsByPolicyId: (policyId: string) => TicketData[];

  activePoliciesCount: number;
  expiringPoliciesCount: number;
  pendingClaimsCount: number;
  pendingEndorsementsCount: number;
  pendingTicketsCount: number;

  refreshPolicies: () => Promise<void>;
  refreshClaims: () => Promise<void>;
  refreshEndorsements: () => Promise<void>;
  refreshRequirements: () => Promise<void>;
  refreshTickets: () => Promise<void>;
  refreshVehicles: () => Promise<void>;
  refreshAlerts: () => Promise<void>;
  refreshAll: () => Promise<void>;

  markAlertReadOptimistic: (id: string) => Promise<void>;
  markAllAlertsReadOptimistic: () => Promise<void>;
  selectQuoteOptimistic: (reqId: string, quoteId: string) => Promise<void>;
  error: string | null;
};

const InsuranceContext = createContext<InsuranceContextType | undefined>(
  undefined
);

export function InsuranceProvider({ children }: { children: ReactNode }) {
  const { selectedMemberId } = useMember();
  const [policies, setPolicies] = useState<PolicyData[]>([]);
  const [claims, setClaims] = useState<ClaimData[]>([]);
  const [endorsements, setEndorsements] = useState<EndorsementData[]>([]);
  const [requirements, setRequirements] = useState<RequirementData[]>([]);
  const [tickets, setTickets] = useState<TicketData[]>([]);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshPolicies = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const params = selectedMemberId === "all" ? {} : { memberIds: selectedMemberId };
      const data = await api.getPolicies(params);
      setPolicies(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load policies:", err);
      }
      throw err;
    }
  }, [selectedMemberId]);

  const refreshClaims = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const params = selectedMemberId === "all" ? {} : { memberId: selectedMemberId };
      const data = await api.getClaims(params);
      setClaims(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load claims:", err);
      }
      throw err;
    }
  }, [selectedMemberId]);

  const refreshEndorsements = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const params = selectedMemberId === "all" ? {} : { memberId: selectedMemberId };
      const data = await api.getEndorsements(params);
      setEndorsements(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load endorsements:", err);
      }
      throw err;
    }
  }, [selectedMemberId]);

  const refreshRequirements = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const params = selectedMemberId === "all" ? {} : { memberId: selectedMemberId };
      const data = await api.getRequirements(params);
      setRequirements(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load requirements:", err);
      }
      throw err;
    }
  }, [selectedMemberId]);

  const refreshTickets = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const data = await api.getTickets();
      setTickets(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load tickets:", err);
      }
      throw err;
    }
  }, []);

  const refreshVehicles = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const params = selectedMemberId === "all" ? {} : { ownerId: selectedMemberId };
      const data = await api.getVehicles(params);
      setVehicles(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load vehicles:", err);
      }
      throw err;
    }
  }, [selectedMemberId]);

  const refreshAlerts = useCallback(async () => {
    if (!hasValidToken()) return;
    try {
      const data = await api.getAlerts();
      setAlerts(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load alerts:", err);
      }
      throw err;
    }
  }, []);

  const refreshAll = useCallback(async () => {
    if (!hasValidToken()) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        refreshPolicies(),
        refreshClaims(),
        refreshEndorsements(),
        refreshRequirements(),
        refreshTickets(),
        refreshVehicles(),
        refreshAlerts(),
      ]);
    } catch (err: any) {
      if (err?.status !== 401) {
        setError("Failed to load latest data. Please check your network connection or try again.");
      }
    } finally {
      setLoading(false);
    }
  }, [refreshPolicies, refreshClaims, refreshEndorsements, refreshRequirements, refreshTickets, refreshVehicles, refreshAlerts]);

  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Optimistic Alerts Reads
  const markAlertReadOptimistic = useCallback(async (id: string) => {
    const originalAlerts = [...alerts];
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, read: true } : a)));
    try {
      await api.markAlertRead(id);
      refreshAlerts();
    } catch (err) {
      setAlerts(originalAlerts);
      console.error("Failed to mark alert read:", err);
    }
  }, [alerts, refreshAlerts]);

  const markAllAlertsReadOptimistic = useCallback(async () => {
    const originalAlerts = [...alerts];
    setAlerts((prev) => prev.map((a) => ({ ...a, read: true })));
    try {
      await api.markAllAlertsRead();
      refreshAlerts();
    } catch (err) {
      setAlerts(originalAlerts);
      console.error("Failed to mark all alerts read:", err);
    }
  }, [alerts, refreshAlerts]);

  // Optimistic Quote Selection
  const selectQuoteOptimistic = useCallback(async (reqId: string, quoteId: string) => {
    const originalReqs = [...requirements];
    setRequirements((prev) =>
      prev.map((r) => {
        if (r.id !== reqId) return r;
        return {
          ...r,
          status: "quote-shared",
          quotes: r.quotes?.map((q) =>
            q.id === quoteId ? { ...q, selected: true } : { ...q, selected: false }
          ),
        };
      })
    );
    try {
      await api.selectQuote(reqId, quoteId);
      refreshRequirements();
    } catch (err) {
      setRequirements(originalReqs);
      console.error("Failed to select quote:", err);
    }
  }, [requirements, refreshRequirements]);

  const entities: InsuranceEntity[] = [
    ...policies,
    ...claims,
    ...endorsements,
    ...requirements,
  ];

  const getPoliciesByMember = (memberId: string): PolicyData[] => {
    if (memberId === "all") return policies;
    return policies.filter((policy) => policy.memberIds?.includes(memberId));
  };

  const getClaimsByMember = (memberId: string): ClaimData[] => {
    if (memberId === "all") return claims;
    return claims.filter((claim) => claim.memberId === memberId);
  };

  const getEndorsementsByMember = (memberId: string): EndorsementData[] => {
    if (memberId === "all") return endorsements;
    return endorsements.filter((e) => e.memberId === memberId);
  };

  const getRequirementsByMember = (memberId: string): RequirementData[] => {
    if (memberId === "all") return requirements;
    return requirements.filter(
      (req) => req.memberId === memberId
    );
  };

  const getTicketsByMember = (memberId: string): TicketData[] => {
    if (memberId === "all") return tickets;
    // memberId is optional on TicketData; include tickets where it's unset for backward compat.
    return tickets.filter((t) => !t.memberId || t.memberId === memberId);
  };

  const getVehiclesByMember = (memberId: string): VehicleData[] => {
    if (memberId === "all") return vehicles;
    return vehicles.filter((v) => v.ownerId === memberId);
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

  const getClaimById = (id: string): ClaimData | undefined => {
    return claims.find((claim) => claim.id === id);
  };

  const getEndorsementById = (id: string): EndorsementData | undefined => {
    return endorsements.find((endorsement) => endorsement.id === id);
  };

  const getTicketById = (id: string): TicketData | undefined => {
    return tickets.find((ticket) => ticket.id === id);
  };

  const getClaimsByPolicyId = (policyId: string): ClaimData[] => {
    return claims.filter((claim) => claim.policyId === policyId);
  };

  const getEndorsementsByPolicyId = (policyId: string): EndorsementData[] => {
    return endorsements.filter(
      (endorsement) => endorsement.policyId === policyId
    );
  };

  const getTicketsByPolicyId = (policyId: string): TicketData[] => {
    return tickets.filter((ticket) => ticket.policyId === policyId);
  };

  const activePoliciesCount = policies.filter(
    (p) => p.status === "active" || p.status === "due"
  ).length;
  const expiringPoliciesCount = policies.filter(
    (p) => p.status === "due"
  ).length;
  const pendingClaimsCount = claims.filter(
    (c) =>
      c.status === "doc-requested" ||
      c.status === "under-review"
  ).length;
  const pendingEndorsementsCount = endorsements.filter(
    (e) => e.status === "pending" || e.status === "in-progress"
  ).length;
  const pendingTicketsCount = tickets.filter(
    (t) => t.status === "open" || t.status === "in-progress"
  ).length;

  return (
    <InsuranceContext.Provider
      value={{
        entities,
        loading,
        policies,
        claims,
        endorsements,
        requirements,
        tickets,
        vehicles,
        alerts,
        getPoliciesByMember,
        getClaimsByMember,
        getEndorsementsByMember,
        getRequirementsByMember,
        getTicketsByMember,
        getVehiclesByMember,
        getClaimablePolicies,
        getPolicyById,
        getClaimById,
        getEndorsementById,
        getTicketById,
        getClaimsByPolicyId,
        getEndorsementsByPolicyId,
        getTicketsByPolicyId,
        activePoliciesCount,
        expiringPoliciesCount,
        pendingClaimsCount,
        pendingEndorsementsCount,
        pendingTicketsCount,
        refreshPolicies,
        refreshClaims,
        refreshEndorsements,
        refreshRequirements,
        refreshTickets,
        refreshVehicles,
        refreshAlerts,
        refreshAll,
        markAlertReadOptimistic,
        markAllAlertsReadOptimistic,
        selectQuoteOptimistic,
        error,
      }}
    >
      {children}
    </InsuranceContext.Provider>
  );
}

export function useInsurance() {
  const context = useContext(InsuranceContext);
  if (context === undefined)
    throw new Error("useInsurance must be used within an InsuranceProvider");
  return context;
}

export function usePolicy() {
  const context = useInsurance();
  return {
    policies: context.policies,
    loading: context.loading,
    getPoliciesByMember: context.getPoliciesByMember,
    getClaimablePolicies: context.getClaimablePolicies,
    getPolicyById: context.getPolicyById,
    activePoliciesCount: context.activePoliciesCount,
    expiringPoliciesCount: context.expiringPoliciesCount,
    refreshPolicies: context.refreshPolicies,
  };
}

export function useClaim() {
  const context = useInsurance();
  return {
    claims: context.claims,
    loading: context.loading,
    getClaimsByMember: context.getClaimsByMember,
    getClaimById: context.getClaimById,
    pendingClaimsCount: context.pendingClaimsCount,
    refreshClaims: context.refreshClaims,
  };
}

export function useEndorsement() {
  const context = useInsurance();
  return {
    endorsements: context.endorsements,
    loading: context.loading,
    getEndorsementsByMember: context.getEndorsementsByMember,
    getEndorsementById: context.getEndorsementById,
    pendingEndorsementsCount: context.pendingEndorsementsCount,
    refreshEndorsements: context.refreshEndorsements,
  };
}

export function useRequirement() {
  const context = useInsurance();
  return {
    requirements: context.requirements,
    loading: context.loading,
    getRequirementsByMember: context.getRequirementsByMember,
    refreshRequirements: context.refreshRequirements,
    selectQuoteOptimistic: context.selectQuoteOptimistic,
  };
}

export function useTicket() {
  const context = useInsurance();
  return {
    tickets: context.tickets,
    loading: context.loading,
    getTicketsByMember: context.getTicketsByMember,
    getTicketById: context.getTicketById,
    getTicketsByPolicyId: context.getTicketsByPolicyId,
    pendingTicketsCount: context.pendingTicketsCount,
    refreshTickets: context.refreshTickets,
  };
}

export function useAlert() {
  const context = useInsurance();
  return {
    alerts: context.alerts,
    loading: context.loading,
    refreshAlerts: context.refreshAlerts,
    markAlertReadOptimistic: context.markAlertReadOptimistic,
    markAllAlertsReadOptimistic: context.markAllAlertsReadOptimistic,
  };
}

export function useVehicle() {
  const context = useInsurance();
  return {
    vehicles: context.vehicles,
    loading: context.loading,
    getVehiclesByMember: context.getVehiclesByMember,
    refreshVehicles: context.refreshVehicles,
  };
}
