import { Box, Grid, Typography } from "@mui/material"
import { Project } from "models/project"
import { memo } from "react"
import DetailCustomQuestion from "../DetailCustomQuestion"
import VideoDetailItem from "../VideoDetailItem"

export interface Props {
  project?: Project
}

const DetailSurveySetupForPack = memo(({ project }: Props) => {

  return (
    <Box>
      {!!project?.videos?.length && (
        <>
          <Typography variant="h6" mb={2}>
            Videos
          </Typography>
          <Grid ml={2}>
            <Grid spacing={2} container>
              {project?.videos?.map((item, index) => (
                <VideoDetailItem
                  key={index}
                  item={item}
                />
              ))}
            </Grid>
          </Grid>
        </>
      )}
      <DetailCustomQuestion
        project={project}
      />
    </Box>
  )
})

export default DetailSurveySetupForPack