import { Box, Grid } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import Images from "config/images";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { ProjectStatus } from "models/project";
import { AttachmentService } from "services/attachment";
import FileSaver from "file-saver";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import Heading1 from "components/common/text/Heading1";
import Heading4 from "components/common/text/Heading4";
import { useTranslation } from "react-i18next";
import clsx from "clsx";
import TimeLineItem from "./components/TimeLineItem";
import moment, { Moment } from "moment";
import Dashboard from "./components/Dashboard";
import { Attachment } from "models/attachment";
import { Dot } from "components/common/dot/Dot";
import ReportNotStarted from "./components/ReportNotStarted";
import ReportInProgress from "./components/ReportInProgress";
import ReportStillProgress from "./components/ReportStillProgress";
import ReportDelivered from "./components/ReportDelivered";
import ProjectHelper from "helpers/project"
import { ProjectResultService } from "services/project_result";
import { PaymentScheduleService } from "services/payment_schedule";
import _ from "lodash";

export enum ETimelineType {
  NOT_STARTED_YET = 1,
  IN_PROGRESS,
  DELIVERED,
}

const NUMBER_OF_LIST_MONTHS = 4

export interface IResult {
  report: Attachment;
  dataStudio: string;
  month: Date;
  isReady: boolean;
}

export interface ITimeLineItem {
  date: Moment;
  state?: ETimelineType;
  result?: IResult;
  id?: number
}

interface Props {
  projectId: number;
}

