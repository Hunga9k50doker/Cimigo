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
import {
  GetListPaymentScheduleHistory,
  GetSlidePaymentSchedule,
  PayMentScheduleHistory,
  SlidePaymentScheduleMakeAnOrder,
} from "models/payment_schedule";
import KeyboardArrowLeftIcon from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { DataPagination, ECurrency } from "models/general";
import PopupConfirmCancelSubsription from "../components/PopupConfirmCancelSubsription";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import moment from "moment";
import { PaymentScheduleService } from "services/payment_schedule";
import { fCurrencyVND } from "utils/formatNumber";
import useAuth from "hooks/useAuth";
interface MakeAnOrderProp {
  projectId: number;
}
enum SortedField {
  name = "name",
  createdAt = "createdAt",
  updatedAt = "updatedAt",
}
enum StatusSlide {
  NOT_PAID,
  IN_PROGRESS,
  PAID,
  OVERDUE,
}
const paramsDefault: PayMentScheduleHistory = {
  take: 10,
  page: 1,
  sortedField: SortedField.updatedAt,
  isDescending: true,
};
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
const paramsListPaymentHistoryDefault: GetListPaymentScheduleHistory = {
  take: 10,
  page: 1,
  sortedField: SortedField.updatedAt,
  isDescending: true,
  projectId: 0,
}
const MakeAnOrder = ({ projectId }: MakeAnOrderProp) => {
  
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const isMobile = useMediaQuery(theme.breakpoints.down(768));
  const [slide, setSlide] =
    useState<DataPagination<SlidePaymentScheduleMakeAnOrder>>();
  const [params, setParams] = useState<GetListPaymentScheduleHistory>({ ...paramsListPaymentHistoryDefault })
  const [listPaymentHistory, setListPaymentHistory] = useState<DataPagination<PayMentScheduleHistory>>();
  const [onSubmitCancelSubsription, setOnSubmitCancelSubsription] =
    useState(false);
  const [customSlide, setCustomSlide] = useState<CustomSlide>({
    ...paramsSlideDefault,
  });
  const handleChangePage = (_: React.MouseEvent<HTMLButtonElement, MouseEvent>, newPage: number) => {
    setParams({ ...params, page: newPage + 1 })
  };
  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setParams({
      ...params,
      take: Number(event.target.value),
      page: 1,
    });
  };
  const inValidPage = () => {
    if (!listPaymentHistory) return false
    return listPaymentHistory.meta.page > 1 && Math.ceil(listPaymentHistory.meta.itemCount / listPaymentHistory.meta.take) < listPaymentHistory.meta.page
  }
  const pageIndex = useMemo(() => {
    if (!listPaymentHistory) return 0
    if (inValidPage()) return listPaymentHistory.meta.page - 2
    return listPaymentHistory.meta.page - 1
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const onCloseSubmitCancelSubsription = () => {
    setOnSubmitCancelSubsription(false);
  };
  const submitCancelSubsription = (reson: string) => {
    setOnSubmitCancelSubsription(false);
  };
  const cancelSubscription = () => {
    setOnSubmitCancelSubsription(true);
  };
  const goToPayNow = () => {};
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
  const getPaymmentHistory = async () => {
        PaymentScheduleService.getListPaymentScheduleHistory(params).then((res) => {
          setListPaymentHistory({
            data: res.data,
            meta: res.meta,
          });
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
  }
  useEffect(() => {
    if (inValidPage()) {
      handleChangePage(null, listPaymentHistory.meta.page - 2)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPaymentHistory])
  useEffect(() => {
    const getListSlide = async () => {
      dispatch(setLoading(true));
      const data: GetSlidePaymentSchedule = {
        projectId: projectId,
      };
      PaymentScheduleService.getSlideMakeAnOrderPaymentSchedule(data)
        .then((res) => {
          setSlide({
            data: res.data,
            meta: res.meta,
          });
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    if (projectId) {
      getListSlide();
    }
  }, [projectId]);
  useEffect(() => {
    setParams({ ...params, projectId: projectId });
    getPaymmentHistory();
  },[projectId])
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
  }, [isMobile]);
  useEffect(() => {
    getPaymmentHistory()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        <Alert
          title={"Thanks for making an order!"}
          content={
            <ParagraphBody $colorName={"--eerie-black"}>
              Fieldwork will start at the beginning of Jan 2023 if you make the
              first payment by Nov 25, 2023. Subsequent payments will be made
              every 3 months.
            </ParagraphBody>
          }
          type={AlerType.Success}
        />
        <Alert
          title={"A payment is about to become due."}
          content={
            <Box>
              <ParagraphBody $colorName={"--eerie-black"}>
                You have a pending payment that is about to become overdue. You
                must process the payment by December 25, 2022 to avoid being
                terminated.
              </ParagraphBody>
              <ParagraphBody $colorName={"--eerie-black"}>
                If you have made the payment, please wait for Cimigo to process.
              </ParagraphBody>
            </Box>
          }
          type={AlerType.Warning}
        />
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
              {slide?.data.map((item) => {
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
                            <Button
                              btnType={BtnType.Raised}
                              endIcon={<CreditCardIcon />}
                              children={
                                <TextBtnSmall $colorName={"--white"}>
                                  Pay now
                                </TextBtnSmall>
                              }
                              onClick={goToPayNow}
                            />
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
          <Grid className={classes.paymentHistory} pt={6}>
            <Heading4 $fontWeight={"400"} $colorName={"--eerie-black"}>
              Payment history
            </Heading4>
            <Grid className={classes.listPayemnt} pt={2}>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
              <Box className={classes.itemPayment}>
                <Grid container spacing={1}>
                  <Grid item xs={12} sm={8}>
                    <Heading5 $colorName={"--gray-90"}>
                      SEP 2022 - NOV 2022
                    </Heading5>
                    <Grid className={classes.moneyAndDate} pt={1}>
                      <Grid className={classes.money} pr={2.5}>
                        <span className={classes.iconDolar}>
                          <Dolar />
                        </span>{" "}
                        150,000,000 đ
                      </Grid>
                      <Grid className={classes.date}>
                        <DateRangeIcon
                          className={classes.iconCalendar}
                          sx={{ marginRight: "10px" }}
                        />
                        Nov 25, 2022
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <ParagraphSmallUnderline2 className={classes.linkDownload}>
                      Download invoice
                    </ParagraphSmallUnderline2>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
          <Grid className={classes.pagination} pt={4}>
            <TablePagination
              labelRowsPerPage={t("common_row_per_page")}
              labelDisplayedRows={function defaultLabelDisplayedRows({ from, to, count }) {
                return t("common_row_of_page", { from: from, to: to, count: count });
              }}
              component="div"
              count={listPaymentHistory?.meta?.itemCount || 0}
              rowsPerPage={listPaymentHistory?.meta?.take || 10}
              page={pageIndex}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </Grid>
        </Grid>
      </Grid>
      <PopupConfirmCancelSubsription
        isOpen={onSubmitCancelSubsription}
        onCancel={onCloseSubmitCancelSubsription}
        onSubmit={(reson) => submitCancelSubsription(reson)}
      />
      <Footer />
    </>
  );
};
export default MakeAnOrder;
