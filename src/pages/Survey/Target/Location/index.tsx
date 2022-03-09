import { useState } from "react";
import { Grid, Checkbox, Stack, Chip, ListItem, ListItemButton, ListItemText, Switch, FormControlLabel } from "@mui/material"
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";

const tags = ['5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities'];

const location = ['7 provinces', 'Ho Chi Minh', 'Ho Chi Minh', 'Ho Chi Minh', 'Dong Nai'];

const dataList = [
  {
    name: "South East",
  },
  {
    name: "North",
  },
  {
    name: "Mekong Delta",
  },
  {
    name: "South East",
  }
]

const Location = () => {
  const [selectedIndex, setSelectedIndex] = useState();
  const [checked, setChecked] = useState<any>();

  const handleListItemClick = (index) => {
    setSelectedIndex(index);
  };
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
            {tags.map((tag, index) => (
              <Chip key={index} label={tag} clickable variant="outlined" />
            ))}
          </Stack>
        </Grid>
        <Grid classes={{ root: classes.rootBody }}>
          <Grid classes={{ root: classes.rootSelect }}>
            {dataList.map((item, index) => (
              <ListItem
                key={index}
                secondaryAction={selectedIndex === index ?
                  <img src={Images.icSelect} /> : ""
                }
                disablePadding
              >
                <ListItemButton
                  selected={selectedIndex === index}
                  onClick={() => handleListItemClick(index)}
                  classes={{ selected: classes.selected }}
                >
                  <Checkbox
                    classes={{ root: classes.rootCheckboxLocation }}
                    checked={selectedIndex === index}
                    icon={<img src={Images.icCheck} alt="" />}
                    checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                  <ListItemText primary={item.name} classes={{ primary: classes.rootPrimary }} />
                </ListItemButton>
              </ListItem>
            ))}
          </Grid>
          <Grid classes={{ root: classes.rootLevel }}>
            <p>Region level
              <Switch
                onChange={(e) => setChecked(e.target.checked)}
                classes={{
                  root: classes.rootSwitch,
                  checked: classes.checkedSwitch,
                  track: checked ? classes.trackSwitchOn : classes.trackSwitchOff
                }}
              />
            </p>
            <Grid classes={{ root: classes.checkLocation }}>
              {location.map((item, index) => {
                return (
                  <Grid item xs={6} key={index} >
                    <FormControlLabel
                      control={
                        <Checkbox
                          classes={{ root: classes.rootCheckboxLocation }}
                          icon={<img src={Images.icCheck} alt="" />}
                          checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                      }
                      label={item}
                    />
                  </Grid>
                )
              })}
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid classes={{ root: classes.rootBtn }}>
        <Buttons btnType="Blue" children={"Save"} padding="16px 56px" />
      </Grid>
    </>
  )
}

export default Location