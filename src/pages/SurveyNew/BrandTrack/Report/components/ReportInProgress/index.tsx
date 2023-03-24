import { Box, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import { memo } from "react";
import classes from "../../styles.module.scss";
import images from "config/images";
import Heading2 from "components/common/text/Heading2";
import ParagraphBody from "components/common/text/ParagraphBody";
import Heading4 from "components/common/text/Heading4";
import { useTranslation } from "react-i18next";

interface Props {
  dueDate: string
}

const ReportInProgress = memo(({ dueDate }: Props) => {
  const { t } = useTranslation();
  return (
    <Grid className={classes.descriptionWrapper}>
      <Box className={classes.imageDescription}>
        <img src={images.imgFieldworkInProgress} alt="" />
      </Box>
      <Box className={classes.description}>
        <Heading2 mb={1} translation-key="brand_track_results_tab_report_inprogress_title">
          {t("brand_track_results_tab_report_inprogress_title")}
        </Heading2>
        <ParagraphBody $colorName="--eerie-black" translation-key="brand_track_results_tab_report_inprogress_subtitle">
          {t("brand_track_results_tab_report_inprogress_subtitle")}
        </ParagraphBody>
        <ParagraphBody
          $colorName="--eerie-black"
          mb={4}
          className={classes.descriptionSubTitle}
          translation-key="brand_track_results_tab_report_inprogress_description"
          dangerouslySetInnerHTML={{ __html: t("brand_track_results_tab_report_inprogress_description", { dueDate: dueDate }) }}
        ></ParagraphBody>
        <Button
          btnType={BtnType.Primary}
          disabled
          children={
            <Heading4 $colorName="--gray-80" $fontWeight={500} translation-key="brand_track_results_tab_result_not_ready">
              {t("brand_track_results_tab_result_not_ready")}
            </Heading4>
          }
          sx={{ width: { xs: "100%", sm: "auto" } }}
        />
      </Box>
    </Grid>
  );
});

export default ReportInProgress;
