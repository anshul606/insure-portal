import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { Member, MemberProfile } from "../types/models";
import { api } from "../services/api";

type MemberContextType = {
  members: Member[];
  loading: boolean;
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  activeMember: Member | undefined;
  getProfileForMember: (memberId: string) => MemberProfile | undefined;
};

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMemberId, setSelectedMemberId] = useState("all");

  useEffect(() => {
    api.getMembers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  const activeMember = members.find((m) => m.id === selectedMemberId) || members[0] || { id: "all", name: "Loading..." };

  const getProfileForMember = (memberId: string): MemberProfile | undefined => {
    const id = memberId === "all" ? "rajesh" : memberId;
    return members.find((m) => m.id === id)?.profile;
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
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) throw new Error("useMember must be used within a MemberProvider");
  return context;
}
