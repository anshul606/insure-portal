import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import UiCard from "../shared/UiCard";
import { usePolicy } from "../../contexts/InsuranceContext";

const CATEGORIES = [
    "Claim assistance",
    "Policy document needed",
    "Premium receipt / Tax certificate",
    "Cashless pre-authorisation",
    "Policy correction",
    "General query"
];

const PRIORITIES = [
    { value: "Normal", label: "Normal" },
    { value: "High", label: "High — Urgent" }
];

export default function TicketForm({ onCancel }: { onCancel: () => void }) {
    const { policies } = usePolicy();
    const [policyId, setPolicyId] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [priority, setPriority] = useState("Normal");
    const [subject, setSubject] = useState("");
    const [description, setDescription] = useState("");

    return (
        <UiCard>
            <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: "text.primary" }}>
                New Support Ticket
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <TextField
                    select
                    label="Related Policy (optional)"
                    size="small"
                    value={policyId}
                    onChange={(e) => setPolicyId(e.target.value)}
                >
                    <MenuItem value="">-- None --</MenuItem>
                    {policies.map((p) => (
                        <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Category"
                    size="small"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                >
                    {CATEGORIES.map((c) => (
                        <MenuItem key={c} value={c}>{c}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    select
                    label="Priority"
                    size="small"
                    value={priority}
                    onChange={(e) => setPriority(e.target.value)}
                >
                    {PRIORITIES.map((p) => (
                        <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                    ))}
                </TextField>

                <TextField
                    label="Subject"
                    size="small"
                    placeholder="Brief subject line"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                />

                <TextField
                    label="Description"
                    size="small"
                    multiline
                    rows={4}
                    placeholder="Describe your issue in detail..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            alert("Ticket raised. Your advisor will respond within 4 hours.");
                            onCancel();
                        }}
                        sx={{ flex: 1, borderRadius: 2 }}
                    >
                        Submit Ticket
                    </Button>
                    <Button
                        variant="outlined"
                        color="secondary"
                        onClick={onCancel}
                        sx={{ flex: 1, borderRadius: 2, borderColor: "border.main" }}
                    >
                        Cancel
                    </Button>
                </Box>
            </Box>
        </UiCard>
    );
}
