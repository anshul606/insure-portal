import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { FileText, Upload, FilePlus, Ticket } from "lucide-react";

const actions = [
    { icon: <FileText size={22} />, title: "Raise Claim", sub: "File a new claim" },
    { icon: <Upload size={22} />, title: "Upload Policy", sub: "From other insurers" },
    { icon: <FilePlus size={22} />, title: "New Requirement", sub: "Get a quote" },
    { icon: <Ticket size={22} />, title: "Support Ticket", sub: "Need help?" },
];

export default function QuickActions() {
    return (
        <Box sx={{ mt: 4 }}>
            <Typography
                sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.primary",
                    mb: 1.5,
                }}
            >
                Quick Actions
            </Typography>
            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: {
                        xs: "1fr 1fr",
                        md: "repeat(4, 1fr)",
                    },
                    gap: 1.5,
                }}
            >
                {actions.map((action, index) => (
                    <Box
                        key={index}
                        sx={{
                            bgcolor: "background.paper",
                            border: "1px solid",
                            borderColor: "border.main",
                            borderRadius: 2,
                            p: 2,
                            textAlign: "center",
                            cursor: "pointer",
                            transition: "all 0.15s ease",
                            "@media (hover: hover)": {
                                "&:hover": {
                                    borderColor: "primary.main",
                                    transform: "translateY(-2px)",
                                    boxShadow: "0 4px 12px rgba(20,86,160,0.08)",
                                },
                            },
                            "&:active": {
                                borderColor: "primary.main",
                                transform: "scale(0.97)",
                            },
                        }}
                    >
                        <Box
                            sx={{
                                width: 44,
                                height: 44,
                                borderRadius: "50%",
                                bgcolor: "rgba(20,86,160,0.06)",
                                color: "#1456A0",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                margin: "0 auto",
                                mb: 1.5,
                            }}
                        >
                            {action.icon}
                        </Box>
                        <Typography
                            sx={{
                                fontSize: 13,
                                fontWeight: 600,
                                color: "text.primary",
                                mb: 0.25,
                            }}
                        >
                            {action.title}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                                lineHeight: 1.3,
                            }}
                        >
                            {action.sub}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
}
