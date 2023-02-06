/* eslint-disable jsx-a11y/anchor-is-valid */
import { memo } from "react";
import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { useTranslation } from "react-i18next";
import AccordionDetails from "@mui/material/AccordionDetails";
import Heading4 from "components/common/text/Heading4";
import Heading6 from "components/common/text/Heading6";
import ParagraphBody from "components/common/text/ParagraphBody";
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
          <Heading4 $colorName={"--cimigo-blue"}>Order summary</Heading4>
        </AccordionSummary>
        <AccordionDetails>
          <BoxCustom py={2} mt={1} $borderTop={true}>
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
          </BoxCustom>
          <BoxCustom $borderTop={true} $paddingTop={true}>
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
          </BoxCustom>
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
