import { useState, useEffect } from "react";
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
import { useNavigate } from "react-router-dom";
import { Download, Upload as UploadIcon, FileText, Hospital, Receipt, PieChart } from "lucide-react";

import AppLayout from "../layouts/AppLayout";
import Welcome from "../components/Welcome";
import UiCard from "../components/shared/UiCard";
import TableSkeleton from "../components/shared/TableSkeleton";
import { useMember } from "../contexts/MemberContext";
import { api } from "../services/api";
import { hasValidToken } from "../services/apiClient";
import type { DocumentData } from "../types/models";

const getDocTypeStyles = (type: string) => {
  switch (type) {
    case "policy-doc":
      return {
        icon: <FileText size={20} color="#1456A0" />,
        color: "#1456A0",
        bg: "#EBF3FC"
      };
    case "claim-doc":
      return {
        icon: <Hospital size={20} color="#854F0B" />,
        color: "#854F0B",
        bg: "#FAEEDA"
      };
    case "receipt":
      return {
        icon: <Receipt size={20} color="#6B6963" />,
        color: "#6B6963",
        bg: "#F1EFE8"
      };
    case "tax-doc":
    default:
      return {
        icon: <PieChart size={20} color="#3B6D11" />,
        color: "#3B6D11",
        bg: "#EAF3DE"
      };
  }
};

export default function DocumentsPage() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { selectedMemberId } = useMember();

  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocType, setSelectedDocType] = useState("all");

  useEffect(() => {
    let active = true;
    async function fetchDocs() {
      if (!hasValidToken()) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const params: Record<string, any> = {};
        if (selectedMemberId !== "all") {
          params.memberId = selectedMemberId;
        }
        if (selectedDocType !== "all") {
          params.docType = selectedDocType;
        }
        const data = await api.getDocuments(params);
        if (active) {
          setDocuments(data);
        }
      } catch (err: any) {
        if (err?.status !== 401) {
          console.error(err);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }
    fetchDocs();
    return () => {
      active = false;
    };
  }, [selectedMemberId, selectedDocType]);

  const handleDownload = (doc: DocumentData) => {
    api.downloadDocument(doc.id);
  };

  return (
    <AppLayout>
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            justifyContent: "space-between",
            mb: 3,
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <Welcome
              title="Documents"
              content="All policy certificates, claim documents and receipts in one place."
            />
          </Box>

          <Box sx={{ display: "flex", gap: 1.5, flexShrink: 0 }}>
            <Select
              value={selectedDocType}
              onChange={(e) => setSelectedDocType(e.target.value)}
              size="small"
              sx={{
                bgcolor: "surface.main",
                borderRadius: 2,
                height: 36,
                minWidth: 160,
                fontSize: 13,
                "& fieldset": { borderColor: "border.main" },
              }}
            >
              <MenuItem value="all" sx={{ fontSize: 13 }}>All Types</MenuItem>
              <MenuItem value="policy-doc" sx={{ fontSize: 13 }}>Policy Documents</MenuItem>
              <MenuItem value="claim-doc" sx={{ fontSize: 13 }}>Claim Documents</MenuItem>
              <MenuItem value="receipt" sx={{ fontSize: 13 }}>Receipts</MenuItem>
              <MenuItem value="tax-doc" sx={{ fontSize: 13 }}>Tax Documents</MenuItem>
            </Select>

            <Button
              size="small"
              variant="contained"
              onClick={() => navigate("/upload")}
              startIcon={<UploadIcon size={14} />}
              sx={{
                fontSize: 11,
                fontWeight: 500,
                textTransform: "none",
                minHeight: 36,
                px: 1.75,
                borderRadius: 2,
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
              Upload
            </Button>
          </Box>
        </Box>

        {loading ? (
          <TableSkeleton />
        ) : documents.length === 0 ? (
          <UiCard sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", py: 8, textAlign: "center" }}>
            <Box sx={{ width: 48, height: 48, borderRadius: "50%", bgcolor: "surface.secondary", display: "flex", alignItems: "center", justifyContent: "center", color: "text.disabled", mb: 2 }}>
              <FileText size={24} />
            </Box>
            <Typography sx={{ fontSize: 15, fontWeight: 600, color: "text.primary" }}>No documents found</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}>Try switching members or changing the filter type.</Typography>
          </UiCard>
        ) : isMobile ? (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
            {documents.map((doc) => {
              const styles = getDocTypeStyles(doc.docType || "tax-doc");
              return (
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
                      width: 40,
                      height: 40,
                      borderRadius: "8px",
                      bgcolor: styles.bg,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    {styles.icon}
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
                      component="div"
                      sx={{
                        fontSize: 11,
                        color: "text.secondary",
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        flexWrap: "wrap",
                      }}
                    >
                      <Chip
                        label={doc.docTypeDisplay || doc.docType}
                        size="small"
                        sx={{
                          bgcolor: styles.bg,
                          color: styles.color,
                          fontWeight: 600,
                          fontSize: 9,
                          height: 18,
                          ".MuiChip-label": { px: 0.75 },
                        }}
                      />
                      <span>· {doc.memberName || "General"}</span>
                      <span>· {doc.dateDisplay || doc.dateIso}</span>
                      <span>· {doc.sizeDisplay || `${doc.sizeBytes} B`}</span>
                    </Typography>
                  </Box>
                  <Button
                    variant="outlined"
                    onClick={() => handleDownload(doc)}
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
              );
            })}
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
                <TableRow sx={{ bgcolor: "surface.secondary" }}>
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
                {documents.map((doc) => {
                  const styles = getDocTypeStyles(doc.docType || "tax-doc");
                  return (
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
                              bgcolor: styles.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {styles.icon}
                          </Box>
                          <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.primary" }}>
                            {doc.name}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: "text.primary", fontFamily: "monospace" }}>
                          {doc.relatedToId || "—"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: "text.primary" }}>
                          {doc.memberName || "General"}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={doc.docTypeDisplay || doc.docType}
                          size="small"
                          sx={{
                            bgcolor: styles.bg,
                            color: styles.color,
                            fontWeight: 600,
                            fontSize: 11,
                            height: 22,
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: "text.primary" }}>
                          {doc.dateDisplay || doc.dateIso}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                          {doc.sizeDisplay || `${doc.sizeBytes} B`}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleDownload(doc)}
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </AppLayout>
  );
}
