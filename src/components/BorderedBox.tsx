import { BoxProps } from "@mui/material";
import { ReactNode } from "react";

interface BorderedBoxProps extends BoxProps {
  chilren: ReactNode;
}

const BorderedBox: React.FC<BorderedBoxProps> = () => {
  return <>BorderedBox</>;
};

export default BorderedBox;
