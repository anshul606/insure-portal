import { createContext, useContext, type ReactNode } from "react";

export type ClaimData = {
  id: string;
  claimNumber: string;
  policyName: string;
  policyNumber: string;
  memberName: string;
  memberId: string;
  claimType: string;
  amount: string;
  status:
    | "pending"
    | "doc-requested"
    | "under-review"
    | "approved"
    | "settled"
    | "rejected";
  filedDate: string;
  insurer: string;
  hospital?: string;
};

type ClaimContextType = {
  claims: ClaimData[];
  getClaimsByMember: (memberId: string) => ClaimData[];
  getClaimById: (id: string) => ClaimData | undefined;
  pendingClaimsCount: number;
};

const statusMap = {
  pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
  "doc-requested": { label: "Doc Requested", color: "#854F0B", bg: "#FAEEDA" },
  "under-review": { label: "Under Review", color: "#1456A0", bg: "#EBF3FC" },
  approved: { label: "Approved", color: "#3B6D11", bg: "#EAF3DE" },
  settled: { label: "Settled", color: "#3B6D11", bg: "#EAF3DE" },
  rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

export { statusMap };

const claimsList: ClaimData[] = [
  {
    id: "CL-2025-0124",
    claimNumber: "CL-2025-0124",
    policyName: "Health Floater",
    policyNumber: "HLT-2024-0001432",
    memberName: "Priya Sharma",
    memberId: "priya",
    claimType: "Hospitalisation",
    amount: "₹1,20,000",
    status: "doc-requested",
    filedDate: "28 Apr 2025",
    insurer: "HDFC ERGO",
    hospital: "Apollo Hospital, Pune",
  },
  {
    id: "CL-2025-0098",
    claimNumber: "CL-2025-0098",
    policyName: "Car Insurance",
    policyNumber: "MTR-2024-0887654",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    claimType: "Own Damage",
    amount: "₹28,500",
    status: "under-review",
    filedDate: "15 Apr 2025",
    insurer: "Bajaj Allianz",
    hospital: "Authorised Garage, Pune",
  },
  {
    id: "CL-2024-0892",
    claimNumber: "CL-2024-0892",
    policyName: "Health Floater",
    policyNumber: "HLT-2024-0001432",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    claimType: "OPD",
    amount: "₹45,200",
    status: "approved",
    filedDate: "10 Mar 2025",
    insurer: "HDFC ERGO",
  },
  {
    id: "CL-2024-0771",
    claimNumber: "CL-2024-0771",
    policyName: "Car Insurance",
    policyNumber: "MTR-2024-0887654",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    claimType: "Third Party",
    amount: "₹15,000",
    status: "settled",
    filedDate: "02 Dec 2024",
    insurer: "Bajaj Allianz",
  },
];

const ClaimContext = createContext<ClaimContextType | undefined>(undefined);

export function ClaimProvider({ children }: { children: ReactNode }) {
  const getClaimsByMember = (memberId: string): ClaimData[] => {
    if (memberId === "all") {
      return claimsList;
    }
    return claimsList.filter((claim) => claim.memberId === memberId);
  };

  const getClaimById = (id: string): ClaimData | undefined => {
    return claimsList.find((claim) => claim.id === id);
  };

  const pendingClaimsCount = claimsList.filter(
    (c) =>
      c.status === "pending" ||
      c.status === "doc-requested" ||
      c.status === "under-review",
  ).length;

  return (
    <ClaimContext.Provider
      value={{
        claims: claimsList,
        getClaimsByMember,
        getClaimById,
        pendingClaimsCount,
      }}
    >
      {children}
    </ClaimContext.Provider>
  );
}

export function useClaim() {
  const context = useContext(ClaimContext);
  if (context === undefined) {
    throw new Error("useClaim must be used within a ClaimProvider");
  }
  return context;
}
