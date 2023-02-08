import { Box, Grid } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo, useEffect, useState, useCallback } from "react";
import classes from "./styles.module.scss";
import DoneIcon from "@mui/icons-material/Done";
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Heading3 from "components/common/text/Heading3";
import { ReducerType } from "redux/reducers";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes, routesOutside } from "routers/routes";
import { useTranslation } from "react-i18next";
import Dolar from "components/icons/IconDolar";
import Footer from "components/Footer";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";

import { PaymentScheduleService } from "services/payment_schedule";
import { DataPagination, ECurrency } from "models/general";
import moment from "moment";
import useAuth from "hooks/useAuth";
import { fCurrencyVND } from "utils/formatNumber";
import PopupConfirmMakeAnOrder from "../components/PopupConfirmMakeAnOrder";
import { authPreviewOrPayment, formatOrdinalumbers } from "../models";
import { GetPaymentSchedulePreview, PaymentSchedulePreview } from "models/payment_schedule";
import clsx from "clsx";
import {setMakeAnOrderReducer } from "redux/reducers/MakeAnOrderPaymentSchedule/actionTypes";
import { MakeAnOrderReducer } from "redux/reducers/MakeAnOrderPaymentSchedule";
export interface DateItem {
  id: number;
  date?: string;
}
interface SelectDateProps {
  projectId: number;
}
const SelectDate = memo(({ projectId }: SelectDateProps) => {
  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project);
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [listDate, setListDate] = useState<DateItem[]>([]);
  const [viewPS, setViewPS] = useState<Boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateItem>();
  const [onSubmitMakeAnOrder, seOnSubmitMakeAnOrder] = useState(false);
  const [listSchedulePreview, setListSchedulePreview] =
    useState<DataPagination<PaymentSchedulePreview>>();
  const onClickDate = (dateItem: DateItem) => {
    setSelectedDate(dateItem);
  };
  const viewListPS = () => {
    setViewPS(!viewPS);
  };
  const goToPayment = () => {
    dispatch(
      push(
        routes.project.detail.paymentBilling.previewAndPayment.preview.replace(
          ":id",
          `${project.id}`
        )
      )
    );
  };
  const goToMakeAnOrder = () => {
    seOnSubmitMakeAnOrder(true);
  };
  const formatMoney = useCallback(
    (schedule: PaymentSchedulePreview) => {
      switch (user?.currency) {
        case ECurrency.VND:
          return `${fCurrencyVND(schedule.totalAmount)}`;
        case ECurrency.USD:
          return `$${schedule.totalAmountUSD}`;
      }
    },
    [user?.currency]
  );
  const onConfirmMakeAnOrder = () => {
    seOnSubmitMakeAnOrder(false);
  };
  const submitMakeAnOrder = () => {
    if (!selectedDate) return;
    dispatch(setLoading(true));
    PaymentScheduleService.paymentScheduleMakeAnOrder({
      projectId: projectId,
      startDate: new Date(moment(selectedDate.date).format('YYYY-MM-DD')),
    })
      .then(() => {
        seOnSubmitMakeAnOrder(false)
        const paramMakeAnOrder: MakeAnOrderReducer = {
          projectId,
          startDate: new Date(moment(selectedDate.date).format('YYYY-MM-DD')),
        }
        dispatch(setMakeAnOrderReducer(paramMakeAnOrder));
        dispatch(
          push(
            routes.project.detail.paymentBilling.previewAndPayment.makeAnOrder.replace(
              ":id",
              `${project.id}`
            )
          )
        );
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };
  useEffect(() => {
    authPreviewOrPayment(project, onRedirect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);
  useEffect(() => {
    let days = [];
    var today = moment().startOf('month').format('YYYY-MM-DD');
    for (var i = 0; i < 6; i++) {
      days[i] = {
        id: i,
        date: moment(today).add(i+1, 'M').format('YYYY-MM-DD'),
      };
      if (i === 0) {
        setSelectedDate(days[i]);
      }
    }
    setListDate([...days]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const getSchedulePreview = async () => {
      dispatch(setLoading(true));
      const params: GetPaymentSchedulePreview = {
        projectId: projectId,
        startDate: new Date(moment(selectedDate.date).format('YYYY-MM-DD')),
      };
      PaymentScheduleService.getPaymentSchedulePreview(params)
        .then((res) => {
          setListSchedulePreview({
            data: res.data,
            meta: res.meta,
          });
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    };
    if (selectedDate) {
      getSchedulePreview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);
  return (
    <>
      <Grid classes={{ root: classes.root }}>
        <Grid pt={4}>
          <Heading4 $colorName={"--eerie-black"}>
            Select the date to begin tracking
          </Heading4>
          <ParagraphBody $colorName={"--eerie-black"}>
            Please choose the date when you want us to start tracking your brand
            performance. The fieldwork will be kicked off at beginning of the
            every month.
          </ParagraphBody>
          <Grid className={classes.listDate}>
            <Grid ml={3} className={classes.contentListDate}>
              {listDate?.map((item, index) => (
                <Box
                  mr={2}
                  key={index}
                  className={
                    clsx(
                      {[classes.itemDateActive]: index === selectedDate.id },
                      {[classes.itemDate]: index !== selectedDate.id }
                      )
                  }
                  onClick={() => {
                    onClickDate(item);
                  }}
                >
                  <span className={classes.iconActive}>
                    <DoneIcon />
                  </span>
                  <Heading5 className={classes.titleMonth} pb={2}>
                    {moment(item.date).lang(i18n.language).format("MMM").toUpperCase()}
                  </Heading5>
                  <ParagraphBody>{+moment(item.date).format("yyyy")}</ParagraphBody>
                </Box>
              ))}
            </Grid>
          </Grid>
          {selectedDate && (
            <Grid pb={4} className={classes.noteSelectDate}>
              <ParagraphBody $colorName={"--eerie-black"}>
                {" "}
                <span className={classes.bold}>Note:</span> For the project to
                start, you would need to make the first payment by{" "}
                <span className={classes.bold}> {moment(selectedDate.date).subtract(7,'days').lang(i18n.language).format("MMM DD, yyyy")} </span>. Subsequent
                payments will be made every 3 months.
              </ParagraphBody>
            </Grid>
          )}
          {listSchedulePreview && (
            <>
              <Grid className={classes.linkViewPS} pl={1}>
                <ArrowRightIcon />
                <ParagraphBodyUnderline
                  $colorName={"--cimigo-blue"}
                  onClick={viewListPS}
                >
                  View payment schedules
                </ParagraphBodyUnderline>
              </Grid>
              {viewPS && (
                <Grid className={classes.contentPS} pt={2}>
                  <ParagraphBody $colorName={"--eerie-black"}>
                    The following is the schedule for the next 4 payments:
                  </ParagraphBody>
                  <Grid className={classes.listPayment} pt={2}>
                    <Grid container spacing={2}>
                      {listSchedulePreview?.data.map((schedulePreview) => {
                        return (
                          <Grid item xs={12} md={5} key={schedulePreview.order}>
                            <Box className={classes.payment}>
                              <Grid className={classes.contentPayment}>
                                <Heading3 $colorName={"--gray-80"}>
                                  {formatOrdinalumbers(schedulePreview.order,i18n.language)} payment
                                </Heading3>
                                <ParagraphBody $colorName={"--gray-80"}>
                                  {schedulePreview.scheduledMonths} months (
                                  {`${moment(schedulePreview.startDate)
                                    .lang(i18n.language)
                                    .format("MMM yyyy")} - ${moment(
                                    schedulePreview.endDate
                                  )
                                    .lang(i18n.language)
                                    .format("MMM yyyy")}`}
                                  )
                                </ParagraphBody>
                                <Heading3
                                  $colorName={"--gray-80"}
                                  $fontWeight={400}
                                  pt={1}
                                >
                                  <span className={classes.iconDolar}>
                                    <Dolar />
                                  </span>
                                  {formatMoney(schedulePreview)}
                                </Heading3>
                                <ParagraphSmall $colorName={"--gray-80"} pt={2}>
                                  {`Due date: ${moment(schedulePreview.dueDate)
                                    .lang(i18n.language)
                                    .format("MMM DD, yyyy")}`}
                                </ParagraphSmall>
                              </Grid>
                            </Box>
                          </Grid>
                        );
                      })}
                    </Grid>
                  </Grid>
                </Grid>
              )}
            </>
          )}

          <Grid className={classes.btnFooter} pt={4}>
            <Button
              className={classes.btnBack}
              btnType={BtnType.Outlined}
              children={
                <TextBtnSecondary $colorName={"--cimigi-blue"}>
                  Back
                </TextBtnSecondary>
              }
              onClick={goToPayment}
            />
            <Button
              className={classes.btnBack}
              btnType={BtnType.Raised}
              children={<TextBtnSecondary>Make an order</TextBtnSecondary>}
              onClick={goToMakeAnOrder}
            />
          </Grid>
          <Grid className={classes.disTermsOfServices} pt={1}>
            <ParagraphSmall $colorName={"--gray-60"}>
              By click “make an order”, you agree to our &nbsp;
              <a
                className={classes.linkTermOfService}
                target="_blank"
                rel="noopener noreferrer"
                href={routesOutside(i18n.language)?.rapidsurveyTermsOfService}
              >
                terms of services.
              </a>
            </ParagraphSmall>
          </Grid>
        </Grid>
      </Grid>
      <PopupConfirmMakeAnOrder
        isOpen={onSubmitMakeAnOrder}
        project={project}
        selectedDate={selectedDate}
        onCancel={onConfirmMakeAnOrder}
        onSubmit={() => submitMakeAnOrder()}
      />
      <Footer />
    </>
  );
});
export default SelectDate;
