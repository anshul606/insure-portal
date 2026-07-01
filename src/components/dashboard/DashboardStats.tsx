import Box from "@mui/material/Box";
import UiCard from "../shared/UiCard";
import Typography from "@mui/material/Typography";
import type { StatBlock } from "../../types/models";
import { useMember } from "../../contexts/MemberContext";

type StatProps = {
  title: string;
  value: string;
  text: string;
};

function StatCard({ title, value, text }: StatProps) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "border.main",
        borderRadius: 1.5,
        p: 1.75,
      }}
    >
      <Typography
        sx={{
          fontSize: 11,
          color: "text.secondary",
          mb: 0.5,
          fontWeight: 500,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: 22,
          fontWeight: 600,
          color: "text.primary",
          lineHeight: 1.1,
        }}
      >
        {value}
      </Typography>

      <Typography
        sx={{
          fontSize: 11,
          color: "text.disabled",
          mt: 0.375,
          lineHeight: 1.3,
        }}
      >
        {text}
      </Typography>
    </Box>
  );
}

export default function DashboardStats({ stats }: { stats: StatBlock }) {
  const { selectedMemberId, members } = useMember();

  let membersText = "Across family group";
  if (selectedMemberId !== "all") {
    membersText = "For active profile";
  } else if (members.length > 0) {
    const familyMembersCount = members.filter((m) => m.id !== "all").length;
    membersText = `Across ${familyMembersCount} member${familyMembersCount > 1 ? "s" : ""}`;
  }

  return (
    <UiCard
      sx={{
        p: 2,
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          lg: "repeat(4, 1fr)",
        },
        gap: 1.25,
      }}
    >
      <StatCard
        title="Policies"
        value={stats.activePolicies.toString()}
        text={membersText}
      />
      <StatCard 
        title="Coverage" 
        value={stats.sumInsuredDisplay || "—"} 
        text="Combined coverage" 
      />
      <StatCard 
        title="Claims" 
        value={stats.openClaims.toString()} 
        text={stats.openClaimsAmount > 0 ? `${stats.openClaimsAmountDisplay} pending` : "No pending claims"} 
      />
      <StatCard
        title="Alerts"
        value={stats.renewalsDue.toString()}
        text="Next 30 days"
      />
    </UiCard>
  );
}
