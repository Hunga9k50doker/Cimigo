import { Grid } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo } from "react"

interface BrandAssetRecognitionProps {
  project: Project;
}


const BrandAssetRecognition = memo(({ project }: BrandAssetRecognitionProps) => {
  return (
    <Grid id={SETUP_SURVEY_SECTION.additional_attributes} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        STEP 4 (OPTIONAL): Brand asset recognition
      </Heading4>
    </Grid>
  )
})

export default BrandAssetRecognition