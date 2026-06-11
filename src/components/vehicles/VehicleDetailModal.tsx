import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import Chip from "@mui/material/Chip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { X, Shield } from "lucide-react";
import { useInsurance } from "../../contexts/InsuranceContext";
import type { VehicleData } from "../../types/models";

export default function VehicleDetailModal({
  open,
  onClose,
  vehicle,
}: {
  open: boolean;
  onClose: () => void;
  vehicle: VehicleData | null;
}) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { getPolicyById } = useInsurance();

  if (!vehicle) return null;

  const policy = vehicle.policyId ? getPolicyById(vehicle.policyId) : null;

  const content = (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <Box
        sx={{
          p: 2.5,
          borderBottom: "1px solid",
          borderColor: "border.main",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "12px",
              bgcolor: "surface.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 24,
            }}
          >
            {vehicle.icon}
          </Box>
          <Box>
            <Typography sx={{ fontSize: 16, fontWeight: 700, color: "text.primary" }}>
              {vehicle.name}
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary", fontFamily: "DM Mono, monospace" }}>
              {vehicle.registrationNumber}
            </Typography>
          </Box>
        </Box>
        {!isMobile && (
          <IconButton onClick={onClose} size="small" sx={{ color: "text.secondary" }}>
            <X size={20} />
          </IconButton>
        )}
      </Box>

      <Box sx={{ p: 2.5, flex: 1, overflowY: "auto" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Vehicle Information
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Make</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{vehicle.make}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Model</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{vehicle.model}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Mfg. Year</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{vehicle.year}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Owner Name</Typography>
                <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{vehicle.memberName}</Typography>
              </Box>
            </Box>
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Insurance Details
            </Typography>
            {policy ? (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Insurer</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{policy.insurer}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Policy Type</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{policy.type}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Policy Number</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary", fontFamily: "DM Mono, monospace" }}>{policy.policyNumber}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Cover Amount</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{policy.sumInsuredFull}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Annual Premium</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{policy.premium}</Typography>
                </Box>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography sx={{ fontSize: 14, color: "text.secondary" }}>Deductible</Typography>
                  <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>{policy.deductible}</Typography>
                </Box>
              </Box>
            ) : (
              <Box sx={{ p: 2, bgcolor: "surface.light", borderRadius: 2 }}>
                <Typography sx={{ fontSize: 14, color: "text.secondary", textAlign: "center" }}>
                  No active policy linked to this vehicle.
                </Typography>
              </Box>
            )}
          </Box>

          <Box>
            <Typography sx={{ fontSize: 13, fontWeight: 600, color: "text.secondary", mb: 1.5, textTransform: "uppercase", letterSpacing: "0.5px" }}>
              Status & Coverage
            </Typography>
            <Box
              sx={{
                bgcolor: "surface.light",
                p: 2,
                borderRadius: 2,
                display: "flex",
                flexDirection: "column",
                gap: 2,
              }}
            >
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Shield size={16} color={theme.palette.text.secondary} />
                  <Typography sx={{ fontSize: 14, color: "text.primary", fontWeight: 500 }}>
                    Motor Insurance
                  </Typography>
                </Box>
                {vehicle.status === "active" ? (
                  <Chip label="Active" size="small" sx={{ bgcolor: "#EAF3DE", color: "#3B6D11", fontWeight: 600, fontSize: 11 }} />
                ) : (
                  <Chip label={`Renews ${vehicle.renewDate}`} size="small" sx={{ bgcolor: "#FAEEDA", color: "#854F0B", fontWeight: 600, fontSize: 11 }} />
                )}
              </Box>
              {vehicle.policyId && (
                <Button
                  variant="outlined"
                  fullWidth
                  size="small"
                  sx={{ textTransform: "none", borderColor: "border.main", color: "text.primary", borderRadius: 2 }}
                >
                  View Policy Details
                </Button>
              )}
            </Box>
          </Box>
        </Box>
      </Box>

      {isMobile && (
        <Box sx={{ p: 2, borderTop: "1px solid", borderColor: "border.main" }}>
          <Button
            variant="contained"
            fullWidth
            onClick={onClose}
            sx={{ textTransform: "none", borderRadius: 2 }}
          >
            Close
          </Button>
        </Box>
      )}
    </Box>
  );

  if (isMobile) {
    return (
      <Drawer
        anchor="bottom"
        open={open}
        onClose={onClose}
        sx={{
          zIndex: theme.zIndex.modal + 20,
        }}
        slotProps={{
          backdrop: {
            sx: {
              bgcolor: "rgba(0, 0, 0, 0.4)",
              backdropFilter: "blur(2px)",
            },
          },
          paper: {
            sx: {
              borderTopLeftRadius: 16,
              borderTopRightRadius: 16,
              maxHeight: "85vh",
              bgcolor: "background.paper",
              display: "flex",
              flexDirection: "column",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 36,
            height: 4,
            bgcolor: "border.main",
            borderRadius: 2,
            alignSelf: "center",
            mt: 1.5,
            mb: 0.5,
          }}
        />
        {content}
      </Drawer>
    );
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      slotProps={{
        backdrop: {
          sx: {
            bgcolor: "rgba(0, 0, 0, 0.4)",
            backdropFilter: "blur(2px)",
          },
        },
        paper: {
          sx: {
            borderRadius: 4,
            boxShadow: "0px 8px 32px rgba(0, 0, 0, 0.08)",
          },
        },
      }}
    >
      {content}
    </Dialog>
  );
}
