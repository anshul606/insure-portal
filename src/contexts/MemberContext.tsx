import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Member, MemberProfile } from "../types/models";
import { api, setCachedMembers } from "../services/api";
import { hasValidToken } from "../services/apiClient";

type MemberContextType = {
  members: Member[];
  loading: boolean;
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  activeMember: Member | undefined;
  getProfileForMember: (memberId: string) => MemberProfile | undefined;
  getMemberName: (memberId: string) => string;
  refreshMembers: () => Promise<void>;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberIdState] = useState<string>(() => {
    return localStorage.getItem("selectedMemberId") || "all";
  });

  const setSelectedMemberId = (id: string) => {
    setSelectedMemberIdState(id);
    localStorage.setItem("selectedMemberId", id);
  };

  const refreshMembers = async () => {
    if (!hasValidToken()) {
      setMembers([]);
      setLoading(false);
      return;
    }
    try {
      const data = await api.getMembers();
      setMembers(data);
      setCachedMembers(data);
    } catch (err: any) {
      if (err?.status !== 401) {
        console.error("Failed to load members:", err);
      }
    }
  };

  useEffect(() => {
    refreshMembers().finally(() => setLoading(false));
  }, []);

  const activeMember =
    selectedMemberId === "all"
      ? members[0]
      : members.find((m) => m.id === selectedMemberId) || members[0];

  const getProfileForMember = (memberId: string): MemberProfile | undefined => {
    if (memberId === "all") return undefined;
    return members.find((m) => m.id === memberId)?.profile;
  };

  const getMemberName = (memberId: string): string => {
    const member = members.find((m) => m.id === memberId);
    return member?.name ?? "";
  };

  return (
    <MemberContext.Provider
      value={{
        members,
        loading,
        selectedMemberId,
        setSelectedMemberId,
        activeMember,
        getProfileForMember,
        getMemberName,
        refreshMembers,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined)
    throw new Error("useMember must be used within a MemberProvider");
  return context;
}
