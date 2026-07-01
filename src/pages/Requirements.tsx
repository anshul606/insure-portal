import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import RequirementForm from "../components/requirements/RequirementForm";
import RequirementList from "../components/requirements/RequirementList";
import { useRequirement } from "../contexts/InsuranceContext";
import GridSkeleton from "../components/shared/GridSkeleton";

export default function RequirementsPage() {
  const [searchParams] = useSearchParams();
  const [showForm, setShowForm] = useState(searchParams.get("new") === "true");
  const { loading } = useRequirement();

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
              title="Requirements"
              content="Create a new insurance requirement and your advisor will share quotes."
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
            Create New Requirement
          </Button>
        </Box>

        {showForm && (
          <Box sx={{ maxWidth: { xs: "100%", md: "860px" } }}>
            <RequirementForm onCancel={() => setShowForm(false)} />
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          {loading ? <GridSkeleton /> : <RequirementList />}
        </Box>
      </Box>
    </AppLayout>
  );
}
