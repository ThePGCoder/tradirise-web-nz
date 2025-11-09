"use client";

import { useContext, useEffect } from "react";
import { ActiveRouteContext } from "../providers/ActiveRouteProvider";

interface SetActiveRouteProps {
  route: string;
}

const SetActiveRoute = ({ route }: SetActiveRouteProps) => {
  const { changeActiveRoute } = useContext(ActiveRouteContext);

  useEffect(() => {
    changeActiveRoute(route);
  }, [route, changeActiveRoute]);

  return null;
};

export default SetActiveRoute;
