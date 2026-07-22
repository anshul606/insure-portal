import { apiClient, downloadFile } from "./apiClient";
import type {
  Member,
  PolicyData,
  ClaimData,
  EndorsementData,
  RequirementData,
  TicketData,
  VehicleData,
  DocumentData,
  AlertData,
  DashboardSummary,
  LoginResponse,
  Advisor,
  Faq,
  InsuranceEntity,
  BrandingData,
  ChangePasswordRequest,
  Preferences,
} from "../types/models";

let cachedMembers: Member[] = [];

export function setCachedMembers(members: Member[]) {
  cachedMembers = members;
}

export const getMemberDisplayText = (memberIds: string[]): string => {
  if (!memberIds || memberIds.length === 0) return "—";
  const memberNames = memberIds.map((id) => {
    const member = cachedMembers.find((m) => m.id === id);
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
  if (!memberIds || memberIds.length === 0) return "—";
  const memberNames = memberIds.map((id) => {
    const member = cachedMembers.find((m) => m.id === id);
    return member ? member.name.split(" ")[0] : id;
  });
  return memberNames.join(", ");
};

type ListParams = Record<string, string | number | boolean | undefined>;

export const api = {
  getBranding: async (orgCode: string): Promise<BrandingData> => {
    try {
      const res = await apiClient.get<BrandingData>(`/api/branding/${orgCode}`);
      return res.data;
    } catch {
      const fallback = await apiClient.get<BrandingData>("/api/branding/unknown");
      return fallback.data;
    }
  },

  login: async (orgCode: string, loginId: string, password: string): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/api/auth/login", {
      orgCode,
      loginId,
      password,
    });
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post("/api/auth/logout");
  },

  getMe: async (): Promise<LoginResponse["user"]> => {
    const res = await apiClient.get<LoginResponse["user"]>("/api/auth/me");
    return res.data;
  },

  changePassword: async (req: ChangePasswordRequest): Promise<void> => {
    await apiClient.post("/api/auth/change-password", req);
  },

  getMembers: async (): Promise<Member[]> => {
    const res = await apiClient.get<Member[]>("/api/members");
    return res.data;
  },

  getMemberById: async (id: string): Promise<Member> => {
    const res = await apiClient.get<Member>(`/api/members/${id}`);
    return res.data;
  },

  createMember: async (member: Partial<Member>): Promise<Member> => {
    const res = await apiClient.post<Member>("/api/members", member);
    return res.data;
  },

  updateMember: async (id: string, patch: { mobile?: string; email?: string; address?: string }): Promise<Member> => {
    const res = await apiClient.patch<Member>(`/api/members/${id}`, patch);
    return res.data;
  },

  updateMemberKyc: async (id: string, patch: { status: string }): Promise<Member> => {
    try {
      const res = await apiClient.patch<Member>(`/api/members/${id}`, { status: patch.status });
      return res.data;
    } catch {
      const res = await apiClient.patch<Member>(`/api/members/${id}`, patch);
      return res.data;
    }
  },

  getMemberPreferences: async (id: string): Promise<Preferences> => {
    const res = await apiClient.get<Preferences>(`/api/members/${id}/preferences`);
    return res.data;
  },

  updateMemberPreferences: async (id: string, prefs: Preferences): Promise<Preferences> => {
    const res = await apiClient.put<Preferences>(`/api/members/${id}/preferences`, prefs);
    return res.data;
  },

  deleteMember: async (id: string): Promise<void> => {
    await apiClient.del(`/api/members/${id}`);
  },

  getPolicies: async (params?: ListParams): Promise<PolicyData[]> => {
    const res = await apiClient.get<PolicyData[]>("/api/policies", params);
    return res.data;
  },

  getPolicyById: async (id: string): Promise<PolicyData> => {
    const res = await apiClient.get<PolicyData>(`/api/policies/${id}`);
    return res.data;
  },

  createPolicy: async (data: Partial<PolicyData>): Promise<PolicyData> => {
    const res = await apiClient.post<PolicyData>("/api/policies", data);
    return res.data;
  },

  updatePolicy: async (id: string, data: Partial<PolicyData>): Promise<PolicyData> => {
    const res = await apiClient.put<PolicyData>(`/api/policies/${id}`, data);
    return res.data;
  },

  downloadCertificate: async (id: string): Promise<void> => {
    await downloadFile(`/api/policies/${id}/certificate`, `policy-certificate-${id}.pdf`);
  },

  getClaims: async (params?: ListParams): Promise<ClaimData[]> => {
    const res = await apiClient.get<ClaimData[]>("/api/claims", params);
    return res.data;
  },

  getClaimById: async (id: string): Promise<ClaimData> => {
    const res = await apiClient.get<ClaimData>(`/api/claims/${id}`);
    return res.data;
  },

  createClaim: async (data: Partial<ClaimData>): Promise<ClaimData> => {
    const res = await apiClient.post<ClaimData>("/api/claims", data);
    return res.data;
  },

  updateClaim: async (id: string, data: Partial<ClaimData>): Promise<ClaimData> => {
    const res = await apiClient.put<ClaimData>(`/api/claims/${id}`, data);
    return res.data;
  },

  patchClaim: async (id: string, patch: { status?: string; step?: number }): Promise<ClaimData> => {
    const res = await apiClient.patch<ClaimData>(`/api/claims/${id}`, patch);
    return res.data;
  },

  deleteClaim: async (id: string): Promise<void> => {
    await apiClient.del(`/api/claims/${id}`);
  },

  getEndorsements: async (params?: ListParams): Promise<EndorsementData[]> => {
    const res = await apiClient.get<EndorsementData[]>("/api/endorsements", params);
    return res.data;
  },

  getEndorsementById: async (id: string): Promise<EndorsementData> => {
    const res = await apiClient.get<EndorsementData>(`/api/endorsements/${id}`);
    return res.data;
  },

  createEndorsement: async (data: Partial<EndorsementData>): Promise<EndorsementData> => {
    const res = await apiClient.post<EndorsementData>("/api/endorsements", data);
    return res.data;
  },

  updateEndorsement: async (id: string, data: Partial<EndorsementData>): Promise<EndorsementData> => {
    const res = await apiClient.put<EndorsementData>(`/api/endorsements/${id}`, data);
    return res.data;
  },

  patchEndorsement: async (id: string, patch: { status?: string; completedDateIso?: string }): Promise<EndorsementData> => {
    const res = await apiClient.patch<EndorsementData>(`/api/endorsements/${id}`, patch);
    return res.data;
  },

  deleteEndorsement: async (id: string): Promise<void> => {
    await apiClient.del(`/api/endorsements/${id}`);
  },

  getRequirements: async (params?: ListParams): Promise<RequirementData[]> => {
    const res = await apiClient.get<RequirementData[]>("/api/requirements", params);
    return res.data;
  },

  getRequirementById: async (id: string): Promise<RequirementData> => {
    const res = await apiClient.get<RequirementData>(`/api/requirements/${id}`);
    return res.data;
  },

  createRequirement: async (data: Partial<RequirementData>): Promise<RequirementData> => {
    const res = await apiClient.post<RequirementData>("/api/requirements", data);
    return res.data;
  },

  selectQuote: async (requirementId: string, quoteId: string): Promise<RequirementData> => {
    const res = await apiClient.post<RequirementData>(
      `/api/requirements/${requirementId}/select-quote`,
      { quoteId }
    );
    return res.data;
  },

  deleteRequirement: async (id: string): Promise<void> => {
    await apiClient.del(`/api/requirements/${id}`);
  },

  getTickets: async (params?: ListParams): Promise<TicketData[]> => {
    const res = await apiClient.get<TicketData[]>("/api/tickets", params);
    return res.data;
  },

  getTicketById: async (id: string): Promise<TicketData> => {
    const res = await apiClient.get<TicketData>(`/api/tickets/${id}`);
    return res.data;
  },

  createTicket: async (data: Partial<TicketData>): Promise<TicketData> => {
    const res = await apiClient.post<TicketData>("/api/tickets", data);
    return res.data;
  },

  patchTicket: async (id: string, patch: { status?: string }): Promise<TicketData> => {
    const res = await apiClient.patch<TicketData>(`/api/tickets/${id}`, patch);
    return res.data;
  },

  replyToTicket: async (id: string, message: string): Promise<TicketData> => {
    const res = await apiClient.post<TicketData>(`/api/tickets/${id}/replies`, { message });
    return res.data;
  },

  deleteTicket: async (id: string): Promise<void> => {
    await apiClient.del(`/api/tickets/${id}`);
  },

  getDocuments: async (params?: ListParams): Promise<DocumentData[]> => {
    const res = await apiClient.get<DocumentData[]>("/api/documents", params);
    return res.data;
  },

  getDocumentById: async (id: string): Promise<DocumentData> => {
    const res = await apiClient.get<DocumentData>(`/api/documents/${id}`);
    return res.data;
  },

  createDocument: async (data: Partial<DocumentData>): Promise<DocumentData> => {
    const res = await apiClient.post<DocumentData>("/api/documents", data);
    return res.data;
  },

  downloadDocument: async (id: string): Promise<void> => {
    await downloadFile(`/api/documents/${id}/download`, `document-${id}.pdf`);
  },

  deleteDocument: async (id: string): Promise<void> => {
    await apiClient.del(`/api/documents/${id}`);
  },

  getVehicles: async (params?: ListParams): Promise<VehicleData[]> => {
    const res = await apiClient.get<VehicleData[]>("/api/vehicles", params);
    return res.data;
  },

  getVehicleById: async (id: string): Promise<VehicleData> => {
    const res = await apiClient.get<VehicleData>(`/api/vehicles/${id}`);
    return res.data;
  },

  getVehiclePolicy: async (id: string): Promise<PolicyData> => {
    const res = await apiClient.get<PolicyData>(`/api/vehicles/${id}/policy`);
    return res.data;
  },

  createVehicle: async (data: Partial<VehicleData>): Promise<VehicleData> => {
    const res = await apiClient.post<VehicleData>("/api/vehicles", data);
    return res.data;
  },

  updateVehicle: async (id: string, data: Partial<VehicleData>): Promise<VehicleData> => {
    const res = await apiClient.put<VehicleData>(`/api/vehicles/${id}`, data);
    return res.data;
  },

  deleteVehicle: async (id: string): Promise<void> => {
    await apiClient.del(`/api/vehicles/${id}`);
  },

  getAlerts: async (): Promise<AlertData[]> => {
    const res = await apiClient.get<AlertData[]>("/api/alerts");
    return res.data;
  },

  markAlertRead: async (id: string): Promise<AlertData> => {
    const res = await apiClient.patch<AlertData>(`/api/alerts/${id}`, { read: true });
    return res.data;
  },

  markAllAlertsRead: async (): Promise<void> => {
    await apiClient.post("/api/alerts/mark-all-read");
  },

  getDashboardSummary: async (memberId?: string): Promise<DashboardSummary> => {
    const params = memberId ? { memberId } : undefined;
    const res = await apiClient.get<DashboardSummary>("/api/dashboard/summary", params);
    return res.data;
  },

  getAdvisor: async (): Promise<Advisor> => {
    const res = await apiClient.get<Advisor>("/api/advisor");
    return res.data;
  },

  getFaqs: async (): Promise<Faq[]> => {
    const res = await apiClient.get<Faq[]>("/api/faqs");
    return res.data;
  },

  getInsuranceEntities: async (): Promise<InsuranceEntity[]> => {
    const [policies, claims, endorsements, requirements] = await Promise.all([
      api.getPolicies(),
      api.getClaims(),
      api.getEndorsements(),
      api.getRequirements(),
    ]);
    return [...policies, ...claims, ...endorsements, ...requirements];
  },
};
