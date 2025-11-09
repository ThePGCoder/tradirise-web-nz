"use client";

import { useState } from "react";

export function useToggle() {
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };

  return { open, toggleOpen };
}
