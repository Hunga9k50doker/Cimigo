import { Box, Grid } from "@mui/material";
import classes from './styles.module.scss';
import images from "config/images";
import { memo, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import Images from "config/images";
import { PaymentService } from "services/payment";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import FileSaver from 'file-saver';
import moment from "moment";
import { push } from "connected-react-router";
import { authCompleted, getPayment } from "../models";
import { useTranslation } from "react-i18next";
import { Content, LeftContent, PageRoot } from "pages/SurveyNew/components";
import { DownLoadItem, ImageMain, ParagraphBodyBlueNestedA } from "../components";
import Heading1 from "components/common/text/Heading1";
import Heading2 from "components/common/text/Heading2";
import Heading4 from "components/common/text/Heading4";
import ParagraphBody from "components/common/text/ParagraphBody";

interface Props {

}

const Completed = memo(({ }: Props) => {
  const { t } = useTranslation()

  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project)

  const payment = useMemo(() => getPayment(project?.payments), [project])

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

  // const openNewTabContact = () => {
  //   window.open(`${process.env.REACT_APP_BASE_API_URL}/static/contract/contract.pdf`, '_blank').focus()
  // }

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)))
  }

  useEffect(() => {
    authCompleted(project, onRedirect)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project])

  return (
    <PageRoot>
      <LeftContent>
        <Content className={classes.root}>
          <Grid className={classes.content}>
            <ImageMain className={classes.img} src={images.imgPayment} alt="" />
            <Heading1 sx={{ mb: { xs: 3, sm: 2 } }} $colorName="--cimigo-blue" translation-key="payment_billing_completed_title" align="center">
              {t('payment_billing_completed_title')}
            </Heading1>
            <Heading2 mb={1} $fontSizeMobile={"16px"} $lineHeightMobile="24px" $colorName="--cimigo-green-dark-1" translation-key="payment_billing_total_amount" align="center">
              {t('payment_billing_total_amount')}: {`$`}{fCurrency2(payment?.totalAmountUSD || 0)}
            </Heading2>
            <Heading4 mb={3} $fontSizeMobile={"12px"} $lineHeightMobile="16px" $colorName="--cimigo-blue-dark-1" translation-key="payment_billing_equivalent_to" align="center">
              ({t('payment_billing_equivalent_to')} {fCurrency2VND(payment?.totalAmount || 0)} VND)
            </Heading4>
            <ParagraphBody $colorName="--eerie-black-00" translation-key="payment_billing_completed_sub_1" align="center">
              {t('payment_billing_completed_sub_1')}
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