import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import Button from "@mui/material/Button";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { Download, Upload, FileText, Car, Hospital, Receipt, PieChart } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";

const fakeDocuments = [
  {
    id: 1,
    name: "Health Policy Certificate 2025-26",
    relatedTo: "HLT-2024-0001432",
    member: "All Members",
    type: "Policy Doc",
    date: "02 Apr 2025",
    size: "412 KB",
    icon: <FileText size={22} color="#1456A0" />,
    color: "#1456A0",
    bg: "#EBF3FC",
  },
  {
    id: 2,
    name: "Car Insurance Schedule",
    relatedTo: "MTR-2024-0887654",
    member: "Rajesh",
    type: "Policy Doc",
    date: "12 May 2024",
    size: "287 KB",
    icon: <Car size={22} color="#1456A0" />,
    color: "#1456A0",
    bg: "#EBF3FC",
  },
  {
    id: 3,
    name: "Discharge Summary — Priya",
    relatedTo: "CL-2025-0124",
    member: "Priya",
    type: "Claim Doc",
    date: "28 Apr 2025",
    size: "1.8 MB",
    icon: <Hospital size={22} color="#854F0B" />,
    color: "#854F0B",
    bg: "#FAEEDA",
  },
  {
    id: 4,
    name: "Premium Receipt FY 2024-25",
    relatedTo: "LIF-2023-0045231",
    member: "Rajesh",
    type: "Receipt",
    date: "01 Apr 2025",
    size: "98 KB",
    icon: <Receipt size={22} color="#6B6963" />,
    color: "#6B6963",
    bg: "#F1EFE8",
  },
  {
    id: 5,
    name: "Tax Certificate u/s 80D",
    relatedTo: "HLT-2024-0001432",
    member: "Rajesh",
    type: "Tax Doc",
    date: "31 Mar 2025",
    size: "145 KB",
    icon: <PieChart size={22} color="#3B6D11" />,
    color: "#3B6D11",
    bg: "#EAF3DE",
  },
];

export default function DocumentsPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
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
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Welcome
              title="Documents"
              content="All policy certificates, claim documents and receipts in one place."
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1, flexShrink: 0, flexDirection: { xs: "row" } }}>
            <Select
              defaultValue="All Types"
              size="small"
              sx={{
                bgcolor: "surface.light",
                borderRadius: 2,
                height: 36,
                minWidth: 140,
                fontSize: 13,
                "& fieldset": { borderColor: "border.main" },
              }}
            >
              <MenuItem value="All Types" sx={{ fontSize: 13 }}>All Types</MenuItem>
              <MenuItem value="Policy Documents" sx={{ fontSize: 13 }}>Policy Documents</MenuItem>
              <MenuItem value="Claim Documents" sx={{ fontSize: 13 }}>Claim Documents</MenuItem>
              <MenuItem value="Receipts" sx={{ fontSize: 13 }}>Receipts</MenuItem>
              <MenuItem value="Tax Documents" sx={{ fontSize: 13 }}>Tax Documents</MenuItem>
            </Select>

            <Button
              size="small"
              variant="contained"
              startIcon={<Upload size={14} />}
              sx={{
                fontSize: 12,
                fontWeight: 500,
                textTransform: "none",
                minHeight: 36,
                px: 2,
                borderRadius: 2,
                boxShadow: "none",
              }}
            >
              Upload
            </Button>
          </Box>
        </Box>

        {isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {fakeDocuments.map((doc) => (
              <Box
                key={doc.id}
                sx={{
                  bgcolor: "background.paper",
                  borderRadius: 3,
                  p: 2,
                  border: "1px solid",
                  borderColor: "border.main",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    bgcolor: doc.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <Box sx={{ display: "flex", transform: "scale(0.85)" }}>
                    {doc.icon}
                  </Box>
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
                    {doc.name}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Chip
                      label={doc.type}
                      size="small"
                      sx={{
                        bgcolor: doc.bg,
                        color: doc.color,
                        fontWeight: 600,
                        fontSize: 9,
                        height: 18,
                        ".MuiChip-label": { px: 0.75 },
                      }}
                    />
                    <span>· {doc.member}</span>
                    <span>· {doc.date}</span>
                    <span>· {doc.size}</span>
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  sx={{
                    minWidth: 0,
                    width: 32,
                    height: 32,
                    p: 0,
                    borderRadius: 2,
                    borderColor: "border.main",
                    color: "text.primary",
                    flexShrink: 0,
                  }}
                >
                  <Download size={16} />
                </Button>
              </Box>
            ))}
          </Box>
        ) : (
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
                    Document Name
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
                    Related To
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
                    Member
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
                    Type
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
                    Date
                  </TableCell>
                  <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
                    Size
                  </TableCell>
                  <TableCell align="right"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fakeDocuments.map((doc) => (
                  <TableRow
                    key={doc.id}
                    hover
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                        <Box
                          sx={{
                            width: 36,
                            height: 36,
                            borderRadius: "8px",
                            bgcolor: doc.bg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Box sx={{ display: "flex", transform: "scale(0.85)" }}>
                            {doc.icon}
                          </Box>
                        </Box>
                        <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                          {doc.name}
                        </Typography>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "text.primary", fontFamily: "DM Mono, monospace" }}>
                        {doc.relatedTo}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "text.primary" }}>
                        {doc.member}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={doc.type}
                        size="small"
                        sx={{
                          bgcolor: doc.bg,
                          color: doc.color,
                          fontWeight: 600,
                          fontSize: 11,
                          height: 22,
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "text.primary" }}>
                        {doc.date}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                        {doc.size}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{
                          minWidth: 0,
                          width: 32,
                          height: 32,
                          p: 0,
                          borderRadius: 2,
                          borderColor: "border.main",
                          color: "text.primary",
                        }}
                      >
                        <Download size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
