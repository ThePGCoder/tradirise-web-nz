import { Icon } from "@iconify/react";
import { CardContent, Typography, Grid } from "@mui/material";
import { Center } from "./Center";
import InnerCustomCard from "./InnerCustomCard";
import React from "react";
import Flex from "@/global/Flex";

interface DisplayBoxProps {
  title: string;
  icon: string;
  items: {
    itemTitle: string;
    itemDescription: string | React.ReactNode;
  }[];
}

const DisplayBox: React.FC<DisplayBoxProps> = ({ title, icon, items }) => {
  return (
    <InnerCustomCard>
      <CardContent>
        <Center pb={2}>
          <Grid
            container
            alignItems="center"
            justifyContent="center"
            spacing={1}
          >
            <Grid>
              <Flex color="primary.main" alignItems="center">
                <Icon icon={icon} height={20} />
              </Flex>
            </Grid>
            <Grid>
              <Typography variant="body1" fontWeight={600}>
                {title}
              </Typography>
            </Grid>
          </Grid>
        </Center>

        <Grid container spacing={2}>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              <Grid size={5}>
                <Typography variant="body2" fontWeight={600} textAlign="right">
                  {item.itemTitle}
                </Typography>
              </Grid>
              <Grid size={7}>
                {typeof item.itemDescription === "string" ? (
                  <Typography variant="body2">
                    {item.itemDescription}
                  </Typography>
                ) : (
                  <div style={{ fontSize: "0.875rem", lineHeight: "1.43" }}>
                    {item.itemDescription}
                  </div>
                )}
              </Grid>
            </React.Fragment>
          ))}
        </Grid>
      </CardContent>
    </InnerCustomCard>
  );
};

export default DisplayBox;
