import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type {
  PolicyData,
  ClaimData,
  EndorsementData,
  RequirementData,
  InsuranceEntity,
} from "../types/models";
import { api } from "../services/api";

export const claimStatusMap = {
  pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
  "doc-requested": { label: "Doc Requested", color: "#854F0B", bg: "#FAEEDA" },
  "under-review": { label: "Under Review", color: "#1456A0", bg: "#EBF3FC" },
  approved: { label: "Approved", color: "#3B6D11", bg: "#EAF3DE" },
  settled: { label: "Settled", color: "#3B6D11", bg: "#EAF3DE" },
  rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

export const endorsementStatusMap = {
  pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
  "in-progress": { label: "In Progress", color: "#1456A0", bg: "#EBF3FC" },
  completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
  rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

export const requirementStatusMap = {
  processing: { label: "Processing", color: "#854F0B", bg: "#FAEEDA" },
  "quote-shared": { label: "Quote Shared", color: "#1456A0", bg: "#EBF3FC" },
  "policy-issued": { label: "Policy Issued", color: "#3B6D11", bg: "#EAF3DE" },
};

type InsuranceContextType = {
  entities: InsuranceEntity[];
  loading: boolean;

  policies: PolicyData[];
  claims: ClaimData[];
  endorsements: EndorsementData[];
  requirements: RequirementData[];

  getPoliciesByMember: (memberId: string) => PolicyData[];
  getClaimsByMember: (memberId: string) => ClaimData[];
  getEndorsementsByMember: (memberId: string) => EndorsementData[];

  getClaimablePolicies: (memberId: string) => PolicyData[];
  getPolicyById: (id: string) => PolicyData | undefined;
  getClaimById: (id: string) => ClaimData | undefined;
  getEndorsementById: (id: string) => EndorsementData | undefined;

  getClaimsByPolicyId: (policyId: string) => ClaimData[];
  getEndorsementsByPolicyId: (policyId: string) => EndorsementData[];

  activePoliciesCount: number;
  expiringPoliciesCount: number;
  pendingClaimsCount: number;
  pendingEndorsementsCount: number;
};

const InsuranceContext = createContext<InsuranceContextType | undefined>(
  undefined,
);

export function InsuranceProvider({ children }: { children: ReactNode }) {
  const [entities, setEntities] = useState<InsuranceEntity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInsuranceEntities().then((data) => {
      setEntities(data);
      setLoading(false);
    });
  }, []);

  const policies = entities.filter(
    (e): e is PolicyData => e.entityType === "policy",
  );
  const claims = entities.filter(
    (e): e is ClaimData => e.entityType === "claim",
  );
  const endorsements = entities.filter(
    (e): e is EndorsementData => e.entityType === "endorsement",
  );
  const requirements = entities.filter(
    (e): e is RequirementData => e.entityType === "requirement",
  );

  const getPoliciesByMember = (memberId: string): PolicyData[] => {
    if (memberId === "all") return policies;
    return policies.filter((policy) => policy.memberIds.includes(memberId));
  };

  const getClaimsByMember = (memberId: string): ClaimData[] => {
    if (memberId === "all") return claims;
    return claims.filter((claim) => claim.memberId === memberId);
  };

  const getEndorsementsByMember = (memberId: string): EndorsementData[] => {
    if (memberId === "all") return endorsements;
    return endorsements.filter(
      (endorsement) => endorsement.memberId === memberId,
    );
  };

  const getClaimablePolicies = (memberId: string): PolicyData[] => {
    const memberPolicies = getPoliciesByMember(memberId);
    return memberPolicies.filter(
      (policy) => policy.status === "active" || policy.status === "due",
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

  const getClaimsByPolicyId = (policyId: string): ClaimData[] => {
    return claims.filter((claim) => claim.policyId === policyId);
  };

  const getEndorsementsByPolicyId = (policyId: string): EndorsementData[] => {
    return endorsements.filter(
      (endorsement) => endorsement.policyId === policyId,
    );
  };

  const activePoliciesCount = policies.filter(
    (p) => p.status === "active" || p.status === "due",
  ).length;
  const expiringPoliciesCount = policies.filter(
    (p) => p.status === "due",
  ).length;
  const pendingClaimsCount = claims.filter(
    (c) =>
      c.status === "pending" ||
      c.status === "doc-requested" ||
      c.status === "under-review",
  ).length;
  const pendingEndorsementsCount = endorsements.filter(
    (e) => e.status === "pending" || e.status === "in-progress",
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
        getPoliciesByMember,
        getClaimsByMember,
        getEndorsementsByMember,
        getClaimablePolicies,
        getPolicyById,
        getClaimById,
        getEndorsementById,
        getClaimsByPolicyId,
        getEndorsementsByPolicyId,
        activePoliciesCount,
        expiringPoliciesCount,
        pendingClaimsCount,
        pendingEndorsementsCount,
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
  };
}

export function useRequirement() {
  const context = useInsurance();
  return {
    requirements: context.requirements,
    loading: context.loading,
  };
}
