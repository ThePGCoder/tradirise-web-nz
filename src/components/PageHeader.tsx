import { Typography } from "@mui/material";

interface PageHeaderProps {
  title: string;
  description?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description }) => {
  return (
    <>
      <Typography variant="h4" py={3} fontWeight={500}>
        {title}
      </Typography>
      {description && <Typography pb={2}>{description}</Typography>}
    </>
  );
};

export default PageHeader;
