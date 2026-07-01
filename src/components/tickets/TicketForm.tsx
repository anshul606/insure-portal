import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import UiCard from "../shared/UiCard";
import { usePolicy, useTicket } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

const CATEGORIES = [
  "Claim assistance",
  "Policy document needed",
  "Premium receipt / Tax certificate",
  "Cashless pre-authorisation",
  "Policy correction",
  "General query"
];

const PRIORITIES = [
  { value: "normal", label: "Normal" },
  { value: "high", label: "High — Urgent" }
];

export default function TicketForm({ onCancel }: { onCancel: () => void }) {
  const { policies } = usePolicy();
  const { refreshTickets } = useTicket();
  
  const [policyId, setPolicyId] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [priority, setPriority] = useState("normal");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim()) {
      setError("Subject is required.");
      return;
    }
    if (!description.trim()) {
      setError("Description is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const selectedPolicy = policies.find((p) => p.id === policyId);

    const newTicket = {
      subject: subject.trim(),
      policyId: policyId || undefined,
      relatedPolicy: selectedPolicy?.name || undefined,
      category,
      priority,
      status: "open",
      thread: [
        {
          from: "You",
          fromRole: "customer",
          timeDisplay: "Just now",
          message: description.trim()
        }
      ]
    };

    try {
      await api.createTicket(newTicket);
      await refreshTickets();
      onCancel();
    } catch (err: any) {
      console.error("Failed to create ticket:", err);
      setError(err.message || "Failed to create support ticket. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <UiCard component="form" onSubmit={handleSubmit}>
      <Typography sx={{ fontSize: 16, fontWeight: 600, mb: 2, color: "text.primary" }}>
        New Support Ticket
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2, fontSize: 12 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField
          select
          label="Related Policy (optional)"
          size="small"
          disabled={saving}
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
          disabled={saving}
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
          disabled={saving}
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
          required
          disabled={saving}
          placeholder="Brief subject line"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        />

        <TextField
          label="Description"
          size="small"
          multiline
          required
          rows={4}
          disabled={saving}
          placeholder="Describe your issue in detail..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <Box sx={{ display: "flex", gap: 1.5, mt: 1 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ flex: 1, borderRadius: 2, textTransform: "none" }}
          >
            {saving ? "Submitting..." : "Submit Ticket"}
          </Button>
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={saving}
            sx={{ flex: 1, borderRadius: 2, borderColor: "border.main", color: "text.secondary", textTransform: "none" }}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </UiCard>
  );
}
