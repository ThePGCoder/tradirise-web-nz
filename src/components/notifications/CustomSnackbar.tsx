import { forwardRef, useCallback } from "react";
import { CustomContentProps, SnackbarContent, useSnackbar } from "notistack";
import {
  Card,
  CardActions,
  IconButton,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import Iconify from "@/components/Iconify";

interface CustomSnackbarProps extends CustomContentProps {
  allowDownload?: boolean;
}

const CustomSnackbar = forwardRef<HTMLDivElement, CustomSnackbarProps>(
  ({ id, message, variant, ...otherProps }, ref) => {
    const { closeSnackbar } = useSnackbar();
    const theme = useTheme();

    // Destructure and exclude notistack-specific props that shouldn't be passed to DOM
    const {
      ...props
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } = otherProps as any;

    const handleDismiss = useCallback(() => {
      closeSnackbar(id);
    }, [id, closeSnackbar]);

    // 🔸 Choose appropriate icon
    const getIcon = () => {
      switch (variant) {
        case "success":
          return (
            <Iconify
              icon="eva:checkmark-circle-2-fill"
              width={24}
              sx={{ color: "#fff" }}
            />
          );
        case "error":
          return (
            <Iconify
              icon="eva:alert-circle-fill"
              width={24}
              sx={{ color: "#fff" }}
            />
          );
        case "warning":
          return (
            <Iconify
              icon="eva:alert-triangle-fill"
              width={24}
              sx={{ color: "#fff" }}
            />
          );
        case "info":
          return (
            <Iconify icon="eva:info-fill" width={24} sx={{ color: "#fff" }} />
          );
        default:
          return null;
      }
    };

    // 🔸 Use MUI palette for solid backgrounds
    const getBackgroundColor = () => {
      switch (variant) {
        case "success":
          return theme.palette.success.main;
        case "error":
          return theme.palette.error.main;
        case "warning":
          return theme.palette.warning.main;
        case "info":
          return theme.palette.info.main;
        default:
          return theme.palette.background.paper;
      }
    };

    // 🧠 Ensure good text contrast
    const textColor =
      theme.palette.mode === "dark"
        ? theme.palette.getContrastText(theme.palette.grey[800])
        : theme.palette.getContrastText(getBackgroundColor());

    return (
      <SnackbarContent ref={ref} role="alert" {...props}>
        <Card
          sx={{
            minWidth: 288,
            maxWidth: 568,
            boxShadow: theme.shadows[8],
            backgroundColor: getBackgroundColor(),
            color: textColor,
            borderRadius: 2,
          }}
        >
          <CardActions
            sx={{
              padding: "8px 12px",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              {getIcon()}
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ color: textColor }}
              >
                {message}
              </Typography>
            </Box>
            <IconButton
              size="small"
              onClick={handleDismiss}
              sx={{ color: textColor }}
            >
              <Iconify icon="eva:close-fill" width={20} />
            </IconButton>
          </CardActions>
        </Card>
      </SnackbarContent>
    );
  }
);

CustomSnackbar.displayName = "CustomSnackbar";

export default CustomSnackbar;
