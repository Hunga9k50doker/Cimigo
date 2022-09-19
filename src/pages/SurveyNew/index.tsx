import { useEffect, useMemo, useState } from "react";
import classes from './styles.module.scss';
import {
  Box,
  Grid,
  Tab,
  Tabs,
} from "@mui/material";
import { matchPath, Redirect, Route, Switch, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { getProjectRequest, setProjectReducer } from "redux/reducers/Project/actionTypes";
import Header from "components/Header";
import { routes } from "routers/routes";
import { push } from "connected-react-router";
import { Check, CheckCircle, KeyboardArrowRight } from "@mui/icons-material";
import Heading4 from "components/common/text/Heading4";
import ChipProjectStatus from "components/common/status/ChipProjectStatus";
import HomeIcon from '@mui/icons-material/Home';
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import Button, { BtnType } from "components/common/buttons/Button";
import SubTitle from "components/common/text/SubTitle";
import InputTextfield from "components/common/inputs/InputTextfield";
import SetupSurvey from "./SetupSurvey";
import Target from "./Target";
import Quotas from "pages/Survey/Quotas";
import PaymentBilling from "pages/Survey/PaymentBilling";
import Report from "pages/Survey/Report";
import ProjectHelper from "helpers/project";

export const Survey = () => {

  const dispatch = useDispatch()
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id?: string }>()
  const { project } = useSelector((state: ReducerType) => state.project)
  const [isEditName, setIsEditName] = useState(false);
  const [projectName, setProjectName] = useState<string>('');

  const tabs: string[] = useMemo(() => {
    return [
      routes.project.detail.setupSurvey,
      routes.project.detail.target,
      routes.project.detail.quotas,
      routes.project.detail.paymentBilling.root,
      routes.project.detail.report
    ]
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language, routes])

  const isValidSetup = useMemo(() => {
    return ProjectHelper.isValidSetup(project)
  }, [project])

  const isValidTargetTab = useMemo(() => {
    return ProjectHelper.isValidTargetTab(project)
  }, [project])

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
    const index = tabs.findIndex(it => activeRoute(it))
    if (index === -1) return 0
    return index
  }

  const onChangeTab = (_: any, newTab: number) => {
    dispatch(push(tabs[newTab].replace(":id", id)))
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
    <Grid className={classes.root}>
      <Header project detail={project} />
      <Grid className={classes.subHeaderMobile}>
        <HomeIcon className={classes.homeIcon} onClick={() => dispatch(push(routes.project.management))} />
        <KeyboardArrowRight sx={{ fontSize: 16, marginLeft: '8px', marginRight: '8px', color: "var(--eerie-black-40)" }} />
        {!isEditName ? (
          <SubTitle className={classes.projectName} $colorName="--cimigo-green-dark-2" onClick={handleEditProjectName}>{project?.name}</SubTitle>
        ) : (
          <div className={classes.editBox}>
            <InputTextfield
              name=""
              size="small"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder={t('field_project_name_placeholder')}
              translation-key-placeholder="field_project_name_placeholder"
            />
            <Button
              nowrap
              btnType={BtnType.Primary}
              translation-key="common_save"
              children={t('common_save')}
              padding="3px 13px"
              startIcon={<Check sx={{ fontSize: "16px !important" }} />}
              onClick={onChangeProjectName}
            />
          </div>
        )}
      </Grid>
      <Box className={classes.tabsBox}>
        <Tabs
          value={getActiveTab()}
          onChange={onChangeTab}
          variant="scrollable"
          classes={{
            root: classes.rootTabs,
            indicator: classes.indicatorTabs,
            flexContainer: classes.flexContainer,
          }}
        >
          <Tab
            value={0}
            label={<Box display="flex" alignItems="center">
              {isValidSetup && <CheckCircle className={classes.tabItemIcon} />}
              <Heading4 className={classes.tabItemTitle} translation-key="setup_tab">{t("setup_tab")}</Heading4>
            </Box>}
          />
          <Tab
            value={1}
            label={<Box display="flex" alignItems="center">
              {isValidTargetTab && <CheckCircle className={classes.tabItemIcon} />}
              <Heading4 className={classes.tabItemTitle} translation-key="target_tab">{t("target_tab")}</Heading4>
            </Box>}
          />
          <Tab
            value={2}
            label={<Box display="flex" alignItems="center">
              <Heading4 className={classes.tabItemTitle} translation-key="quotas_tab">{t("quotas_tab")}</Heading4>
            </Box>}
          />
          <Tab
            value={3}
            label={<Box display="flex" alignItems="center">
              <Heading4 className={classes.tabItemTitle} translation-key="payment_tab">{t("payment_tab")}</Heading4>
            </Box>}
          />
          <Tab
            value={4}
            label={<Box display="flex" alignItems="center">
              <Heading4 className={classes.tabItemTitle} translation-key="results_tab">{t("results_tab")}</Heading4>
            </Box>}
          />
        </Tabs>
        <Box className={classes.statusBox}>
          <ChipProjectStatus status={project?.status} />
        </Box>
      </Box>
      <Box className={classes.tabContent}>
        <Switch>
          <Route exact path={routes.project.detail.setupSurvey} render={(routeProps) => <SetupSurvey {...routeProps} projectId={Number(id)} />} />
          <Route exact path={routes.project.detail.target} render={(routeProps) => <Target {...routeProps} projectId={Number(id)} />} />
          <Route exact path={routes.project.detail.quotas} render={(routeProps) => <Quotas {...routeProps} projectId={Number(id)} />} />
          <Route path={routes.project.detail.paymentBilling.root} render={(routeProps) => <PaymentBilling {...routeProps} projectId={Number(id)} />} />
          <Route exact path={routes.project.detail.report} render={(routeProps) => <Report {...routeProps} projectId={Number(id)} />} />

          <Redirect from={routes.project.detail.root} to={routes.project.detail.setupSurvey} />
        </Switch>
      </Box>
    </Grid>
  )
}

export default Survey;