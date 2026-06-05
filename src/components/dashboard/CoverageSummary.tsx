import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";

type CoverageItemProps = {
    label: string;
    value: string;
    progress: number;
    color: "primary" | "success" | "warning" | "error" | "info";
};

function CoverageItem({ label, value, progress, color }: CoverageItemProps) {
    return (
        <Box>
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary" }}>
                    {label}
                </Typography>
                <Typography sx={{ fontSize: 12, fontWeight: 500, color: "text.secondary" }}>
                    {value}
                </Typography>
            </Box>
            <LinearProgress
                variant="determinate"
                value={progress}
                color={color}
                sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: "action.hover",
                    "& .MuiLinearProgress-bar": {
                        borderRadius: 3,
                    },
                }}
            />
        </Box>
    );
}

export default function CoverageSummary() {
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
                display: "flex",
                flexDirection: "column",
            }}
        >
            <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 3 }}>
                Coverage Summary
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5, flex: 1 }}>
                <CoverageItem
                    label="Health Insurance"
                    value="₹15L / ₹25L"
                    progress={60}
                    color="primary"
                />
                <CoverageItem
                    label="Motor Insurance"
                    value="IDV ₹8.5L"
                    progress={71}
                    color="warning"
                />
                <CoverageItem
                    label="Term Life"
                    value="₹1Cr cover"
                    progress={100}
                    color="success"
                />
                <CoverageItem
                    label="Home Insurance"
                    value="₹80L cover"
                    progress={100}
                    color="success"
                />
            </Box>

            {/* Footer Area */}
            <Box sx={{ borderTop: "1px solid", borderColor: "divider", mt: 3, pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                    Annual premium outgo
                </Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 700, color: "text.primary" }}>
                    ₹1,24,500
                </Typography>
            </Box>
        </Box>
    );
}
