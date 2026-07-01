import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function GridSkeleton() {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", lg: "1fr 1fr" },
        gap: 2,
        width: "100%"
      }}
    >
      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
      <Skeleton variant="rectangular" height={160} sx={{ borderRadius: 3 }} />
    </Box>
  );
}
