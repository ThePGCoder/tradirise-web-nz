"use client";

import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface PaymentCancelModalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentCancelModal: React.FC<PaymentCancelModalProps> = ({
  open,
  onClose,
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          textAlign: "center",
        },
      }}
    >
      <DialogContent sx={{ pt: 6, pb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 3,
          }}
        >
          <Box
            sx={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "warning.light",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon
              icon="mdi:alert-circle"
              width={50}
              height={50}
              color="warning.main"
            />
          </Box>
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, userSelect: "none" }}
        >
          Payment Canceled
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, userSelect: "none" }}
        >
          Your payment was canceled. No charges were made to your account. You
          can try again whenever you&apos;re ready.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 4, px: 3, gap: 2 }}>
        <Button
          variant="text"
          size="large"
          onClick={onClose}
          sx={{ minWidth: 150, userSelect: "none" }}
        >
          Close
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={onClose}
          startIcon={<Icon icon="mdi:credit-card" />}
          sx={{ minWidth: 150, userSelect: "none" }}
        >
          Try Again
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentCancelModal;
