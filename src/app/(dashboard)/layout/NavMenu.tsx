import { NavProps } from "@/types/navItem";
import { Box } from "@mui/material";
import React from "react";
import NavItem from "./NavItem";

interface NavMenuProps {
  navData: NavProps[];
  toggleDrawer?: () => void;
}

const NavMenu: React.FC<NavMenuProps> = ({ navData, toggleDrawer }) => {
  return (
    <Box>
      {navData.map((item) => (
        <Box key={item.title} my={1.5}>
          <NavItem item={item} toggleDrawer={toggleDrawer} />
        </Box>
      ))}
    </Box>
  );
};

export default NavMenu;
