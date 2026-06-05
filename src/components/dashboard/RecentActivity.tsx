import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

type TimelineItemProps = {
    title: string;
    subtitle: string;
    time: string;
    dotColor: string;
    isLast?: boolean;
};

function TimelineItem({ title, subtitle, time, dotColor, isLast }: TimelineItemProps) {
    return (
        <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
            {/* Vertical Timeline line */}
            {!isLast && (
                <Box
                    sx={{
                        position: "absolute",
                        top: 24,
                        bottom: -8,
                        left: 5,
                        width: "2px",
                        bgcolor: "divider",
                        zIndex: 0,
                    }}
                />
            )}

            {/* Timeline Dot */}
            <Box sx={{ mt: 0.5, position: "relative", zIndex: 1 }}>
                <Box
                    sx={{
                        width: 12,
                        height: 12,
                        borderRadius: "50%",
                        bgcolor: dotColor,
                        border: "2px solid",
                        borderColor: "background.paper",
                        boxShadow: "0 0 0 1px var(--mui-palette-divider)", // clean outer ring
                    }}
                />
            </Box>

            {/* Content */}
            <Box sx={{ flex: 1, pb: 3 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 1 }}>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}>
                        {title}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "text.disabled", whiteSpace: "nowrap" }}>
                        {time}
                    </Typography>
                </Box>
                <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
                    {subtitle}
                </Typography>
            </Box>
        </Box>
    );
}

export default function RecentActivity() {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 3,
                p: 3,
                boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
                height: "100%", // To match height with adjacent cards
            }}
        >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 3 }}>
                Recent Activity
            </Typography>

            <Box>
                <TimelineItem
                    title="Health claim approved — ₹45,200"
                    subtitle="CL-2024-0892 · Rajesh Sharma"
                    time="2h ago"
                    dotColor="success.main"
                />
                <TimelineItem
                    title="Document requested for claim"
                    subtitle="CL-2025-0124 · Discharge summary needed"
                    time="Yesterday"
                    dotColor="warning.main"
                />
                <TimelineItem
                    title="Car insurance renewal reminder"
                    subtitle="MTR-2024-0887654 · Due in 12 days"
                    time="2d ago"
                    dotColor="error.main"
                />
                <TimelineItem
                    title="Policy certificate downloaded"
                    subtitle="Health Floater — HLT-2024-0001432"
                    time="5d ago"
                    dotColor="text.disabled"
                    isLast
                />
            </Box>
        </Box>
    );
}
