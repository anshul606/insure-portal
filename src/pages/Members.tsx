import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Plus } from "lucide-react";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import MembersList from "../components/members/MembersList";
import MemberForm from "../components/members/MemberForm";
import { useMember } from "../contexts/MemberContext";

export default function MembersPage() {
  const [showForm, setShowForm] = useState(false);
  const { members } = useMember();
  // Derive a group label: use the first member's name or a sensible fallback
  const groupLabel = members.length > 0
    ? `${members[0].name.split(" ").slice(-1)[0]} Family Group`
    : "Family Group";

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 }, overflow: "hidden" }}>
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
              title="Family Members"
              content={`Members under the ${groupLabel}.`}
              hideMemberSelector
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
            Add Member
          </Button>
        </Box>

        <Box sx={{ mt: 3, width: "100%" }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: "text.primary" }}>
                B2C — {groupLabel}
              </Typography>
              <Chip
                label="Family"
                size="small"
                sx={{
                  bgcolor: "info.light",
                  color: "info.main",
                  fontWeight: 600,
                  fontSize: 10,
                  height: 20,
                }}
              />
            </Box>
          </Box>

          {showForm ? (
            <Box sx={{ maxWidth: 800, mb: 4 }}>
              <MemberForm onCancel={() => setShowForm(false)} />
            </Box>
          ) : null}

          <MembersList />
        </Box>
      </Box>
    </AppLayout>
  );
}
