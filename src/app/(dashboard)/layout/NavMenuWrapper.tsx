import { getUser } from "@/utils/supabase/server";
import { publicNavData, protectedNavData } from "@/lib/data/navItemData";
import NavMenu from "./NavMenu";

interface NavMenuWrapperProps {
  toggleDrawer?: () => void;
}

const NavMenuWrapper = async ({ toggleDrawer }: NavMenuWrapperProps) => {
  const user = await getUser();
  const navData = user ? protectedNavData : publicNavData;

  return <NavMenu navData={navData} toggleDrawer={toggleDrawer} />;
};

export default NavMenuWrapper;
