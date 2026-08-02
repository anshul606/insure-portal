import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import { api } from "../../services/api";
import { useMember } from "../../contexts/MemberContext";

export default function MemberForm({ onCancel }: { onCancel: () => void }) {
  const { refreshMembers } = useMember();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState("Spouse");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("Male");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [pan, setPan] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [address, setAddress] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !dob) {
      setError("Name and Date of Birth are required.");
      return;
    }

    setSaving(true);
    setError(null);

    const initials = name
      .trim()
      .split(/\s+/)
      .map((part) => part.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);

    const birthYear = new Date(dob).getFullYear();
    const currentYear = new Date().getFullYear();
    const isMinor = currentYear - birthYear < 18;

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
    const today = new Date();
    const since = `${monthNames[today.getMonth()]} ${today.getFullYear()}`;

    const defaultKyc = [
      { label: "Aadhaar Card", status: aadhaar ? "verified" : "not-added" },
      { label: "PAN Card", status: pan ? "verified" : "not-added" },
      { label: "Photograph", status: "pending" }
    ];

    const newMember = {
      name: name.trim(),
      relationship,
      initials,
      since,
      gender,
      isMinor,
      profile: {
        mobile: mobile.trim() || undefined,
        email: email.trim() || undefined,
        dobIso: dob,
        pan: pan.trim().toUpperCase() || undefined,
        aadhaar: aadhaar.trim() || undefined,
        address: address.trim() || undefined,
      },
      kyc: defaultKyc,
    };

    try {
      await api.createMember(newMember);
      await refreshMembers();
      onCancel();
    } catch (err: any) {
      console.error("Failed to add member:", err);
      setError(err.message || "Failed to save member. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        bgcolor: "background.paper",
        p: { xs: 2.5, md: 3 },
        borderRadius: { xs: 3, md: 4 },
        border: "1px solid",
        borderColor: "border.main",
      }}
    >
      <Box sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: 18, fontWeight: 600, color: "text.primary" }}>
          Add Family Member
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          Enter the personal and KYC details for the new member.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3, fontSize: 13 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Full Name"
            placeholder="e.g. Rajesh Sharma"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={name}
            onChange={(e) => setName(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
          <TextField
            select
            label="Relationship"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={relationship}
            onChange={(e) => setRelationship(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {["Spouse", "Son", "Daughter", "Father", "Mother", "Other"].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Date of Birth"
            type="date"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
          <TextField
            select
            label="Gender"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {["Male", "Female", "Other"].map((opt) => (
              <MenuItem key={opt} value={opt} sx={{ fontSize: 14 }}>
                {opt}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Mobile Number"
            placeholder="e.g. +91 98765 43210"
            fullWidth
            size="small"
            disabled={saving}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
          <TextField
            label="Email Address"
            placeholder="e.g. member@email.com"
            fullWidth
            size="small"
            disabled={saving}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="PAN Number"
            placeholder="e.g. ABCDE1234F"
            fullWidth
            size="small"
            disabled={saving}
            value={pan}
            onChange={(e) => setPan(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light", fontFamily: "DM Mono, monospace" },
              },
            }}
          />
          <TextField
            label="Aadhaar Number"
            placeholder="e.g. 1234 5678 9012"
            fullWidth
            size="small"
            disabled={saving}
            value={aadhaar}
            onChange={(e) => setAadhaar(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light", fontFamily: "DM Mono, monospace" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: "column" }}>
          <TextField
            label="Address"
            placeholder="e.g. Flat 4B, Sunrise Apts, Baner Road, Pune — 411045"
            fullWidth
            size="small"
            multiline
            rows={2}
            disabled={saving}
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            justifyContent: "flex-end",
            mt: 2,
            pt: 2.5,
            borderTop: "1px solid",
            borderColor: "border.main",
          }}
        >
          <Button
            variant="outlined"
            onClick={onCancel}
            disabled={saving}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              px: 3,
              color: "text.secondary",
              borderColor: "border.main",
            }}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={saving}
            startIcon={saving ? <CircularProgress size={14} color="inherit" /> : null}
            sx={{ textTransform: "none", borderRadius: 2, px: 3 }}
          >
            {saving ? "Saving..." : "Save Member"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
