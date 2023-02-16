import { Box, Grid } from "@mui/material";
import Heading4 from "components/common/text/Heading4";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo, useEffect, useState } from "react";
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
import moment from "moment";
import PopupConfirmMakeAnOrder from "../components/PopupConfirmMakeAnOrder";
import { authPreviewOrSelectDate } from "../models";
import { GetPaymentSchedulePreview, PaymentSchedulePreview } from "models/payment_schedule";
import clsx from "clsx";
import {setPaymentIsMakeAnOrderSuccessReducer } from "redux/reducers/MakeAnOrderPaymentSchedule/actionTypes";
import { usePrice } from "helpers/price";
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import { formatOrdinalumbers } from "utils/formatNumber";

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
  const { getCostCurrency } = usePrice();
  
  const [listDate, setListDate] = useState<DateItem[]>([]);
  const [isOpenListPaymentSchedule, setIsOpenListPaymentSchedule] = useState<Boolean>(false);
  const [selectedDate, setSelectedDate] = useState<DateItem>();
  const [onSubmitMakeAnOrder, seOnSubmitMakeAnOrder] = useState(false);
  const [listSchedulePreview, setListSchedulePreview] = useState<PaymentSchedulePreview[]>();

  useEffect(() => {
    authPreviewOrSelectDate(project, onRedirect);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project]);

  useEffect(() => {
    let days = [];
    var today = moment().startOf('month').format('YYYY-MM-DD');
    for (var i = 0; i < 6; i++) {
      days[i] = {
        id: i,
        date: moment(today).add(i+1, 'M'),
      };
    }
    setSelectedDate(days[0]);
    setListDate([...days]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedDate) {
      dispatch(setLoading(true));
      const params: GetPaymentSchedulePreview = {
        projectId: projectId,
        startDate: moment(selectedDate.date).toDate(),
      };
      PaymentScheduleService.getPaymentSchedulePreview(params)
        .then((res) => {
          setListSchedulePreview(res?.data);
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  const selectedDatePayment = (dateItem: DateItem) => {
    setSelectedDate(dateItem);
  };
  const onToggleListPaymentSchedule = () => {
    setIsOpenListPaymentSchedule(!isOpenListPaymentSchedule);
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
  const onConfirmMakeAnOrder = () => {
    seOnSubmitMakeAnOrder(false);
  };
  const submitMakeAnOrder = () => {
    if (!selectedDate) return;
    dispatch(setLoading(true));
    PaymentScheduleService.paymentScheduleMakeAnOrder({
      projectId: projectId,
      startDate: moment(selectedDate.date).toDate(),
    })
      .then((res) => {
        seOnSubmitMakeAnOrder(false)
        dispatch(setPaymentIsMakeAnOrderSuccessReducer(true));
        dispatch(setProjectReducer({
          ...project,
          status: res?.status,
          startPaymentSchedule: res?.startPaymentSchedule
        }))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };
  const onRedirect = (route: string) => {
    dispatch(push(route.replace(":id", `${project.id}`)));
  };

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
                      classes.itemDate,
                      {[classes.itemDateActive]: index === selectedDate.id }
                      )
                  }
                  onClick={() => {
                    selectedDatePayment(item);
                  }}
                >
                  <span className={classes.iconActive}>
                    <DoneIcon />
                  </span>
                  <Heading5 className={classes.titleMonth} pb={2}>
                    {moment(item.date).format("MMM").toUpperCase()}
                  </Heading5>
                  <ParagraphBody>{+moment(item.date).format("yyyy")}</ParagraphBody>
                </Box>
              ))}
            </Grid>
          </Grid>
          {selectedDate && (
            <Grid pb={4}>
              <ParagraphBody $colorName={"--eerie-black"}>
                {" "}
                <span className={classes.bold}>Note:</span> For the project to
                start, you would need to make the first payment by{" "}
                <span className={classes.bold}> {moment(listSchedulePreview?.[0]?.dueDate).format("MMM DD, yyyy")} </span>. Subsequent
                payments will be made every {listSchedulePreview?.[0]?.scheduledMonths} months.
              </ParagraphBody>
            </Grid>
          )}
          {listSchedulePreview && (
            <>
              <Grid className={classes.viewPaymentScheduleTextWrapper} pl={1}>
                <ArrowRightIcon className={clsx({[classes.rotateIcon]: isOpenListPaymentSchedule})}/>
                <ParagraphBodyUnderline
                  $colorName={"--cimigo-blue"}
                  onClick={onToggleListPaymentSchedule}
                >
                  View payment schedules
                </ParagraphBodyUnderline>
              </Grid>
              {isOpenListPaymentSchedule && (
                <Grid pt={2}>
                  <ParagraphBody $colorName={"--eerie-black"}>
                    The following is the schedule for the next 4 payments:
                  </ParagraphBody>
                  <Grid className={classes.listPayment} pt={2}>
                    <Grid container spacing={2}>
                      {listSchedulePreview?.map((schedulePreview) => {
                        return (
                          <Grid item xs={12} md={5} key={schedulePreview.order}>
                            <Box className={classes.payment}>
                              <Grid className={classes.contentPayment}>
                                <Heading3 $colorName={"--gray-80"}>
                                  {formatOrdinalumbers(schedulePreview.order,i18n.language)} payment
                                </Heading3>
                                <ParagraphBody $colorName={"--gray-80"}>
                                  {schedulePreview.scheduledMonths} months ({`${moment(schedulePreview.startDate).format("MMM yyyy")} - ${moment(schedulePreview.endDate).format("MMM yyyy")}`})
                                </ParagraphBody>
                                <Heading3
                                  $colorName={"--gray-80"}
                                  $fontWeight={400}
                                  pt={1}
                                >
                                  <span className={classes.iconDolar}>
                                    <Dolar />
                                  </span>
                                  {getCostCurrency(schedulePreview.totalAmount)?.show}
                                </Heading3>
                                <ParagraphSmall $colorName={"--gray-80"} pt={2}>
                                  {`Due date: ${moment(schedulePreview.dueDate).format("MMM DD, yyyy")}`}
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
        paymentSchedule={listSchedulePreview?.[0]}
        selectedDate={selectedDate}
        onCancel={onConfirmMakeAnOrder}
        onSubmit={() => submitMakeAnOrder()}
      />
      <Footer />
    </>
  );
});
export default SelectDate;
