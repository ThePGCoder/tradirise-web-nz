import Logo from "@/components/Logo";
import { Box } from "@mui/material";

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface TestingProps {}

const Testing: React.FC<TestingProps> = () => {
  return (
    <>
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 100px)"
        sx={{ userSelect: "none" }}
      >
        <Logo
          fontSize={100}
          iconHeight={100}
          countryFontSize={20}
          countryIconSize={20}
          countryLetterSpacing={10}
        />
      </Box>
    </>
  );
};

export default Testing;
