import { createTheme } from "@mui/material";
import {
  blue,
  orange,
  red,
  green,
  amber,
  purple,
  grey,
} from "@mui/material/colors";

// Add this interface to extend Material-UI's typography variants
declare module "@mui/material/styles" {
  interface TypographyVariants {
    body3: React.CSSProperties;
  }

  interface TypographyVariantsOptions {
    body3?: React.CSSProperties;
  }

  interface Palette {
    dusk: Palette["primary"];
  }

  interface PaletteOptions {
    dusk?: PaletteOptions["primary"];
  }
}

// Update the Typography's variant prop options
declare module "@mui/material/Typography" {
  interface TypographyPropsVariantOverrides {
    body3: true;
  }
}

// Extend Button props to include dusk color
declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    dusk: true;
  }
}

// Extend Chip props to include dusk color
declare module "@mui/material/Chip" {
  interface ChipPropsColorOverrides {
    dusk: true;
  }
}

export const lightBorder = "RGBA(0, 0, 0, 0.08)";
export const darkBorder = "RGBA(255, 255, 255, 0.08)";
export const lightShadow = "2px 2px 5px #646464";
export const darkShadow = `0px 0px 8px 2px ${orange[300]}`;
export const lightGradient = `linear-gradient(to bottom, ${orange[200]} 30%, ${orange[400]} 90%)`;
export const darkGradient = `linear-gradient(to bottom, ${orange[600]} 30%, ${orange[800]} 90%)`;
export const darkText = "#0d1720";

export const darkGlowHover = `-0.5px -0.5px 5px 2px ${orange[300]}`;

export const lightRadial = `radial-gradient(circle, #ffffff 50%, #E2E8F0 66%)`;
export const darkRadial = `radial-gradient(circle, #323232 33%, ${grey[900]} 66%)`;

// Light theme gradients
export const lightSuccessGradient = `linear-gradient(to bottom, ${green[400]} 30%, ${green[600]} 90%)`;
export const lightErrorGradient = `linear-gradient(to bottom, ${red[400]} 30%, ${red[600]} 90%)`;
export const lightInfoGradient = `linear-gradient(to bottom, ${blue[400]} 30%, ${blue[600]} 90%)`;
export const lightWarningGradient = `linear-gradient(to bottom, ${amber[400]} 30%, ${amber[600]} 90%)`;
export const lightSecondaryGradient = `linear-gradient(to bottom, ${purple[400]} 30%, ${purple[600]} 90%)`;
export const lightDuskGradient = `linear-gradient(to bottom, ${grey[800]} 30%, ${grey[900]} 90%)`;

// Dark theme gradients - lighter with dark text
export const darkSuccessGradient = `linear-gradient(to bottom, ${green[200]} 30%, ${green[300]} 90%)`;
export const darkErrorGradient = `linear-gradient(to bottom, ${red[200]} 30%, ${red[300]} 90%)`;
export const darkInfoGradient = `linear-gradient(to bottom, ${blue[200]} 30%, ${blue[300]} 90%)`;
export const darkWarningGradient = `linear-gradient(to bottom, ${amber[200]} 30%, ${amber[300]} 90%)`;
export const darkSecondaryGradient = `linear-gradient(to bottom, ${purple[200]} 30%, ${purple[300]} 90%)`;
export const darkDuskGradient = `linear-gradient(to bottom, ${grey[800]} 30%, ${grey[900]} 90%)`;

