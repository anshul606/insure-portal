import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Paperclip } from "lucide-react";
import UiCard from "../shared/UiCard";
import { useMember } from "../../contexts/MemberContext";
import { usePolicy } from "../../contexts/InsuranceContext";

export default function ClaimForm({
  onCancel,
  onSubmit,
}: {
  onCancel: () => void;
  onSubmit: () => void;
}) {
  const { selectedMemberId, members } = useMember();
  const { getClaimablePolicies } = usePolicy();
  const availablePolicies = getClaimablePolicies(selectedMemberId);

  const [formData, setFormData] = useState({
    policy: "",
    member: "",
    claimType: "",
    amount: "",
    incidentDate: "",
    hospital: "",
    description: "",
  });

  return (
    <UiCard sx={{ mb: 2 }}>
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
        New Claim
      </Typography>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
          gap: 1.5,
          mb: 1.5,
        }}
      >
        {/* Policy Select */}
        <FormControl fullWidth size="small">
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
        <FormControl fullWidth size="small">
          <InputLabel
            sx={{
              fontSize: 11,
              fontWeight: 600,
              "&.MuiInputLabel-shrink": { fontSize: 14 },
            }}
          >
            Claim for
          </InputLabel>
          <Select
            value={formData.member}
            label="Claim for"
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

        {/* Claim Type Select */}
        <FormControl fullWidth size="small">
          <InputLabel
            sx={{
              fontSize: 11,
              fontWeight: 600,
              "&.MuiInputLabel-shrink": { fontSize: 14 },
            }}
          >
            Claim Type
          </InputLabel>
          <Select
            value={formData.claimType}
            label="Claim Type"
            onChange={(e) =>
              setFormData({ ...formData, claimType: e.target.value })
            }
            sx={{ fontSize: 14 }}
          >
            <MenuItem value="cashless">Hospitalisation — Cashless</MenuItem>
            <MenuItem value="reimbursement">
              Hospitalisation — Reimbursement
            </MenuItem>
            <MenuItem value="opd">OPD / Day Care</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          size="small"
          label="Claimed Amount (₹)"
          type="number"
          value={formData.amount}
          onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
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
        <TextField
          fullWidth
          size="small"
          label="Date of Incident"
          type="date"
          value={formData.incidentDate}
          onChange={(e) =>
            setFormData({ ...formData, incidentDate: e.target.value })
          }
          slotProps={{
            inputLabel: {
              shrink: true,
              sx: {
                fontSize: 11,
                fontWeight: 600,
                "&.MuiInputLabel-shrink": { fontSize: 14 },
              },
            },
            input: { style: { fontSize: 14 } },
          }}
        />
        <TextField
          fullWidth
          size="small"
          label="Hospital / Garage"
          placeholder="e.g. Apollo Hospital, Pune"
          value={formData.hospital}
          onChange={(e) =>
            setFormData({ ...formData, hospital: e.target.value })
          }
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
      </Box>

      <TextField
        fullWidth
        multiline
        rows={3}
        size="small"
        label="Description"
        placeholder="Brief description..."
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
          border: "1.5px dashed",
          borderColor: "border.light",
          borderRadius: 1.5,
          p: 2.75,
          textAlign: "center",
          cursor: "pointer",
          transition: "all 0.15s",
          bgcolor: "surface.secondary",
          mb: 1.5,
          "&:hover": { borderColor: "info.main", bgcolor: "info.light" },
        }}
      >
        <Box sx={{ fontSize: 20, mb: 0.75 }}>
          <Paperclip size={20} />
        </Box>
        <Typography
          sx={{
            fontSize: 13,
            fontWeight: 500,
            color: "text.secondary",
            mb: 0.375,
          }}
        >
          Tap to attach documents
        </Typography>
        <Typography sx={{ fontSize: 11, color: "text.disabled" }}>
          Bills, Discharge Summary, Prescriptions · Max 10MB each
        </Typography>
      </Box>

      <Box
        sx={{
          display: "flex",
          gap: 1,
          justifyContent: "flex-end",
          flexWrap: "wrap",
        }}
      >
        <Button
          size="small"
          variant="outlined"
          onClick={onCancel}
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
          onClick={onSubmit}
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
          Submit Claim
        </Button>
      </Box>
    </UiCard>
  );
}
