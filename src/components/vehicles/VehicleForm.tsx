import { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

import { useMember } from "../../contexts/MemberContext";
import { useVehicle } from "../../contexts/InsuranceContext";
import { api } from "../../services/api";

export default function VehicleForm({ onCancel }: { onCancel: () => void }) {
  const { members } = useMember();
  const { refreshVehicles } = useVehicle();

  const [makeModel, setMakeModel] = useState("");
  const [regNumber, setRegNumber] = useState("");
  const [ownerId, setOwnerId] = useState(members[0]?.id || "");
  const [vehicleType, setVehicleType] = useState("car");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!makeModel.trim()) {
      setError("Make & Model is required.");
      return;
    }
    if (!regNumber.trim()) {
      setError("Registration number is required.");
      return;
    }

    setSaving(true);
    setError(null);

    const owner = members.find(m => m.id === ownerId);

    const newVehicle = {
      makeModel: makeModel.trim(),
      registrationNumber: regNumber.trim().toUpperCase(),
      ownerId,
      ownerName: owner?.name || "Family Member",
      vehicleType,
      status: "insured",
      idv: 500000,
      idvDisplay: "₹5,00,000",
      renewDateIso: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      renewDateDisplay: "1 year from now",
      hasDocument: false
    };

    try {
      await api.createVehicle(newVehicle);
      await refreshVehicles();
      onCancel();
    } catch (err: any) {
      console.error("Failed to add vehicle:", err);
      setError(err.message || "Failed to add vehicle. Please try again.");
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
          Add New Vehicle
        </Typography>
        <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>
          Enter the vehicle's registration and make details to link it to your family group.
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2.5, fontSize: 12, borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ display: "flex", flexDirection: "column", gap: 2.5 }}>
        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            label="Make & Model"
            placeholder="e.g. Honda City ZX"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={makeModel}
            onChange={(e) => setMakeModel(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          />
          <TextField
            label="Registration Number"
            placeholder="e.g. MH-12-AB-1234"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={regNumber}
            onChange={(e) => setRegNumber(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light", fontFamily: "monospace" },
              },
            }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 2, flexDirection: { xs: "column", sm: "row" } }}>
          <TextField
            select
            label="Owner (Family Member)"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={ownerId}
            onChange={(e) => setOwnerId(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            {members.map((m) => (
              <MenuItem key={m.id} value={m.id} sx={{ fontSize: 14 }}>
                {m.name}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Vehicle Type"
            fullWidth
            size="small"
            required
            disabled={saving}
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            slotProps={{
              inputLabel: { shrink: true },
              input: {
                sx: { fontSize: 14, borderRadius: 2, bgcolor: "surface.light" },
              },
            }}
          >
            <MenuItem value="car" sx={{ fontSize: 14 }}>Car</MenuItem>
            <MenuItem value="two-wheeler" sx={{ fontSize: 14 }}>Two Wheeler</MenuItem>
          </TextField>
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
            {saving ? "Saving..." : "Save Vehicle"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
