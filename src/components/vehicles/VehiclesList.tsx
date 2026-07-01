import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useInsurance } from "../../contexts/InsuranceContext";
import { useMember } from "../../contexts/MemberContext";
import type { VehicleData } from "../../types/models";

export default function VehiclesList({ onViewClick }: { onViewClick: (vehicle: VehicleData) => void }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { getVehiclesByMember } = useInsurance();
  const { selectedMemberId } = useMember();

  const vehicles = getVehiclesByMember(selectedMemberId);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "active":
      case "insured":
        return { label: "Insured", color: "#3B6D11", bg: "#EAF3DE" };
      case "due":
        return { label: "Renewal Due", color: "#854F0B", bg: "#FAEEDA" };
      case "upcoming":
        return { label: "Upcoming", color: "#1456A0", bg: "#EBF3FC" };
      case "external":
        return { label: "External", color: "#6B6963", bg: "#F1EFE8" };
      default:
        return { label: status || "Unknown", color: "#6B6963", bg: "#F1EFE8" };
    }
  };

  if (vehicles.length === 0) {
    return (
      <Box
        sx={{
          bgcolor: "background.paper",
          borderRadius: 4,
          border: "1px solid",
          borderColor: "border.main",
          p: 6,
          textAlign: "center",
        }}
      >
        <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
          No registered vehicles found for the selected member.
        </Typography>
      </Box>
    );
  }

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {vehicles.map((veh) => {
          const statusStyle = getStatusColor(veh.status);
          const iconEmoji = veh.vehicleType === "two-wheeler" ? "🏍️" : "🚗";
          const renewText = veh.renewDateDisplay || veh.renewDateIso || "—";
          
          return (
            <Box
              key={veh.id}
              onClick={() => onViewClick(veh)}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                p: 2,
                border: "1px solid",
                borderColor: "border.main",
                display: "flex",
                alignItems: "center",
                gap: 2,
                cursor: "pointer",
                "&:active": {
                  bgcolor: "surface.light",
                },
              }}
            >
              <Box
                sx={{
                  width: 44,
                  height: 44,
                  borderRadius: "10px",
                  bgcolor: "surface.light",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 22,
                  flexShrink: 0,
                }}
              >
                {iconEmoji}
              </Box>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  noWrap
                  sx={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: "text.primary",
                    mb: 0.25,
                  }}
                >
                  {veh.makeModel} — {veh.ownerName}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "text.secondary",
                    fontFamily: "DM Mono, monospace",
                  }}
                >
                  {veh.registrationNumber}
                </Typography>
              </Box>
              <Box sx={{ flexShrink: 0 }}>
                <Chip
                  label={veh.status === "due" ? `Renews ${renewText.split(" ").slice(0, 2).join(" ")}` : statusStyle.label}
                  size="small"
                  sx={{
                    bgcolor: statusStyle.bg,
                    color: statusStyle.color,
                    fontWeight: 600,
                    fontSize: 10,
                    height: 20,
                  }}
                />
              </Box>
            </Box>
          );
        })}
      </Box>
    );
  }

  return (
    <TableContainer
      sx={{
        bgcolor: "background.paper",
        borderRadius: 4,
        border: "1px solid",
        borderColor: "border.main",
        overflow: "hidden",
      }}
    >
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
          <TableRow sx={{ bgcolor: "surface.light" }}>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
              Vehicle Details
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
              Registration No.
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
              Status
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {vehicles.map((veh) => {
            const statusStyle = getStatusColor(veh.status);
            const iconEmoji = veh.vehicleType === "two-wheeler" ? "🏍️" : "🚗";
            const renewText = veh.renewDateDisplay || veh.renewDateIso || "—";

            return (
              <TableRow
                key={veh.id}
                hover
                onClick={() => onViewClick(veh)}
                sx={{ 
                  cursor: "pointer",
                  "&:last-child td, &:last-child th": { border: 0 } 
                }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        bgcolor: "surface.light",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 18,
                      }}
                    >
                      {iconEmoji}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
                        {veh.makeModel}
                      </Typography>
                      <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                        Owned by {veh.ownerName}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 13, color: "text.primary", fontFamily: "DM Mono, monospace", fontWeight: 500 }}>
                    {veh.registrationNumber}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={veh.status === "due" ? `Renews ${renewText}` : statusStyle.label}
                    size="small"
                    sx={{
                      bgcolor: statusStyle.bg,
                      color: statusStyle.color,
                      fontWeight: 600,
                      fontSize: 11,
                      height: 24,
                    }}
                  />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
