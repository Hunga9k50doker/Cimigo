import { Grid } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo } from "react"

interface BrandDispositionAndEquityProps {
  project: Project
}

const BrandDispositionAndEquity = memo(({ project }: BrandDispositionAndEquityProps) => {
  return (
    <Grid id={SETUP_SURVEY_SECTION.additional_brand_list} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_add_brand_title"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        STEP 3: Brand disposition and equity
      </Heading4>
    </Grid >
  )
})

export default BrandDispositionAndEquity