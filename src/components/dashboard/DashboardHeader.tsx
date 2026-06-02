import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import { useState } from "react";

type MemberTab = {
  id: string;
  name: string;
};

const members: MemberTab[] = [
  { id: "all", name: "All Members" },
  { id: "rajesh", name: "Rajesh Sharma" },
  { id: "priya", name: "Priya Sharma" },
  { id: "aarav", name: "Aarav Sharma" },
];

export default function DashboardHeader() {
  const [activeTab, setActiveTab] = useState("all");

  return (
    <Box>
      <Typography
        sx={{
          fontSize: 18,
          fontWeight: 600,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        Dashboard
      </Typography>

      <Typography
        sx={{
          fontSize: 12,
          color: "text.disabled",
          lineHeight: 1.5,
          mb: 2,
        }}
      >
        Overview of your family's insurance portfolio
      </Typography>

      <Box
        sx={{
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "border.main",
          borderRadius: 1.5,
          p: 1.5,
          display: "flex",
          alignItems: "center",
          gap: 1,
          flexWrap: "wrap",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 0.75,
            flex: 1,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": {
              display: "none",
            },
            pb: 0.25,
          }}
        >
          {members.map((member) => (
            <Box
              key={member.id}
              onClick={() => setActiveTab(member.id)}
              sx={{
                px: 1.75,
                py: 0.75,
                borderRadius: "20px",
                fontSize: 12,
                cursor: "pointer",
                border: "1px solid",
                borderColor:
                  activeTab === member.id ? "#B5D4F4" : "border.main",
                bgcolor:
                  activeTab === member.id ? "info.light" : "surface.secondary",
                color: activeTab === member.id ? "info.main" : "text.secondary",
                fontWeight: activeTab === member.id ? 500 : 400,
                whiteSpace: "nowrap",
                flexShrink: 0,
                transition: "all 0.12s",
                "&:hover": {
                  bgcolor: activeTab === member.id ? "info.light" : "grey.100",
                },
              }}
            >
              {member.name}
            </Box>
          ))}
        </Box>

        <Typography
          sx={{
            fontSize: 11,
            color: "text.disabled",
            whiteSpace: "nowrap",
            flexShrink: 0,
          }}
        >
          4 members · ₹1.5 Cr
        </Typography>
      </Box>
    </Box>
  );
}
