/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import classes from "./styles.module.scss";
import Grid from "@mui/material/Grid";
import { useTranslation } from "react-i18next";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import Heading4 from "components/common/text/Heading5";
import Heading6 from "components/common/text/Heading6";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import AccordionSummary from "../AccordionSummary";

const Ordersummary = memo(() => {
  const { t } = useTranslation();
  const { configs } = useSelector((state: ReducerType) => state.user);

  return (
    <Box mb={2}>
      <Accordion className={classes.accordion}>
        <AccordionSummary className={classes.accordionSummary} aria-controls="panel1a-content">
          <Heading4 $colorName={"--cimigo-blue"}>Order summary</Heading4>
        </AccordionSummary>
        <AccordionDetails className={classes.accordionDetails}>
          <Grid component="div" py={2} mt={1} className={classes.box}>
            <ParagraphBody display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                Brand track (3 months)
              </Heading6>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="">
                150,000,000 đ
              </Heading6>
            </ParagraphBody>
            <ParagraphExtraSmall $colorName={"--gray-60"}>Dec 2022 - Feb 2023</ParagraphExtraSmall>
            <ParagraphExtraSmall $colorName={"--gray-60"}>Project ID: 6</ParagraphExtraSmall>
          </Grid>
          <Grid component="div" pt={2} className={classes.box}>
            <ParagraphBody display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <ParagraphSmall color={"var(--gray-60)"} translation-key="common_vat">
                {t("common_sub_total")}
              </ParagraphSmall>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"}>
                150,000,000 đ
              </Heading6>
            </ParagraphBody>
            <ParagraphBody display={"flex"} alignItems={"center"} justifyContent={"space-between"}>
              <ParagraphSmall color={"var(--gray-60)"} translation-key="common_vat">
                {t("common_vat", { percent: (configs?.vat || 0) * 100 })}
              </ParagraphSmall>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"}>
                15,000,000 đ
              </Heading6>
            </ParagraphBody>
          </Grid>
          <Box display={"flex"} alignItems={"center"} justifyContent={"space-between"} pt={3}>
            <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="common_total">
              {t("common_total")}
            </Heading4>
            <Heading4 $fontWeight={500} $colorName={"--eerie-black"}>
              165,000,000 đ
            </Heading4>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

export default Ordersummary;
