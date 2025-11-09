"use client";

import { lightTheme, darkTheme } from "@/styles/theme";
import {
  createTheme,
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
} from "@mui/material";
import React, { createContext, ReactNode, useEffect, useState } from "react";
import { SnackbarProvider } from "notistack";

// Theme Provider Types and Context
type ThemeMode = "light" | "dark";
type ThemeContextType = {
  mode: ThemeMode;
  toggleTheme: () => void;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
  undefined
);

// Theme Provider Component
interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>("light");

  useEffect(() => {
    const savedMode = localStorage.getItem("color-mode") as ThemeMode;
    if (savedMode) {
      setMode(savedMode);
    }
  }, []);

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    localStorage.setItem("color-mode", newMode);

    // smooth transition
    const styleEl = document.createElement("style");
    styleEl.textContent =
      "html * { transition: color, background-color 0.2s ease-out!important }";
    document.head.appendChild(styleEl);
    setTimeout(() => {
      document.head.removeChild(styleEl);
    }, 300);
  };

  const theme = createTheme(mode === "light" ? lightTheme : darkTheme);

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        <SnackbarProvider
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          autoHideDuration={4000}
          maxSnack={3}
        >
          {children}
        </SnackbarProvider>
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
