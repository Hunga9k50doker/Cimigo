import { Box, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { memo } from "react";
import classes from "../../styles.module.scss";
import images from "config/images";
import Heading2 from "components/common/text/Heading2";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading4 from "components/common/text/Heading4";
import { DashboardOutlined } from "@mui/icons-material";
import { IconDownload } from "components/icons";

interface Props {
  onOpenDashboard?: () => void;
  onDownLoad?: () => void;
  isHasReport: boolean;
}

const ReportDelivered = memo(({ onOpenDashboard, onDownLoad, isHasReport }: Props) => {
  return (
    <Grid className={classes.descriptionWrapper}>
      <Box className={classes.imageDescription}>
        <img src={images.imgDashboardReady} alt="" />
      </Box>
      <Box className={classes.description}>
        <Heading2 mb={1}>Dashboard ready!</Heading2>
        <ParagraphBody $colorName="--eerie-black" mb={4}>
          Access your results dashboard anywhere, intuitively and interactively.
        </ParagraphBody>
        <Box className={classes.actionWrapper}>
          <Button
            btnType={BtnType.Primary}
            children={
              <Heading4 $colorName="--white" $fontWeight={500} translation-key="">
                Access dashboard
              </Heading4>
            }
            startIcon={<DashboardOutlined sx={{ fontSize: "22.5px !important" }} />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            onClick={onOpenDashboard}
          />
          {isHasReport && (
            <Button
              btnType={BtnType.Outlined}
              children={
                <Heading4 $colorName="--cimigo-blue" $fontWeight={500} translation-key="">
                  Download results
                </Heading4>
              }
              startIcon={<IconDownload sx={{ fontSize: "16.5px !important" }} />}
              sx={{ width: { xs: "100%", sm: "auto" } }}
              onClick={onDownLoad}
            />
          )}
        </Box>
      </Box>
    </Grid>
  );
});

export default ReportDelivered;
