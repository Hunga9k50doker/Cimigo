import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";
import Heading4 from "components/common/text/Heading4";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import classes from "./styles.module.scss";
import Dolar from "components/icons/IconDolar";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Footer from "components/Footer";
import { useEffect, useMemo, useRef, useState } from "react";
import Alert, { AlerType } from "../../../../../components/Alert";
import {
  PaymentSchedule,
  PaymentScheduleStatus,
} from "models/payment_schedule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import PopupConfirmCancelSubsription from "../components/PopupConfirmCancelSubsription";
import PaymentHistoryList from "../components/PaymentHistoryList";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import moment from "moment";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { authYourNextPayment } from "../models";
import { usePrice } from "helpers/price";
import { setPaymentIsMakeAnOrderSuccessReducer, setPaymentScheduleResultReducer } from "redux/reducers/Payment/actionTypes";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { EPaymentMethod } from "models/general";
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PopupPayNow from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupPayNow";
import PopupBankTransfer from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupBankTransfer";
import PopupOnlinePayment from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupOnlinePayment";
import PopupSupportAgent from "pages/SurveyNew/BrandTrack/components/PopupPayment/PopupSupportAgent";
import { useTranslation } from "react-i18next";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { PaymentService } from "services/payment";
import FileSaver from "file-saver";
import { PaymentScheduleService } from "services/payment_schedule";
import { getPaymentSchedulesRequest } from "redux/reducers/Project/actionTypes";
interface MakeAnOrderProp {
  projectId: number;
}

const sliderSettings = {
  50: {
    slidesPerView: 1,
    spaceBetween: 30,
  },
  440: {
    slidesPerView: 1,
    spaceBetween: 30,
  },
  680: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
  1024: {
    slidesPerView: 2,
    spaceBetween: 30,
  },
};

