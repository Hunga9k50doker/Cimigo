import { Box } from "@mui/material";
import WarningBox from "components/WarningBox";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import { memo } from "react"
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import { ReducerType } from "redux/reducers";
import { routes } from "routers/routes";
import ProjectReview from "../ProjectReview";
import classes from './styles.module.scss';

interface Props {
}

const ProjectReviewAndPayment = memo(({ }: Props) => {
  const { t } = useTranslation()
  const { cancelPayment } = useSelector((state: ReducerType) => state.project)
  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.content}>
          {cancelPayment && (
            <Box className={classes.warningBox}>
              <WarningBox translation-key="payment_billing_sub_tab_preview_warning">
                {t("payment_billing_sub_tab_preview_warning")}
              </WarningBox>
            </Box>
          )}
          <Switch>
            <Route exact path={routes.project.detail.paymentBilling.previewAndPayment.preview} render={(routeProps) => <ProjectReview {...routeProps} />} />
            <Redirect from={routes.project.detail.paymentBilling.previewAndPayment.root} to={routes.project.detail.paymentBilling.previewAndPayment.preview} />
          </Switch>
        </Content>
      </LeftContent>
    </PageRoot>
  )
})

export default ProjectReviewAndPayment