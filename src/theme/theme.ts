import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    custom: {
      card: string;
      border: string;
      success: string;
    };
  }

  interface PaletteOptions {
    custom?: {
      card: string;
      border: string;
      success: string;
    };
  }
}

const theme = createTheme({
  palette: {
    mode: "dark",

    primary: {
      main: "#00E676",
    },

    secondary: {
      main: "#00B8FF",
    },

    background: {
      default: "#07111D",
      paper: "#111B2A",
    },

    text: {
      primary: "#FFFFFF",
      secondary: "#B0BEC5",
    },

    custom: {
      card: "rgba(255,255,255,0.05)",
      border: "rgba(255,255,255,0.08)",
      success: "#00E676",
    },
  },

  typography: {
    fontFamily: "'Poppins', sans-serif",

    h3: {
      fontWeight: 700,
      letterSpacing: "-0.02em",
    },

    h4: {
      fontWeight: 700,
    },

    h5: {
      fontWeight: 600,
    },

    h6: {
      fontWeight: 600,
    },

    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 18,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          minHeight: "100%",
          scrollBehavior: "smooth",
        },
        body: {
          margin: 0,
          minHeight: "100%",
          background: `radial-gradient(circle at top, rgba(0,230,118,0.12), transparent 28%), radial-gradient(circle at bottom right, rgba(0,184,255,0.16), transparent 30%), #07111D`,
          backgroundAttachment: "fixed",
          overflowX: "hidden",
          color: "#fff",
          fontFamily: "'Poppins', sans-serif",
        },
        "#root": {
          minHeight: "100vh",
        },
        "*::-webkit-scrollbar": {
          width: 6,
        },
        "*::-webkit-scrollbar-thumb": {
          background: "#00E676",
          borderRadius: 20,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 14,
          padding: "12px 22px",
        },
      },
    },
  },
});

export default theme;