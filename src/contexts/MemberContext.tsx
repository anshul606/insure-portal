import { createContext, useContext, useState, type ReactNode } from "react";

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

type MemberContextType = {
  members: Member[];
  selectedMemberId: string;
  setSelectedMemberId: (id: string) => void;
  activeMember: Member;
  getProfileForMember: (memberId: string) => MemberProfile | undefined;
};

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

const MemberContext = createContext<MemberContextType | undefined>(undefined);

export function MemberProvider({ children }: { children: ReactNode }) {
  const [selectedMemberId, setSelectedMemberId] = useState("all");

  const activeMember =
    membersList.find((m) => m.id === selectedMemberId) || membersList[0];

  const getProfileForMember = (memberId: string): MemberProfile | undefined => {
    const id = memberId === "all" ? "rajesh" : memberId;
    return membersList.find((m) => m.id === id)?.profile;
  };

  return (
    <MemberContext.Provider
      value={{
        members: membersList,
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
  if (context === undefined) {
    throw new Error("useMember must be used within a MemberProvider");
  }
  return context;
}
