/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { useTranslation } from "react-i18next";
import AccordionDetails from "@mui/material/AccordionDetails";
import Heading4 from "components/common/text/Heading4";
import Heading6 from "components/common/text/Heading6";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import AccordionSummary from "../AccordionSummary";
import Accordion from "../../components/Accordion";
import BoxCustom from "../BoxCustom";
const Ordersummary = memo(() => {
  const { t } = useTranslation();
  const { configs } = useSelector((state: ReducerType) => state.user);

  return (
    <Box mb={2}>
      <Accordion $accordionOrderSummary={true}>
        <AccordionSummary aria-controls="panel1a-content">
          <Heading4 $colorName={"--cimigo-blue"} translation-key="payment_billing_sub_tab_payment_summary">
            {t("payment_billing_sub_tab_payment_summary")}
          </Heading4>
        </AccordionSummary>
        <AccordionDetails>
          <BoxCustom py={2} mt={1} $borderTop={true}>
            <BoxCustom $flexBox={true}>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"} translation-key="brand_track_paynow_popup_project_name">
                {t("brand_track_paynow_popup_project_name", { time: `3 ${t("common_month", { s: 3 > 1 ? t("common_s") : "" })}` })}
              </Heading6>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"}>
                150,000,000 đ
              </Heading6>
            </BoxCustom>
            <ParagraphExtraSmall $colorName={"--gray-60"}>Dec 2022 - Feb 2023</ParagraphExtraSmall>
            <ParagraphExtraSmall $colorName={"--gray-60"} translation-key="brand_track_paynow_popup_project_id">
              {t("brand_track_paynow_popup_project_id")}: 6
            </ParagraphExtraSmall>
          </BoxCustom>
          <BoxCustom $borderTop={true} pt={2}>
            <BoxCustom $flexBox={true}>
              <ParagraphSmall color={"var(--gray-60)"} translation-key="common_vat">
                {t("common_sub_total")}
              </ParagraphSmall>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"}>
                150,000,000 đ
              </Heading6>
            </BoxCustom>
            <BoxCustom $flexBox={true}>
              <ParagraphSmall color={"var(--gray-60)"} translation-key="common_vat">
                {t("common_vat", { percent: (configs?.vat || 0) * 100 })}
              </ParagraphSmall>
              <Heading6 $fontWeight={500} $colorName={"--eerie-black"}>
                15,000,000 đ
              </Heading6>
            </BoxCustom>
          </BoxCustom>
          <BoxCustom $flexBox={true} pt={3}>
            <Heading4 $fontWeight={500} $colorName={"--eerie-black"} translation-key="common_total">
              {t("common_total")}
            </Heading4>
            <Heading4 $fontWeight={500} $colorName={"--eerie-black"}>
              165,000,000 đ
            </Heading4>
          </BoxCustom>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
});

export default Ordersummary;
