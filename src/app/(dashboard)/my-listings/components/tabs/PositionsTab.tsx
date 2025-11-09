// components/PositionsTab.tsx
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
import PositionsCard from "../cards/PositionCard";

import { deletePositionListing } from "../../actions";
import { PositionWithProfiles } from "../../page";
import EmptyResult from "@/components/EmptyResult";

interface PositionsTabProps {
  initialPositions: PositionWithProfiles[];
  onCountChange?: (count: number) => void;
}

const PositionsTab: React.FC<PositionsTabProps> = ({
  initialPositions,
  onCountChange,
}) => {
  const [positionAds, setPositionAds] =
    useState<PositionWithProfiles[]>(initialPositions);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: PositionWithProfiles | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(positionAds.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [positionAds.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/positions/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/positions/view/${id}`);
  };

  const handleDeleteClick = (
    item: PositionWithProfiles,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deletePositionListing(deleteDialog.item!.id);

        // Remove from local state on success
        setPositionAds((prev) =>
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
        {positionAds.length > 0 ? (
          positionAds.map((position) => (
            <Grid
              key={position.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <PositionsCard
                position={position}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onViewDetails={handleViewDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-positions" size={12}></Grid>
        )}
      </Grid>

      <EmptyResult
        icon="fluent:person-star-16-filled"
        description="Create your first position listing to get started."
        title="No Position Listings Found"
        showButton={true}
        buttonText="Add Position"
        onButtonClick={() => router.push("/create/position")}
        height="calc(100vh * 0.6)"
      />

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
            Are you sure you want to delete the position listing for{" "}
            <strong>{deleteDialog.item?.title || "this position"}</strong>? This
            action cannot be undone.
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

export default PositionsTab;