export const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: { main: orange[800] },
    secondary: { main: blue[600] },
    error: { main: red[600] },
    success: { main: green[600] },
    info: { main: blue[600] },
    warning: { main: amber[600] },
    dusk: { main: grey[900] },
    background: {
      default: "#E2E8F0",
    },
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.43,
      letterSpacing: "0.01071em",
      fontWeight: 400,
    },
    body3: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.01071em",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: lightRadial,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundImage: darkGradient,
          color: "#fff",
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorSuccess: {
          backgroundImage: lightSuccessGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorError: {
          backgroundImage: lightErrorGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorInfo: {
          backgroundImage: lightInfoGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorWarning: {
          backgroundImage: lightWarningGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorSecondary: {
          backgroundImage: lightSecondaryGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        outlined: {
          borderWidth: 2,
          "&.MuiChip-colorPrimary": {
            borderColor: orange[800],
            color: orange[800],
            "&:hover": {
              backgroundColor: orange[50],
            },
          },
          "&.MuiChip-colorSuccess": {
            borderColor: green[600],
            color: green[600],
            "&:hover": {
              backgroundColor: green[50],
            },
          },
          "&.MuiChip-colorError": {
            borderColor: red[600],
            color: red[600],
            "&:hover": {
              backgroundColor: red[50],
            },
          },
          "&.MuiChip-colorInfo": {
            borderColor: blue[600],
            color: blue[600],
            "&:hover": {
              backgroundColor: blue[50],
            },
          },
          "&.MuiChip-colorWarning": {
            borderColor: amber[600],
            color: amber[600],
            "&:hover": {
              backgroundColor: amber[50],
            },
          },
          "&.MuiChip-colorSecondary": {
            borderColor: purple[600],
            color: purple[600],
            "&:hover": {
              backgroundColor: purple[50],
            },
          },
        },
      },
    },

    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          "&.Mui-disabled": {
            backgroundColor: grey[300],
            color: grey[600],
            backgroundImage: "none",
            opacity: 1,
            border: `1px solid ${grey[400]}`,
          },
        },
        containedPrimary: {
          backgroundImage: darkGradient,
          color: "#fff",
          "&:hover": {
            boxShadow: lightShadow,
          },
        },
        containedSuccess: {
          backgroundImage: lightSuccessGradient,
          color: "#fff",
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${green[300]} 30%, ${green[500]} 90%)`,
            boxShadow: lightShadow,
          },
        },
        containedInfo: {
          backgroundImage: lightInfoGradient,
          color: "#fff",
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${blue[300]} 30%, ${blue[500]} 90%)`,
            boxShadow: lightShadow,
          },
        },
        containedWarning: {
          backgroundImage: lightWarningGradient,
          color: "#fff",
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${amber[300]} 30%, ${amber[500]} 90%)`,
            boxShadow: lightShadow,
          },
        },
        contained: {
          "&.MuiButton-colorDusk": {
            backgroundImage: lightDuskGradient,
            color: "#fff",
            "&:hover": {
              backgroundImage: `linear-gradient(to bottom, ${grey[700]} 30%, ${grey[800]} 90%)`,
              boxShadow: lightShadow,
            },
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
          "&.Mui-disabled": {
            borderColor: grey[400],
            color: grey[500],
            opacity: 1,
          },
          "&.MuiButton-outlinedDusk": {
            borderColor: grey[900],
            color: grey[900],
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: grey[50],
              borderColor: grey[800],
            },
          },
        },
        text: {
          border: "1px solid",
          borderColor: lightBorder,
          "&.Mui-disabled": {
            borderColor: grey[300],
            color: grey[500],
            opacity: 1,
          },
          "&.MuiButton-textDusk": {
            color: grey[900],
            borderColor: lightBorder,
            "&:hover": {
              backgroundColor: grey[50],
              borderColor: grey[300],
            },
          },
        },
      },
    },

    MuiFab: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          "&.Mui-disabled": {
            backgroundColor: grey[300],
            color: grey[600],
            backgroundImage: "none",
            opacity: 1,
          },
        },
        primary: {
          backgroundImage: darkGradient,
          color: "#fff",
          "&:hover": {
            boxShadow: lightShadow,
          },
        },
        secondary: {
          backgroundImage: lightSecondaryGradient,
          color: "#fff",
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${purple[300]} 30%, ${purple[500]} 90%)`,
            boxShadow: lightShadow,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: orange[800],
            borderWidth: 2,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: orange[800],
            borderWidth: 2,
          },
        },
      },
    },
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: { main: orange[300] },
    secondary: { main: blue[300] },
    error: { main: red[300] },
    success: { main: green[300] },
    info: { main: blue[300] },
    warning: { main: amber[300] },
    dusk: { main: grey[700] },
    background: {
      default: grey[900],
      paper: "#2d2d2d",
    },
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
    body3: {
      fontSize: "0.75rem",
      lineHeight: 1.4,
      letterSpacing: "0.01071em",
      fontWeight: 400,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: darkRadial,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          backgroundAttachment: "fixed",
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        colorPrimary: {
          backgroundImage: lightGradient,
          color: darkText,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorSuccess: {
          backgroundImage: darkSuccessGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorError: {
          backgroundImage: darkErrorGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorInfo: {
          backgroundImage: darkInfoGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorWarning: {
          backgroundImage: darkWarningGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        colorSecondary: {
          backgroundImage: darkSecondaryGradient,
          "&.MuiChip-outlined": {
            backgroundImage: "none",
            backgroundColor: "transparent",
          },
        },
        outlined: {
          borderWidth: 2,
          "&.MuiChip-colorPrimary": {
            borderColor: orange[300],
            color: orange[300],
            "&:hover": {
              backgroundColor: orange[900],
            },
          },
          "&.MuiChip-colorSuccess": {
            borderColor: green[300],
            color: green[300],
            "&:hover": {
              backgroundColor: green[900],
            },
          },
          "&.MuiChip-colorError": {
            borderColor: red[300],
            color: red[300],
            "&:hover": {
              backgroundColor: red[900],
            },
          },
          "&.MuiChip-colorInfo": {
            borderColor: blue[300],
            color: blue[300],
            "&:hover": {
              backgroundColor: blue[900],
            },
          },
          "&.MuiChip-colorWarning": {
            borderColor: amber[300],
            color: amber[300],
            "&:hover": {
              backgroundColor: amber[900],
            },
          },
          "&.MuiChip-colorSecondary": {
            borderColor: purple[300],
            color: purple[300],
            "&:hover": {
              backgroundColor: purple[900],
            },
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        variant: "contained",
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          borderRadius: 6,
          "&.Mui-disabled": {
            backgroundColor: grey[700],
            color: grey[400],
            backgroundImage: "none",
            opacity: 1,
            border: `1px solid ${grey[600]}`,
          },
        },
        containedPrimary: {
          backgroundImage: lightGradient,
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${orange[300]} 30%, ${orange[400]} 90%)`,
            boxShadow: darkGlowHover,
          },
        },
        containedSuccess: {
          backgroundImage: darkSuccessGradient,
          color: darkText,
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${green[100]} 30%, ${green[200]} 90%)`,
            boxShadow: `0px 0px 8px 2px ${green[200]}`,
          },
        },
        containedInfo: {
          backgroundImage: darkInfoGradient,
          color: darkText,
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${blue[100]} 30%, ${blue[200]} 90%)`,
            boxShadow: `0px 0px 8px 2px ${blue[200]}`,
          },
        },
        containedWarning: {
          backgroundImage: darkWarningGradient,
          color: darkText,
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${amber[100]} 30%, ${amber[200]} 90%)`,
            boxShadow: `0px 0px 8px 2px ${amber[200]}`,
          },
        },
        contained: {
          "&.MuiButton-colorDusk": {
            backgroundImage: darkDuskGradient,
            color: "#fff",
            "&:hover": {
              backgroundImage: `linear-gradient(to bottom, ${grey[700]} 30%, ${grey[800]} 90%)`,
              boxShadow: `0px 0px 8px 2px ${grey[700]}`,
            },
          },
        },
        outlined: {
          borderWidth: "2px",
          "&:hover": {
            borderWidth: "2px",
          },
          "&.Mui-disabled": {
            borderColor: grey[600],
            color: grey[500],
            opacity: 1,
          },
          "&.MuiButton-outlinedDusk": {
            borderColor: grey[700],
            color: grey[300],
            backgroundColor: "transparent",
            "&:hover": {
              backgroundColor: grey[800],
              borderColor: grey[600],
            },
          },
        },
        text: {
          border: "1px solid",
          borderColor: darkBorder,
          "&.Mui-disabled": {
            borderColor: grey[700],
            color: grey[500],
            opacity: 1,
          },
          "&.MuiButton-textDusk": {
            color: "#fff",
            borderColor: darkBorder,
            "&:hover": {
              backgroundColor: grey[800],
              borderColor: grey[600],
            },
          },
        },
      },
    },

    MuiFab: {
      defaultProps: {
        color: "primary",
      },
      styleOverrides: {
        root: {
          textTransform: "none",
          "&.Mui-disabled": {
            backgroundColor: grey[700],
            color: grey[400],
            backgroundImage: "none",
            opacity: 1,
          },
        },
        primary: {
          backgroundImage: lightGradient,
          color: darkText,
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${orange[300]} 30%, ${orange[400]} 90%)`,
            boxShadow: darkGlowHover,
          },
        },
        secondary: {
          backgroundImage: darkSecondaryGradient,
          color: darkText,
          "&:hover": {
            backgroundImage: `linear-gradient(to bottom, ${purple[100]} 30%, ${purple[200]} 90%)`,
            boxShadow: `0px 0px 5px 1px ${purple[200]}`,
          },
        },
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: orange[300],
            borderWidth: 2,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: orange[300],
            borderWidth: 2,
          },
        },
      },
    },
  },
});
