import { Grid } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo } from "react"

interface BrandListProps {
  project: Project
}

const BrandList = memo(({ project }: BrandListProps) => {
  return (
    <Grid id={SETUP_SURVEY_SECTION.upload_packs} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        STEP 2: Building your brand list
      </Heading4>
    </Grid>
  )
})

export default BrandList