export interface NavProps {
  title: string;
  icon: string;
  link?: string;
  dropdown?: boolean;
  subMenu?: NavProps[];
}
