import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1456A0",
    },

    background: {
      default: "#F7F6F3",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#1A1916",
      secondary: "#6B6963",
    },
  },

  shape: {
    borderRadius: 12,
  },

  typography: {
    fontFamily: ["DM Sans", "system-ui", "-apple-system", "sans-serif"].join(
      ",",
    ),
  },
});
