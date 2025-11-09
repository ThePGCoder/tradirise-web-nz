"use client";

import React, { createContext, ReactNode, useState } from "react";

// Active Route Provider Types and Context
interface ActiveRouteContextType {
  activeRoute: string | null;
  changeActiveRoute: (route: string | null) => void;
}

export const ActiveRouteContext = createContext<ActiveRouteContextType>({
  activeRoute: null,
  changeActiveRoute: () => {},
});

// Active Route Provider Component
interface ActiveRouteProviderProps {
  children: ReactNode;
}

const ActiveRouteProvider: React.FC<ActiveRouteProviderProps> = ({
  children,
}) => {
  const [activeRoute, setActiveRoute] = useState<string | null>(null);

  const changeActiveRoute = (route: string | null) => {
    setActiveRoute(route);
  };

  return (
    <ActiveRouteContext.Provider value={{ activeRoute, changeActiveRoute }}>
      {children}
    </ActiveRouteContext.Provider>
  );
};

export default ActiveRouteProvider;
