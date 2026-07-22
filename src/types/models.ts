export type BrandingData = {
  orgCode: string;
  name: string;
  status: string;
  loginLogoUrl?: string;
  squareIconUrl?: string;
  isDefault: boolean;
};

export type ChangePasswordRequest = {
  currentPassword?: string;
  newPassword?: string;
};

export type PrefChannels = {
  email?: boolean;
  sms?: boolean;
  whatsapp?: boolean;
  push?: boolean;
};

export type PrefCategories = {
  renewalReminders?: boolean;
  claimUpdates?: boolean;
  paymentReminders?: boolean;
  promotions?: boolean;
};

export type Preferences = {
  channels?: PrefChannels;
  categories?: PrefCategories;
};

export type KycItem = {
  label: string;
  status: string;
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
  preferences?: Preferences;
  policyCount?: number;
  totalCoverage?: number;
  totalCoverageDisplay?: string;
  portfolioSummary?: string;
};

export type PolicyData = {
  entityType: "policy";
  id: string;
  name: string;
  policyNumber: string;
  insurer: string;
  category?: string;
  isExternal?: boolean;
  type?: string;
  coverageLabel?: string;
  sumInsured: number;
  sumInsuredDisplay?: string;
  premiumAnnual: number;
  premiumDisplay?: string;
  deductibleDisplay?: string;
  memberIds: string[];
  status: string;
  renewDateIso?: string;
  renewDateDisplay?: string;
  renewLabel?: string;
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
  amount: number;
  amountDisplay?: string;
  status: string;
  statusDisplay?: string;
  filedDateIso?: string;
  filedDateDisplay?: string;
  insurer: string;
  hospital?: string;
  step?: number;
  steps?: string[];
};

export type TimelineStep = {
  label: string;
  state: string;
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
  status: string;
  statusDisplay?: string;
  requestedDateIso?: string;
  requestedDateDisplay?: string;
  completedDateIso?: string;
  completedDateDisplay?: string;
  insurer: string;
  timeline?: TimelineStep[];
};

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
  status: string;
  statusDisplay?: string;
  dateIso?: string;
  dateDisplay?: string;
  quotesAvailable?: number;
  policyId?: string;
  quotes?: Quote[];
  issuedPolicy?: IssuedPolicy;
};

export type ThreadMessage = {
  from: string;
  fromRole: string;
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
  priority: string;
  status: string;
  statusDisplay?: string;
  createdDateIso?: string;
  updatedDateIso?: string;
  updatedDisplay?: string;
  thread?: ThreadMessage[];
};

export type VehicleData = {
  id: string;
  makeModel: string;
  registrationNumber: string;
  ownerName: string;
  ownerId: string;
  vehicleType?: string;
  status?: string;
  policyId?: string;
  insurer?: string;
  idv?: number;
  idvDisplay?: string;
  renewDateIso?: string;
  renewDateDisplay?: string;
  hasDocument?: boolean;
};

export type DocumentData = {
  id: string;
  name: string;
  relatedToId?: string;
  relatedToLabel?: string;
  memberName?: string;
  memberId?: string;
  docType?: string;
  docTypeDisplay?: string;
  dateIso?: string;
  dateDisplay?: string;
  sizeBytes?: number;
  sizeDisplay?: string;
  fileName?: string;
};

export type AlertData = {
  id: string;
  severity: string;
  title: string;
  message: string;
  relatedToId?: string;
  timeIso?: string;
  timeDisplay?: string;
  read: boolean;
  actionLabel?: string;
  actionTarget?: string;
};

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
  kind: string;
  dateIso: string;
};

export type DashboardSummary = {
  stats: StatBlock;
  coverageSummary: CoverageRow[];
  recentActivity: ActivityItem[];
  annualPremiumOutgo: number;
  annualPremiumOutgoDisplay: string;
};

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

export type LoginResponse = {
  token: string;
  user: {
    id: string;
    name: string;
    clientId: string;
    memberId: string;
  };
};

export type InsuranceEntity =
  | PolicyData
  | ClaimData
  | EndorsementData
  | RequirementData;
