"use client";

import React, { ReactNode } from "react";
import ThemeProvider from "./ThemeProvider";
import ActiveRouteProvider from "./ActiveRouteProvider";
import NotistackProvider from "./NotistackProvider";

// Parent Provider that combines both providers
interface AppProvidersProps {
  children: ReactNode;
}

const AppProviders: React.FC<AppProvidersProps> = ({ children }) => {
  return (
    <ThemeProvider>
      <NotistackProvider>
        <ActiveRouteProvider>{children}</ActiveRouteProvider>
      </NotistackProvider>
    </ThemeProvider>
  );
};

export default AppProviders;
