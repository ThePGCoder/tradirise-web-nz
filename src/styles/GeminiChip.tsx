import { Chip, ChipProps, styled } from "@mui/material";

// Create a styled Chip component that looks like Google Gemini's chips
export const GeminiChip = styled(Chip)<ChipProps>(({ theme }) => ({
  backgroundColor: "#E8F0FE", // Light blue background (Google blue)
  color: "#1967D2", // Blue text (Google blue)
  border: "none",
  fontWeight: 500,
  fontSize: "0.75rem",
  height: "28px",
  borderRadius: "14px",

  // Hover state
  "&:hover": {
    backgroundColor: "#D2E3FC", // Slightly darker blue on hover
    color: "#1557B0",
  },

  // Focus state
  "&:focus": {
    backgroundColor: "#D2E3FC",
    color: "#1557B0",
  },

  // Delete icon styling (if using deletable chips)
  "& .MuiChip-deleteIcon": {
    color: "#1967D2",
    fontSize: "16px",
    "&:hover": {
      color: "#1557B0",
    },
  },

  // Dark mode support
  ...(theme.palette.mode === "dark" && {
    backgroundColor: "#1E3A8A", // Dark blue background for dark mode
    color: "#93C5FD", // Light blue text for dark mode
    "&:hover": {
      backgroundColor: "#1E40AF",
      color: "#BFDBFE",
    },
    "&:focus": {
      backgroundColor: "#1E40AF",
      color: "#BFDBFE",
    },
    "& .MuiChip-deleteIcon": {
      color: "#93C5FD",
      "&:hover": {
        color: "#BFDBFE",
      },
    },
  }),
}));
