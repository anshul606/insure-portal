import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import UiCard from "../shared/UiCard";

const INSURANCE_TYPES = [
  "Health Insurance",
  "Motor Insurance",
  "Term Life Insurance",
  "Home Insurance",
  "Travel Insurance",
  "Group / Employee Benefits",
];

const MEMBER_OPTIONS = [
  "Rajesh Sharma",
  "Priya Sharma",
  "Aarav Sharma",
  "Entire Family",
];

export default function RequirementForm({
  onCancel,
}: {
  onCancel: () => void;
}) {
  const [type, setType] = useState("");
  const [member, setMember] = useState("");
  const [coverage, setCoverage] = useState("");
  const [budget, setBudget] = useState("");

  return (
    <UiCard>
      <Typography
        sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: "text.primary" }}
      >
        Create New Requirement
      </Typography>

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          select
          label="Insurance Category"
          size="small"
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
          value={member}
          onChange={(e) => setMember(e.target.value)}
        >
          {MEMBER_OPTIONS.map((m) => (
            <MenuItem key={m} value={m}>
              {m}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Coverage Required (₹)"
          size="small"
          placeholder="e.g. 50,00,000"
          value={coverage}
          onChange={(e) => setCoverage(e.target.value)}
          inputMode="numeric"
        />

        <TextField
          label="Annual Budget (₹)"
          size="small"
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
          placeholder="Specific requirements, health conditions, add-ons needed..."
        />

        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              alert(
                "Requirement submitted. Your advisor Arjun Mehta will share quotes within 24 hours.",
              );
              onCancel();
            }}
            sx={{ flex: 1, borderRadius: 2 }}
          >
            Submit Requirement
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
