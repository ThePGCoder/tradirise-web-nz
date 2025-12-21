// components/PlantTab.tsx
"use client";

import { useEffect, useState, useTransition } from "react";
import {
  Box,
  Alert,
  Grid,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  CircularProgress,
  Button,
} from "@mui/material";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { deletePlantListing } from "../../actions";
import PlantCard from "../cards/PlantCard";
import { PlantWithProfile } from "../../page";
import EmptyResult from "@/components/EmptyResult";

interface PlantTabProps {
  initialPlant: PlantWithProfile[];
  onCountChange?: (count: number) => void;
}

const PlantTab: React.FC<PlantTabProps> = ({ initialPlant, onCountChange }) => {
  const [plant, setPlant] = useState<PlantWithProfile[]>(initialPlant);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: PlantWithProfile | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(plant.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plant.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/plant/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/plant/view/${id}`);
  };

  const handleDeleteClick = (
    item: PlantWithProfile,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deletePlantListing(deleteDialog.item!.id);

        setPlant((prev) =>
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
        {plant.length > 0 ? (
          plant.filter(Boolean).map((equipment) => (
            <Grid
              key={equipment.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <PlantCard
                equipment={equipment}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={handleViewDetails}
                onClick={handleViewDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-plant" size={12}>
            <EmptyResult
              icon="mdi:excavator"
              description="Create your first equipment listing to get started."
              title="No Equipment Listings Found"
              showButton={true}
              buttonText="Add Equipment"
              onButtonClick={() => router.push("/create/plant")}
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
            Are you sure you want to delete the equipment listing for{" "}
            <strong>{deleteDialog.item?.title || "this equipment"}</strong>?
            This action cannot be undone.
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

export default PlantTab;