const YourNextPayment = ({ projectId }: MakeAnOrderProp) => {
  const dispatch = useDispatch();
  
  const { t, i18n } = useTranslation();
  
  const { project } = useSelector((state: ReducerType) => state.project);
  const { isMakeAnOrder, paymentScheduleResult } = useSelector((state: ReducerType) => state.payment);

  const swiperRef = useRef<any>();

  const paymentSchedules = useMemo(() => project?.paymentSchedules || [], [project])

  const [isOpenPopupPaynow, setIsOpenPopupPaynow] = useState(false);
  const [isOpenPopupBankTransfer, setIsOpenPopupBankTransfer] = useState(false);
  const [isOpenPopupOnlinePayment, setIsOpenPopupOnlinePayment] =
    useState(false);
  const [isOpenPopupSuportAgent, setIsOpenPopupSupportAgent] = useState(false);
  const [paymentScheduleForPay, setDataPaymentSchedule] =
    useState<PaymentSchedule>();

  const [alertMakeAnOrderSuccess, setAlertMakeAnOrderSuccess] =
    useState<boolean>(false);

  const [alertPaymentReminder, setAlertPaymentReminder] =
    useState<PaymentSchedule>();

  const [onSubmitCancelSubsription, setOnSubmitCancelSubsription] =
    useState(false);

  const onCloseSubmitCancelSubsription = () => {
    setOnSubmitCancelSubsription(false);
  };

  const submitCancelSubsription = (reson: string) => {
    setOnSubmitCancelSubsription(false);
  };

  const cancelSubscription = () => {
    setOnSubmitCancelSubsription(true);
  };
  const goToPayNow = (item: PaymentSchedule) => {
    setDataPaymentSchedule(item);
    setIsOpenPopupPaynow(true);
  };
  const onCancelPayment = () => {
    dispatch(setLoading(true));
    PaymentScheduleService.cancelPaymentSchedule(paymentScheduleForPay.id)
      .then(() => {
        onClose();
        setIsOpenPopupPaynow(true);
        dispatch(getPaymentSchedulesRequest(project.id));
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  const onOpenModal = (item: PaymentSchedule) => {
    setIsOpenPopupPaynow(false);
    setDataPaymentSchedule(item)
    switch (item?.payments?.[0]?.paymentMethodId) {
      case EPaymentMethod.BANK_TRANSFER:
        setIsOpenPopupBankTransfer(true);
        break;
      case EPaymentMethod.ONEPAY_GENERAL:
        setIsOpenPopupOnlinePayment(true);
        break;
      case EPaymentMethod.MAKE_AN_ORDER:
        setIsOpenPopupSupportAgent(true);
        break;
      default:
        break;
    }
  };
  const onClose = () => {
    setIsOpenPopupPaynow(false);
    setIsOpenPopupBankTransfer(false);
    setIsOpenPopupOnlinePayment(false);
    setIsOpenPopupSupportAgent(false);
  };
  const { getCostCurrency } = usePrice();

  const onCloseMakeAnOrderSuccess = () => {
    setAlertMakeAnOrderSuccess(false);
  };
  
  const onCloseAlertPaymentScheduleResult = () => {
    dispatch(setPaymentScheduleResultReducer(null))
  };

  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };
  
  const handleDownloadInvoice = (payment) => {
    dispatch(setLoading(true));
    PaymentService.getInvoiceDemo(projectId, payment.id)
      .then((res) => {
        FileSaver.saveAs(res.data, `invoice-${moment().format("MM-DD-YYYY-hh-mm-ss")}.pdf`);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
}

  useEffect(() => {
    authYourNextPayment(project, onRedirect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    if (paymentSchedules.length) {
      var paymentFirst = paymentSchedules[0];
      var now = moment().add(14, "d");
      if (
        moment(paymentFirst?.dueDate).isBefore(now) &&
        paymentFirst?.status === PaymentScheduleStatus.NOT_PAID
      ) {
        setAlertPaymentReminder(paymentFirst);
      } else {
        setAlertPaymentReminder(null);
      }
    }
  }, [paymentSchedules]);

  useEffect(() => {
    if (isMakeAnOrder) {
      setAlertMakeAnOrderSuccess(isMakeAnOrder);
      dispatch(setPaymentIsMakeAnOrderSuccessReducer(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMakeAnOrder]);

  return (
    <>
      <Grid classes={{ root: classes.root }}>
        {paymentScheduleResult && paymentScheduleResult?.isSuccess && (
          <Alert
            translation-key="brand_track_your_next_payment_title_alert_payment_success"
            title={t(
              "brand_track_your_next_payment_title_alert_payment_success"
            )}
            onClose={onCloseAlertPaymentScheduleResult}
            content={
              <ParagraphBody
                $colorName={"--eerie-black"}
                className={classes.contentAlert}
                translation-key="brand_track_your_next_payment_content_alert_payment_success"
                dangerouslySetInnerHTML={{
                  __html: t(
                    "brand_track_your_next_payment_content_alert_payment_success",
                    {
                      dateRange: `${moment(paymentScheduleResult?.paymentSchedule?.start).format("MMM yyyy").toUpperCase()} - ${moment(paymentScheduleResult?.paymentSchedule?.end).format("MMM yyyy").toUpperCase()}`,
                    }
                  ),
                }}
              ></ParagraphBody>
            }
            type={AlerType.Success}
          />
        )}
        {paymentScheduleResult && !paymentScheduleResult?.isSuccess && (
          <Alert
            translation-key="brand_track_your_next_payment_title_alert_payment_fail"
            title={t(
              "brand_track_your_next_payment_title_alert_payment_fail"
            )}
            onClose={onCloseAlertPaymentScheduleResult}
            content={
              <ParagraphBody
                $colorName={"--eerie-black"}
                className={classes.contentAlert}
                translation-key="brand_track_your_next_payment_content_alert_payment_fail"
                dangerouslySetInnerHTML={{
                  __html: t(
                    "brand_track_your_next_payment_content_alert_payment_fail",
                    {
                      dateRange: `${moment(paymentScheduleResult?.paymentSchedule?.start).format("MMM yyyy").toUpperCase()} - ${moment(paymentScheduleResult?.paymentSchedule?.end).format("MMM yyyy").toUpperCase()}`,
                    }
                  ),
                }}
              ></ParagraphBody>
            }
            type={AlerType.Error}
          />
        )}
        {alertMakeAnOrderSuccess && (
          <Alert
            title={t(
              "brand_track_your_next_payment_title_alert_make_an_order_success"
            )}
            onClose={onCloseMakeAnOrderSuccess}
            content={
              <ParagraphBody
                $colorName={"--eerie-black"}
                translation-key="brand_track_your_next_payment_content_alert_make_an_order_success_des"
                dangerouslySetInnerHTML={{
                  __html: t(
                    "brand_track_your_next_payment_content_alert_make_an_order_success_des",
                    {
                      startPayment: moment(
                        project?.startPaymentSchedule
                      ).format("MMMM yyyy"),
                      dueDate: moment(paymentSchedules[0]?.dueDate).format(
                        "MMMM DD, yyyy"
                      ),
                      scheduledMonths:
                        paymentSchedules[0]?.solutionConfig
                          ?.paymentMonthSchedule,
                    }
                  ),
                }}
              ></ParagraphBody>
            }
            type={AlerType.Success}
          />
        )}
        {alertPaymentReminder && !alertMakeAnOrderSuccess && (
          <Alert
            title={t("brand_track_your_next_payment_title_alert_warring")}
            content={
              <Box>
                <ParagraphBody
                  $colorName={"--eerie-black"}
                  translation-key="brand_track_your_next_payment_content_alert_warring_des_1"
                  dangerouslySetInnerHTML={{
                    __html: t(
                      "brand_track_your_next_payment_content_alert_warring_des_1",
                      {
                        date: moment(alertPaymentReminder?.dueDate).format(
                          "MMMM DD, yyyy"
                        ),
                      }
                    ),
                  }}
                ></ParagraphBody>
                <ParagraphBody
                  $colorName={"--eerie-black"}
                  translation-key="brand_track_your_next_payment_content_alert_warring_des_2"
                >
                  {t(
                    "brand_track_your_next_payment_content_alert_warring_des_2"
                  )}
                </ParagraphBody>
              </Box>
            }
            type={AlerType.Warning}
          />
        )}
        {!project?.status && (
          <Alert
            title={t(
              "brand_track_your_next_payment_title_alert_subscription_canceled"
            )}
            content={
              <ParagraphBody
                $colorName={"--eerie-black"}
                translation-key="brand_track_your_next_payment_content_alert_subscription_canceled_des"
              >
                {t(
                  "brand_track_your_next_payment_content_alert_subscription_canceled_des"
                )}
              </ParagraphBody>
            }
            type={AlerType.Default}
          />
        )}

        <Grid pt={4}>
          <Grid className={classes.yourNextPaymentHeader}>
            <Heading4
              $fontWeight={"400"}
              $colorName={"--eerie-black"}
              translation-key="brand_track_your_next_payment_title"
            >
              {t("brand_track_your_next_payment_title")}
            </Heading4>
            <TextBtnSmall
              className={classes.cancelSub}
              $colorName={"--gray-80"}
              pr={1}
              onClick={cancelSubscription}
              translation-key="brand_track_your_next_payment_title_cancel_subscription"
            >
              {t("brand_track_your_next_payment_title_cancel_subscription")}
            </TextBtnSmall>
          </Grid>
          <Box className={classes.slidePayment} pt={4}>
            <Grid className={classes.slidePaymentSwiper}>
              <Box
                className={clsx(classes.iconSlide, classes.iconSlideLeft)}
                onClick={() => swiperRef.current?.slidePrev()}
              >
                <KeyboardArrowLeftIcon />
              </Box>

              <Swiper
                slidesPerView={2}
                breakpoints={sliderSettings}
                direction={"horizontal"}
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {paymentSchedules?.map((item, index) => {
                  return (
                    <SwiperSlide key={item.id}>
                      <Box
                        className={clsx(
                          classes.customSlide,
                          {
                            [classes.slideDefault]:
                              item.status === PaymentScheduleStatus.NOT_PAID,
                          },
                          {
                            [classes.slideProcessing]:
                              item.status === PaymentScheduleStatus.IN_PROGRESS,
                          },
                          {
                            [classes.slideDisabled]:
                              item.status === PaymentScheduleStatus.OVERDUE,
                          },
                          {
                            [classes.slideCompleted]:
                              item.status === PaymentScheduleStatus.PAID,
                          }
                        )}
                      >
                        <Box className={classes.contentSlideSwiper}>
                          <Grid className={classes.contentLeftSwiper}>
                            <Heading3 $colorName={"--gray-80"}>
                              {`${moment(item.start).format(
                                "MMM yyyy"
                              )} - ${moment(item.end).format("MMM yyyy")}`}
                            </Heading3>
                            <ParagraphBody
                              $colorName={"--gray-80"}
                              translation-key="common_month"
                            >
                              {item.solutionConfig.paymentMonthSchedule}{" "}
                              {t("common_month", {
                                s:
                                  item.solutionConfig.paymentMonthSchedule === 1
                                    ? ""
                                    : t("common_s"),
                              })}
                            </ParagraphBody>
                            <Heading3
                              $colorName={"--gray-80"}
                              $fontWeight={400}
                            >
                              <span className={classes.iconDolar}>
                                <Dolar />
                              </span>
                              {getCostCurrency(item.totalAmount)?.show}
                            </Heading3>
                          </Grid>
                          <Box className={classes.contentRightSwiper}>
                            {item.status === PaymentScheduleStatus.NOT_PAID && (
                              <Box>
                                <Button
                                  btnType={BtnType.Raised}
                                  endIcon={<CreditCardIcon />}
                                  children={
                                    <TextBtnSmall
                                      $colorName={"--white"}
                                      translation-key="brand_track_your_next_payment_title_button_pay_now"
                                    >
                                      {t(
                                        "brand_track_your_next_payment_title_button_pay_now"
                                      )}
                                    </TextBtnSmall>
                                  }
                                  onClick={() => goToPayNow(item)}
                                  disabled={!!index}
                                />

                                <ParagraphSmall
                                  pt={0.5}
                                  translation-key="brand_track_your_next_payment_sub_due"
                                >{`${t(
                                  "brand_track_your_next_payment_sub_due"
                                )} ${moment(item.dueDate).format(
                                  "MMM DD, yyyy"
                                )}`}</ParagraphSmall>
                              </Box>
                            )}
                            {item.status ===
                              PaymentScheduleStatus.IN_PROGRESS && (
                              <Box>
                                <Box className={classes.statusPayment}>
                                  <HourglassBottomIcon />
                                  <ParagraphSmall
                                    $colorName={"--warning-dark"}
                                    pl={1}
                                    translation-key="brand_track_your_next_payment_title_button_processing"
                                  >
                                    {t(
                                      "brand_track_your_next_payment_title_button_processing"
                                    )}
                                  </ParagraphSmall>
                                </Box>
                                <ParagraphSmallUnderline2
                                  $colorName={"--gray-90"}
                                  className={classes.urlViewDetail}
                                  pt={0.5}
                                  onClick={() => onOpenModal(item)}
                                  translation-key="brand_track_your_next_payment_sub_view_detail"
                                >
                                  {t(
                                    "brand_track_your_next_payment_sub_view_detail"
                                  )}
                                </ParagraphSmallUnderline2>
                              </Box>
                            )}
                            {item.status === PaymentScheduleStatus.OVERDUE && (
                              <Box>
                                <Button
                                  className={classes.btnWaiting}
                                  btnType={BtnType.Raised}
                                  endIcon={<CreditCardIcon />}
                                  disabled={true}
                                  children={
                                    <TextBtnSmall
                                      $colorName={"--gray-20"}
                                      translation-key="brand_track_your_next_payment_title_button_waiting"
                                    >
                                      {t(
                                        "brand_track_your_next_payment_title_button_waiting"
                                      )}
                                    </TextBtnSmall>
                                  }
                                />
                                <ParagraphSmall
                                  pt={0.5}
                                  $colorName={"--gray-40"}
                                  translation-key="brand_track_your_next_payment_sub_due"
                                >
                                  {`${t(
                                    "brand_track_your_next_payment_sub_due"
                                  )} ${moment(item.dueDate).format(
                                    "MMM DD, yyyy"
                                  )}`}
                                </ParagraphSmall>
                              </Box>
                            )}
                            {item.status === PaymentScheduleStatus.PAID && (
                              <Box>
                                <Box className={classes.icon}>
                                  <CheckCircleIcon />
                                </Box>
                                <ParagraphSmall
                                  $colorName={"--cimigo-green-dark-2"}
                                  translation-key="brand_track_your_next_payment_title_button_payment_completed"
                                >
                                  {t(
                                    "brand_track_your_next_payment_title_button_payment_completed"
                                  )}
                                </ParagraphSmall>
                                <ParagraphSmallUnderline2
                                  $colorName={"--gray-90"}
                                  className={classes.urlViewDetail}
                                  pt={0.5}
                                  translation-key="brand_track_your_next_payment_download_invoice"
                                >
                                  {t(
                                    "brand_track_your_next_payment_download_invoice"
                                  )}
                                </ParagraphSmallUnderline2>
                              </Box>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <Box
                className={clsx(classes.iconSlide, classes.iconSlideRight)}
                onClick={() => swiperRef.current?.slideNext()}
              >
                <KeyboardArrowRightIcon />
              </Box>
            </Grid>
          </Box>
          <PaymentHistoryList projectId={projectId} />
        </Grid>
      </Grid>
      <PopupConfirmCancelSubsription
        projectId={projectId}
        isOpen={onSubmitCancelSubsription}
        onCancel={onCloseSubmitCancelSubsription}
        onSubmit={(reson) => submitCancelSubsription(reson)}
      />
      {paymentScheduleForPay && isOpenPopupPaynow && (
        <PopupPayNow
          isOpen={isOpenPopupPaynow}
          onClose={onClose}
          paymentSchedule={paymentScheduleForPay}
          onOpenModal={onOpenModal}
        />
      )}
      {paymentScheduleForPay && isOpenPopupBankTransfer && (
        <PopupBankTransfer
          isOpen={isOpenPopupBankTransfer}
          onCancel={onClose}
          onDownloadInvoice={() => handleDownloadInvoice(paymentScheduleForPay?.payments?.[0])}
          onCancelPayment={onCancelPayment}
          paymentSchedule={paymentScheduleForPay}
        />
      )}
      {paymentScheduleForPay && isOpenPopupOnlinePayment && (
        <PopupOnlinePayment
          isOpen={isOpenPopupOnlinePayment}
          onCancel={onClose}
          onDownloadInvoice={() => handleDownloadInvoice(paymentScheduleForPay?.payments?.[0])}
          onCancelPayment={onCancelPayment}
          paymentSchedule={paymentScheduleForPay}
        />
      )}
      {paymentScheduleForPay && isOpenPopupSuportAgent && (
        <PopupSupportAgent
          isOpen={isOpenPopupSuportAgent}
          onCancel={onClose}
          onDownloadInvoice={() => handleDownloadInvoice(paymentScheduleForPay?.payments?.[0])}
          onCancelPayment={onCancelPayment}
          paymentSchedule={paymentScheduleForPay}
        />
      )}
      <Footer />
    </>
  );
};
export default YourNextPayment;
