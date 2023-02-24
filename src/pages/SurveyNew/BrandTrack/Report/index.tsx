import { Box, Grid } from "@mui/material";
import { memo, useEffect, useMemo, useState } from "react";
import classes from "./styles.module.scss";
import Images from "config/images";
import { useDispatch, useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { ProjectStatus } from "models/project";
import { DashboardOutlined } from "@mui/icons-material";
import { AttachmentService } from "services/attachment";
import FileSaver from "file-saver";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import Button, { BtnType } from "components/common/buttons/Button";
import ProjectHelper from "helpers/project";
import Heading1 from "components/common/text/Heading1";
import Heading2 from "components/common/text/Heading2";
import Heading4 from "components/common/text/Heading4";
import Heading3 from "components/common/text/Heading3";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/common/text/ParagraphBody";
import clsx from "clsx";
import images from "config/images";
import TimeLineItem from "./components/TimeLineItem";
import moment, { Moment } from "moment";
import { IconDownload } from "components/icons";
import Dashboard from "./components/Dashboard";
import { Attachment } from "models/attachment";
import { Dot } from "components/common/dot/Dot";

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

  const isPaymentPaid = useMemo(() => ProjectHelper.isPaymentPaid(project), [project]);

  const isReportReady = useMemo(() => ProjectHelper.isReportReady(project), [project]);

  const reportReadyDate = useMemo(() => {
    return ProjectHelper.getReportReadyDate(project, i18n.language).format("DD MMMM, YYYY");
  }, [i18n.language, project]);

  const [listTimeline, setListTimeline] = useState<ITimeLineItem[]>([]);
  const [timelineSelected, setTimelineSelected] = useState<ITimeLineItem>(null);
  const [isOpenDashboard, setIsOpenDashboard] = useState(false);

  useEffect(() => {
    const currentDate = moment();
    const startPaymentScheduleDate = moment(project?.startPaymentSchedule);
    let _listTimeline = [];

    if (currentDate < startPaymentScheduleDate) {
      for (let i = 0; i <= 3; i++) {
        _listTimeline.push({
          date: moment(startPaymentScheduleDate).add(i, "month").startOf('month'),
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
      //     _listTimeline.push(getTimeLine(moment(currentDate).subtract(i, "month").startOf('month')));
      //   }
      //   for (let i = 1; _listTimeline.length <= 3; i++) {
      //     _listTimeline.push({
      //       date: moment(currentDate).add(i, "month").startOf('month'),
      //       state: ETimelineType.NOT_STARTED_YET,
      //       report: null,
      //     });
      //   }
      // } else {
      //   for (let i = 2; i >= 0; i--) {
      //     _listTimeline.push(getTimeLine(moment(currentDate).subtract(i, "month").startOf('month')));
      //   }
      //   _listTimeline.push({
      //     date: moment(currentDate).add(1, "month").startOf('month'),
      //     state: ETimelineType.NOT_STARTED_YET,
      //     report: null,
      //   });
      // }

      // Fake data
      for (let i = 0; i <= 3; i++) {
        _listTimeline.push({
          date: moment(startPaymentScheduleDate).add(i, "month").startOf('month'),
          state: i === 0 ?  ETimelineType.DELIVERED : i === 1 ? ETimelineType.IN_PROGRESS : ETimelineType.NOT_STARTED_YET,
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
  //       report: reportOfTimeline[0],
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
      {isReportReady ? (
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
                  <Dot/>
                  <Dot $height={"8px"} $width={"8px"}/>
                  <Dot $height={"12px"} $width={"12px"}/>
                </Box>
              </Box>
            )}
            {listTimeline?.map((item, index) => (
              <TimeLineItem
                key={index}
                timeLineItem={item}
                isFirstWave={!index && moment(listTimeline?.[index]?.date).isSame(startPaymentScheduleDate, "month")}
                isLastWave={false}
                onSelect={() => {
                  setTimelineSelected(item);
                }}
              />
            ))}
            {project?.status === ProjectStatus.COMPLETED ? (
              <Box
                className={clsx(classes.headPoint, {
                  [classes.deliveredHeadPoint]: listTimeline?.[listTimeline?.length - 1]?.state === ETimelineType.DELIVERED,
                  [classes.inProgressHeadPoint]: listTimeline?.[listTimeline?.length - 1]?.state === ETimelineType.IN_PROGRESS,
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
                  <Dot $height={"12px"} $width={"12px"}/>
                  <Dot $height={"8px"} $width={"8px"}/>
                  <Dot/>
                </Box>
              </Box>
            )}
          </Grid>
          {(!timelineSelected || timelineSelected?.state === ETimelineType.NOT_STARTED_YET) && (
            <Grid className={classes.descriptionWrapper}>
              <Box className={classes.imageDescription}>
                <img src={images.imgProjectScheduled} alt="" />
              </Box>
              <Box className={classes.description}>
                <Heading2 mb={1}>Project scheduled</Heading2>
                <ParagraphBody $colorName="--eerie-black" mb={4} className={classes.descriptionSubTitle}>
                  Your project has been scheduled, the fieldwork will begin in early <span>December 2022.</span>
                </ParagraphBody>
                <Button
                  btnType={BtnType.Primary}
                  disabled
                  children={
                    <Heading4 $colorName="--gray-80" $fontWeight={500} translation-key="">
                      Results not ready
                    </Heading4>
                  }
                  startIcon={<DashboardOutlined sx={{ fontSize: "22px !important" }} />}
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                />
              </Box>
            </Grid>
          )}
          {timelineSelected?.state === ETimelineType.IN_PROGRESS && (
            <Grid className={classes.descriptionWrapper}>
              <Box className={classes.imageDescription}>
                <img src={images.imgFieldworkInProgress} alt="" />
              </Box>
              <Box className={classes.description}>
                <Heading2 mb={1}>Fieldwork in progress</Heading2>
                <ParagraphBody $colorName="--eerie-black">Fieldwork of the first month of your project is in progress</ParagraphBody>
                <ParagraphBody $colorName="--eerie-black" mb={4} className={classes.descriptionSubTitle}>
                  The results will be delivered by <span>December 30, 2022.</span>
                </ParagraphBody>
                <Button
                  btnType={BtnType.Primary}
                  disabled
                  children={
                    <Heading4 $colorName="--gray-80" $fontWeight={500} translation-key="">
                      Results not ready
                    </Heading4>
                  }
                  sx={{ width: { xs: "100%", sm: "auto" } }}
                />
              </Box>
            </Grid>
          )}
          {timelineSelected?.state === ETimelineType.DELIVERED && (
            <Grid className={classes.descriptionWrapper}>
              <Box className={classes.imageDescription}>
                <img src={images.imgDashboardReady} alt="" />
              </Box>
              <Box className={classes.description}>
                <Heading2 mb={1}>Dashboard ready!</Heading2>
                <ParagraphBody $colorName="--eerie-black" mb={4}>
                  Access your results dashboard anywhere, intuitively and interactively.
                </ParagraphBody>
                <Box className={classes.actionWrapper}>
                  <Button
                    btnType={BtnType.Primary}
                    children={
                      <Heading4 $colorName="--white" $fontWeight={500} translation-key="">
                        Access dashboard
                      </Heading4>
                    }
                    startIcon={<DashboardOutlined sx={{ fontSize: "22.5px !important" }} />}
                    sx={{ width: { xs: "100%", sm: "auto" } }}
                    onClick={onOpenDashboard}
                  />
                  {timelineSelected?.report && (
                    <Button
                      btnType={BtnType.Outlined}
                      children={
                        <Heading4 $colorName="--cimigo-blue" $fontWeight={500} translation-key="">
                          Download results
                        </Heading4>
                      }
                      startIcon={<IconDownload sx={{ fontSize: "16.5px !important" }} />}
                      sx={{ width: { xs: "100%", sm: "auto" } }}
                      onClick={onDownLoad}
                    />
                  )}
                </Box>
              </Box>
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid className={classes.noSetup}>
          {isPaymentPaid ? <img src={Images.imgNoResultPaid} alt="" /> : <img src={Images.imgNoResultNotPay} alt="" />}
          <Heading1 align="center" mb={2} $colorName="--gray-80" translation-key="report_coming_soon">
            {t("report_coming_soon")}
          </Heading1>
          {isPaymentPaid ? (
            <Heading4
              align="center"
              sx={{ fontWeight: "400 !important" }}
              $colorName="--gray-80"
              translation-key="report_coming_soon_des_paid"
            >
              {t("report_coming_soon_des_paid")}{" "}
              <Heading3 align="center" variant="body2" variantMapping={{ body2: "span" }} $colorName="--cimigo-blue">
                {reportReadyDate}.
              </Heading3>
            </Heading4>
          ) : (
            <Heading4 align="center" sx={{ fontWeight: "400 !important" }} $colorName="--gray-80" translation-key="">
              You have not completed your project setup and payment. Please finish these first.
            </Heading4>
          )}
        </Grid>
      )}

      <Dashboard isOpen={isOpenDashboard} onClose={onCloseDashboard} report={timelineSelected?.report} />
    </Grid>
  );
});

export default Report;
