import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { Plus, Pencil } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";
import EndorsementsTable from "../components/endorsements/EndorsementsTable";
import EndorsementForm from "../components/endorsements/EndorsementForm";
import { useMember } from "../contexts/MemberContext";
import { useEndorsement } from "../contexts/InsuranceContext";
import TableSkeleton from "../components/shared/TableSkeleton";

export default function EndorsementsPage() {
  const { selectedMemberId } = useMember();
  const { getEndorsementsByMember, loading } = useEndorsement();
  const [showForm, setShowForm] = useState(false);

  const endorsements = getEndorsementsByMember(selectedMemberId);

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
          <EndorsementForm
            onCancel={() => setShowForm(false)}
            onSubmit={() => setShowForm(false)}
          />
        )}

        {loading ? (
          <TableSkeleton />
        ) : endorsements.length > 0 ? (
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
