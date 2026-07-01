import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import UiCard from "../shared/UiCard";
import { useMember } from "../../contexts/MemberContext";
import { usePolicy, useEndorsement } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

export default function EndorsementForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const { selectedMemberId, members } = useMember();
  const { getClaimablePolicies } = usePolicy();
  const { refreshEndorsements } = useEndorsement();
  const availablePolicies = getClaimablePolicies(selectedMemberId);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    policy: "",
    member: selectedMemberId === "all" ? "" : selectedMemberId,
    type: "address-change",
    description: "",
  });

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.policy || !formData.member || !formData.type) {
      setError("Please select a policy, member, and endorsement type.");
      return;
    }

    setSaving(true);
    setError(null);

    const selectedPolicy = availablePolicies.find((p) => p.id === formData.policy);
    const selectedMember = members.find((m) => m.id === formData.member);

    const typeLabelMap: Record<string, string> = {
      "add-member": "Add / Remove Member",
      "address-change": "Address Change",
      "name-correction": "Name Correction",
      "sum-insured-upgrade": "Sum Insured Upgrade",
      "nominee-change": "Nominee Change",
      other: "Other",
    };

    const newEndorsement = {
      policyId: formData.policy,
      policyName: selectedPolicy?.name || "Insurance Policy",
      memberId: formData.member,
      memberName: selectedMember?.name || "Family Member",
      type: typeLabelMap[formData.type] || formData.type,
      description: formData.description.trim() || undefined,
      requestedDateIso: new Date().toISOString().split("T")[0],
      status: "pending",
      timeline: [
        { label: "Request submitted", state: "done" },
        { label: "Under review by insurer", state: "current" },
        { label: "Completed", state: "pending" }
      ],
    };

    try {
      await api.createEndorsement(newEndorsement);
      await refreshEndorsements();
      onSubmit();
    } catch (err: any) {
      console.error("Failed to submit endorsement request:", err);
      setError(err.message || "Failed to submit request. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UiCard sx={{ mb: 2 }} component="form" onSubmit={handleFormSubmit}>
      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "text.primary",
          mb: 1.75,
          pb: 1.25,
          borderBottom: "1px solid",
          borderColor: "border.main",
        }}
      >
        New Endorsement Request
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>
          {error}
        </Alert>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          mb: 1.5,
        }}
      >
        {/* Policy Select */}
        <FormControl fullWidth size="small" required>
          <InputLabel
            sx={{
              fontSize: 11,
              fontWeight: 600,
              "&.MuiInputLabel-shrink": { fontSize: 14 },
            }}
          >
            Policy
          </InputLabel>
          <Select
            value={formData.policy}
            label="Policy"
            disabled={saving}
            onChange={(e) =>
              setFormData({ ...formData, policy: e.target.value })
            }
            sx={{ fontSize: 14 }}
          >
            {availablePolicies.map((p) => (
              <MenuItem key={p.id} value={p.id} sx={{ fontSize: 14 }}>
                {p.name} — {p.policyNumber}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Member Select */}
        <FormControl fullWidth size="small" required>
          <InputLabel
            sx={{
              fontSize: 11,
              fontWeight: 600,
              "&.MuiInputLabel-shrink": { fontSize: 14 },
            }}
          >
            Member
          </InputLabel>
          <Select
            value={formData.member}
            label="Member"
            disabled={saving}
            onChange={(e) =>
              setFormData({ ...formData, member: e.target.value })
            }
            sx={{ fontSize: 14 }}
          >
            {members
              .filter((m) => m.id !== "all")
              .map((m) => (
                <MenuItem key={m.id} value={m.id} sx={{ fontSize: 14 }}>
                  {m.name}
                </MenuItem>
              ))}
          </Select>
        </FormControl>

        {/* Endorsement Type Select */}
        <FormControl fullWidth size="small" required>
          <InputLabel
            sx={{
              fontSize: 11,
              fontWeight: 600,
              "&.MuiInputLabel-shrink": { fontSize: 14 },
            }}
          >
            Endorsement Type
          </InputLabel>
          <Select
            value={formData.type}
            label="Endorsement Type"
            disabled={saving}
            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            sx={{ fontSize: 14 }}
          >
            <MenuItem value="add-member">Add / Remove Member</MenuItem>
            <MenuItem value="address-change">Address Change</MenuItem>
            <MenuItem value="name-correction">Name Correction</MenuItem>
            <MenuItem value="sum-insured-upgrade">Sum Insured Upgrade</MenuItem>
            <MenuItem value="nominee-change">Nominee Change</MenuItem>
            <MenuItem value="other">Other</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        size="small"
        label="Details"
        required
        placeholder="Describe the endorsement you need..."
        disabled={saving}
        value={formData.description}
        onChange={(e) =>
          setFormData({ ...formData, description: e.target.value })
        }
        sx={{ mb: 1.5 }}
        slotProps={{
          inputLabel: {
            sx: {
              fontSize: 11,
              fontWeight: 600,
              "&.MuiInputLabel-shrink": { fontSize: 14 },
            },
          },
          input: { style: { fontSize: 14 } },
        }}
      />

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
          flexWrap: "wrap",
          alignItems: "center",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={onCancel}
          disabled={saving}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: "none",
            minHeight: 36,
            px: 1.75,
            py: 1,
            borderColor: "border.light",
            color: "text.secondary",
            "&:hover": {
              borderColor: "border.light",
              bgcolor: "surface.secondary",
            },
          }}
        >
          Cancel
        </Button>
        <Button
          size="small"
          variant="contained"
          type="submit"
          disabled={saving}
          startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
          sx={{
            fontSize: 12,
            fontWeight: 500,
            textTransform: "none",
            minHeight: 36,
            px: 1.75,
            py: 1,
            bgcolor: "info.light",
            color: "info.main",
            boxShadow: "none",
            border: "1px solid #B5D4F4",
            "&:hover": {
              bgcolor: "info.light",
              opacity: 0.9,
              boxShadow: "none",
            },
          }}
        >
          {saving ? "Submitting..." : "Submit Request"}
        </Button>
      </Box>
    </UiCard>
  );
}
