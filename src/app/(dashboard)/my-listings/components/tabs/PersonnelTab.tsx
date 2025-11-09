// components/PersonnelTab.tsx (Refactored with PersonnelCard)
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

import { deletePersonnelListing } from "../../actions";
import PersonnelCard from "../cards/PersonnelCard";
import { PersonnelWithProfile } from "../../page";
import EmptyResult from "@/components/EmptyResult";

interface PersonnelTabProps {
  initialPersonnel: PersonnelWithProfile[];
  onCountChange?: (count: number) => void;
}

const PersonnelTab: React.FC<PersonnelTabProps> = ({
  initialPersonnel,
  onCountChange,
}) => {
  const [personnelAds, setPersonnelAds] =
    useState<PersonnelWithProfile[]>(initialPersonnel);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: PersonnelWithProfile | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(personnelAds.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [personnelAds.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/personnel/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/personnel/view/${id}`);
  };

  const handleDeleteClick = (
    item: PersonnelWithProfile,
    event: React.MouseEvent
  ) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deletePersonnelListing(deleteDialog.item!.id);

        setPersonnelAds((prev) =>
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
        {personnelAds.length > 0 ? (
          personnelAds.map((person) => (
            <Grid
              key={person.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <PersonnelCard
                person={person}
                showContactDetails={false}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onView={handleViewDetails}
                onClick={handleViewDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-personnel" size={12}>
            <EmptyResult
              icon="entypo:v-card"
              description="Create your first personnel listing to get started."
              title="No Personnel Listings Found"
              showButton={true}
              buttonText="Add Personnel"
              onButtonClick={() => router.push("/create/personnel")}
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
            Are you sure you want to delete the personnel listing for{" "}
            <strong>
              {deleteDialog.item?.primary_trade_role || "this position"}
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

export default PersonnelTab;
