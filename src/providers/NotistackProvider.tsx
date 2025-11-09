"use client";

import { SnackbarProvider } from "notistack";
import { ReactNode } from "react";
import { Slide } from "@mui/material";
import CustomSnackbar from "@/components/notifications/CustomSnackbar";

export default function NotistackProvider({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "center",
      }}
      autoHideDuration={4000}
      preventDuplicate
      TransitionComponent={Slide}
      Components={{
        success: CustomSnackbar,
        error: CustomSnackbar,
        warning: CustomSnackbar,
        info: CustomSnackbar,
      }}
    >
      {children}
    </SnackbarProvider>
  );
}
