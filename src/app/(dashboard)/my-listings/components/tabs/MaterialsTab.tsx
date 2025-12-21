// components/MaterialsTab.tsx
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

import { deleteMaterialListing } from "../../actions";
import MaterialCard from "../cards/MaterialCard";
import { MaterialWithProfile } from "../../page";
import EmptyResult from "@/components/EmptyResult";

interface MaterialsTabProps {
  initialMaterials: MaterialWithProfile[];
  onCountChange?: (count: number) => void;
}

const MaterialsTab: React.FC<MaterialsTabProps> = ({
  initialMaterials,
  onCountChange,
}) => {
  const [materials, setMaterials] =
    useState<MaterialWithProfile[]>(initialMaterials);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: MaterialWithProfile | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(materials.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [materials.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/materials/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/materials/view/${id}`);
  };

  const handleDeleteClick = (
    item: MaterialWithProfile,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deleteMaterialListing(deleteDialog.item!.id);

        setMaterials((prev) =>
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
        {materials.length > 0 ? (
          materials.filter(Boolean).map((material) => (
            <Grid
              key={material.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <MaterialCard
                material={material}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={handleViewDetails}
                onClick={handleViewDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-materials" size={12}>
            <EmptyResult
              icon="mdi:package-variant"
              description="Create your first material listing to get started."
              title="No Material Listings Found"
              showButton={true}
              buttonText="Add Material"
              onButtonClick={() => router.push("/create/materials")}
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
            Are you sure you want to delete the material listing for{" "}
            <strong>{deleteDialog.item?.title || "this material"}</strong>? This
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

export default MaterialsTab;
