// src/app/(dashboard)/layout/Layout.tsx
import { ReactNode } from "react";
import LayoutClient from "./LayoutClient";

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => {
  // ✅ No need to fetch user here - useUser hook handles it on client
  return <LayoutClient>{children}</LayoutClient>;
};

export default Layout;
