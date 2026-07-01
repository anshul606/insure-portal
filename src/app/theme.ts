import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    border: {
      main: string;
      light: string;
    };
    surface: {
      main: string;
      secondary: string;
    };
  }
  interface PaletteOptions {
    border?: {
      main?: string;
      light?: string;
    };
    surface?: {
      main?: string;
      secondary?: string;
    };
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#1456A0",
      light: "#378ADD",
    },

    secondary: {
      main: "#6B6963",
    },

    success: {
      main: "#3B6D11",
      light: "#EAF3DE",
      contrastText: "#FFFFFF",
    },

    warning: {
      main: "#854F0B",
      light: "#FAEEDA",
      contrastText: "#FFFFFF",
    },

    error: {
      main: "#A32D2D",
      light: "#FCEBEB",
      contrastText: "#FFFFFF",
    },

    info: {
      main: "#1456A0",
      light: "#EBF3FC",
      contrastText: "#FFFFFF",
    },

    background: {
      default: "#F7F6F3",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#1A1916",
      secondary: "#6B6963",
      disabled: "#A8A49E",
    },

    border: {
      main: "#E4E3DF",
      light: "#CFCDC8",
    },

    surface: {
      main: "#FFFFFF",
      secondary: "#F2F1EE",
    },

    grey: {
      50: "#F1EFE8",
      100: "#E4E3DF",
      200: "#CFCDC8",
      300: "#A8A49E",
      400: "#6B6963",
      500: "#5F5E5A",
      600: "#1A1916",
    },
  },

  shape: {
    borderRadius: 8,
  },

  typography: {
    fontFamily: ["DM Sans", "system-ui", "-apple-system", "sans-serif"].join(
      ",",
    ),

    h6: {
      fontSize: "18px",
      fontWeight: 600,
      lineHeight: 1.3,
    },

    body1: {
      fontSize: "14px",
      lineHeight: 1.5,
    },

    body2: {
      fontSize: "12px",
      lineHeight: 1.4,
    },

    caption: {
      fontSize: "11px",
      lineHeight: 1.3,
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontSize: "12px",
          fontWeight: 500,
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "10px",
          fontWeight: 600,
          height: "auto",
          padding: "2px 8px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E4E3DF",
          borderRadius: "12px",
          boxShadow: "none",
        },
      },
    },
  },
});
