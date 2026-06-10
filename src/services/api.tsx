import { Heart, Car, Shield, Home, Plane, FileText } from "lucide-react";
import type {
  Member,
  PolicyData,
  ClaimData,
  EndorsementData,
  RequirementData,
  TicketData,
  InsuranceEntity,
} from "../types/models";

const membersList: Member[] = [
  { id: "all", name: "All Members" },
  {
    id: "rajesh",
    name: "Rajesh Sharma",
    profile: {
      mobile: "+91 98765 43210",
      email: "rajesh.sharma@gmail.com",
      dob: "12 Jun 1978 (46 years)",
      pan: "ABCRS1234F",
      aadhaar: "XXXX XXXX 3456",
      address: "Flat 4B, Sunrise Apts, Baner Road, Pune — 411045",
      relationship: "Family Head",
      initials: "RS",
      clientId: "CLI-2020-00891",
      since: "Jan 2020",
      kyc: [
        { label: "PAN Card", status: "verified" },
        { label: "Aadhaar Card", status: "verified" },
        { label: "Address Proof", status: "pending" },
        { label: "Photograph", status: "verified" },
        { label: "Bank Account", status: "not-added" },
        { label: "Video KYC", status: "not-added" },
      ],
    },
  },
  {
    id: "priya",
    name: "Priya Sharma",
    profile: {
      mobile: "+91 98765 43211",
      email: "priya.sharma@gmail.com",
      dob: "24 Sep 1980 (44 years)",
      pan: "BKCPS5678G",
      aadhaar: "XXXX XXXX 7890",
      address: "Flat 4B, Sunrise Apts, Baner Road, Pune — 411045",
      relationship: "Spouse",
      initials: "PS",
      clientId: "CLI-2020-00892",
      since: "Jan 2020",
      kyc: [
        { label: "PAN Card", status: "verified" },
        { label: "Aadhaar Card", status: "verified" },
        { label: "Address Proof", status: "verified" },
        { label: "Photograph", status: "verified" },
        { label: "Bank Account", status: "not-added" },
        { label: "Video KYC", status: "not-added" },
      ],
    },
  },
  {
    id: "aarav",
    name: "Aarav Sharma",
    profile: {
      mobile: "—",
      email: "—",
      dob: "05 Mar 2015 (10 years)",
      pan: "—",
      aadhaar: "XXXX XXXX 1234",
      address: "Flat 4B, Sunrise Apts, Baner Road, Pune — 411045",
      relationship: "Son",
      initials: "AS",
      clientId: "CLI-2024-01455",
      since: "May 2024",
      kyc: [
        { label: "Aadhaar Card", status: "verified" },
        { label: "Photograph", status: "pending" },
      ],
    },
  },
];

