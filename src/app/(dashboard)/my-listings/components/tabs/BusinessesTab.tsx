"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Box,
  Alert,
  Grid,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { deleteBusinessListing } from "../../actions";
import BusinessCard from "../cards/BusinessCard";
import { Business } from "@/types/business";
import EmptyResult from "@/components/EmptyResult";

interface BusinessesTabProps {
  initialBusinesses: Business[];
  onCountChange?: (count: number) => void;
}

const BusinessesTab: React.FC<BusinessesTabProps> = ({
  initialBusinesses,
  onCountChange,
}) => {
  const [businesses, setBusinesses] = useState<Business[]>(initialBusinesses);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: Business | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(businesses.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businesses.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/businesses/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/businesses/view/${id}`);
  };

  const handleDeleteClick = (id: string) => {
    const business = businesses.find((b) => b.id === id);
    if (business) {
      setDeleteDialog({ open: true, item: business });
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deleteBusinessListing(deleteDialog.item!.id);

        // Remove from local state on success
        setBusinesses((prev) =>
          prev.filter((item) => item.id !== deleteDialog.item!.id)
        );
        setDeleteDialog({ open: false, item: null });
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete");
      }
    });
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, item: null });
  };

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box>
      <Grid container columnSpacing={4} rowGap={4}>
        {businesses.length > 0 ? (
          businesses.map((business) => (
            <Grid
              key={business.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <BusinessCard
                data={business}
                onViewDetails={handleViewDetails}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-businesses" size={12}>
            <EmptyResult
              icon="ic:baseline-business"
              description="Register your first business to get started."
              title="No Business Listings Found"
              showButton={true}
              buttonText="Add Business"
              onButtonClick={() => router.push("/create/business")}
              height="calc(100vh * 0.6)"
            />
          </Grid>
        )}
      </Grid>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialog.open}
        onClose={handleDeleteCancel}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <DialogTitle id="delete-dialog-title">Confirm Deletion</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-dialog-description">
            Are you sure you want to delete the business listing for{" "}
            <strong>
              {deleteDialog.item?.business_name || "this business"}
            </strong>
            ? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel} disabled={isPending}>
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isPending}
            startIcon={
              isPending ? (
                <CircularProgress size={16} />
              ) : (
                <Icon icon="mdi:delete" width={16} height={16} />
              )
            }
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BusinessesTab;
