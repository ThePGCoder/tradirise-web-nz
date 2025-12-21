// components/VehiclesTab.tsx
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

import { deleteVehicleListing } from "../../actions";
import VehicleCard from "../cards/VehicleCard";
import { VehicleWithProfile } from "../../page";
import EmptyResult from "@/components/EmptyResult";

interface VehiclesTabProps {
  initialVehicles: VehicleWithProfile[];
  onCountChange?: (count: number) => void;
}

const VehiclesTab: React.FC<VehiclesTabProps> = ({
  initialVehicles,
  onCountChange,
}) => {
  const [vehicles, setVehicles] =
    useState<VehicleWithProfile[]>(initialVehicles);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: VehicleWithProfile | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(vehicles.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vehicles.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/vehicles/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/vehicles/view/${id}`);
  };

  const handleDeleteClick = (
    item: VehicleWithProfile,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deleteVehicleListing(deleteDialog.item!.id);

        setVehicles((prev) =>
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
        {vehicles.length > 0 ? (
          vehicles.filter(Boolean).map((vehicle) => (
            <Grid
              key={vehicle.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <VehicleCard
                vehicle={vehicle}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={handleViewDetails}
                onClick={handleViewDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-vehicles" size={12}>
            <EmptyResult
              icon="mdi:truck"
              description="Create your first vehicle listing to get started."
              title="No Vehicle Listings Found"
              showButton={true}
              buttonText="Add Vehicle"
              onButtonClick={() =>
                router.push("/listings/marketplace/vehicles/add-vehicle")
              }
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
            Are you sure you want to delete the vehicle listing for{" "}
            <strong>
              {deleteDialog.item
                ? `${deleteDialog.item.year} ${deleteDialog.item.make} ${deleteDialog.item.model}`
                : "this vehicle"}
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

export default VehiclesTab;