const policiesList: PolicyData[] = [
  {
    entityType: "policy",
    id: "HLT-2024-0001432",
    name: "Family Health Floater",
    policyNumber: "HLT-2024-0001432",
    insurer: "HDFC ERGO",
    coverage: "₹25L",
    sumInsuredFull: "₹25,00,000",
    memberIds: ["rajesh", "priya", "aarav"],
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
    entityType: "policy",
    id: "MTR-2024-0887654",
    name: "Car Insurance — Maruti Swift",
    policyNumber: "MTR-2024-0887654",
    insurer: "Bajaj Allianz",
    coverage: "IDV: ₹8.5L",
    sumInsuredFull: "₹8,50,000",
    memberIds: ["rajesh"],
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
    entityType: "policy",
    id: "LIF-2023-0045231",
    name: "Term Life Insurance",
    policyNumber: "LIF-2023-0045231",
    insurer: "LIC of India",
    coverage: "SA: ₹1Cr",
    sumInsuredFull: "₹1,00,00,000",
    memberIds: ["rajesh"],
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
    entityType: "policy",
    id: "EXT-STR-001",
    name: "Individual Health (Uploaded)",
    policyNumber: "Star Health — Individual",
    insurer: "Star Health",
    coverage: "₹10L",
    sumInsuredFull: "₹10,00,000",
    memberIds: ["priya"],
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
    entityType: "policy",
    id: "HOM-2024-0012344",
    name: "Home Structure Insurance",
    policyNumber: "HOM-2024-0012344",
    insurer: "New India Assurance",
    coverage: "₹80L",
    sumInsuredFull: "₹80,00,000",
    memberIds: ["rajesh"],
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
    entityType: "policy",
    id: "TRV-2025-0004521",
    name: "Travel Insurance — Europe",
    policyNumber: "TRV-2025-0004521",
    insurer: "Tata AIG",
    coverage: "₹50L",
    sumInsuredFull: "₹50,00,000",
    memberIds: ["rajesh", "priya"],
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

const claimsList: ClaimData[] = [
  {
    entityType: "claim",
    id: "CL-2025-0124",
    claimNumber: "CL-2025-0124",
    policyName: "Health Floater",
    policyId: "HLT-2024-0001432",
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
    entityType: "claim",
    id: "CL-2025-0098",
    claimNumber: "CL-2025-0098",
    policyName: "Car Insurance",
    policyId: "MTR-2024-0887654",
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
    entityType: "claim",
    id: "CL-2024-0892",
    claimNumber: "CL-2024-0892",
    policyName: "Health Floater",
    policyId: "HLT-2024-0001432",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    claimType: "OPD",
    amount: "₹45,200",
    status: "approved",
    filedDate: "10 Mar 2025",
    insurer: "HDFC ERGO",
  },
  {
    entityType: "claim",
    id: "CL-2024-0771",
    claimNumber: "CL-2024-0771",
    policyName: "Car Insurance",
    policyId: "MTR-2024-0887654",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    claimType: "Third Party",
    amount: "₹15,000",
    status: "settled",
    filedDate: "02 Dec 2024",
    insurer: "Bajaj Allianz",
  },
];

const endorsementsList: EndorsementData[] = [
  {
    entityType: "endorsement",
    id: "END-2025-0041",
    endorsementNumber: "END-2025-0041",
    policyName: "Family Health Floater",
    policyId: "HLT-2024-0001432",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    type: "Add Member",
    description: "Add newborn Aarav Sharma to family floater policy",
    status: "in-progress",
    requestedDate: "02 May 2025",
    insurer: "HDFC ERGO",
  },
  {
    entityType: "endorsement",
    id: "END-2025-0033",
    endorsementNumber: "END-2025-0033",
    policyName: "Car Insurance — Maruti Swift",
    policyId: "MTR-2024-0887654",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    type: "Address Change",
    description: "Update registered address to new residence in Baner, Pune",
    status: "pending",
    requestedDate: "18 Apr 2025",
    insurer: "Bajaj Allianz",
  },
  {
    entityType: "endorsement",
    id: "END-2024-0198",
    endorsementNumber: "END-2024-0198",
    policyName: "Family Health Floater",
    policyId: "HLT-2024-0001432",
    memberName: "Priya Sharma",
    memberId: "priya",
    type: "Name Correction",
    description: "Correct spelling of name from 'Priyaa' to 'Priya'",
    status: "completed",
    requestedDate: "10 Jan 2025",
    completedDate: "15 Jan 2025",
    insurer: "HDFC ERGO",
  },
  {
    entityType: "endorsement",
    id: "END-2024-0156",
    endorsementNumber: "END-2024-0156",
    policyName: "Term Life Insurance",
    policyId: "LIF-2023-0045231",
    memberName: "Rajesh Sharma",
    memberId: "rajesh",
    type: "Sum Insured Upgrade",
    description: "Increase sum assured from ₹1Cr to ₹2Cr",
    status: "rejected",
    requestedDate: "25 Nov 2024",
    insurer: "LIC of India",
  },
];

const requirementsList: RequirementData[] = [
  {
    entityType: "requirement",
    id: "REQ-2025-0041",
    type: "Health Insurance",
    member: "Priya Sharma",
    coverage: "₹10L",
    advisor: "Arjun Mehta",
    status: "quote-shared",
    date: "22 Apr 2025",
    quotesAvailable: 3,
  },
  {
    entityType: "requirement",
    id: "REQ-2024-0187",
    type: "Term Life Insurance",
    member: "Rajesh Sharma",
    coverage: "₹2Cr",
    advisor: "Arjun Mehta",
    status: "policy-issued",
    date: "10 Aug 2024",
    policyId: "LIF-2023-0045231",
  },
];

const ticketsList: TicketData[] = [
  {
    entityType: "ticket",
    id: "TKT-2025-0089",
    ticketNumber: "TKT-2025-0089",
    subject: "Hospital cashless denied",
    policyId: "HLT-2024-0001432",
    policyName: "Health Floater",
    memberId: "rajesh",
    category: "Claim assistance",
    priority: "High",
    status: "open",
    updatedDate: "Today",
  },
  {
    entityType: "ticket",
    id: "TKT-2025-0067",
    ticketNumber: "TKT-2025-0067",
    subject: "Wrong address on policy",
    policyId: "MTR-2024-0887654",
    policyName: "Car Insurance",
    memberId: "rajesh",
    category: "Policy correction",
    priority: "Normal",
    status: "in-progress",
    updatedDate: "Yesterday",
  },
  {
    entityType: "ticket",
    id: "TKT-2024-0892",
    ticketNumber: "TKT-2024-0892",
    subject: "Premium receipt needed",
    policyId: "LIF-2023-0045231",
    policyName: "Term Life",
    memberId: "rajesh",
    category: "Premium receipt / Tax certificate",
    priority: "Normal",
    status: "resolved",
    updatedDate: "12 Dec 2024",
  },
];

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMemberDisplayText = (memberIds: string[]): string => {
  const memberNames = memberIds.map((id) => {
    const member = membersList.find((m) => m.id === id);
    return member ? member.name.split(" ")[0] : id;
  });

  if (memberNames.length === 1) {
    return memberNames[0];
  } else if (memberNames.length === 2) {
    return `${memberNames[0]} + ${memberNames[1]}`;
  } else if (memberNames.length === 3) {
    return "3 members";
  } else {
    return `${memberNames.length} members`;
  }
};

export const getMemberListText = (memberIds: string[]): string => {
  const memberNames = memberIds.map((id) => {
    const member = membersList.find((m) => m.id === id);
    return member ? member.name.split(" ")[0] : id;
  });
  return memberNames.join(", ");
};

export const api = {
  getMembers: async (): Promise<Member[]> => {
    await delay(300);
    return membersList;
  },
  getPolicies: async (): Promise<PolicyData[]> => {
    await delay(400);
    return policiesList;
  },
  getClaims: async (): Promise<ClaimData[]> => {
    await delay(500);
    return claimsList;
  },
  getEndorsements: async (): Promise<EndorsementData[]> => {
    await delay(500);
    return endorsementsList;
  },
  getRequirements: async (): Promise<RequirementData[]> => {
    await delay(300);
    return requirementsList;
  },
  getTickets: async (): Promise<TicketData[]> => {
    await delay(300);
    return ticketsList;
  },
  getInsuranceEntities: async (): Promise<InsuranceEntity[]> => {
    await delay(500);
    return [
      ...policiesList,
      ...claimsList,
      ...endorsementsList,
      ...requirementsList,
      ...ticketsList,
    ];
  },
};
