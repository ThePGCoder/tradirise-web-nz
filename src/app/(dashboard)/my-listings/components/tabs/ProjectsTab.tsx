// components/ProjectsTab.tsx
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

import { deleteProjectListing } from "../../actions";
import ProjectCard from "../cards/ProjectCard";
import EmptyResult from "@/components/EmptyResult";

interface Project {
  id: string;
  title: string;
  required_trades: string[];
  price_range: string;
  region: string;
  description: string;
  proposed_start_date: string;
  posted_date: string;
  profiles?: {
    username: string;
    avatar_url: string;
    first_name: string;
    last_name: string;
  } | null;
  businesses?: {
    business_name: string;
    logo_url: string;
  } | null;
  posted_by: string;
  auth_id?: string;
}

interface ProjectsTabProps {
  initialProjects: Project[];
  onCountChange?: (count: number) => void;
}

const ProjectsTab: React.FC<ProjectsTabProps> = ({
  initialProjects,
  onCountChange,
}) => {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [error, setError] = useState<string | null>(null);
  const [deleteDialog, setDeleteDialog] = useState<{
    open: boolean;
    item: Project | null;
  }>({ open: false, item: null });
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  // Notify parent component of count changes
  useEffect(() => {
    if (onCountChange) {
      onCountChange(projects.length);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [projects.length]);

  const handleEdit = (id: string) => {
    router.push(`/my-listings/projects/edit/${id}`);
  };

  const handleViewDetails = (id: string) => {
    router.push(`/my-listings/projects/view/${id}`);
  };

  const handleDeleteClick = (item: Project, event: React.MouseEvent) => {
    event.stopPropagation();
    setDeleteDialog({ open: true, item });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteDialog.item) return;

    startTransition(async () => {
      try {
        await deleteProjectListing(deleteDialog.item!.id);

        // Remove from local state on success
        setProjects((prev) =>
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
        {projects.length > 0 ? (
          projects.map((project) => (
            <Grid
              key={project.id}
              size={{ xs: 12, sm: 12, md: 12, lg: 6, xl: 4 }}
            >
              <ProjectCard
                project={project}
                onEdit={handleEdit}
                onDelete={handleDeleteClick}
                onViewDetails={handleViewDetails}
              />
            </Grid>
          ))
        ) : (
          <Grid key="no-projects" size={12}></Grid>
        )}
      </Grid>

      <EmptyResult
        icon="mingcute:house-fill"
        description="Create your first project listing to get started."
        title="No Project Listings Found"
        showButton={true}
        buttonText="Add Project"
        onButtonClick={() => router.push("/create/project")}
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
            Are you sure you want to delete the project listing for{" "}
            <strong>{deleteDialog.item?.title || "this project"}</strong>? This
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

export default ProjectsTab;
