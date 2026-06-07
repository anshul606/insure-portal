import Box from "@mui/material/Box";
import type { BoxProps } from "@mui/material/Box";

export default function UiCard({ children, sx, ...props }: BoxProps) {
    return (
        <Box
            sx={{
                bgcolor: "background.paper",
                border: "1px solid",
                borderColor: "border.main",
                borderRadius: 3,
                p: 2,
                ...sx,
            }}
            {...props}
        >
            {children}
        </Box>
    );
}
