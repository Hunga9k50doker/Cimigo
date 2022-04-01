import { useEffect, useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
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
import { useDispatch, useSelector } from "react-redux";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { useParams } from "react-router-dom";
import { ReducerType } from "redux/reducers";
import { OptionItem } from "models/general";
import QueryString from 'query-string';
import { routes } from "routers/routes";
import { push } from "connected-react-router";

export enum ETab {
  SETUP_SURVEY,
  TARGET,
  QUOTAS,
  PAYMENT_BILLING,
  REPORT
}

const tabs: OptionItem[] = [
  { id: ETab.SETUP_SURVEY, name: 'Setup survey' },
  { id: ETab.TARGET, name: 'Target' },
  { id: ETab.QUOTAS, name: 'Quotas' },
  { id: ETab.PAYMENT_BILLING, name: 'Payment & Billing' },
  { id: ETab.REPORT, name: 'Report' },
]

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  }; 
}
const Survey = () => {

  const { id } = useParams<{ id?: string }>()
  const { tab }: { tab?: string } = QueryString.parse(window.location.search);
  const { project } = useSelector((state: ReducerType) => state.project)
  const dispatch = useDispatch()
  
  const [activeTab, setActiveTab] = useState(ETab.SETUP_SURVEY);

  const handleChange = (e: any, newValue: number) => {
    dispatch(push({
      pathname: routes.project.detail.replace(":id", id),
      search: `?tab=${newValue}`
    }))
  };

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(getProjectRequest(Number(id)))
    }
  }, [dispatch, id])

  useEffect(() => {
    if (tab && !isNaN(Number(tab))) {
      const _tab = Number(tab)
      const item = tabs.find(it => it.id === _tab)
      if (item) {
        setActiveTab(Number(tab))
      } else {
        dispatch(push({
          pathname: routes.project.detail.replace(":id", id),
          search: `?tab=${activeTab}`
        }))
      }
    }
  }, [tab])

  return (
    <Grid>
      <Header project detail={project?.name}/>
      <Grid className={classes.rootMobile}>
        <img src={images.icHomeMobile} alt='' onClick={() => dispatch(push(routes.project.management))}/>
        <img src={images.icNextMobile} alt='' />
        <p>{project?.name}</p>
      </Grid>
      <Grid className={classes.root}>
        <Tabs
          value={activeTab}
          onChange={handleChange}
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
          {tabs.map((item, index) => (
            <Tab
              key={index}
              classes={{
                selected: classes.selectedTab,
                root: classes.rootTab,
              }}
              label={item.name} {...a11yProps(index)} />
          ))}
        </Tabs>
        <Grid className={classes.bodyTab}>
          <TabPanel value={activeTab} index={ETab.SETUP_SURVEY}>
            <SetupSurvey id={Number(id)} />
          </TabPanel>
          <TabPanel value={activeTab} index={ETab.TARGET}>
            <Target />
          </TabPanel>
          <TabPanel value={activeTab} index={ETab.QUOTAS}>
            <Quotas />
          </TabPanel>
          <TabPanel value={activeTab} index={ETab.PAYMENT_BILLING}>
            <PaymentBilling />
          </TabPanel>
          <TabPanel value={activeTab} index={ETab.REPORT}>
            Report
          </TabPanel>
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Survey;