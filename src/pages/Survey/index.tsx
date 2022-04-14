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
import SetupSurvey from "./SetupSurvey";
import Target from "./Target";
import Quotas from "./Quotas";
import PaymentBilling from "./PaymentBilling";
import Report from "./Report";
import images from "config/images";
import { useDispatch, useSelector } from "react-redux";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";
import { matchPath, Redirect, Route, Switch, useParams } from "react-router-dom";
import { ReducerType } from "redux/reducers";
import { routes } from "routers/routes";
import { push } from "connected-react-router";

interface TabItem {
  name: string,
  path: string
}

const tabs: TabItem[] = [
  { name: 'Setup survey', path: routes.project.detail.setupSurvey },
  { name: 'Target', path: routes.project.detail.target },
  { name: 'Quotas', path: routes.project.detail.quotas },
  { name: 'Payment & Billing', path: routes.project.detail.paymentBilling.root },
  { name: 'Report', path: routes.project.detail.report }
]

const Survey = () => {

  const { id } = useParams<{ id?: string }>()
  const { project } = useSelector((state: ReducerType) => state.project)
  const dispatch = useDispatch()

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(getProjectRequest(Number(id)))
    }
  }, [dispatch, id])

  const activeRoute = (routeName: string, exact: boolean = false) => {
    const match = matchPath(window.location.pathname, {
      path: routeName,
      exact: exact
    })
    return !!match
  };

  const getActiveTab = () => {
    const index = tabs.findIndex(it => activeRoute(it.path))
    if (index === -1) return 0
    return index
  }

  const onChangeTab = (_: any, newTab: number) => {
    dispatch(push(tabs[newTab].path.replace(":id", id)))
  }

  return (
    <Grid>
      <Header project detail={project?.name} />
      <Grid className={classes.rootMobile}>
        <img src={images.icHomeMobile} alt='' onClick={() => dispatch(push(routes.project.management))} />
        <img src={images.icNextMobile} alt='' />
        <p>{project?.name}</p>
      </Grid>
      <Grid className={classes.root}>
        <Tabs
          value={getActiveTab()}
          onChange={onChangeTab}
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
              label={item.name}
              id={`build-tab-${index}`}
            />
          ))}
        </Tabs>
        <Grid className={classes.bodyTab}>
          <div className={classes.tabContent}>
            <Switch>
              <Route exact path={routes.project.detail.setupSurvey} render={(routeProps) => <SetupSurvey {...routeProps} id={Number(id)} />} />
              <Route exact path={routes.project.detail.target} render={(routeProps) => <Target {...routeProps} projectId={Number(id)} />} />
              <Route exact path={routes.project.detail.quotas} render={(routeProps) => <Quotas {...routeProps} projectId={Number(id)} />} />
              <Route path={routes.project.detail.paymentBilling.root} render={(routeProps) => <PaymentBilling {...routeProps} projectId={Number(id)} />} />
              <Route exact path={routes.project.detail.report} render={(routeProps) => <Report {...routeProps} projectId={Number(id)} />} />

              <Redirect from={routes.project.detail.root} to={routes.project.detail.setupSurvey} />
            </Switch>
          </div>
        </Grid>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Survey;