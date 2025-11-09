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
import { useRouter } from "next/navigation";

interface PaymentSuccessModalProps {
  open: boolean;
  onClose: () => void;
}

const PaymentSuccessModal: React.FC<PaymentSuccessModalProps> = ({
  open,
  onClose,
}) => {
  const router = useRouter();

  const handleGoHome = () => {
    onClose();
    router.push("/account");
  };

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
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "success.main",
            }}
          >
            <Icon icon="mdi:check-circle" width={50} height={50} />
          </Box>
        </Box>

        <Typography
          variant="h4"
          gutterBottom
          sx={{ fontWeight: 600, userSelect: "none" }}
        >
          Payment Successful!
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 2, userSelect: "none" }}
        >
          Thank you for your purchase. Your subscription is now active and you
          have access to all premium features.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 4, px: 3 }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleGoHome}
          fullWidth
          startIcon={<Icon icon="mdi:close" />}
          sx={{ userSelect: "none" }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PaymentSuccessModal;
