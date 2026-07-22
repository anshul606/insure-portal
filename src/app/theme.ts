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
      dark: "#0E4079",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#6B6963",
      light: "#A8A49E",
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
    fontFamily: ["DM Sans", "system-ui", "-apple-system", "sans-serif"].join(","),

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
          borderRadius: "8px",
          boxShadow: "none",
          transition: "all 0.15s ease-in-out",
          "&:hover": {
            boxShadow: "none",
          },
        },
        contained: {
          fontWeight: 600,
          "&:hover": {
            boxShadow: "none",
          },
        },
        outlined: {
          borderColor: "#E4E3DF",
          color: "#1A1916",
          "&:hover": {
            borderColor: "#CFCDC8",
            backgroundColor: "#F2F1EE",
          },
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: "10px",
          fontWeight: 600,
          borderRadius: "6px",
          height: "22px",
        },
        sizeSmall: {
          height: "20px",
          fontSize: "10px",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E4E3DF",
          borderRadius: "12px",
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.02)",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: "16px",
          boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
          border: "1px solid #E4E3DF",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          "& fieldset": {
            borderColor: "#E4E3DF",
          },
          "&:hover fieldset": {
            borderColor: "#CFCDC8",
          },
          "&.Mui-focused fieldset": {
            borderColor: "#1456A0",
          },
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        rounded: {
          borderRadius: "12px",
        },
      },
    },

    MuiPopover: {
      styleOverrides: {
        paper: {
          borderRadius: "12px",
          border: "1px solid #E4E3DF",
          boxShadow: "0 6px 20px rgba(0, 0, 0, 0.06)",
        },
      },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          fontSize: "12px",
        },
      },
    },
  },
});
