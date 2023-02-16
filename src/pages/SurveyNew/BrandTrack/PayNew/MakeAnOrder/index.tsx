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
import { useEffect, useRef, useState } from "react";
import Alert, { AlerType } from "../Alert";
import { GetPaymentSchedule, PaymentSchedule, PaymentScheduleStatus } from "models/payment_schedule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { DataPagination } from "models/general";
import PopupConfirmCancelSubsription from "../components/PopupConfirmCancelSubsription";
import PaymentHistoryList from "../components/PaymentHistoryList";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import moment from "moment";
import { PaymentScheduleService } from "services/payment_schedule";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { authProjectPreview } from "../models";
import { usePrice } from "helpers/price";
import { setPaymentReducer } from "redux/reducers/MakeAnOrderPaymentSchedule/actionTypes";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import HourglassBottomIcon from "@mui/icons-material/HourglassBottom";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PopupPayNow from "pages/SurveyNew/components/PopupPayment/PopupPayNow";
import { EPaymentMethod, OptionItem } from "models/general";
// Import Swiper styles
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/pagination";
import "swiper/css/navigation";
import PopupBankTransfer from "pages/SurveyNew/components/PopupPayment/PopupBankTransfer";
import PopupOnlinePayment from "pages/SurveyNew/components/PopupPayment/PopupOnlinePayment";
import PopupSupportAgent from "pages/SurveyNew/components/PopupPayment/PopupSupportAgent";

