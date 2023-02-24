import { Box, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { memo } from "react";
import classes from "../../styles.module.scss";
import { DashboardOutlined } from "@mui/icons-material";
import images from "config/images";
import Heading2 from "components/common/text/Heading2";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading4 from "components/common/text/Heading4";

interface Props {}

const ReportNotStarted = memo(({}: Props) => {

  return (
    <Grid className={classes.descriptionWrapper}>
      <Box className={classes.imageDescription}>
        <img src={images.imgProjectScheduled} alt="" />
      </Box>
      <Box className={classes.description}>
        <Heading2 mb={1}>Project scheduled</Heading2>
        <ParagraphBody $colorName="--eerie-black" mb={4} className={classes.descriptionSubTitle}>
          Your project has been scheduled, the fieldwork will begin in early <span>December 2022.</span>
        </ParagraphBody>
        <Button
          btnType={BtnType.Primary}
          disabled
          children={
            <Heading4 $colorName="--gray-80" $fontWeight={500} translation-key="">
              Results not ready
            </Heading4>
          }
          startIcon={<DashboardOutlined sx={{ fontSize: "22px !important" }} />}
          sx={{ width: { xs: "100%", sm: "auto" } }}
        />
      </Box>
    </Grid>
  );
});

export default ReportNotStarted;
