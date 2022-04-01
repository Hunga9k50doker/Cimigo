import { useState, memo } from 'react';
import { Checkbox, Chip, Dialog, Grid, IconButton, Stack, Collapse, Switch, FormControlLabel } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";

interface PopupLocationMobileProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}

const tags = ['5 Key cities', '5 Key cities', '5 Key cities', '5 Key cities'];
const location = ['7 provinces', 'Ho Chi Minh', 'Ho Chi Minh', 'Ho Chi Minh', 'Dong Nai'];

const dataLists = [
  {
    title: "South East",
  },
  {
    title: "North",
  },
  {
    title: "Mekong Delta",
  },
  {
    title: "Mekong Delta",
  },
]

const PopupLocationMobile = memo((props: PopupLocationMobileProps) => {
  const { onClickCancel, onClickOpen } = props;
  const [selectedIndex, setSelectedIndex] = useState("")
  const [checked, setChecked] = useState<any>();

  const handleClickCollapse = index => {
    if (selectedIndex === index) {
      setSelectedIndex("")
    } else {
      setSelectedIndex(index)
    }
  }

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Location</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
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
            <p>Location:</p>
            <Grid classes={{ root: classes.rootTags }}>
              <p>Suggest combination:</p>
              <Stack direction="row" spacing={1}>
                {tags.map((tag, index) => (
                  <Chip key={index} label={tag} clickable variant="outlined" />
                ))}
              </Stack>
            </Grid>
          </Grid>
          <Grid container classes={{ root: classes.rootListMobile }}>
            {dataLists.map((item, index: any) => (
              <Grid
                className={classes.attributesMobile}
                style={{ borderBottom: index === selectedIndex ? '' : ' 0.5px solid #dddddd' }}
                key={index}
                onClick={() => { handleClickCollapse(index) }}
              >
                <Grid style={{ width: "100%" }}>
                  <p className={classes.titleAttributesMobile} >{item.title}</p>
                  <Collapse
                    in={index === selectedIndex}
                    timeout="auto"
                    unmountOnExit
                  >
                    <div className={classes.CollapseAttributesMobile}>
                      <Grid classes={{ root: classes.rootLevel }}>
                        <div className={classes.rootRegionLevel} onClick={e => e.stopPropagation()}>
                          <p>Region level</p>
                          <Switch
                            onChange={(e) => setChecked(e.target.checked)}
                            classes={{
                              root: classes.rootSwitch,
                              checked: classes.checkedSwitch,
                              track: checked ? classes.trackSwitchOn : classes.trackSwitchOff
                            }}
                          />
                        </div>
                        <Grid classes={{ root: classes.checkLocation }} onClick={e => e.stopPropagation()}>
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
                    </div>
                  </Collapse >
                </Grid>
                <img style={{ transform: index === selectedIndex ? 'rotate(180deg)' : 'rotate(0deg)' }} src={Images.icMore} alt='' />
              </Grid>
            ))}
          </Grid>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Save" btnType='Blue' padding='13px 16px' onClick={onClickCancel} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupLocationMobile;



