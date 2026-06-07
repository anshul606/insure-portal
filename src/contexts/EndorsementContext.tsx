import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import type { EndorsementData } from "../types/models";
import { api } from "../services/api";

export const statusMap = {
    pending: { label: "Pending", color: "#6B6963", bg: "#F1EFE8" },
    "in-progress": { label: "In Progress", color: "#1456A0", bg: "#EBF3FC" },
    completed: { label: "Completed", color: "#3B6D11", bg: "#EAF3DE" },
    rejected: { label: "Rejected", color: "#A32D2D", bg: "#FCEBEB" },
};

type EndorsementContextType = {
    endorsements: EndorsementData[];
    loading: boolean;
    getEndorsementsByMember: (memberId: string) => EndorsementData[];
    getEndorsementById: (id: string) => EndorsementData | undefined;
    pendingEndorsementsCount: number;
};

const EndorsementContext = createContext<EndorsementContextType | undefined>(undefined);

export function EndorsementProvider({ children }: { children: ReactNode }) {
    const [endorsements, setEndorsements] = useState<EndorsementData[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.getEndorsements().then((data) => {
            setEndorsements(data);
            setLoading(false);
        });
    }, []);

    const getEndorsementsByMember = (memberId: string): EndorsementData[] => {
        if (memberId === "all") return endorsements;
        return endorsements.filter((e) => e.memberId === memberId);
    };

    const getEndorsementById = (id: string): EndorsementData | undefined => {
        return endorsements.find((e) => e.id === id);
    };

    const pendingEndorsementsCount = endorsements.filter(
        (e) => e.status === "pending" || e.status === "in-progress"
    ).length;

    return (
        <EndorsementContext.Provider value={{ endorsements, loading, getEndorsementsByMember, getEndorsementById, pendingEndorsementsCount }}>
            {children}
        </EndorsementContext.Provider>
    );
}

export function useEndorsement() {
    const context = useContext(EndorsementContext);
    if (context === undefined) throw new Error("useEndorsement must be used within an EndorsementProvider");
    return context;
}
