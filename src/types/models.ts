// ─── Shared / Utility ──────────────────────────────────────────

export type KycItem = {
  label: string;
  status: string; // "verified" | "pending" | "not-added"
};

export type MemberProfile = {
  mobile?: string;
  email?: string;
  dobIso?: string;
  dobDisplay?: string;
  pan?: string;
  aadhaar?: string;
  address?: string;
};

export type Member = {
  id: string;
  name: string;
  relationship?: string;
  initials?: string;
  clientId?: string;
  since?: string;
  gender?: string;
  isMinor?: boolean;
  profile?: MemberProfile;
  kyc?: KycItem[];
  // Computed fields returned by the API
  policyCount?: number;
  totalCoverage?: number;
  totalCoverageDisplay?: string;
  portfolioSummary?: string;
};

// ─── Policy ────────────────────────────────────────────────────

export type PolicyData = {
  entityType: "policy";
  id: string;
  name: string;
  policyNumber: string;
  insurer: string;
  category?: string;           // health | motor | life | home | travel
  isExternal?: boolean;
  type?: string;               // display label e.g. "Health Insurance"
  coverageLabel?: string;      // "Sum Insured" | "IDV" | "Sum Assured"
  sumInsured: number;
  sumInsuredDisplay?: string;  // "₹25,00,000"
  premiumAnnual: number;
  premiumDisplay?: string;     // "₹42,500 / year"
  deductibleDisplay?: string;
  memberIds: string[];
  status: string;              // active | due | upcoming | external | expired
  renewDateIso?: string;
  renewDateDisplay?: string;
  renewLabel?: string;         // "Renews:" | "Expires:" | "Active:"
};

// ─── Claim ─────────────────────────────────────────────────────

export type ClaimData = {
  entityType: "claim";
  id: string;
  claimNumber: string;
  policyName: string;
  policyId: string;
  memberName: string;
  memberId: string;
  claimType: string;
  amount: number;
  amountDisplay?: string;
  status: string;              // doc-requested | under-review | approved | settled
  statusDisplay?: string;
  filedDateIso?: string;
  filedDateDisplay?: string;
  insurer: string;
  hospital?: string;
  step?: number;
  steps?: string[];
};

// ─── Endorsement ───────────────────────────────────────────────

export type TimelineStep = {
  label: string;
  state: string;               // done | current | pending
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
  status: string;              // in-progress | pending | completed | rejected
  statusDisplay?: string;
  requestedDateIso?: string;
  requestedDateDisplay?: string;
  completedDateIso?: string;
  completedDateDisplay?: string;
  insurer: string;
  timeline?: TimelineStep[];
};

// ─── Requirement ───────────────────────────────────────────────

export type QuoteFeature = {
  text: string;
  included: boolean;
};

export type Quote = {
  id: string;
  insurer: string;
  planName: string;
  premiumAnnual: number;
  premiumDisplay?: string;
  features?: QuoteFeature[];
  selected?: boolean;
};

export type IssuedPolicy = {
  policyNumber?: string;
  insurer?: string;
  sumAssured?: number;
  sumAssuredDisplay?: string;
  premiumAnnual?: number;
  premiumDisplay?: string;
  policyTerm?: string;
  issuedOnIso?: string;
  issuedOnDisplay?: string;
};

export type RequirementData = {
  entityType: "requirement";
  id: string;
  type: string;
  member: string;
  memberId?: string;
  coverage: number;
  coverageDisplay?: string;
  advisor: string;
  status: string;              // new | quote-shared | policy-issued
  statusDisplay?: string;
  dateIso?: string;
  dateDisplay?: string;
  quotesAvailable?: number;
  policyId?: string;
  quotes?: Quote[];
  issuedPolicy?: IssuedPolicy;
};

// ─── Ticket ────────────────────────────────────────────────────

export type ThreadMessage = {
  from: string;
  fromRole: string;            // customer | advisor
  timeDisplay: string;
  message: string;
};

export type TicketData = {
  id: string;
  ticketNumber: string;
  subject: string;
  relatedPolicy?: string;
  policyId?: string;
  category: string;
  priority: string;            // high | normal
  status: string;              // open | in-progress | resolved
  statusDisplay?: string;
  createdDateIso?: string;
  updatedDateIso?: string;
  updatedDisplay?: string;
  thread?: ThreadMessage[];
};

// ─── Vehicle ───────────────────────────────────────────────────

export type VehicleData = {
  id: string;
  makeModel: string;
  registrationNumber: string;
  ownerName: string;
  ownerId: string;
  vehicleType?: string;        // car | two-wheeler
  status?: string;             // insured | external
  policyId?: string;
  insurer?: string;
  idv?: number;
  idvDisplay?: string;
  renewDateIso?: string;
  renewDateDisplay?: string;
  hasDocument?: boolean;
};

// ─── Document ──────────────────────────────────────────────────

export type DocumentData = {
  id: string;
  name: string;
  relatedToId?: string;
  relatedToLabel?: string;
  memberName?: string;
  memberId?: string;
  docType?: string;            // policy-doc | claim-doc | receipt | tax-doc
  docTypeDisplay?: string;
  dateIso?: string;
  dateDisplay?: string;
  sizeBytes?: number;
  sizeDisplay?: string;
  fileName?: string;
};

// ─── Alert ─────────────────────────────────────────────────────

export type AlertData = {
  id: string;
  severity: string;            // warn | danger | info | success
  title: string;
  message: string;
  relatedToId?: string;
  timeIso?: string;
  timeDisplay?: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
};

// ─── Dashboard ─────────────────────────────────────────────────

export type StatBlock = {
  activePolicies: number;
  sumInsured: number;
  sumInsuredDisplay: string;
  openClaims: number;
  openClaimsAmount: number;
  openClaimsAmountDisplay: string;
  renewalsDue: number;
};

export type CoverageRow = {
  category: string;
  label: string;
  sumInsured: number;
  sumInsuredDisplay: string;
  utilized: number;
  utilizedDisplay: string;
  utilizedPercent: number;
};

export type ActivityItem = {
  title: string;
  subtitle: string;
  timeDisplay: string;
  kind: string;                // warn | danger | info | success (severity, NOT content type)
  dateIso: string;
};

export type DashboardSummary = {
  stats: StatBlock;
  coverageSummary: CoverageRow[];
  recentActivity: ActivityItem[];
  annualPremiumOutgo: number;
  annualPremiumOutgoDisplay: string;
};

// ─── Reference ─────────────────────────────────────────────────

export type Advisor = {
  name: string;
  role: string;
  irdaiReg: string;
  phone: string;
  whatsapp: string;
  email: string;
};

export type Faq = {
  id: string;
  question: string;
  answer: string;
  category?: string;
};

// ─── Auth ──────────────────────────────────────────────────────

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    clientId: string;
    memberId: string;
  };
};

// ─── Union Type ────────────────────────────────────────────────

export type InsuranceEntity =
  | PolicyData
  | ClaimData
  | EndorsementData
  | RequirementData;
