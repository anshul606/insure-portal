import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Plus, Paperclip, ClipboardList } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";
import ClaimCard from "../components/claims/ClaimCard";
import { useMember } from "../contexts/MemberContext";
import { useClaim } from "../contexts/ClaimContext";
import { usePolicy } from "../contexts/PolicyContext";

export default function ClaimsPage() {
  const { selectedMemberId, members } = useMember();
  const { getClaimsByMember } = useClaim();
  const [showForm, setShowForm] = useState(false);

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

  const claims = getClaimsByMember(selectedMemberId);

  const handleSubmit = () => {
    console.log("Submitting claim:", formData);
    setShowForm(false);
    setFormData({
      policy: "",
      member: "",
      claimType: "",
      amount: "",
      incidentDate: "",
      hospital: "",
      description: "",
    });
  };

  return (
    <AppLayout>
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "flex-start" },
            justifyContent: "space-between",
            mb: 2,
            gap: 1,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
            <Welcome
              title="Claims"
              content="Track existing claims or raise a new one."
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<Plus size={14} />}
            onClick={() => setShowForm(!showForm)}
            sx={{
              fontSize: 11,
              fontWeight: 500,
              textTransform: "none",
              minHeight: 32,
              px: 1.375,
              py: 0.75,
              bgcolor: "info.light",
              color: "info.main",
              boxShadow: "none",
              border: "1px solid #B5D4F4",
              flexShrink: 0,
              "&:hover": {
                bgcolor: "info.light",
                opacity: 0.9,
                boxShadow: "none",
              },
            }}
          >
            Raise New Claim
          </Button>
        </Box>

        {showForm && (
          <Box
            sx={{
              bgcolor: "background.paper",
              border: "1px solid",
              borderColor: "border.main",
              borderRadius: 1.5,
              p: 2,
              mb: 2,
            }}
          >
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
              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: 14,
                    },
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
                  {availablePolicies.map((policy) => (
                    <MenuItem
                      key={policy.id}
                      value={policy.id}
                      sx={{ fontSize: 14 }}
                    >
                      {policy.name} — {policy.policyNumber}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: 14,
                    },
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
                    .map((member) => (
                      <MenuItem
                        key={member.id}
                        value={member.id}
                        sx={{ fontSize: 14 }}
                      >
                        {member.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel
                  sx={{
                    fontSize: 11,
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: 14,
                    },
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
                  <MenuItem
                    value="hospitalisation-cashless"
                    sx={{ fontSize: 14 }}
                  >
                    Hospitalisation — Cashless
                  </MenuItem>
                  <MenuItem
                    value="hospitalisation-reimbursement"
                    sx={{ fontSize: 14 }}
                  >
                    Hospitalisation — Reimbursement
                  </MenuItem>
                  <MenuItem value="opd" sx={{ fontSize: 14 }}>
                    OPD / Day Care
                  </MenuItem>
                  <MenuItem value="accident" sx={{ fontSize: 14 }}>
                    Accident / Emergency
                  </MenuItem>
                </Select>
              </FormControl>

              <TextField
                fullWidth
                size="small"
                label="Claimed Amount (₹)"
                type="number"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                slotProps={{
                  inputLabel: {
                    sx: {
                      fontSize: 11,
                      fontWeight: 600,
                      "&.MuiInputLabel-shrink": {
                        fontSize: 14,
                      },
                    },
                  },
                  input: {
                    style: { fontSize: 14 },
                  },
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
                      "&.MuiInputLabel-shrink": {
                        fontSize: 14,
                      },
                    },
                  },
                  input: {
                    style: { fontSize: 14 },
                  },
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
                      "&.MuiInputLabel-shrink": {
                        fontSize: 14,
                      },
                    },
                  },
                  input: {
                    style: { fontSize: 14 },
                  },
                }}
              />
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Description"
              placeholder="Brief description of the claim..."
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              slotProps={{
                inputLabel: {
                  sx: {
                    fontSize: 11,
                    fontWeight: 600,
                    "&.MuiInputLabel-shrink": {
                      fontSize: 14,
                    },
                  },
                },
                input: {
                  style: { fontSize: 14 },
                },
              }}
              sx={{ mb: 1.5 }}
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
                "&:hover": {
                  borderColor: "info.main",
                  bgcolor: "info.light",
                },
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
              <Typography
                sx={{
                  fontSize: 11,
                  color: "text.disabled",
                }}
              >
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
                onClick={() => setShowForm(false)}
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
                onClick={handleSubmit}
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
          </Box>
        )}

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
            gap: 1.25,
          }}
        >
          {claims.map((claim) => (
            <ClaimCard
              key={claim.id}
              claim={claim}
              onClick={() => {
                console.log("Open claim detail:", claim.id);
              }}
            />
          ))}
        </Box>

        {claims.length === 0 && (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
            }}
          >
            <Typography
              sx={{
                fontSize: 44,
                mb: 1.5,
                opacity: 0.55,
              }}
            >
              <ClipboardList size={44} />
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "text.primary",
                mb: 0.75,
              }}
            >
              No claims found
            </Typography>
            <Typography
              sx={{
                fontSize: 12,
                color: "text.disabled",
                lineHeight: 1.5,
                maxWidth: 260,
                mx: "auto",
              }}
            >
              You haven't filed any claims yet for this member.
            </Typography>
          </Box>
        )}
      </Box>
    </AppLayout>
  );
}
