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
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useMember } from "../../contexts/MemberContext";
import { useInsurance } from "../../contexts/InsuranceContext";

function parseCoverage(sumStr: string | undefined): number {
  if (!sumStr) return 0;
  return parseInt(sumStr.replace(/[^\d]/g, ""), 10) || 0;
}

function formatCoverageAmount(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2).replace(/\.00$/, "")}Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2).replace(/\.00$/, "")}L`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function MembersList() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const { members, setSelectedMemberId } = useMember();
  const { getPoliciesByMember } = useInsurance();

  const familyMembers = members.filter((m) => m.id !== "all");

  const handlePoliciesClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    navigate("/policies");
  };

  const handleProfileClick = (memberId: string) => {
    setSelectedMemberId(memberId);
    navigate("/profile");
  };

  if (isMobile) {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
        {familyMembers.map((member) => {
          const policies = getPoliciesByMember(member.id);
          const activePolicies = policies.filter((p) => p.status === "active");
          const totalCoverage = activePolicies.reduce(
            (sum, p) => sum + parseCoverage(p.sumInsuredFull),
            0
          );
          
          let policiesText = "No active policies";
          if (activePolicies.length > 0) {
            policiesText = `${activePolicies.length} active polic${
              activePolicies.length > 1 ? "ies" : "y"
            }`;
            if (totalCoverage > 0) {
              policiesText += ` · ${formatCoverageAmount(totalCoverage)} coverage`;
            } else if (member.id === "aarav") {
              policiesText = "Covered under family floater";
            }
          }

          return (
            <Box
              key={member.id}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 3,
                p: 2,
                border: "1px solid",
                borderColor: "border.main",
              }}
            >
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: "10px",
                    bgcolor: "info.light",
                    color: "info.main",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 18,
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {member.profile?.initials || member.name.charAt(0)}
                </Box>
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "text.primary",
                      display: "flex",
                      alignItems: "center",
                      gap: 1,
                      mb: 0.5,
                      flexWrap: "wrap",
                    }}
                  >
                    {member.name}
                    {member.profile?.relationship && (
                      <Chip
                        label={member.profile.relationship}
                        size="small"
                        sx={{
                          height: 18,
                          fontSize: 10,
                          fontWeight: 500,
                          bgcolor: "surface.secondary",
                          color: "text.secondary",
                        }}
                      />
                    )}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                      mb: 0.75,
                    }}
                  >
                    DOB: {member.profile?.dob?.split(" ")[0]} · PAN: {member.profile?.pan}
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: 12,
                      color: "text.secondary",
                    }}
                  >
                    {policiesText}
                  </Typography>
                </Box>
              </Box>

              <Box
                sx={{
                  display: "flex",
                  gap: 1,
                  mt: 2,
                  pt: 2,
                  borderTop: "1px solid",
                  borderColor: "border.main",
                }}
              >
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={() => handleProfileClick(member.id)}
                  sx={{
                    textTransform: "none",
                    borderColor: "border.light",
                    color: "text.secondary",
                  }}
                >
                  KYC
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  fullWidth
                  onClick={() => handlePoliciesClick(member.id)}
                  sx={{
                    textTransform: "none",
                    borderColor: "border.light",
                    color: "text.secondary",
                  }}
                >
                  Policies
                </Button>
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
              Member Details
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
              Identity Info
            </TableCell>
            <TableCell sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }}>
              Coverage Summary
            </TableCell>
            <TableCell align="right" sx={{ color: "text.secondary", fontWeight: 600, fontSize: 13, py: 2 }} />
          </TableRow>
        </TableHead>
        <TableBody>
          {familyMembers.map((member) => {
            const policies = getPoliciesByMember(member.id);
            const activePolicies = policies.filter((p) => p.status === "active");
            const totalCoverage = activePolicies.reduce(
              (sum, p) => sum + parseCoverage(p.sumInsuredFull),
              0
            );

            let policiesText = "No active policies";
            if (activePolicies.length > 0) {
              policiesText = `${activePolicies.length} active polic${
                activePolicies.length > 1 ? "ies" : "y"
              }`;
              if (totalCoverage > 0) {
                policiesText += ` · ${formatCoverageAmount(totalCoverage)} coverage`;
              } else if (member.id === "aarav") {
                policiesText = "Covered under family floater";
              }
            }

            return (
              <TableRow
                key={member.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Box
                      sx={{
                        width: 36,
                        height: 36,
                        borderRadius: "8px",
                        bgcolor: "info.light",
                        color: "info.main",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: 600,
                      }}
                    >
                      {member.profile?.initials || member.name.charAt(0)}
                    </Box>
                    <Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary", display: "flex", alignItems: "center", gap: 1 }}>
                        {member.name}
                        {member.profile?.relationship && (
                          <Chip
                            label={member.profile.relationship}
                            size="small"
                            sx={{ height: 18, fontSize: 10, fontWeight: 500 }}
                          />
                        )}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    DOB: {member.profile?.dob?.split(" ")[0] || "—"}
                  </Typography>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    PAN: {member.profile?.pan || "—"}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
                    {policiesText}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleProfileClick(member.id)}
                      sx={{
                        textTransform: "none",
                        borderColor: "border.light",
                        color: "text.secondary",
                      }}
                    >
                      KYC
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handlePoliciesClick(member.id)}
                      sx={{
                        textTransform: "none",
                        borderColor: "border.light",
                        color: "text.secondary",
                      }}
                    >
                      Policies
                    </Button>
                  </Box>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
