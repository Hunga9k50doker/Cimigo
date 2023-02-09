import { Box, TablePagination, useMediaQuery, useTheme } from "@mui/material";
import Grid from "@mui/material/Grid";
import Slider from "react-slick";
import Heading4 from "components/common/text/Heading4";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import classes from "./styles.module.scss";
//slick
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
//end import slick
import Heading5 from "components/common/text/Heading5";
import Dolar from "components/icons/IconDolar";
import IconHourGlass from "components/icons/IconHourGlass";
import DateRangeIcon from "@mui/icons-material/DateRange";
import ParagraphSmallUnderline2 from "components/common/text/ParagraphSmallUnderline2";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody";
import Button, { BtnType } from "components/common/buttons/Button";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Footer from "components/Footer";
import { useCallback, useEffect, useMemo, useState } from "react";
import Alert, { AlerType } from "../Alert";
import { useTranslation } from "react-i18next";
import ChipProjectStatus from "components/common/status/ChipProjectStatus";
import {
  GetListPaymentScheduleHistory,
  GetSlidePaymentSchedule,
  PaymentScheduleHistory,
  SlidePaymentScheduleMakeAnOrder,
} from "models/payment_schedule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { DataPagination, ECurrency } from "models/general";
import PopupConfirmCancelSubsription from "../components/PopupConfirmCancelSubsription";
import PaymentHistoryList from "../components/PaymentHistoryList";
import { useDispatch, useSelector } from "react-redux";
import clsx from "clsx";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import moment from "moment";
import { PaymentScheduleService } from "services/payment_schedule";
import { fCurrencyVND } from "utils/formatNumber";
import useAuth from "hooks/useAuth";
import { ReducerType } from "redux/reducers";
import { push } from "connected-react-router";
import { authPreviewOrPayment } from "../models";
import { MakeAnOrderReducer } from "redux/reducers/MakeAnOrderPaymentSchedule";
import { setMakeAnOrderReducer } from "redux/reducers/MakeAnOrderPaymentSchedule/actionTypes";
interface MakeAnOrderProp {
  projectId: number;
}
enum StatusSlide {
  NOT_PAID,
  IN_PROGRESS,
  PAID,
  OVERDUE,
}
interface CustomSlide {
  navigator: boolean;
  dots: boolean;
  infinite: boolean;
  speed: number;
  slidesToShow: number;
  slidesToScroll: number;
  prevArrow: React.ReactNode;
  nextArrow: React.ReactNode;
}

