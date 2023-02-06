import { Box, Divider } from "@mui/material"
import classes from "./styles.module.scss";
import Heading3 from "components/common/text/Heading3"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { TotalPrice } from "helpers/price"
import { Project } from "models/project"
import { memo } from "react"
import { useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"
import { useTranslation } from "react-i18next"
import Heading4 from "components/common/text/Heading4"
import { ArrowDropDown } from "@mui/icons-material"

interface CostSummaryBrandTrackProps {
  price: TotalPrice,
  project: Project
}

const CostSummaryBrandTrack = memo(({ project, price }: CostSummaryBrandTrackProps) => {

  const { t } = useTranslation()

  const { configs } = useSelector((state: ReducerType) => state.user)

  return (
    <>
      <Heading4 $colorName="--eerie-black" $fontWeight={"500"} mb={1} sx={{display: "flex", alignItems: "center", gap: "8px"}}>
        Monthly cost
        <ArrowDropDown/>
      </Heading4>
      <Divider sx={{ mb: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box>
          <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"}>Brand track</ParagraphSmall>
          <ParagraphExtraSmall $colorName="--gray-60" className={classes.itemSubTitle}>Sample size: <span>{project?.sampleSize}</span></ParagraphExtraSmall>
        </Box>
        <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"}>{price?.sampleSizeCost?.show}</ParagraphSmall>
      </Box>
      {project?.enableCustomQuestion && (
        <Box display="flex" justifyContent="space-between" mb={2}>
          <Box>
            <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"}>Custom questions</ParagraphSmall>
            <ParagraphExtraSmall $colorName="--gray-60" className={classes.itemSubTitle}>Question(s): <span>{project?.customQuestions?.length || 0}</span></ParagraphExtraSmall>
          </Box>
          <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"}>{price?.customQuestionCost?.show}</ParagraphSmall>
        </Box>
      )}
      <Divider sx={{ mt: 4, mb: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_sub_total">{t('common_sub_total')}</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"}>{price?.amountCost?.show}</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={3}>
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_vat">{t('common_vat', { percent: (configs?.vat || 0) * 100 })}</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black" $fontWeight={"500"}>{price?.vatCost?.show}</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mb={1}>
        <Heading4 $fontWeight={"bold"} $colorName="--eerie-black" translation-key="common_total_2">{t('common_total_2')}</Heading4>
        <Heading3 $fontWeight={500} $colorName="--eerie-black" align="right">{price?.totalAmountCost?.show}</Heading3>
      </Box>
      <Box display="flex" justifyContent="flex-end">
        <ParagraphSmall $colorName="--gray-80" align="right">*{project?.solution?.paymentMonthSchedule} months billing cycles</ParagraphSmall>
      </Box>
    </>
  )
})

export default CostSummaryBrandTrack