import { createContext, useContext, type ReactNode } from "react";

export type EndorsementData = {
    id: string;
    endorsementNumber: string;
    policyName: string;
    policyNumber: string;
    memberName: string;
    memberId: string;
    type: string;
    description: string;
    status: "pending" | "in-progress" | "completed" | "rejected";
    requestedDate: string;
    completedDate?: string;
    insurer: string;
};

export const statusMap = {
    pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
    "in-progress": { label: "In Progress", color: "#1456A0", bg: "#EBF3FC" },
    completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
    rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

const endorsementsList: EndorsementData[] = [
    {
        id: "END-2025-0041",
        endorsementNumber: "END-2025-0041",
        policyName: "Family Health Floater",
        policyNumber: "HLT-2024-0001432",
        memberName: "Rajesh Sharma",
        memberId: "rajesh",
        type: "Add Member",
        description: "Add newborn Aarav Sharma to family floater policy",
        status: "in-progress",
        requestedDate: "02 May 2025",
        insurer: "HDFC ERGO",
    },
    {
        id: "END-2025-0033",
        endorsementNumber: "END-2025-0033",
        policyName: "Car Insurance — Maruti Swift",
        policyNumber: "MTR-2024-0887654",
        memberName: "Rajesh Sharma",
        memberId: "rajesh",
        type: "Address Change",
        description: "Update registered address to new residence in Baner, Pune",
        status: "pending",
        requestedDate: "18 Apr 2025",
        insurer: "Bajaj Allianz",
    },
    {
        id: "END-2024-0198",
        endorsementNumber: "END-2024-0198",
        policyName: "Family Health Floater",
        policyNumber: "HLT-2024-0001432",
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
        id: "END-2024-0156",
        endorsementNumber: "END-2024-0156",
        policyName: "Term Life Insurance",
        policyNumber: "LIF-2023-0045231",
        memberName: "Rajesh Sharma",
        memberId: "rajesh",
        type: "Sum Insured Upgrade",
        description: "Increase sum assured from ₹1Cr to ₹2Cr",
        status: "rejected",
        requestedDate: "25 Nov 2024",
        insurer: "LIC of India",
    },
];

type EndorsementContextType = {
    endorsements: EndorsementData[];
    getEndorsementsByMember: (memberId: string) => EndorsementData[];
    getEndorsementById: (id: string) => EndorsementData | undefined;
    pendingEndorsementsCount: number;
};

const EndorsementContext = createContext<EndorsementContextType | undefined>(
    undefined,
);

export function EndorsementProvider({ children }: { children: ReactNode }) {
    const getEndorsementsByMember = (memberId: string): EndorsementData[] => {
        if (memberId === "all") {
            return endorsementsList;
        }
        return endorsementsList.filter((e) => e.memberId === memberId);
    };

    const getEndorsementById = (id: string): EndorsementData | undefined => {
        return endorsementsList.find((e) => e.id === id);
    };

    const pendingEndorsementsCount = endorsementsList.filter(
        (e) => e.status === "pending" || e.status === "in-progress",
    ).length;

    return (
        <EndorsementContext.Provider
            value={{
                endorsements: endorsementsList,
                getEndorsementsByMember,
                getEndorsementById,
                pendingEndorsementsCount,
            }}
        >
            {children}
        </EndorsementContext.Provider>
    );
}

export function useEndorsement() {
    const context = useContext(EndorsementContext);
    if (context === undefined) {
        throw new Error(
            "useEndorsement must be used within an EndorsementProvider",
        );
    }
    return context;
}
