import { createContext, useContext, useState, type ReactNode } from "react";

export type Member = {
  id: string;
  name: string;
};

type MemberContextType = {
  members: Member[];
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  activeMember: Member;
};

const membersList: Member[] = [
  { id: "all", name: "All Members" },
  { id: "rajesh", name: "Rajesh Sharma" },
  { id: "priya", name: "Priya Sharma" },
  { id: "aarav", name: "Aarav Sharma" },
];

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [selectedMemberId, setSelectedMemberId] = useState("all");

  const activeMember =
    membersList.find((m) => m.id === selectedMemberId) || membersList[0];

  return (
    <MemberContext.Provider
      value={{
        members: membersList,
        selectedMemberId,
        setSelectedMemberId,
        activeMember,
      }}
    >
      {children}
    </MemberContext.Provider>
  );
}

export function useMember() {
  const context = useContext(MemberContext);
  if (context === undefined) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
}
