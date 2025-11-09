"use client";

import { useSnackbar, VariantType } from "notistack";
import { useCallback } from "react";

export function useNotification() {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showNotification = useCallback(
    (message: string, variant: VariantType = "default") => {
      return enqueueSnackbar(message, { variant });
    },
    [enqueueSnackbar]
  );

  const success = useCallback(
    (message: string) => showNotification(message, "success"),
    [showNotification]
  );

  const error = useCallback(
    (message: string) => showNotification(message, "error"),
    [showNotification]
  );

  const warning = useCallback(
    (message: string) => showNotification(message, "warning"),
    [showNotification]
  );

  const info = useCallback(
    (message: string) => showNotification(message, "info"),
    [showNotification]
  );

  return {
    showNotification,
    success,
    error,
    warning,
    info,
    close: closeSnackbar,
  };
}
