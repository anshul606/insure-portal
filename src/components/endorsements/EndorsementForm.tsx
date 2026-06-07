import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import UiCard from "../shared/UiCard";
import { useMember } from "../../contexts/MemberContext";
import { usePolicy } from "../../contexts/PolicyContext";

export default function EndorsementForm({ onCancel, onSubmit }: { onCancel: () => void, onSubmit: () => void }) {
    const { selectedMemberId, members } = useMember();
    const { getClaimablePolicies } = usePolicy();
    const availablePolicies = getClaimablePolicies(selectedMemberId);

    const [formData, setFormData] = useState({
        policy: "", member: "", type: "", description: "",
    });

    return (
        <UiCard sx={{ mb: 2 }}>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.primary", mb: 1.75, pb: 1.25, borderBottom: "1px solid", borderColor: "border.main" }}>
                New Endorsement Request
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" }, gap: 1.5, mb: 1.5 }}>
                <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: 11, fontWeight: 600, "&.MuiInputLabel-shrink": { fontSize: 14 } }}>Policy</InputLabel>
                    <Select value={formData.policy} label="Policy" onChange={(e) => setFormData({ ...formData, policy: e.target.value })} sx={{ fontSize: 14 }}>
                        {availablePolicies.map((p) => (<MenuItem key={p.id} value={p.id} sx={{ fontSize: 14 }}>{p.name} — {p.policyNumber}</MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: 11, fontWeight: 600, "&.MuiInputLabel-shrink": { fontSize: 14 } }}>Member</InputLabel>
                    <Select value={formData.member} label="Member" onChange={(e) => setFormData({ ...formData, member: e.target.value })} sx={{ fontSize: 14 }}>
                        {members.filter((m) => m.id !== "all").map((m) => (<MenuItem key={m.id} value={m.id} sx={{ fontSize: 14 }}>{m.name}</MenuItem>))}
                    </Select>
                </FormControl>

                <FormControl fullWidth size="small">
                    <InputLabel sx={{ fontSize: 11, fontWeight: 600, "&.MuiInputLabel-shrink": { fontSize: 14 } }}>Endorsement Type</InputLabel>
                    <Select value={formData.type} label="Endorsement Type" onChange={(e) => setFormData({ ...formData, type: e.target.value })} sx={{ fontSize: 14 }}>
                        <MenuItem value="add-member">Add / Remove Member</MenuItem>
                        <MenuItem value="address-change">Address Change</MenuItem>
                        <MenuItem value="name-correction">Name Correction</MenuItem>
                        <MenuItem value="sum-insured-upgrade">Sum Insured Upgrade</MenuItem>
                        <MenuItem value="nominee-change">Nominee Change</MenuItem>
                        <MenuItem value="other">Other</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TextField fullWidth multiline rows={3} size="small" label="Details" placeholder="Describe the endorsement you need..." value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} sx={{ mb: 1.5 }} slotProps={{ inputLabel: { sx: { fontSize: 11, fontWeight: 600, "&.MuiInputLabel-shrink": { fontSize: 14 } } }, input: { style: { fontSize: 14 } } }} />

            <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end", flexWrap: "wrap" }}>
                <Button size="small" variant="outlined" onClick={onCancel} sx={{ fontSize: 12, fontWeight: 500, textTransform: "none", minHeight: 36, px: 1.75, py: 1, borderColor: "border.light", color: "text.secondary", "&:hover": { borderColor: "border.light", bgcolor: "surface.secondary" } }}>Cancel</Button>
                <Button size="small" variant="contained" onClick={onSubmit} sx={{ fontSize: 12, fontWeight: 500, textTransform: "none", minHeight: 36, px: 1.75, py: 1, bgcolor: "info.light", color: "info.main", boxShadow: "none", border: "1px solid #B5D4F4", "&:hover": { bgcolor: "info.light", opacity: 0.9, boxShadow: "none" } }}>Submit Request</Button>
            </Box>
        </UiCard>
    );
}
