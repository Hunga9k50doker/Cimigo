import { useState, memo } from 'react';
import { Dialog, Grid, IconButton, Tab, Tabs, FormControlLabel, Checkbox } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import TabPanelMobile from '../TabPanel';

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

interface PopupAgeCoverageMobileProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}

const checkAge = ['15-17', '20-24', '30-34', '40-45', '18-19', '25-29', '35-39'];
const checkGender = ['Male', 'Female'];

const checkAgeChild = [
  '0-12 months (aged less than 1)',
  '3 to 6 years (aged 3,4,5,6)',
  '12-24 months (aged 1)',
  '7 to 9 years (aged 7,8,9)',
  '25 to 36 months (aged 2)',
  '10 to 18 years (aged 10 to 18)',
];

const PopupAgeCoverageMobile = memo((props: PopupAgeCoverageMobileProps) => {
  const { onClickCancel, onClickOpen } = props;
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Age coverage</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <Grid className={classes.tabs}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
              classes={{
                root: classes.rootTabs,
                indicator: classes.indicatorTabs,
                flexContainer: classes.flexContainer,
              }}
            >
              <Tab
                label="Gender and age"
                classes={{
                  selected: classes.selectedTab,
                  root: classes.rootTab,
                  iconWrapper: classes.iconWrapper,
                }}
                {...a11yProps(0)}
                icon={<img src={value === 0 ? Images.icTabGreen : Images.icTabGray} />}
                iconPosition="start"
              />
              <Tab
                label="Mum only"
                {...a11yProps(1)}
                classes={{
                  selected: classes.selectedTab,
                  root: classes.rootTab,
                  iconWrapper: classes.iconWrapper,
                }}
                icon={<img src={value === 1 ? Images.icTabGreen : Images.icTabGray} />}
                iconPosition="start"
              />
            </Tabs>
          </Grid>
          <TabPanelMobile value={value} index={0}>
            <Grid>
              <p className={classes.text}>Choose age</p>
              <Grid classes={{ root: classes.checkLocation }}>
                {checkAge.map((item, index) => {
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
            <Grid>
              <p className={classes.text}>Choose gender</p>
              <Grid classes={{ root: classes.checkLocation }}>
                {checkGender.map((item, index) => {
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
          </TabPanelMobile>
          <TabPanelMobile value={value} index={1}>
            <Grid>
              <p className={classes.text}>Choose age of child</p>
              <Grid classes={{ root: classes.checkAgeOfChild }}>
                {checkAgeChild.map((item, index) => {
                  return (
                    <Grid key={index} >
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
          </TabPanelMobile>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Save" btnType='Blue' padding='13px 16px' onClick={onClickCancel} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupAgeCoverageMobile;



