import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import UiCard from "../shared/UiCard";
import { useMember } from "../../contexts/MemberContext";
import { useRequirement } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

const INSURANCE_TYPES = [
  "Health Insurance",
  "Motor Insurance",
  "Term Life Insurance",
  "Home Insurance",
  "Travel Insurance",
  "Group / Employee Benefits",
];

export default function RequirementForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const { members, selectedMemberId } = useMember();
  const { refreshRequirements } = useRequirement();

  const [type, setType] = useState(INSURANCE_TYPES[0]);
  const [memberId, setMemberId] = useState(
    selectedMemberId === "all" ? (members.filter((m) => m.id !== "all")[0]?.id || "") : selectedMemberId
  );
  const [coverage, setCoverage] = useState("");
  const [budget, setBudget] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !memberId || !coverage) {
      setError("Please fill in category, member, and coverage.");
      return;
    }

    const covNum = parseFloat(coverage.replace(/,/g, ""));
    if (isNaN(covNum) || covNum <= 0) {
      setError("Coverage must be a valid positive number.");
      return;
    }

    setSaving(true);
    setError(null);

    const selectedMember = members.find((m) => m.id === memberId);
    const memberName = memberId === "all" ? "Entire Family" : (selectedMember?.name || "Family Member");
    const budgetNum = budget.trim() ? parseFloat(budget.replace(/,/g, "")) : undefined;

    const newRequirement = {
      type,
      member: memberName,
      memberId: memberId,
      coverage: covNum,
      budget: budgetNum,
      notes: notes.trim() || undefined,
      advisor: "Arjun Mehta",
      status: "new",
      dateIso: new Date().toISOString().split("T")[0],
    };

    try {
      await api.createRequirement(newRequirement);
      await refreshRequirements();
      onCancel();
    } catch (err: any) {
      console.error("Failed to create requirement:", err);
      setError(err.message || "Failed to submit requirement. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UiCard component="form" onSubmit={handleSubmit}>
      <Typography
        sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: "text.primary" }}
      >
        Create New Requirement
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, fontSize: 12, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          select
          label="Insurance Category"
          size="small"
          required
          disabled={saving}
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          {INSURANCE_TYPES.map((t) => (
            <MenuItem key={t} value={t}>
              {t}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          select
          label="For Member"
          size="small"
          required
          disabled={saving}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          <MenuItem value="all">Entire Family (Group)</MenuItem>
          {members
            .filter((m) => m.id !== "all")
            .map((m) => (
              <MenuItem key={m.id} value={m.id}>
                {m.name}
              </MenuItem>
            ))}
        </TextField>

        <TextField
          label="Coverage Required (₹)"
          size="small"
          required
          disabled={saving}
          placeholder="e.g. 50,00,000"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Annual Budget (₹)"
          size="small"
          disabled={saving}
          placeholder="e.g. 15,000 per year"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Additional Notes"
          size="small"
          multiline
          rows={3}
          disabled={saving}
          placeholder="Specific requirements, health conditions, add-ons needed..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ flex: 1, borderRadius: 2, textTransform: "none" }}
          >
            {saving ? "Submitting..." : "Submit Requirement"}
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            disabled={saving}
            onClick={onCancel}
            sx={{ flex: 1, borderRadius: 2, borderColor: "border.main", color: "text.secondary", textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </UiCard>
  );
}
