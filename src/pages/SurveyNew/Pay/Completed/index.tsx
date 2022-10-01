import { Box, Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import { push } from "connected-react-router";
import { authCompleted } from "../models";
import { useTranslation } from "react-i18next";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import { DownLoadItem, ImageMain, ParagraphBodyBlueNestedA } from "../components";
import Heading1 from "components/common/text/Heading1";
import ParagraphBody from "components/common/text/ParagraphBody";
import ProjectHelper from "helpers/project";
import Heading5 from "components/common/text/Heading5";

interface Props {

}

const Completed = memo(({ }: Props) => {
  const { t, i18n } = useTranslation()

  const dispatch = useDispatch();
  
  const { project } = useSelector((state: ReducerType) => state.project)

  const getInvoice = () => {
    if (!project) return
    dispatch(setLoading(true))
    PaymentService.getInvoice(project.id)
      .then(res => {
        FileSaver.saveAs(res.data, `invoice-${moment().format('MM-DD-YYYY-hh-mm-ss')}.pdf`)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authCompleted(project, onRedirect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  const reportReadyDate = useMemo(() => {
    return ProjectHelper.getReportReadyDate(project, i18n.language).format("DD MMMM, YYYY")
  }, [i18n.language, project])

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.root}>
          <Grid className={classes.content}>
            <ImageMain className={classes.img} src={images.imgPayment} alt="" />
            <Heading1 sx={{ mb: { xs: 3, sm: 2 } }} $colorName="--cimigo-blue" translation-key="payment_billing_completed_title" align="center">
              {t('payment_billing_completed_title')}
            </Heading1>
            <ParagraphBody mb={3} $colorName="--eerie-black" translation-key="payment_billing_completed_sub_1" align="center">
              {t('payment_billing_completed_sub_1')}
            </ParagraphBody>
            <Heading5 mb={3} $colorName="--eerie-black" translation-key="payment_billing_completed_sub_3" align="center">
              {t("payment_billing_completed_sub_3", { date: reportReadyDate })}
            </Heading5>
            <ParagraphBody $colorName="--eerie-black" translation-key="payment_billing_completed_sub_4" align="center">
              {t('payment_billing_completed_sub_4')}
            </ParagraphBody>
            <Box py={2} display="flex" justifyContent="center">
              <DownLoadItem onClick={getInvoice}>
                <img className={classes.imgAddPhoto} src={images.icInvoice} />
                <ParagraphBody align="center" $colorName="--cimigo-blue" translation-key="payment_billing_completed_invoice">{t("payment_billing_completed_invoice")}</ParagraphBody>
              </DownLoadItem>
            </Box>
            <ParagraphBodyBlueNestedA
              $colorName="--eerie-black-00"
              translation-key="payment_billing_completed_sub_2"
              align="center"
              dangerouslySetInnerHTML={{ __html: t('payment_billing_completed_sub_2') }}
            />
          </Grid>
        </Content>
      </LeftContent>
    </PageRoot>
  )
})

export default Completed;