interface MakeAnOrderProp {
  projectId: number;
}
const sliderSettings = {
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
const MakeAnOrder = ({ projectId }: MakeAnOrderProp) => {
  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project);
  const { isMakeAnOrder } = useSelector((state: ReducerType) => state.payment);
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenBankTransfer, setIsOpenBankTransfer] = useState(false);
  const [isOpenOnlinePayment, setIsOpenOnlinePayment] = useState(false)
  const [isOpenSuportAgent, setIsOpenSupportAgent] = useState(false);
  const [dataPaymentSchedule, setDataPaymentSchedule] = useState <PaymentSchedule>();
  const [paymentSchedule, setPaymentSchedule] =
    useState<DataPagination<PaymentSchedule>>();
  const [alertPaymentSuccess, setAlertPaymentSuccess] =
    useState<boolean>(false);
  const [onSubmitCancelSubsription, setOnSubmitCancelSubsription] =
    useState(false);
  const [alertPaymentReminder, setAlertPaymentReminder] =
    useState<PaymentSchedule>();
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
    setIsOpen(true);
  };
  const onGoBackMakePayment = () => {
    onClose();
    setIsOpen(true);
  }
  const onOpenModal = (item: number) => {
    setIsOpen(false);
    switch (item) {
      case EPaymentMethod.BANK_TRANSFER:
        setIsOpenBankTransfer(true);
        break;
      case EPaymentMethod.ONEPAY_GENERAL:
        setIsOpenOnlinePayment(true);
        break;
      case EPaymentMethod.MAKE_AN_ORDER:
        setIsOpenSupportAgent(true);
        break;
      default:
        break;
    }
  };
  const onClose = () => {
    setIsOpen(false)
    setIsOpenBankTransfer(false);
    setIsOpenOnlinePayment(false);
    setIsOpenSupportAgent(false);
  }
  const { getCostCurrency } = usePrice();
  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };
  const setDefaultMakeAnOrderReducer = () => {
    dispatch(
      setPaymentReducer({
        isMakeAnOrder: false,
      })
    );
  };
  const swiperRef = useRef<any>();
  useEffect(() => {
    authProjectPreview(project, onRedirect);
    setDefaultMakeAnOrderReducer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  useEffect(() => {
    const getListPaymentSchedule = async () => {
      const data: GetPaymentSchedule = {
        projectId: projectId,
      };
      dispatch(setLoading(true));
      await PaymentScheduleService.getPaymentSchedule(data)
        .then((res) => {
          setPaymentSchedule(res);
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    getListPaymentSchedule();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, projectId]);
  useEffect(() => {
    const checkPaymentReminder = () => {
      var paymentFirst = paymentSchedule?.data[0];
      var now = moment().add(14, "d").format("DD MMM yyyy");
      var dueDate = moment(paymentFirst?.dueDate).format("DD MMM yyyy");
      if (
        now >= dueDate &&
        paymentFirst?.status === PaymentScheduleStatus.NOT_PAID
      ) {
        setAlertPaymentReminder(paymentFirst);
      }
    };
    if (paymentSchedule?.data) {
      checkPaymentReminder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paymentSchedule]);
  useEffect(() => {
    if (isMakeAnOrder) {
      setAlertPaymentSuccess(isMakeAnOrder);
    }
  }, [isMakeAnOrder]);
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        {alertPaymentSuccess && (
          <Alert
            title={"Thanks for making an order!"}
            content={
              <ParagraphBody $colorName={"--eerie-black"}>
                Fieldwork will start at the beginning of{" "}
                {moment(project?.startPaymentSchedule).format("MMMM yyyy")} if
                you make the first payment by{" "}
                {moment(paymentSchedule?.data[0]?.dueDate).format(
                  "MMMM DD, yyyy"
                )}
                . Subsequent payments will be made every{" "}
                {paymentSchedule?.data[0]?.solutionConfig?.paymentMonthSchedule}{" "}
                months.
              </ParagraphBody>
            }
            type={AlerType.Success}
          />
        )}
        {alertPaymentReminder && (
          <Alert
            title={"A payment is about to become due."}
            content={
              <Box>
                <ParagraphBody $colorName={"--eerie-black"}>
                  You have a pending payment that is about to become overdue.
                  You must process the payment by{" "}
                  {moment(alertPaymentReminder.dueDate).format("MMMM DD, yyyy")}{" "}
                  to avoid being terminated.
                </ParagraphBody>
                <ParagraphBody $colorName={"--eerie-black"}>
                  If you have made the payment, please wait for Cimigo to
                  process.
                </ParagraphBody>
              </Box>
            }
            type={AlerType.Warning}
          />
        )}
        {!project?.status && (
          <Alert
            title={"Your subscription canceled!"}
            content={
              <ParagraphBody $colorName={"--eerie-black"}>
                You have canceled your subscription. The results are still
                available to you.
              </ParagraphBody>
            }
            type={AlerType.Default}
          />
        )}

        <Grid pt={4}>
          <Grid className={classes.yourNextPaymentHeader}>
            <Heading4 $fontWeight={"400"} $colorName={"--eerie-black"}>
              Your next payments
            </Heading4>
            <TextBtnSmall
              className={classes.cancelSub}
              $colorName={"--gray-80"}
              pr={1}
              onClick={cancelSubscription}
            >
              Cancel subscription
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
                onBeforeInit={(swiper) => {
                  swiperRef.current = swiper;
                }}
              >
                {paymentSchedule?.data.map((item, index) => {
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
                            <ParagraphBody $colorName={"--gray-80"}>
                              {item.solutionConfig.paymentMonthSchedule} months
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
                                    <TextBtnSmall $colorName={"--white"}>
                                      Pay now
                                    </TextBtnSmall>
                                  }
                                  onClick={()=>goToPayNow(item)}
                                  disabled={!!index}
                                />

                                <ParagraphSmall pt={0.5}>{`Due ${moment(
                                  item.dueDate
                                ).format("MMM DD, yyyy")}`}</ParagraphSmall>
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
                                  >
                                    Processing...
                                  </ParagraphSmall>
                                </Box>
                                <ParagraphSmallUnderline2
                                  $colorName={"--gray-90"}
                                  className={classes.urlViewDetail}
                                  pt={0.5}
                                >
                                  View details
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
                                    <TextBtnSmall $colorName={"--gray-20"}>
                                      Waiting
                                    </TextBtnSmall>
                                  }
                                />
                                <ParagraphSmall
                                  pt={0.5}
                                  $colorName={"--gray-40"}
                                >
                                  {`Due ${moment(item.dueDate).format(
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
                                >
                                  Payment completed
                                </ParagraphSmall>
                                <ParagraphSmallUnderline2
                                  $colorName={"--gray-90"}
                                  className={classes.urlViewDetail}
                                  pt={0.5}
                                >
                                  Download invoice
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
        isOpen={onSubmitCancelSubsription}
        onCancel={onCloseSubmitCancelSubsription}
        onSubmit={(reson) => submitCancelSubsription(reson)}
      />
      <PopupPayNow isOpen={isOpen} onClose={onClose} dataPaymentSchedule={dataPaymentSchedule} onOpenModal={onOpenModal}/>
      <PopupBankTransfer isOpen={isOpenBankTransfer} onCancel={onClose} onGoBackMakePayment={onGoBackMakePayment} dataPaymentSchedule={dataPaymentSchedule}/>
      <PopupOnlinePayment isOpen={isOpenOnlinePayment} onCancel={onClose} onGoBackMakePayment={onGoBackMakePayment} dataPaymentSchedule={dataPaymentSchedule}/>
      <PopupSupportAgent isOpen={isOpenSuportAgent} onCancel={onClose} onGoBackMakePayment={onGoBackMakePayment} dataPaymentSchedule={dataPaymentSchedule}/>
      <Footer />
    </>
  );
};
export default MakeAnOrder;
