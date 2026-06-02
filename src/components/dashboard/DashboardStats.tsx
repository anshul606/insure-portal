import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

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

export default function DashboardStats() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr 1fr",
          lg: "repeat(4, 1fr)",
        },
        gap: 1.25,
      }}
    >
      <StatCard title="Policies" value="4" text="Across 3 members" />
      <StatCard title="Coverage" value="₹1.5 Cr" text="Combined coverage" />
      <StatCard title="Claims" value="2" text="₹1.48L pending" />
      <StatCard title="Alerts" value="3" text="Next 30 days" />
    </Box>
  );
}
