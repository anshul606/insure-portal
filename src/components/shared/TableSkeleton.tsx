import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

export default function TableSkeleton() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5, width: "100%" }}>
      <Skeleton variant="rectangular" height={52} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
      <Skeleton variant="rectangular" height={72} sx={{ borderRadius: 2 }} />
    </Box>
  );
}
