import { useEffect, useMemo, useState } from "react";
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
import { getProjectRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import { matchPath, Redirect, Route, Switch, useParams } from "react-router-dom";
import { ReducerType } from "redux/reducers";
import { routes } from "routers/routes";
import { push } from "connected-react-router";
import { useTranslation } from "react-i18next";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { ProjectService } from "services/project";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";

function a11yProps(index: number) {
  return {
    id: `build-tab--${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}


interface TabItem {
  name: string,
  translation: string,
  path: string
}

const Survey = () => {

  const { t, i18n } = useTranslation()

  const tabs: TabItem[] = useMemo(() => {
    return [
      { name: t('setup_survey_tab'), path: routes.project.detail.setupSurvey, translation: 'setup_survey_tab' },
      { name: t('target_tab'), path: routes.project.detail.target, translation: 'target_tab' },
      { name: t('quotas_tab'), path: routes.project.detail.quotas, translation: 'quotas_tab' },
      { name: t('payment_billing_tab'), path: routes.project.detail.paymentBilling.root, translation: 'payment_billing_tab' },
      { name: t('report_tab'), path: routes.project.detail.report, translation: 'report_tab' }
    ]
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const { id } = useParams<{ id?: string }>()
  const { project } = useSelector((state: ReducerType) => state.project)
  const [isEditName, setIsEditName] = useState(false);
  const [projectName, setProjectName] = useState<string>('');

  const dispatch = useDispatch()

  useEffect(() => {
    if (id && !isNaN(Number(id))) {
      dispatch(getProjectRequest(Number(id)))
      return () => {
        dispatch(setProjectReducer(null))
      }
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

  const handleEditProjectName = () => {
    setIsEditName(true)
    setProjectName(project.name)
  }

  const isValidProjectName = () => {
    return projectName && project && projectName !== project.name
  }

  const onCloseChangeProjectName = () => {
    setProjectName('')
    setIsEditName(false)
  }

  const onChangeProjectName = () => {
    if (!isValidProjectName()) {
      onCloseChangeProjectName()
      return
    }
    dispatch(setLoading(true))
    ProjectService.renameProject(Number(id), {
      name: projectName
    })
      .then(() => {
        onCloseChangeProjectName()
        dispatch(getProjectRequest(Number(id)))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(true)))
  }

  return (
    <Grid>
      <Header project detail={project} />
      <Grid className={classes.rootMobile}>
        <img src={images.icHomeMobile} alt='' onClick={() => dispatch(push(routes.project.management))} />
        <img src={images.icNextMobile} alt='' />
        {!isEditName ? (
          <p className={classes.projectName} onClick={handleEditProjectName}>{project?.name}</p>
        ) : (
          <div className={classes.editBox}>
            <Inputs
              name=""
              size="small"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t('field_project_name_placeholder')}
              translation-key-placeholder="field_project_name_placeholder"
            />
            <Buttons
              nowrap
              btnType="Blue"
              translation-key="common_save"
              children={t('common_save')}
              padding="3px 13px"
              startIcon={<img src={images.icSaveWhite} alt="" />}
              onClick={onChangeProjectName}
            />
          </div>
        )}
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
              value={index}
              translation-key={item.translation}
              classes={{
                selected: classes.selectedTab,
                root: classes.rootTab,
              }}
              label={item.name}
              {...a11yProps(index)}
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