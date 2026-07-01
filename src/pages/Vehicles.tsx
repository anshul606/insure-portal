import { useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { Plus } from "lucide-react";

import Welcome from "../components/Welcome";
import AppLayout from "../layouts/AppLayout";
import VehiclesList from "../components/vehicles/VehiclesList";
import VehicleForm from "../components/vehicles/VehicleForm";
import VehicleDetailModal from "../components/vehicles/VehicleDetailModal";
import { useVehicle } from "../contexts/InsuranceContext";
import TableSkeleton from "../components/shared/TableSkeleton";
import type { VehicleData } from "../types/models";

export default function VehiclesPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleData | null>(null);
  const { loading } = useVehicle();

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
              title="Registered Vehicles"
              content="Manage your cars and two-wheelers linked to your insurance policies."
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
            Add Vehicle
          </Button>
        </Box>

        <Box sx={{ width: "100%" }}>
          {showForm && (
            <Box sx={{ mb: 3, maxWidth: 800 }}>
              <VehicleForm onCancel={() => setShowForm(false)} />
            </Box>
          )}

          {loading ? (
            <TableSkeleton />
          ) : (
            <VehiclesList onViewClick={(vehicle) => setSelectedVehicle(vehicle)} />
          )}
        </Box>

        <VehicleDetailModal
          open={!!selectedVehicle}
          onClose={() => setSelectedVehicle(null)}
          vehicle={selectedVehicle}
        />
      </Box>
    </AppLayout>
  );
}
