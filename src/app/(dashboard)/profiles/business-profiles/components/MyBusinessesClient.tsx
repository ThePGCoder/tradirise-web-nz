"use client";

import React, { useEffect, useState, useTransition } from "react";

import {
  Grid,
  Button,
  Alert,
  Box,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { Business } from "@/types/business";

import { deleteBusinessListing } from "@/app/(dashboard)/my-listings/actions";
import BusinessCard from "./BusinessCard";

import EmptyResult from "@/components/EmptyResult";
import PageHeader from "@/components/PageHeader";

interface MyBusinessesClientProps {
  initialBusinesses: Business[];
  onCountChange?: (count: number) => void;
}

const MyBusinessesClient: React.FC<MyBusinessesClientProps> = ({
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
    router.push(`/profiles/business-profiles/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/profiles/business-profiles/view/${id}`);
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

  if (businesses.length === 0) {
    return (
      <EmptyResult
        icon="ic:baseline-business"
        title="No Business Listings Found"
        description="Add a business to see it here."
        onButtonClick={() =>
          router.push("/profiles/business-profiles/add-business")
        }
        showButton={true}
        buttonText="Add a Business"
      />
    );
  }

  return (
    <Box pt={10}>
      <PageHeader title={"My Businesses"} />
      <Grid container columnSpacing={4} rowGap={4}>
        {businesses.map((business) => (
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
        ))}
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

export default MyBusinessesClient;
