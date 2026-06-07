import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { Plus, Pencil } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";
import EndorsementsTable from "../components/endorsements/EndorsementsTable";
import { useMember } from "../contexts/MemberContext";
import { useEndorsement } from "../contexts/EndorsementContext";
import { usePolicy } from "../contexts/PolicyContext";

export default function EndorsementsPage() {
  const { selectedMemberId, members } = useMember();
  const { getEndorsementsByMember } = useEndorsement();
  const { getClaimablePolicies } = usePolicy();
  const [showForm, setShowForm] = useState(false);

  const availablePolicies = getClaimablePolicies(selectedMemberId);

  const [formData, setFormData] = useState({
    policy: "",
    member: "",
    type: "",
    description: "",
  });

  const endorsements = getEndorsementsByMember(selectedMemberId);

  const handleSubmit = () => {
    console.log("Submitting endorsement:", formData);
    setShowForm(false);
    setFormData({
      policy: "",
      member: "",
      type: "",
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
              title="Endorsements"
              content="View and request policy endorsements."
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
            Request Endorsement
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
              New Endorsement Request
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
                  Member
                </InputLabel>
                <Select
                  value={formData.member}
                  label="Member"
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
                  Endorsement Type
                </InputLabel>
                <Select
                  value={formData.type}
                  label="Endorsement Type"
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  sx={{ fontSize: 14 }}
                >
                  <MenuItem value="add-member" sx={{ fontSize: 14 }}>
                    Add / Remove Member
                  </MenuItem>
                  <MenuItem value="address-change" sx={{ fontSize: 14 }}>
                    Address Change
                  </MenuItem>
                  <MenuItem value="name-correction" sx={{ fontSize: 14 }}>
                    Name Correction
                  </MenuItem>
                  <MenuItem value="sum-insured-upgrade" sx={{ fontSize: 14 }}>
                    Sum Insured Upgrade
                  </MenuItem>
                  <MenuItem value="nominee-change" sx={{ fontSize: 14 }}>
                    Nominee Change
                  </MenuItem>
                  <MenuItem value="other" sx={{ fontSize: 14 }}>
                    Other
                  </MenuItem>
                </Select>
              </FormControl>
            </Box>

            <TextField
              fullWidth
              multiline
              rows={3}
              size="small"
              label="Details"
              placeholder="Describe the endorsement you need..."
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
                Submit Request
              </Button>
            </Box>
          </Box>
        )}

        {endorsements.length > 0 ? (
          <EndorsementsTable endorsements={endorsements} />
        ) : (
          <Box sx={{ textAlign: "center", py: 8 }}>
            <Typography sx={{ fontSize: 44, mb: 1.5, opacity: 0.55 }}>
              <Pencil size={44} />
            </Typography>
            <Typography
              sx={{
                fontSize: 15,
                fontWeight: 600,
                color: "text.primary",
                mb: 0.75,
              }}
            >
              No endorsements found
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
              You haven't requested any endorsements for this member yet.
            </Typography>
          </Box>
        )}

      </Box>
    </AppLayout>
  );
}
