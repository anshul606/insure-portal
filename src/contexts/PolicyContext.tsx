import { createContext, useContext, type ReactNode } from "react";
import { Heart, Car, Shield, Home, Plane, FileText } from "lucide-react";

export type PolicyData = {
  id: string;
  name: string;
  policyNumber: string;
  insurer: string;
  coverage: string;
  member: string;
  memberId: string;
  renewDate: string;
  renewLabel: string;
  status: "active" | "due" | "upcoming" | "external";
  icon: React.ReactNode;
  iconBg: string;
  borderColor?: string;
  renewDateColor?: string;
  type?: string;
  premium?: string;
  deductible?: string;
  members?: string;
  sumInsuredFull?: string;
};

type PolicyContextType = {
  policies: PolicyData[];
  getPoliciesByMember: (memberId: string) => PolicyData[];
  getClaimablePolicies: (memberId: string) => PolicyData[];
  getPolicyById: (id: string) => PolicyData | undefined;
  activePoliciesCount: number;
  expiringPoliciesCount: number;
};

const policiesList: PolicyData[] = [
  {
    id: "HLT-2024-0001432",
    name: "Family Health Floater",
    policyNumber: "HLT-2024-0001432",
    insurer: "HDFC ERGO",
    coverage: "₹25L",
    sumInsuredFull: "₹25,00,000",
    member: "3 members",
    memberId: "all",
    members: "Rajesh, Priya, Aarav",
    renewDate: "28 Mar 2026",
    renewLabel: "Renews:",
    status: "active",
    icon: <Heart size={19} />,
    iconBg: "#EAF3DE",
    type: "Health Insurance",
    premium: "₹42,500 / year",
    deductible: "₹3,000 / claim",
  },
  {
    id: "MTR-2024-0887654",
    name: "Car Insurance — Maruti Swift",
    policyNumber: "MTR-2024-0887654",
    insurer: "Bajaj Allianz",
    coverage: "IDV: ₹8.5L",
    sumInsuredFull: "₹8,50,000",
    member: "Rajesh",
    memberId: "rajesh",
    renewDate: "11 May 2025",
    renewLabel: "Expires:",
    renewDateColor: "#854F0B",
    status: "due",
    icon: <Car size={19} />,
    iconBg: "#FAEEDA",
    borderColor: "#FAC775",
    type: "Motor Insurance",
    premium: "₹18,500 / year",
    deductible: "₹2,000 / claim",
  },
  {
    id: "LIF-2023-0045231",
    name: "Term Life Insurance",
    policyNumber: "LIF-2023-0045231",
    insurer: "LIC of India",
    coverage: "SA: ₹1Cr",
    sumInsuredFull: "₹1,00,00,000",
    member: "Rajesh",
    memberId: "rajesh",
    renewDate: "01 Jan 2026",
    renewLabel: "Renews:",
    status: "active",
    icon: <Shield size={19} />,
    iconBg: "#EBF3FC",
    type: "Life Insurance",
    premium: "₹48,000 / year",
    deductible: "N/A",
  },
  {
    id: "EXT-STR-001",
    name: "Individual Health (Uploaded)",
    policyNumber: "Star Health — Individual",
    insurer: "Star Health",
    coverage: "₹10L",
    sumInsuredFull: "₹10,00,000",
    member: "Priya",
    memberId: "priya",
    renewDate: "15 Aug 2025",
    renewLabel: "Renews:",
    status: "external",
    icon: <FileText size={19} />,
    iconBg: "#F1EFE8",
    type: "Health Insurance",
    premium: "—",
    deductible: "—",
  },
  {
    id: "HOM-2024-0012344",
    name: "Home Structure Insurance",
    policyNumber: "HOM-2024-0012344",
    insurer: "New India Assurance",
    coverage: "₹80L",
    sumInsuredFull: "₹80,00,000",
    member: "Rajesh",
    memberId: "rajesh",
    renewDate: "30 Sep 2025",
    renewLabel: "Renews:",
    status: "active",
    icon: <Home size={19} />,
    iconBg: "#F9E8FC",
    type: "Home Insurance",
    premium: "₹24,000 / year",
    deductible: "₹5,000 / claim",
  },
  {
    id: "TRV-2025-0004521",
    name: "Travel Insurance — Europe",
    policyNumber: "TRV-2025-0004521",
    insurer: "Tata AIG",
    coverage: "₹50L",
    sumInsuredFull: "₹50,00,000",
    member: "Rajesh + Priya",
    memberId: "all",
    members: "Rajesh, Priya",
    renewDate: "20 May – 04 Jun",
    renewLabel: "Active:",
    status: "upcoming",
    icon: <Plane size={19} />,
    iconBg: "#E8F9FC",
    type: "Travel Insurance",
    premium: "₹8,500",
    deductible: "N/A",
  },
];

const PolicyContext = createContext<PolicyContextType | undefined>(undefined);

export function PolicyProvider({ children }: { children: ReactNode }) {
  const getPoliciesByMember = (memberId: string): PolicyData[] => {
    if (memberId === "all") {
      return policiesList;
    }
    return policiesList.filter(
      (policy) => policy.memberId === memberId || policy.memberId === "all",
    );
  };

  // ← ADD THIS FUNCTION
  const getClaimablePolicies = (memberId: string): PolicyData[] => {
    const memberPolicies = getPoliciesByMember(memberId);
    return memberPolicies.filter(
      (policy) => policy.status === "active" || policy.status === "due",
    );
  };

  const getPolicyById = (id: string): PolicyData | undefined => {
    return policiesList.find((policy) => policy.id === id);
  };

  const activePoliciesCount = policiesList.filter(
    (p) => p.status === "active" || p.status === "due",
  ).length;

  const expiringPoliciesCount = policiesList.filter(
    (p) => p.status === "due",
  ).length;

  return (
    <PolicyContext.Provider
      value={{
        policies: policiesList,
        getPoliciesByMember,
        getClaimablePolicies, // ← ADD THIS
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
  if (context === undefined) {
    throw new Error("usePolicy must be used within a PolicyProvider");
  }
  return context;
}