const Report = memo(({ projectId }: Props) => {
  const dispatch = useDispatch();

  const { t, i18n } = useTranslation();

  const { project } = useSelector((state: ReducerType) => state.project);

  const startPaymentScheduleDate = useMemo(() => moment(project?.startPaymentSchedule), [project]);

  const [listTimeline, setListTimeline] = useState<ITimeLineItem[]>([]);
  const [listTimelineRender, setListTimelineRender] = useState<ITimeLineItem[]>([]);
  const [page, setPage] = useState(0)
  const [maxPage, setMaxPage] = useState(0)
  const [timelineSelected, setTimelineSelected] = useState<ITimeLineItem>(null);
  const [isOpenDashboard, setIsOpenDashboard] = useState(false);

  useEffect(() => {
    if (ProjectHelper.checkProjectStatus(project, [ProjectStatus.AWAIT_PAYMENT, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED], true)) {
      dispatch(setLoading(true))
      const startPaymentScheduleMoment = moment(project.startPaymentSchedule).startOf('month')
      const monthsToAdd = moment().diff(startPaymentScheduleMoment, 'months') + 1
      let rawTimeLineList = []

      if (monthsToAdd > 0) {
        rawTimeLineList = _.map(new Array(monthsToAdd), ((item, index) => ({
          date: startPaymentScheduleMoment.clone().add(index, 'month'),
        })))
      }

      const rawLengthTimeLine = rawTimeLineList.length

      if (rawLengthTimeLine < NUMBER_OF_LIST_MONTHS) {
        const notStartedMonth = NUMBER_OF_LIST_MONTHS - rawLengthTimeLine
        _.forEach(Array(notStartedMonth), ((item, index) => {
          rawTimeLineList.push({
            date: startPaymentScheduleMoment.clone().add(rawLengthTimeLine + index, 'month')
          })
        }))
      }
      else if (!ProjectHelper.isCancelProject(project)) {
        rawTimeLineList.push({
          date: rawTimeLineList[rawTimeLineList.length - 1].date.clone().add(1, 'month')
        })
      }

      const handleGetResult = async () => {
        await ProjectResultService.getProjectResult({
          projectId: project.id,
        })
          .then(async (res: IResult[]) => {
            const latestPaidPaymentSchedule = await PaymentScheduleService.getLatestPaidPaymentSchedule(project.id)
              .then((latestResult) => {
                if (ProjectHelper.isCancelProject(project) && latestResult?.data) {
                  const lastMonth = moment(latestResult.data.end)
                  if (lastMonth.isSameOrAfter(moment(), "month")) {
                    const currentLastMonth = rawTimeLineList[rawTimeLineList.length - 1]?.date
                    const monthsToAddToLastMonth = lastMonth.diff(currentLastMonth.clone(), 'months')
                    if (monthsToAddToLastMonth > 0) {
                      _.forEach(Array(monthsToAddToLastMonth), (item, index) => {
                        rawTimeLineList.push({
                          date: rawTimeLineList[rawTimeLineList.length - 1].date.clone().add(1, 'month')
                        })
                      })
                    }
                  }
                  else {
                    const latestRunningMonth = rawTimeLineList.findIndex((item) => moment(item.date).isSame(moment(), "month"))
                    if (latestRunningMonth > 0) {
                      const numberOfNotRunMonth = rawTimeLineList.length - latestRunningMonth - 1
                      if (numberOfNotRunMonth > 0) {
                        rawTimeLineList = rawTimeLineList.slice(0, numberOfNotRunMonth * -1);
                      }
                    }
                  }
                }

                return latestResult?.data
              })
              .catch((error) => dispatch(setErrorMess(error)))

            rawTimeLineList = rawTimeLineList.map((item, index) => {
              const result = res?.find((it: IResult) => moment(item.date).isSame(moment(it?.month), "month")) || null
              let state: ETimelineType

              if (item?.date && moment().isSame(item.date, "month")) {
                if (ProjectHelper.isCancelProject(project)) {
                  if (!latestPaidPaymentSchedule?.end || moment().isAfter(moment(latestPaidPaymentSchedule?.end), "month")) {
                    state = ETimelineType.NOT_STARTED_YET
                  }
                  else if (moment().isSameOrBefore(moment(latestPaidPaymentSchedule?.end), "month")) {
                    if (result?.isReady && (result?.report || result?.dataStudio)) {
                      state = ETimelineType.DELIVERED
                    }
                    else {
                      state = ETimelineType.IN_PROGRESS
                    }
                  }
                }
                else {
                  state = ETimelineType.IN_PROGRESS
                }
              }
              else if (item?.date && moment(item.date).isAfter(moment())) {
                state = ETimelineType.NOT_STARTED_YET
              }
              else if (result?.isReady && (result?.report || result?.dataStudio)) {
                state = ETimelineType.DELIVERED
              }
              else {
                state = ETimelineType.NOT_STARTED_YET
              }

              return {
                ...item,
                id: index,
                result,
                state
              }
            })
            setListTimeline(rawTimeLineList)
          })
          .catch((error) => dispatch(setErrorMess(error)))
          .finally(() => dispatch(setLoading(false)));
      }

      handleGetResult()
    }
  }, [dispatch]);

  const getDateFormatted = (date: Date | moment.Moment, isDate?: boolean) => {
    moment.locale(i18n.language)
    if (isDate) return moment(date).format("DD MMMM, YYYY")
    return moment(date).format("MMMM YYYY")
  }

  const checkReadyResult = (result: IResult) => {
    return result?.isReady && (result?.dataStudio || result?.report)
  }

  useEffect(() => {
    if (listTimeline.length) {
      const rawMaxPage = Math.ceil(listTimeline.length / NUMBER_OF_LIST_MONTHS)
      setMaxPage(rawMaxPage)

      const latestReadyResult = [...listTimeline].reverse().find((item) => checkReadyResult(item?.result) && moment(item.date).isSameOrBefore(moment()))
      const latestReadyResultIndex = [...listTimeline].lastIndexOf([...listTimeline].reverse().find((item) => checkReadyResult(item?.result)))

      const getPageFromIndex = (index: number) => {
        return rawMaxPage + 1 - Math.ceil((listTimeline.length - index) / NUMBER_OF_LIST_MONTHS)
      }

      if (latestReadyResult) {
        setTimelineSelected(latestReadyResult)
        setPage(getPageFromIndex(latestReadyResultIndex))
      }
      else {
        const currentMonth = listTimeline.findIndex((item) => item.state === ETimelineType.IN_PROGRESS)
        setPage(getPageFromIndex(currentMonth >= 0 ? currentMonth : 0))
      }
    }
  }, [listTimeline]);

  useEffect(() => {
    let startIndex = listTimeline.length - (NUMBER_OF_LIST_MONTHS * (maxPage - page + 1));
    if (startIndex < 0) startIndex = 0
    const endIndex = startIndex + NUMBER_OF_LIST_MONTHS
    setListTimelineRender([...listTimeline].slice(startIndex, endIndex));
  }, [page])

  const goToPreviousPage = () => {
    if (page <= 1) return;
    setPage(page - 1)
  }

  const goToNextPage = () => {
    if (page >= maxPage) return;
    setPage(page + 1)
  }

  const onDownLoad = () => {
    if (!timelineSelected?.result?.report) return;
    dispatch(setLoading(true));
    AttachmentService.download(timelineSelected?.result?.report.id)
      .then((res) => {
        FileSaver.saveAs(res.data, timelineSelected?.result?.report.fileName);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  const handleChangeSelectedItem = (item: ITimeLineItem) => {
    setTimelineSelected(item)
  }

  const onOpenDashboard = () => {
    setIsOpenDashboard(true);
  };

  const onCloseDashboard = () => {
    setIsOpenDashboard(false);
  };

  return (
    <Grid className={classes.root}>
      {ProjectHelper.checkProjectStatus(project, [ProjectStatus.AWAIT_PAYMENT, ProjectStatus.IN_PROGRESS, ProjectStatus.COMPLETED], true) ? (
        <Grid className={classes.content}>
          <Grid className={classes.timelineWrapper}>
            {moment(listTimelineRender?.[0]?.date).isSame(startPaymentScheduleDate, "month") ? (
              <Box
                className={clsx(classes.headPoint, {
                  [classes.deliveredHeadPoint]: listTimelineRender?.[0]?.state === ETimelineType.DELIVERED,
                  [classes.inProgressHeadPoint]: listTimelineRender?.[0]?.state === ETimelineType.IN_PROGRESS,
                })}
              ></Box>
            ) : (
              <Box className={classes.leftMidPoint} onClick={goToPreviousPage}>
                <Box
                  className={clsx({
                    [classes.deliveredPoint]: listTimelineRender?.[0]?.state === ETimelineType.DELIVERED,
                    [classes.inProgressPoint]: listTimelineRender?.[0]?.state === ETimelineType.IN_PROGRESS,
                  })}
                >
                  <Dot />
                  <Dot $height={"8px"} $width={"8px"} />
                  <Dot $height={"12px"} $width={"12px"} />
                </Box>
              </Box>
            )}
            {!!listTimelineRender?.length &&
              listTimelineRender.map((item, index) => (
                <TimeLineItem
                  key={index}
                  timeLineItem={item}
                  isFirstWave={!index && moment(item?.date).isSame(startPaymentScheduleDate, "month")}
                  isLastWave={ProjectHelper.isCancelProject(project) && item?.id === listTimeline?.[listTimeline?.length - 1]?.id}
                  onSelect={() => {
                    handleChangeSelectedItem(item);
                  }}
                />
              ))}
            {ProjectHelper.isCancelProject(project) && listTimelineRender?.[listTimelineRender?.length - 1]?.id === listTimeline?.[listTimeline?.length - 1]?.id ? (
              <Box
                className={clsx(classes.headPoint, {
                  [classes.deliveredHeadPoint]: listTimelineRender?.[listTimelineRender?.length - 1]?.state === ETimelineType.DELIVERED,
                })}
              ></Box>
            ) : (
              <Box className={classes.rightMidPoint} onClick={goToNextPage}>
                <Box
                  className={clsx({
                    [classes.deliveredPoint]: listTimelineRender?.[listTimelineRender?.length - 1]?.state === ETimelineType.DELIVERED,
                    [classes.inProgressPoint]: listTimelineRender?.[listTimelineRender?.length - 1]?.state === ETimelineType.IN_PROGRESS,
                  })}
                >
                  <Dot $height={"12px"} $width={"12px"} />
                  <Dot $height={"8px"} $width={"8px"} />
                  <Dot />
                </Box>
              </Box>
            )}
          </Grid>
          {
            (moment().isBefore(moment(startPaymentScheduleDate))) && <ReportNotStarted dueDate={getDateFormatted(startPaymentScheduleDate)} />
          }
          {
            (listTimeline?.[0]?.state === ETimelineType.IN_PROGRESS) && <ReportInProgress dueDate={getDateFormatted(moment(startPaymentScheduleDate).endOf("month"), true)} />
          }
          {
            timelineSelected?.state === ETimelineType.DELIVERED && (
              <ReportDelivered result={timelineSelected?.result} onOpenDashboard={onOpenDashboard} onDownLoad={onDownLoad} date={getDateFormatted(timelineSelected.date)} />
            )
          }
          {
            !timelineSelected && moment().isAfter(moment(startPaymentScheduleDate), "month") && <ReportStillProgress />
          }
        </Grid>
      ) : (
        <Grid className={classes.noSetup}>
          <img src={Images.imgNoResultNotPay} alt="" />
          <Heading1 align="center" mb={2} $colorName="--gray-80" translation-key="report_coming_soon">
            {t("report_coming_soon")}
          </Heading1>
          <Heading4
            align="center"
            sx={{ fontWeight: "400 !important" }}
            $colorName="--gray-80"
            translation-key="brand_track_results_tab_result_no_result_description"
          >
            {t("brand_track_results_tab_result_no_result_description")}
          </Heading4>
        </Grid>
      )}
      <Dashboard isOpen={isOpenDashboard} onClose={onCloseDashboard} result={timelineSelected?.result} />
    </Grid>
  );
});

export default Report;