const paramsSlideDefault: CustomSlide = {
  navigator: true,
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 2,
  slidesToScroll: 2,
  prevArrow: (
    <span className="customIcon">
      <KeyboardArrowLeftIcon />
    </span>
  ),
  nextArrow: (
    <span className="customIcon">
      <KeyboardArrowRightIcon />
    </span>
  ),
};
const MakeAnOrder = ({ projectId }: MakeAnOrderProp) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down(768));
  const { project } = useSelector((state: ReducerType) => state.project);
  const { makeAnOrderPaymentSchedule } = useSelector(
    (state: ReducerType) => state.makeAnOrder
  );
  const [slide, setSlide] =
    useState<DataPagination<SlidePaymentScheduleMakeAnOrder>>();

  const [onSubmitCancelSubsription, setOnSubmitCancelSubsription] =
    useState(false);
  const [customSlide, setCustomSlide] = useState<CustomSlide>({
    ...paramsSlideDefault,
  });
  const [checkMakeAnOrder, setCheckMakeAnOrder] = useState<Boolean>(false);
  const [alertPaymentReminder, setAlertPaymentReminder] =
    useState<SlidePaymentScheduleMakeAnOrder>();
  const [dataPopupCancelSubsription, setDataPopupCancelSubsription] = useState<SlidePaymentScheduleMakeAnOrder>();

  const onCloseSubmitCancelSubsription = () => {
    setOnSubmitCancelSubsription(false);
  };
  const submitCancelSubsription = (reson: string) => {
    setOnSubmitCancelSubsription(false);
  };
  const cancelSubscription = () => {
    setOnSubmitCancelSubsription(true);
  };
  const goToPayNow = () => { };
  const formatMoney = useCallback(
    (slide: SlidePaymentScheduleMakeAnOrder) => {
      switch (user?.currency) {
        case ECurrency.VND:
          return `${fCurrencyVND(slide.totalAmount)}`;
        case ECurrency.USD:
          return `$${slide.totalAmountUSD}`;
      }
    },
    [user?.currency]
  );
  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };
  const setDefaultMakeAnOrderReducer = () => {
    const paramMakeAnOrder: MakeAnOrderReducer = {
      projectId: null,
      startDate: null,
    };
    dispatch(setMakeAnOrderReducer(paramMakeAnOrder));
  };

  useEffect(() => {
    authPreviewOrPayment(project, onRedirect);
    if (project && project?.id === makeAnOrderPaymentSchedule?.projectId) {
      setCheckMakeAnOrder(true);
      setDefaultMakeAnOrderReducer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  useEffect(() => {
    const getListSlide = async () => {
      const data: GetSlidePaymentSchedule = {
        projectId: projectId,
      };
      dispatch(setLoading(true));
      await PaymentScheduleService.getSlideMakeAnOrderPaymentSchedule(data)
        .then((res) => {
          setSlide(res);
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    getListSlide()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, projectId]);
  useEffect(() => {
    var customReponsiveSlide = {
      navigator: true,
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 2,
      slidesToScroll: 2,
      prevArrow: (
        <span className="customIcon">
          <KeyboardArrowLeftIcon />
        </span>
      ),
      nextArrow: (
        <span className="customIcon">
          <KeyboardArrowRightIcon />
        </span>
      ),
    };
    if (isMobile) {
      customReponsiveSlide.slidesToScroll = 1;
      customReponsiveSlide.slidesToShow = 1;
    }
    setCustomSlide(customReponsiveSlide);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMobile]);
  useEffect(() => {
    const checkPaymentReminder = () => {
      var now = moment().add(14, "d").format("DD MMM yyyy");
      slide?.data.map((item, index) => {
        var dueDate = moment(item.dueDate).format("DD MMM yyyy");
        if (now >= dueDate && item.status === 0) {
          setAlertPaymentReminder(item);
        }
        if (item.status === StatusSlide.NOT_PAID && !index) {
          setDataPopupCancelSubsription(item)
        }
      });
    };
    if (slide?.data) {
      checkPaymentReminder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slide]);
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        {checkMakeAnOrder && (
          <Alert
            title={"Thanks for making an order!"}
            content={
              <ParagraphBody $colorName={"--eerie-black"}>
                Fieldwork will start at the beginning of Jan 2023 if you make
                the first payment by Nov 25, 2023. Subsequent payments will be
                made every 3 months.
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
                  {moment(alertPaymentReminder.dueDate)
                    .lang(i18n.language)
                    .format("MMMM DD, yyyy")}{" "}
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
        {project?.status == 4 && (
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
            <Slider {...customSlide}>
              {slide?.data.map((item, index) => {
                return (
                  <Grid className={classes.customItemSilde} key={item.id}>
                    <div
                      className={clsx(
                        {
                          [classes.itemSlide]:
                            item.status === StatusSlide.NOT_PAID,
                        },
                        {
                          [classes.itemSlideProcessing]:
                            item.status === StatusSlide.IN_PROGRESS,
                        },
                        {
                          [classes.itemSlideDisabled]:
                            item.status === StatusSlide.OVERDUE,
                        },
                        {
                          [classes.itemSlideCompleted]:
                            item.status === StatusSlide.PAID,
                        }
                      )}
                    >
                      <Box className={classes.contentSlide}>
                        <Grid className={classes.contentLeft}>
                          <Heading3 $colorName={"--gray-80"}>
                            {`${moment(item.start)
                              .lang(i18n.language)
                              .format("MMM yyyy")} - ${moment(item.end)
                                .lang(i18n.language)
                                .format("MMM yyyy")}`}
                          </Heading3>
                          <ParagraphBody $colorName={"--gray-80"}>
                            {item.solutionConfig.paymentMonthSchedule} months
                          </ParagraphBody>
                          <Heading3 $colorName={"--gray-80"} $fontWeight={400}>
                            <span className={classes.iconDolar}>
                              <Dolar />
                            </span>
                            {formatMoney(item)}
                          </Heading3>
                        </Grid>
                        <Box className={classes.contentRight}>
                          <Box>
                          {
                              item.status === StatusSlide.NOT_PAID &&
                              <Button
                                btnType={BtnType.Raised}
                                endIcon={<CreditCardIcon />}
                                children={
                                  <TextBtnSmall $colorName={"--white"}>
                                    Pay now
                                  </TextBtnSmall>
                                }
                                onClick={goToPayNow}
                                disabled={!!index}
                              />
                            }
                            {
                              item.status === StatusSlide.IN_PROGRESS &&
                              <Button
                                btnType={BtnType.Raised}
                                startIcon={<CreditCardIcon />}
                                children={
                                  <TextBtnSmall $colorName={"--white"}>
                                    Processing...
                                  </TextBtnSmall>
                                }
                                onClick={goToPayNow}
                              />
                            }

                            <ParagraphSmall pt={0.5}>
                              {`Due ${moment(item.dueDate)
                                .lang(i18n.language)
                                .format("MMM DD, yyyy")}`}
                            </ParagraphSmall>
                          </Box>
                        </Box>
                      </Box>
                    </div>
                  </Grid>
                );
              })}
            </Slider>
          </Box>
          <PaymentHistoryList projectId={projectId} />
        </Grid>
      </Grid>
      <PopupConfirmCancelSubsription
        payment={dataPopupCancelSubsription}
        isOpen={onSubmitCancelSubsription}
        onCancel={onCloseSubmitCancelSubsription}
        onSubmit={(reson) => submitCancelSubsription(reson)}
      />
      <Footer />
    </>
  );
};
export default MakeAnOrder;
