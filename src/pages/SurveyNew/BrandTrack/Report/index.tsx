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
import ReportDelivered from "./components/ReportDelivered";
import ProjectHelper from "helpers/project"
import { ProjectResultService } from "services/project_result";
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
  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)
  const [timelineSelected, setTimelineSelected] = useState<ITimeLineItem>(null);
  const [isOpenDashboard, setIsOpenDashboard] = useState(false);

  useEffect(() => {
    const startPaymentScheduleMoment = moment(project.startPaymentSchedule).startOf('month')
    const monthsToAdd = moment().diff(startPaymentScheduleMoment, 'months') + 1

    let rawTimeLineList = _.map(new Array(monthsToAdd), ((item, index) => ({
      date: startPaymentScheduleMoment.clone().add(index, 'month'),
    })))

    const rawLengthTimeLine = rawTimeLineList.length

    if (rawLengthTimeLine < NUMBER_OF_LIST_MONTHS) {
      const notStartedMonth = NUMBER_OF_LIST_MONTHS - rawLengthTimeLine
      _.forEach(Array(notStartedMonth), ((item, index) => {
        rawTimeLineList.push({
          date: startPaymentScheduleMoment.clone().add(rawLengthTimeLine + index, 'month')
        })
      }))
    }
    else {
      rawTimeLineList.push({
        date: rawTimeLineList[rawTimeLineList.length - 1].date.clone().add(1, 'month')
      })
    }

    ProjectResultService.getProjectResult({
      projectId: project.id,
    })
      .then((res: IResult[]) => {
        if (res?.length) {
          rawTimeLineList = rawTimeLineList.map((item) => {
            const result = res.find((it: IResult) => moment(item.date).isSame(moment(it?.month), "month")) || null
            let state: ETimelineType

            if (result?.isReady && (result?.report || result?.dataStudio)) {
              state = ETimelineType.DELIVERED
            }
            else if (item?.date && moment().isSame(item.date, "month")) {
              state = ETimelineType.IN_PROGRESS
            }
            else {
              state = ETimelineType.NOT_STARTED_YET
            }

            return {
              ...item,
              result,
              state
            }
          })

          setListTimeline(rawTimeLineList)
        }
      })
      .catch((error) => dispatch(setErrorMess(error)))
      .finally(() => dispatch(setLoading(false)));
      
  }, [dispatch]);

  const checkReadyResult = (result: IResult) => {
    return result?.isReady && (result?.dataStudio || result?.report)
  }

  useEffect(() => {
    if (listTimeline.length) {
      setMaxPage(Math.ceil(listTimeline.length / NUMBER_OF_LIST_MONTHS))
      
      const latestReadyResult = [...listTimeline].reverse().find((item) => checkReadyResult(item?.result))
      const latestReadyResultIndex = [...listTimeline].reverse().findIndex((item) => checkReadyResult(item?.result))

      if (latestReadyResult) {
        setTimelineSelected(latestReadyResult)
        setPage(Math.floor((listTimeline.length - latestReadyResultIndex - 1) / NUMBER_OF_LIST_MONTHS) + 1)
      }
      else {
        setPage(Math.ceil(listTimeline.length / NUMBER_OF_LIST_MONTHS))
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

  // const getTimeLine = (date: Moment) => {
  //   const currentDate = moment();
  //   const reportOfTimeline = project?.reports.filter((itemReport) => moment(date).isSame(itemReport?.updatedAt, "month"));
  //   if (!!reportOfTimeline.length) {
  //     return {
  //       date: date,
  //       state: ETimelineType.DELIVERED,
  //       report: { attachment: reportOfTimeline[0] },
  //     };
  //   } else {
  //     return {
  //       date: date,
  //       state: moment(date).isSame(currentDate, "month") ? ETimelineType.IN_PROGRESS : ETimelineType.NOT_STARTED_YET,
  //       report: null,
  //     };
  //   }
  // };

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
                  isFirstWave={!index && moment(listTimelineRender?.[index]?.date).isSame(startPaymentScheduleDate, "month")}
                  isLastWave={Boolean(index === listTimelineRender.length - 1 && item.state === ETimelineType.DELIVERED)}
                  onSelect={() => {
                    handleChangeSelectedItem(item);
                  }}
                />
              ))}
            {project?.status === ProjectStatus.COMPLETED ? (
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
            (!timelineSelected || timelineSelected?.state === ETimelineType.NOT_STARTED_YET) && <ReportNotStarted />
          }
          {
            timelineSelected?.state === ETimelineType.IN_PROGRESS && <ReportInProgress />
          }
          {
            timelineSelected?.state === ETimelineType.DELIVERED && (
              <ReportDelivered isHasReport={Boolean(timelineSelected?.result)} onOpenDashboard={onOpenDashboard} onDownLoad={onDownLoad} />
            )
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
