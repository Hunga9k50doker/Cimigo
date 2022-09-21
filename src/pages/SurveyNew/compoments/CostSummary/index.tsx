import { Box, Divider } from "@mui/material"
import Heading3 from "components/common/text/Heading3"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { TotalPrice } from "helpers/price"
import { Project } from "models/project"
import { memo } from "react"
import { useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"
import { fCurrency2, fCurrency2VND } from "utils/formatNumber"
import { useTranslation } from "react-i18next"

interface CostSummaryProps {
  price: TotalPrice,
  project: Project
}

const CostSummary = memo(({ project, price }: CostSummaryProps) => {

  const { t } = useTranslation()

  const { configs } = useSelector((state: ReducerType) => state.user)

  return (
    <>
      <ParagraphExtraSmall $colorName="--eerie-black" mb={2}>
        {t('setup_survey_cost_summary_title')}
      </ParagraphExtraSmall>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_sample_size">{t('common_sample_size')} ({project?.sampleSize || 0})</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">{`$`}{fCurrency2(price?.sampleSizeCostUSD || 0)}</ParagraphSmall>
      </Box>
      {project?.enableCustomQuestion && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
          <ParagraphSmall $colorName="--eerie-black" translation-key="common_custom_question">{t("common_custom_question")} ({project?.customQuestions?.length || 0})</ParagraphSmall>
          <ParagraphSmall $colorName="--eerie-black">{`$`}{fCurrency2(price?.customQuestionCostUSD)}</ParagraphSmall>
        </Box>
      )}
      {project.enableEyeTracking && (
        <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
          <ParagraphSmall $colorName="--eerie-black" translation-key="common_eye_tracking">{t('common_eye_tracking')} ({project?.eyeTrackingSampleSize || 0})</ParagraphSmall>
          <ParagraphSmall $colorName="--eerie-black">{`$`}{fCurrency2(price?.eyeTrackingSampleSizeCostUSD || 0)}</ParagraphSmall>
        </Box>
      )}
      <Divider sx={{ my: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_sub_total">{t('common_sub_total')}</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">{`$`}{fCurrency2(price?.amountUSD || 0)}</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
        <ParagraphSmall $colorName="--eerie-black" translation-key="common_vat">{t('common_vat', { percent: (configs?.vat || 0) * 100 })}</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">{`$`}{fCurrency2(price?.vatUSD || 0)}</ParagraphSmall>
      </Box>
      <Divider sx={{ my: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" justifyContent="space-between">
        <Heading3 $fontWeight={500} $colorName="--eerie-black" translation-key="common_total">{t('common_total')} (USD)</Heading3>
        <Box sx={{ textAlign: 'right' }}>
          <Heading3 $fontWeight={500} $colorName="--eerie-black">{`$`}{fCurrency2(price?.totalAmountUSD || 0)}</Heading3>
          <ParagraphSmall $fontWeight={500} $colorName="--eerie-black">({fCurrency2VND(price?.totalAmount || 0)} VND)</ParagraphSmall>
        </Box>
      </Box>
    </>
  )
})

export default CostSummary