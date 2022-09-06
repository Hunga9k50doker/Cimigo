import { Box, Divider } from "@mui/material"
import Heading3 from "components/common/text/Heading3"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { memo } from "react"

interface CostSummaryProps {

}

const CostSummary = memo(({ }: CostSummaryProps) => {

  return (
    <>
      <ParagraphExtraSmall $colorName="--eerie-black" mb={2}>
        Changes in some sections will have an impact on the cost table below.
      </ParagraphExtraSmall>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black">Survey sample (200)</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">$1,999</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
        <ParagraphSmall $colorName="--eerie-black">Eye-tracking sample (30)</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">$300</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
        <ParagraphSmall $colorName="--eerie-black">Custom questions (2)</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">$1,999</ParagraphSmall>
      </Box>
      <Divider sx={{ my: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <ParagraphSmall $colorName="--eerie-black">Subtotal</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">$1,999</ParagraphSmall>
      </Box>
      <Box display="flex" alignItems="center" justifyContent="space-between" mt={0.5}>
        <ParagraphSmall $colorName="--eerie-black">Tax (VAT 8%)</ParagraphSmall>
        <ParagraphSmall $colorName="--eerie-black">$1,999</ParagraphSmall>
      </Box>
      <Divider sx={{ my: 2, borderColor: 'var(--gray-20)' }} />
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Heading3 $fontWeight={500} $colorName="--eerie-black">Total (USD)</Heading3>
        <Box sx={{ textAlign: 'right' }}>
          <Heading3 $fontWeight={500} $colorName="--eerie-black">$1,999</Heading3>
          <ParagraphSmall $fontWeight={500} $colorName="--eerie-black">(4,900,000 VND)</ParagraphSmall>
        </Box>
      </Box>
    </>
  )
})

export default CostSummary