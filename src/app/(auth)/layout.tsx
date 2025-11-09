import React, { ReactNode } from "react";

import { Box } from "@mui/material";
import Header from "./layout/Header";

//import { createClient } from "@/utils/supabase/server";
//import { redirect } from "next/navigation";

interface AuthLayoutProps {
  children: ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = async ({ children }) => {
  //const supabase = await createClient();

  /*const { data, error } = await supabase.auth.getClaims();
  if (!error && data?.claims) {
    redirect("/home2");
  }*/
  return (
    <Box>
      <Header />
      <Box>{children}</Box>
    </Box>
  );
};

export default AuthLayout;
