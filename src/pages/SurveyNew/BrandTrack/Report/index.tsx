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

export enum ETimelineType {
  NOT_STARTED_YET = 1,
  IN_PROGRESS,
  DELIVERED,
}

export interface IReport {
  attachment: Attachment;
  dataStudio: string;
  date: Date;
}

export interface ITimeLineItem {
  date: Moment;
  state: ETimelineType;
  report: IReport;
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
  const [timelineSelected, setTimelineSelected] = useState<ITimeLineItem>(null);
  const [isOpenDashboard, setIsOpenDashboard] = useState(false);
  useEffect(() => {
    const currentDate = moment();
    const startPaymentScheduleDate = moment(project?.startPaymentSchedule);
    let _listTimeline = [];
    if (currentDate > startPaymentScheduleDate) {
      for (let i = 0; i <= 3; i++) {
        _listTimeline.push({
          date: moment(startPaymentScheduleDate).add(i, "month").startOf("month"),
          state: ETimelineType.NOT_STARTED_YET,
          report: null,
        });
      }
      setListTimeline(_listTimeline);
    } else {
      // const _currentDate = moment([currentDate.year(), currentDate.month()]);
      // const _startPaymentScheduleDate = moment([startPaymentScheduleDate.year(), startPaymentScheduleDate.month()]);
      // const monthDiff = Math.ceil(_currentDate.diff(_startPaymentScheduleDate, "months", true));

      // if (monthDiff <= 2) {
      //   for (let i = monthDiff; i >= 0; i--) {
      //     _listTimeline.push(getTimeLine(moment(currentDate).subtract(i, "month").startOf("month")));
      //   }
      //   for (let i = 1; _listTimeline.length <= 3; i++) {
      //     _listTimeline.push({
      //       date: moment(currentDate).add(i, "month").startOf("month"),
      //       state: ETimelineType.NOT_STARTED_YET,
      //       report: null,
      //     });
      //   }
      // } else {
      //   for (let i = 2; i >= 0; i--) {
      //     _listTimeline.push(getTimeLine(moment(currentDate).subtract(i, "month").startOf("month")));
      //   }
      //   _listTimeline.push({
      //     date: moment(currentDate).add(1, "month").startOf("month"),
      //     state: ETimelineType.NOT_STARTED_YET,
      //     report: null,
      //   });
      // }

      // Fake data
      for (let i = 0; i <= 3; i++) {
        _listTimeline.push({
          date: moment(startPaymentScheduleDate).add(i, "month").startOf("month"),
          state: i < 3 ? ETimelineType.DELIVERED : i === 3 ? ETimelineType.IN_PROGRESS : ETimelineType.NOT_STARTED_YET,
          // state: ETimelineType.DELIVERED,
          report: null,
        });
      }

      setListTimeline(_listTimeline);
    }
  }, [dispatch, project]);

  useEffect(() => {
    setTimelineSelected(listTimeline?.filter((item) => moment().isSame(item?.date, "month"))[0] || null);
  }, [listTimeline]);

  const onDownLoad = () => {
    dispatch(setLoading(true));
    AttachmentService.download(timelineSelected?.report?.attachment.id)
      .then((res) => {
        FileSaver.saveAs(res.data, timelineSelected?.report?.attachment.fileName);
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

  const onOpenDashboard = () => {
    setIsOpenDashboard(true);
  };

  const onCloseDashboard = () => {
    setIsOpenDashboard(false);
  };

  return (
    <Grid className={classes.root}>
      {project?.status === ProjectStatus.IN_PROGRESS || project?.status === ProjectStatus.COMPLETED ? (
        <Grid className={classes.content}>
          <Grid className={classes.timelineWrapper}>
            {moment(listTimeline?.[0]?.date).isSame(startPaymentScheduleDate, "month") ? (
              <Box
                className={clsx(classes.headPoint, {
                  [classes.deliveredHeadPoint]: listTimeline?.[0]?.state === ETimelineType.DELIVERED,
                  [classes.inProgressHeadPoint]: listTimeline?.[0]?.state === ETimelineType.IN_PROGRESS,
                })}
              ></Box>
            ) : (
              <Box className={classes.leftMidPoint}>
                <Box
                  className={clsx({
                    [classes.deliveredPoint]: listTimeline?.[0]?.state === ETimelineType.DELIVERED,
                    [classes.inProgressPoint]: listTimeline?.[0]?.state === ETimelineType.IN_PROGRESS,
                  })}
                >
                  <Dot />
                  <Dot $height={"8px"} $width={"8px"} />
                  <Dot $height={"12px"} $width={"12px"} />
                </Box>
              </Box>
            )}
            {!!listTimeline?.length &&
              listTimeline.map((item, index) => (
                <TimeLineItem
                  key={index}
                  timeLineItem={item}
                  isFirstWave={!index && moment(listTimeline?.[index]?.date).isSame(startPaymentScheduleDate, "month")}
                  isLastWave={Boolean(index === listTimeline.length - 1 && item.state === ETimelineType.DELIVERED)}
                  onSelect={() => {
                    setTimelineSelected(item);
                  }}
                />
              ))}
            {project?.status === ProjectStatus.COMPLETED ? (
              <Box
                className={clsx(classes.headPoint, {
                  [classes.deliveredHeadPoint]: listTimeline?.[listTimeline?.length - 1]?.state === ETimelineType.DELIVERED,
                })}
              ></Box>
            ) : (
              <Box className={classes.rightMidPoint}>
                <Box
                  className={clsx({
                    [classes.deliveredPoint]: listTimeline?.[listTimeline?.length - 1]?.state === ETimelineType.DELIVERED,
                    [classes.inProgressPoint]: listTimeline?.[listTimeline?.length - 1]?.state === ETimelineType.IN_PROGRESS,
                  })}
                >
                  <Dot $height={"12px"} $width={"12px"} />
                  <Dot $height={"8px"} $width={"8px"} />
                  <Dot />
                </Box>
              </Box>
            )}
          </Grid>
          {(!timelineSelected || timelineSelected?.state === ETimelineType.NOT_STARTED_YET) && <ReportNotStarted />}
          {timelineSelected?.state === ETimelineType.IN_PROGRESS && <ReportInProgress />}
          {timelineSelected?.state === ETimelineType.DELIVERED && (
            <ReportDelivered isHasReport={Boolean(timelineSelected?.report)} onOpenDashboard={onOpenDashboard} onDownLoad={onDownLoad} />
          )}
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
      <Dashboard isOpen={isOpenDashboard} onClose={onCloseDashboard} report={timelineSelected?.report} />
    </Grid>
  );
});

export default Report;
