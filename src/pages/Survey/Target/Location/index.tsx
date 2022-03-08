import { Grid, Checkbox, Stack, Chip } from "@mui/material"
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";

const tags = ['5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities'];

const Location = () => {
  return (
    <>
      <Grid classes={{ root: classes.rootStrata }}>
        <p>Strata:</p>
        <Checkbox
          classes={{ root: classes.rootCheckbox }}
          icon={<img src={Images.icCheck} alt="" />}
          checkedIcon={<img src={Images.icCheckActive} alt="" />} />
        <span>Urban</span>
        <Checkbox
          classes={{ root: classes.rootCheckbox }}
          icon={<img src={Images.icCheck} alt="" />}
          checkedIcon={<img src={Images.icCheckActive} alt="" />} />
        <span>Rural</span>
      </Grid>
      <Grid classes={{ root: classes.rootCountry }}>
        <p>Country:</p>
        <Grid>
          <p>Vietnam</p>
          <span>*We currently launch this platform only in Vietnam, other countries will be available soon.</span>
        </Grid>
      </Grid>
      <Grid classes={{ root: classes.rootLocation }}>
        <p>Choose location:</p>
        <Grid classes={{ root: classes.rootTags }}>
          <p>Suggest combination:</p>
          <Stack direction="row" spacing={1}>
            {tags.map((tag) => (
              <Chip label={tag} clickable variant="outlined" />
            ))}
          </Stack>
        </Grid>
      </Grid>
    </>
  )
}

export default Location