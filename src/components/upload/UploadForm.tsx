import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { Info, Paperclip } from "lucide-react";
import UiCard from "../shared/UiCard";
import { useMember } from "../../contexts/MemberContext";
import { usePolicy } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

const POLICY_TYPES = [
  "Health Insurance — Individual",
  "Health Insurance — Family Floater",
  "Motor Insurance — Car",
  "Motor Insurance — Two Wheeler",
  "Life Insurance — Term",
  "Home Insurance",
  "Travel Insurance"
];

const getCategoryFromType = (type: string): string => {
  const lower = type.toLowerCase();
  if (lower.includes("health")) return "health";
  if (lower.includes("motor")) return "motor";
  if (lower.includes("life")) return "life";
  if (lower.includes("home")) return "home";
  if (lower.includes("travel")) return "travel";
  return "health";
};

const getCoverageLabelFromType = (type: string): string => {
  const category = getCategoryFromType(type);
  if (category === "motor") return "IDV";
  if (category === "life") return "Sum Assured";
  return "Sum Insured";
};

export default function UploadForm() {
  const { members } = useMember();
  const { refreshPolicies } = usePolicy();

  const [memberId, setMemberId] = useState(
    members.filter((m) => m.id !== "all")[0]?.id || ""
  );
  const [insurer, setInsurer] = useState("");
  const [policyType, setPolicyType] = useState(POLICY_TYPES[0]);
  const [policyNumber, setPolicyNumber] = useState("");
  const [sumInsured, setSumInsured] = useState("");
  const [premiumAnnual, setPremiumAnnual] = useState("");
  const [startDateIso, setStartDateIso] = useState("");
  const [expiryDateIso, setExpiryDateIso] = useState("");
  const [notes, setNotes] = useState("");

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberId || !insurer || !policyType || !policyNumber || !expiryDateIso) {
      setError("Please fill in member, insurer, policy type, policy number, and expiry date.");
      return;
    }

    const parsedSumInsured = parseFloat(sumInsured.replace(/,/g, ""));
    const parsedPremium = parseFloat(premiumAnnual.replace(/,/g, ""));

    setSaving(true);
    setError(null);
    setSuccess(null);

    const newPolicy = {
      name: policyType,
      policyNumber: policyNumber.trim(),
      insurer: insurer.trim(),
      category: getCategoryFromType(policyType),
      isExternal: true,
      type: policyType,
      coverageLabel: getCoverageLabelFromType(policyType),
      sumInsured: isNaN(parsedSumInsured) ? 0 : parsedSumInsured,
      premiumAnnual: isNaN(parsedPremium) ? 0 : parsedPremium,
      memberIds: [memberId],
      status: "external",
      renewDateIso: expiryDateIso,
      renewLabel: "Expires:",
    };

    try {
      await api.createPolicy(newPolicy);
      await refreshPolicies();
      setSuccess("Policy uploaded successfully and added to your portfolio under review!");
      
      // Clear form
      setInsurer("");
      setPolicyNumber("");
      setSumInsured("");
      setPremiumAnnual("");
      setStartDateIso("");
      setExpiryDateIso("");
      setNotes("");
    } catch (err: any) {
      console.error("Failed to upload policy:", err);
      setError(err.message || "Failed to upload policy. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UiCard sx={{ mb: 3 }} component="form" onSubmit={handleSubmit}>
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

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, fontSize: 12, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 2.5, fontSize: 12, borderRadius: 2 }}>
          {success}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          select
          label="Policy Holder"
          size="small"
          required
          disabled={saving}
          value={memberId}
          onChange={(e) => setMemberId(e.target.value)}
        >
          {members
            .filter((m) => m.id !== "all")
            .map((m) => (
              <MenuItem key={m.id} value={m.id}>{m.name}</MenuItem>
            ))}
        </TextField>

        <TextField
          label="Insurance Company"
          size="small"
          required
          disabled={saving}
          placeholder="e.g. Star Health, ICICI Lombard..."
          value={insurer}
          onChange={(e) => setInsurer(e.target.value)}
        />

        <TextField
          select
          label="Policy Type"
          size="small"
          required
          disabled={saving}
          value={policyType}
          onChange={(e) => setPolicyType(e.target.value)}
        >
          {POLICY_TYPES.map((t) => (
            <MenuItem key={t} value={t}>{t}</MenuItem>
          ))}
        </TextField>

        <TextField
          label="Policy Number"
          size="small"
          required
          disabled={saving}
          placeholder="As on policy document"
          value={policyNumber}
          onChange={(e) => setPolicyNumber(e.target.value)}
        />

        <TextField
          label="Sum Insured (₹)"
          size="small"
          disabled={saving}
          placeholder="0"
          value={sumInsured}
          onChange={(e) => setSumInsured(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Annual Premium (₹)"
          size="small"
          disabled={saving}
          placeholder="0"
          value={premiumAnnual}
          onChange={(e) => setPremiumAnnual(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Policy Start Date (optional)"
          size="small"
          type="date"
          disabled={saving}
          value={startDateIso}
          onChange={(e) => setStartDateIso(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Expiry / Renewal Date"
          size="small"
          type="date"
          required
          disabled={saving}
          value={expiryDateIso}
          onChange={(e) => setExpiryDateIso(e.target.value)}
          slotProps={{ inputLabel: { shrink: true } }}
        />

        <TextField
          label="Notes (optional)"
          size="small"
          multiline
          rows={2}
          disabled={saving}
          placeholder="Any specific notes..."
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
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
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ borderRadius: 2 }}
          >
            {saving ? "Saving..." : "Save & Upload Policy"}
          </Button>
        </Box>
      </Box>
    </UiCard>
  );
}
