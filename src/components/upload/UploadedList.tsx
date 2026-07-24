import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import UiCard from "../shared/UiCard";
import { usePolicy } from "../../contexts/InsuranceContext";

// NOTE (soft-delete convention): If a "Delete" action is added to uploaded policies,
// do NOT call api.deletePolicy(id). Instead use api.updatePolicy(id, { status: "deleted" })
// via PUT — this is an intentional soft-delete pattern on the backend so advisors retain
// an audit trail. The backend will filter out status="deleted" policies from normal list
// responses. Calling the DELETE endpoint would permanently remove the record.

export default function UploadedList() {
    const { policies, loading } = usePolicy();
    
    if (loading) return null;

    const uploadedPolicies = policies.filter(p => p.status === "external");

    if (uploadedPolicies.length === 0) return null;

    return (
        <Box>
            <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", mb: 2, px: { xs: 0, md: 1 } }}>
                Already Uploaded
            </Typography>

            <UiCard sx={{ p: 0, overflow: "hidden" }}>
                <Box
                    sx={{
                        display: { xs: "none", md: "grid" },
                        gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
                        gap: 1,
                        px: 2,
                        py: 1.25,
                        bgcolor: "surface.secondary",
                        borderBottom: "1px solid",
                        borderColor: "border.main",
                    }}
                >
                    {["Policy", "Insurer", "Member", "Sum Insured", "Renewal Date", "Status"].map((h) => (
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

                {uploadedPolicies.map((policy, i) => (
                    <Box
                        key={policy.id}
                        sx={{
                            borderBottom: i < uploadedPolicies.length - 1 ? "1px solid" : "none",
                            borderColor: "border.main",
                        }}
                    >
                        <Box
                            sx={{
                                display: { xs: "none", md: "grid" },
                                gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr 1fr",
                                gap: 1,
                                px: 2,
                                py: 1.5,
                                alignItems: "center",
                                "&:hover": { bgcolor: "rgba(20,86,160,0.02)" },
                            }}
                        >
                            <Typography sx={{ fontSize: 12, color: "text.primary", fontWeight: 500 }}>
                                {policy.name}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                {policy.insurer}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                                {policy.memberIds.join(", ")}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.primary", fontWeight: 500 }}>
                                {policy.sumInsuredDisplay || policy.sumInsured}
                            </Typography>
                            <Typography sx={{ fontSize: 12, color: "text.disabled" }}>
                                {policy.renewDateDisplay || policy.renewDateIso || "—"}
                            </Typography>
                            <Chip
                                label="Under Review"
                                size="small"
                                sx={{
                                    bgcolor: "#EBF3FC",
                                    color: "#1456A0",
                                    fontWeight: 600,
                                    fontSize: 10,
                                    height: "auto",
                                    px: 0.5,
                                    py: 0.25,
                                    width: "fit-content"
                                }}
                            />
                        </Box>

                        <Box
                            sx={{
                                display: { xs: "flex", md: "none" },
                                flexDirection: "column",
                                p: 2,
                            }}
                        >
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                                <Box>
                                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
                                        {policy.name}
                                    </Typography>
                                    <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.5 }}>
                                        {policy.insurer} • {policy.memberIds.join(", ")}
                                    </Typography>
                                </Box>
                                <Chip
                                    label="Under Review"
                                    size="small"
                                    sx={{
                                        bgcolor: "#EBF3FC",
                                        color: "#1456A0",
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
                                gap: 2,
                                mt: 1,
                                pt: 1.5,
                                borderTop: "1px solid",
                                borderColor: "border.main"
                            }}>
                                <Box>
                                    <Typography sx={{ fontSize: 10, color: "text.disabled", textTransform: "uppercase" }}>Sum Insured</Typography>
                                    <Typography sx={{ fontSize: 12, color: "text.primary", fontWeight: 500 }}>{policy.sumInsuredDisplay || policy.sumInsured}</Typography>
                                </Box>
                                <Box>
                                    <Typography sx={{ fontSize: 10, color: "text.disabled", textTransform: "uppercase" }}>Renewal Date</Typography>
                                    <Typography sx={{ fontSize: 12, color: "text.primary", fontWeight: 500 }}>{policy.renewDateDisplay || policy.renewDateIso || "—"}</Typography>
                                </Box>
                            </Box>
                        </Box>
                    </Box>
                ))}
            </UiCard>
        </Box>
    );
}
