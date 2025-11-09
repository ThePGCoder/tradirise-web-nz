import { getUser } from "@/utils/supabase/server";
import { publicNavData, protectedNavData } from "@/lib/data/navItemData";
import NavMenu from "./NavMenu";

interface NavMenuServerProps {
  toggleDrawer?: () => void;
}

const NavMenuServer = async ({ toggleDrawer }: NavMenuServerProps) => {
  const user = await getUser();
  const navData = user ? protectedNavData : publicNavData;

  return <NavMenu navData={navData} toggleDrawer={toggleDrawer} />;
};

export default NavMenuServer;
