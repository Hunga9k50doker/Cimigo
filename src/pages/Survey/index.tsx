import { useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
  IconButton,
  Tab,
  Tabs,
  tabsClasses
} from "@mui/material";

import Header from "components/Header";
import Footer from "components/Footer";
import TabPanel from "components/TabPanel";
import SetupSurvey from "./SetupSurvey";
import Target from "./Target";
import Quotas from "./Quotas";
import PaymentBilling from "./PaymentBilling";
import images from "config/images";
import { routes } from "routers/routes";
import { useHistory } from 'react-router-dom';

const listTabs = ['Setup survey', 'Target', 'Quotas', 'Payment & Billing', 'Report']

// const ExpandIcon = (props) => {
//   return (
//     <img {...props} src={images.icCheck} />
//   )
// };

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }; 
}
const Survey = () => {
  const history = useHistory();
  const [value, setValue] = useState(0);

  const handleChange = (e, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Grid>
      <Header project detail="C7938 On Demand (SaaS)"/>
      <Grid className={classes.rootMobile}>
        <img src={images.icHomeMobile} alt='' onClick={() => history.push(routes.project.management)}/>
        <img src={images.icNextMobile} alt='' />
        <p>C7938 On Demand (SaaS)</p>
      </Grid>
      <Grid className={classes.root}>
        <Tabs
          value={value}
          onChange={handleChange}
          // ScrollButtonComponent={ExpandIcon}
          variant="scrollable"
          allowScrollButtonsMobile
          classes={{
            root: classes.rootTabs,
            indicator: classes.indicatorTabs,
            flexContainer: classes.flexContainer,
            scrollButtons: classes.scrollButtonsMobile,
          }}
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { display: "none" },
            },
          }}
        >
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
            <SetupSurvey />
          </TabPanel>
          <TabPanel value={value} index={1}>
            <Target />
          </TabPanel>
          <TabPanel value={value} index={2}>
            <Quotas />
          </TabPanel>
          <TabPanel value={value} index={3}>
            <PaymentBilling />
          </TabPanel>
          <TabPanel value={value} index={4}>
            Report
          </TabPanel>
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Survey;