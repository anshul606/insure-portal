import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";
import PolicyGrid from "../components/policies/PolicyGrid";
import { useMember } from "../contexts/MemberContext";
import { usePolicy } from "../contexts/PolicyContext";

export default function PoliciesPage() {
  const { selectedMemberId } = useMember();
  const { getPoliciesByMember } = usePolicy();

  const policies = getPoliciesByMember(selectedMemberId);

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
              title="Policies"
              content="All active and archived policies across your family group."
            />
          </Box>

          <Button
            size="small"
            variant="contained"
            startIcon={<Plus size={14} />}
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
            Upload External
          </Button>
        </Box>

        <PolicyGrid policies={policies} />
      </Box>
    </AppLayout>
  );
}
