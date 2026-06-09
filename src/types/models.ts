import type { ReactNode } from "react";

export type KycItem = {
  label: string;
  status: "verified" | "pending" | "not-added";
};

export type MemberProfile = {
  mobile: string;
  email: string;
  dob: string;
  pan: string;
  aadhaar: string;
  address: string;
  relationship: string;
  initials: string;
  clientId: string;
  since: string;
  kyc: KycItem[];
};

export type Member = {
  id: string;
  name: string;
  profile?: MemberProfile;
};

export type PolicyMember = {
  policyId: string;
  memberId: string;
};

export type PolicyData = {
  entityType: "policy";
  id: string;
  name: string;
  policyNumber: string;
  insurer: string;
  coverage: string;
  memberIds: string[];
  renewDate: string;
  renewLabel: string;
  status: "active" | "due" | "upcoming" | "external";
  icon: ReactNode;
  iconBg: string;
  borderColor?: string;
  renewDateColor?: string;
  type?: string;
  premium?: string;
  deductible?: string;
  sumInsuredFull?: string;
};

export type ClaimData = {
  entityType: "claim";
  id: string;
  claimNumber: string;
  policyName: string;
  policyId: string;
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

export type EndorsementData = {
  entityType: "endorsement";
  id: string;
  endorsementNumber: string;
  policyName: string;
  policyId: string;
  memberName: string;
  memberId: string;
  type: string;
  description: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  requestedDate: string;
  completedDate?: string;
  insurer: string;
};

export type RequirementData = {
  entityType: "requirement";
  id: string;
  type: string;
  member: string;
  coverage: string;
  advisor: string;
  status: "quote-shared" | "processing" | "policy-issued";
  date: string;
  quotesAvailable?: number;
  policyId?: string;
};

export type InsuranceEntity =
  | PolicyData
  | ClaimData
  | EndorsementData
  | RequirementData;
