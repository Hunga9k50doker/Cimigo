import { useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
  Tab,
  Tabs
} from "@mui/material";

import Header from "components/Header";
import Footer from "components/Footer";
import TabPanel from "components/TabPanel";
import SetupSurvey from "./SetupSurvey";
import Target from "./Target";

const listTabs = ['Setup survey', 'Target', 'Quotas', 'Payment & Billing', 'Report']

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const Survey = () => {
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid>
      <Header />
      <Grid className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          classes={{
            root: classes.rootTabs,
            indicator: classes.indicatorTabs,
            flexContainer: classes.flexContainer,
          }}>
          {listTabs.map((item, index) => (
            <Tab
              key={index}
              classes={{
                selected: classes.selectedTab,
                root: classes.rootTab,
              }}
              label={item} {...a11yProps(index)} />
          ))}
        </Tabs>
        <Grid className={classes.bodyTab}>
          <TabPanel value={value} index={0}>
            <SetupSurvey/>
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Target/>
          </TabPanel>
          <TabPanel value={value} index={2}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={3}>
            Item Three
          </TabPanel>
          <TabPanel value={value} index={4}>
            Item Three
          </TabPanel>
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Survey;