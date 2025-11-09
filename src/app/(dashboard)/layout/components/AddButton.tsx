// src/app/(dashboard)/layout/AddButton.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Button,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Icon } from "@iconify/react";

interface AddOption {
  type: string;
  icon: string;
  route: string;
}

const addOptions: AddOption[] = [
  {
    type: "Personnel",
    icon: "mdi:account-circle",
    route: "/listings/personnel/add-personnel",
  },
  {
    type: "Position",
    icon: "fluent:person-star-16-filled",
    route: "/listings/positions/add-position",
  },
  {
    type: "Project",
    icon: "mingcute:house-fill",
    route: "/listings/projects/add-project",
  },
  {
    type: "Business",
    icon: "ic:baseline-business",
    route: "/profiles/business-profiles/add-business",
  },
];

const AddButton: React.FC = () => {
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMenuItemClick = (route: string) => {
    router.push(route);
    handleClose();
  };

  return (
    <Box position="fixed" bottom={20} right={20} zIndex={1000}>
      <Button
        size="large"
        variant="contained"
        startIcon={<Icon icon="mdi:plus" />}
        sx={{ borderRadius: 2 }}
        onClick={handleClick}
      >
        Add
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        PaperProps={{
          sx: {
            minWidth: 150,
            borderRadius: 2,
            mt: -1,
          },
        }}
      >
        {addOptions.map((option) => (
          <MenuItem
            key={option.type}
            onClick={() => handleMenuItemClick(option.route)}
            sx={{
              py: 1.5,
              "&:hover": {
                backgroundColor: "action.hover",
              },
            }}
          >
            <ListItemIcon>
              <Box color="primary.main">
                <Icon icon={option.icon} width={24} />
              </Box>
            </ListItemIcon>
            <ListItemText
              primary={option.type}
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </MenuItem>
        ))}
      </Menu>
    </Box>
  );
};

export default AddButton;
