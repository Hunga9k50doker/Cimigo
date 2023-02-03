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
import { GetSchedulePreview, SchedulePreview } from "models/schedule";
import { ScheduleService } from "services/schedule";
import { DataPagination, ECurrency } from "models/general";
import moment from "moment";
import useAuth from "hooks/useAuth";
import { fCurrencyVND } from "utils/formatNumber";
import PopupConfirmMakeAnOrder from "../components/PopupConfirmMakeAnOrder";
export interface DateItem {
  id: number;
  month: number;
  year: number;
  day: number;
  date?: string;
  active?: boolean;
}
interface SelectDateProps {
  projectId: number;
}
const SelectDate = memo(({ projectId }: SelectDateProps) => {
  const dispatch = useDispatch();
  const { project } = useSelector((state: ReducerType) => state.project);
  const { i18n } = useTranslation();
  const { user } = useAuth();
  const [date, setDate] = useState<DateItem[]>([]);
  const [viewPS, setViewPS] = useState<Boolean>(false);
  const [duaDate, setDuaDate] = useState("");
  const [selectedDate, setSelectedDate] = useState<DateItem>();
  const [onSubmitMakeAnOrder, seOnSubmitMakeAnOrder] = useState(false);
  const [listSchedulePreview, setListSchedulePreview] =
    useState<DataPagination<SchedulePreview>>();
  const onClickDate = (dateItem: DateItem) => {
    const newDates = date.map((obj) => {
      // 👇️ if id equals 2, update country property
      if (obj.id === dateItem.id) {
        return { ...obj, active: true };
      }
      if (obj.id !== dateItem.id) {
        return { ...obj, active: false };
      }
      return obj;
    });
    setDate(newDates);
    setSelectedDate(dateItem);
    setDuaDate(formatDateToString(dateItem));
  };
  const formatDateToString = (val: DateItem) => {
    let stringDueDate = val.year + "-" + val.month + "-" + val.day;
    var newDate = new Date(stringDueDate);
    return moment(newDate.setDate(newDate.getDate() - 7))
      .lang(i18n.language)
      .format("MMM DD, yyyy");
  };
  const formatNameMonth = (date: DateItem) => {
    return moment(date.date).lang(i18n.language).format("MMM");
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
    (schedule: SchedulePreview) => {
      switch (user?.currency) {
        case ECurrency.VND:
          return `${fCurrencyVND(schedule.totalAmount)}`;
        case ECurrency.USD:
          return `$${schedule.totalAmountUSD}`;
      }
    },
    [user?.currency]
  );
  const formatDay = (day: number) => {
    if (day > 3 && day < 21) return day + "th";
    switch (day % 10) {
      case 1:
        return day + "st";
      case 2:
        return day + "nd";
      case 3:
        return day + "rd";
      default:
        return day + "th";
    }
  };
  const onConfirmMakeAnOrder = () => {
    seOnSubmitMakeAnOrder(false);
  };
  const submitMakeAnOrder = () => {
    if (!selectedDate) return;
    dispatch(setLoading(true));
    ScheduleService.makeAnOrder({
      projectId: projectId,
      month: selectedDate.month,
      year: selectedDate.year,
    })
      .then(() => {
        seOnSubmitMakeAnOrder(false)
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

  useEffect(() => {
    let days = [];
    var today = new Date();
    for (var i = 0; i < 6; i++) {
      days[i] = {
        id: i,
        month: today.getMonth() + 2 + i,
        year: today.getFullYear(),
        day: 1,
        date: `${today.getFullYear()}-${today.getMonth() + 2 + i}-${1}`,
        active: i === 0 ? true : false,
      };
      if (i === 0) {
        setSelectedDate(days[i]);
        setDate(days[i]);
        setDuaDate(formatDateToString(days[i]));
      }
    }
    setDate([...days]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const getSchedulePreview = async () => {
      dispatch(setLoading(true));
      const params: GetSchedulePreview = {
        projectId: project?.id ? project.id : projectId,
        month: selectedDate.month,
        year: selectedDate.year,
      };
      ScheduleService.getSchedulePreview(params)
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
              {date?.map((item, index) => (
                <Box
                  mr={2}
                  key={index}
                  className={
                    item.active ? classes.itemDateActive : classes.itemDate
                  }
                  onClick={() => {
                    onClickDate(item);
                  }}
                >
                  <span className={classes.iconActive}>
                    <DoneIcon />
                  </span>
                  <Heading5 className={classes.titleMonth} pb={2}>
                    {formatNameMonth(item).toUpperCase()}
                  </Heading5>
                  <ParagraphBody>{item.year}</ParagraphBody>
                </Box>
              ))}
            </Grid>
          </Grid>
          {duaDate && (
            <Grid pb={4} className={classes.noteSelectDate}>
              <ParagraphBody $colorName={"--eerie-black"}>
                {" "}
                <span className={classes.bold}>Note:</span> For the project to
                start, you would need to make the first payment by{" "}
                <span className={classes.bold}> {duaDate} </span>. Subsequent
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
                // {moment(item.updatedAt).format("DD-MM-yyyy")}
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
                                  {formatDay(schedulePreview.order)} payment
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
        duaDate={duaDate}
        selectedDate={selectedDate}
        onCancel={onConfirmMakeAnOrder}
        onSubmit={() => submitMakeAnOrder()}
      />
      <Footer />
    </>
  );
});
export default SelectDate;
