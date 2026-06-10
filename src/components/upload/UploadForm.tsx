import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import { Info, Paperclip } from "lucide-react";
import UiCard from "../shared/UiCard";

const MEMBER_OPTIONS = [
    "Rajesh Sharma",
    "Priya Sharma",
    "Aarav Sharma"
];

const POLICY_TYPES = [
    "Health Insurance — Individual",
    "Health Insurance — Family Floater",
    "Motor Insurance — Car",
    "Motor Insurance — Two Wheeler",
    "Life Insurance — Term",
    "Home Insurance",
    "Travel Insurance"
];

export default function UploadForm() {
    return (
        <UiCard sx={{ mb: 3 }}>
            <Box sx={{ display: "flex", gap: 1.5, p: 2, mb: 2, bgcolor: "#EBF3FC", borderRadius: 2, color: "#1456A0" }}>
                <Info size={20} />
                <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 0.5 }}>
                        How this works
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                        Your advisor will review the uploaded policy and reach out before the renewal date with competitive quotes.
                    </Typography>
                </Box>
            </Box>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    select
                    label="Policy Holder"
                    size="small"
                    defaultValue={MEMBER_OPTIONS[0]}
                >
                    {MEMBER_OPTIONS.map((m) => (
                        <MenuItem key={m} value={m}>{m}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Insurance Company"
                    size="small"
                    placeholder="e.g. Star Health, ICICI Lombard..."
                />

                <TextField
                    select
                    label="Policy Type"
                    size="small"
                    defaultValue={POLICY_TYPES[0]}
                >
                    {POLICY_TYPES.map((t) => (
                        <MenuItem key={t} value={t}>{t}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Policy Number"
                    size="small"
                    placeholder="As on policy document"
                />

                <TextField
                    label="Sum Insured (₹)"
                    size="small"
                    placeholder="0"
                    inputMode="numeric"
                />

                <TextField
                    label="Annual Premium (₹)"
                    size="small"
                    placeholder="0"
                    inputMode="numeric"
                />

                <TextField
                    label="Policy Start Date"
                    size="small"
                    type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    label="Expiry / Renewal Date"
                    size="small"
                    type="date"
                    slotProps={{ inputLabel: { shrink: true } }}
                />

                <TextField
                    label="Notes (optional)"
                    size="small"
                    multiline
                    rows={2}
                    placeholder="Any specific notes..."
                />

                <Box
                    sx={{
                        border: "1px dashed",
                        borderColor: "border.main",
                        borderRadius: 2,
                        p: 3,
                        textAlign: "center",
                        cursor: "pointer",
                        bgcolor: "surface.secondary",
                        "&:hover": { bgcolor: "rgba(20,86,160,0.02)" }
                    }}
                    onClick={() => document.getElementById("pol-file")?.click()}
                >
                    <Paperclip size={24} style={{ marginBottom: 8, color: "var(--mui-palette-text-secondary)" }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 500, color: "text.primary", mb: 0.5 }}>
                        Upload Policy Document
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
                        PDF, JPG, PNG · Max 10 MB
                    </Typography>
                    <input type="file" id="pol-file" accept=".pdf,.jpg,.jpeg,.png" style={{ display: "none" }} />
                </Box>

                <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}>
                    <Button
                        variant="contained"
                        onClick={() => alert("Policy uploaded. Your advisor will review and add it to your portfolio.")}
                        sx={{ borderRadius: 2 }}
                    >
                        Save & Upload Policy
                    </Button>
                </Box>
            </Box>
        </UiCard>
    );
}
