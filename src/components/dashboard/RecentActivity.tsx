import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import type { ActivityItem } from "../../types/models";

type TimelineItemProps = {
  title: string;
  subtitle: string;
  time: string;
  dotColor: string;
  isLast?: boolean;
};

const kindColorMap: Record<string, string> = {
  success: "success.main",
  warn: "warning.main",
  danger: "error.main",
  info: "info.main",
};

function TimelineItem({
  title,
  subtitle,
  time,
  dotColor,
  isLast,
}: TimelineItemProps) {
  return (
    <Box sx={{ display: "flex", gap: 2, position: "relative" }}>
      {!isLast && (
        <Box
          sx={{
            position: "absolute",
            top: 24,
            bottom: -8,
            left: 5,
            width: "2px",
            bgcolor: "divider",
            zIndex: 0,
          }}
        />
      )}

      <Box sx={{ mt: 0.5, position: "relative", zIndex: 1 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            bgcolor: dotColor,
            border: "2px solid",
            borderColor: "background.paper",
            boxShadow: "0 0 0 1px var(--mui-palette-divider)",
          }}
        />
      </Box>

      <Box sx={{ flex: 1, pb: 3 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            gap: 1,
          }}
        >
          <Typography
            sx={{ fontSize: 13, fontWeight: 600, color: "text.primary" }}
          >
            {title}
          </Typography>
          <Typography
            sx={{ fontSize: 11, color: "text.disabled", whiteSpace: "nowrap" }}
          >
            {time}
          </Typography>
        </Box>
        <Typography sx={{ fontSize: 12, color: "text.secondary", mt: 0.25 }}>
          {subtitle}
        </Typography>
      </Box>
    </Box>
  );
}

export default function RecentActivity({
  recentActivity,
}: {
  recentActivity: ActivityItem[];
}) {
  return (
    <Box
      sx={{
        bgcolor: "background.paper",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 3,
        boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
        height: "100%",
      }}
    >
      <Typography
        sx={{ fontSize: 16, fontWeight: 600, color: "text.primary", mb: 3 }}
      >
        Recent Activity
      </Typography>

      <Box>
        {recentActivity.length === 0 ? (
          <Typography sx={{ fontSize: 13, color: "text.secondary", textAlign: "center", mt: 4 }}>
            No recent activity.
          </Typography>
        ) : (
          recentActivity.map((item, idx) => {
            const dotColor = kindColorMap[item.kind.toLowerCase()] || "text.disabled";
            return (
              <TimelineItem
                key={`${item.title}-${idx}`}
                title={item.title}
                subtitle={item.subtitle}
                time={item.timeDisplay}
                dotColor={dotColor}
                isLast={idx === recentActivity.length - 1}
              />
            );
          })
        )}
      </Box>
    </Box>
  );
}
