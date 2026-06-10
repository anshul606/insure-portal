import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import UiCard from "../shared/UiCard";
import { useTicket, ticketStatusMap } from "../../contexts/InsuranceContext";
import { useMember } from "../../contexts/MemberContext";
import type { TicketData } from "../../types/models";

type TicketsListProps = {
    onViewClick: (ticket: TicketData) => void;
};

export default function TicketsList({ onViewClick }: TicketsListProps) {
    const { getTicketsByMember, loading } = useTicket();
    const { selectedMemberId } = useMember();

    const tickets = getTicketsByMember(selectedMemberId);

    if (loading) {
        return (
            <Typography sx={{ p: 2, fontSize: 13, color: "text.secondary" }}>
                Loading tickets...
            </Typography>
        );
    }

    if (tickets.length === 0) {
        return (
            <Typography sx={{ p: 2, fontSize: 13, color: "text.secondary" }}>
                No tickets found.
            </Typography>
        );
    }

    return (
        <UiCard sx={{ p: 0, overflow: "hidden" }}>
            {/* Desktop Table Header */}
            <Box
                sx={{
                    display: { xs: "none", md: "grid" },
                    gridTemplateColumns: "1.2fr 1.6fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr",
                    gap: 1,
                    px: 2,
                    py: 1.25,
                    bgcolor: "surface.secondary",
                    borderBottom: "1px solid",
                    borderColor: "border.main",
                }}
            >
                {["Ticket No.", "Subject", "Policy", "Priority", "Status", "Updated", ""].map((h) => (
                    <Typography
                        key={h}
                        sx={{
                            fontSize: 10,
                            fontWeight: 600,
                            color: "text.disabled",
                            textTransform: "uppercase",
                            letterSpacing: "0.06em",
                        }}
                    >
                        {h}
                    </Typography>
                ))}
            </Box>

            {/* Rows */}
            {tickets.map((tkt, i) => {
                const st = ticketStatusMap[tkt.status as keyof typeof ticketStatusMap];
                const isHigh = tkt.priority === "High";

                return (
                    <Box
                        key={tkt.id}
                        sx={{
                            borderBottom: i < tickets.length - 1 ? "1px solid" : "none",
                            borderColor: "border.main",
                        }}
                    >
                        {/* Desktop Row */}
                        <Box
                            sx={{
                                display: { xs: "none", md: "grid" },
                                gridTemplateColumns: "1.2fr 1.6fr 1.2fr 0.8fr 0.8fr 1fr 0.8fr",
                                gap: 1,
                                px: 2,
                                py: 1.5,
                                alignItems: "center",
                                "&:hover": { bgcolor: "rgba(20,86,160,0.02)" },
                                borderLeft: isHigh ? "3px solid" : "3px solid transparent",
                                borderLeftColor: isHigh ? "error.main" : "transparent"
                            }}
                        >
                            <Typography sx={{ fontSize: 11, color: "text.disabled", fontFamily: "monospace", pl: isHigh ? 1 : 0 }}>
                                {tkt.ticketNumber}
                            </Typography>
                            <Typography sx={{ fontSize: 13, color: "text.primary", fontWeight: 500, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {tkt.subject}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                                {tkt.policyName || "—"}
                            </Typography>
                            <Chip
                                label={tkt.priority}
                                size="small"
                                sx={{
                                    bgcolor: isHigh ? "#FCEBEB" : "surface.secondary",
                                    color: isHigh ? "#A32D2D" : "text.secondary",
                                    fontWeight: 600,
                                    fontSize: 10,
                                    height: "auto",
                                    px: 0.5,
                                    py: 0.25,
                                    width: "fit-content",
                                    border: isHigh ? "none" : "1px solid",
                                    borderColor: "border.main"
                                }}
                            />
                            <Chip
                                label={st.label}
                                size="small"
                                sx={{
                                    bgcolor: st.bg,
                                    color: st.color,
                                    fontWeight: 600,
                                    fontSize: 10,
                                    height: "auto",
                                    px: 0.5,
                                    py: 0.25,
                                    width: "fit-content"
                                }}
                            />
                            <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                                {tkt.updatedDate}
                            </Typography>
                            <Button
                                size="small"
                                variant="outlined"
                                onClick={() => onViewClick(tkt)}
                                sx={{
                                    fontSize: 11,
                                    fontWeight: 500,
                                    px: 1,
                                    py: 0.5,
                                    borderRadius: 1.5,
                                    minHeight: 0,
                                    textTransform: "none",
                                    justifySelf: "end",
                                    borderColor: "border.main",
                                    color: "text.secondary"
                                }}
                            >
                                View
                            </Button>
                        </Box>

                        {/* Mobile Row */}
                        <Box
                            sx={{
                                display: { xs: "flex", md: "none" },
                                flexDirection: "column",
                                p: 2,
                                borderLeft: isHigh ? "3px solid" : "3px solid transparent",
                                borderLeftColor: isHigh ? "error.main" : "transparent"
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 11, fontWeight: 700, color: "text.disabled", mb: 0.5, fontFamily: "monospace" }}>
                                        {tkt.ticketNumber}
                                    </Typography>
                                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
                                        {tkt.subject}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
                                        {tkt.policyName ? `${tkt.policyName} · ` : ""}Updated {tkt.updatedDate.toLowerCase()}
                                    </Typography>
                                </Box>
                                <Chip
                                    label={st.label}
                                    size="small"
                                    sx={{
                                        bgcolor: st.bg,
                                        color: st.color,
                                        fontWeight: 600,
                                        fontSize: 10,
                                        height: "auto",
                                        px: 0.5,
                                        py: 0.25,
                                    }}
                                />
                            </Box>

                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                mt: 1.5,
                                pt: 1.5,
                                borderTop: "1px solid",
                                borderColor: "border.main"
                            }}>
                                {isHigh ? (
                                    <Chip
                                        label="High Priority"
                                        size="small"
                                        sx={{
                                            bgcolor: "#FCEBEB",
                                            color: "#A32D2D",
                                            fontWeight: 600,
                                            fontSize: 10,
                                            height: "auto",
                                            px: 0.5,
                                            py: 0.25,
                                        }}
                                    />
                                ) : (
                                    <Chip
                                        label="Normal"
                                        size="small"
                                        sx={{
                                            bgcolor: "surface.secondary",
                                            color: "text.secondary",
                                            fontWeight: 600,
                                            fontSize: 10,
                                            height: "auto",
                                            px: 0.5,
                                            py: 0.25,
                                            border: "1px solid",
                                            borderColor: "border.main"
                                        }}
                                    />
                                )}
                                <Button
                                    variant="contained"
                                    size="small"
                                    onClick={() => onViewClick(tkt)}
                                    sx={{ borderRadius: 2 }}
                                >
                                    View Ticket
                                </Button>
                            </Box>
                        </Box>
                    </Box>
                );
            })}
        </UiCard>
    );
}
