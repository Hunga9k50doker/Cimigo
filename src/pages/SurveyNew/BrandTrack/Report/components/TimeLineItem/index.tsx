import { Box } from "@mui/system";
import { memo } from "react";
import classes from "./styles.module.scss";
import { Done } from "@mui/icons-material";
import clsx from "clsx";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import moment from "moment";
import ParagraphBody from "components/common/text/ParagraphBody";
import { ETimelineType } from "../..";

interface Props {
  timeLineItem: any;
  onSelect?: () => void;
}

const TimeLineItem = memo(({ timeLineItem, onSelect }: Props) => {
  return (
    <Box className={classes.root}>
      {timeLineItem.state === ETimelineType.DELIVERED ? (
        <>
          <ParagraphBody $colorName="--cimigo-blue" $fontWeight={600}>
            Delivered
          </ParagraphBody>
          <Box className={classes.lineWrapper}>
            <Box className={clsx(classes.line, classes.deliveredLine)}></Box>
            <Box className={clsx(classes.circle, classes.circleDelivered)} onClick={onSelect}>
              <Done sx={{ fontSize: "14px", color: "var(--white)" }} />
            </Box>
            <Box className={clsx(classes.line, classes.deliveredLine)}></Box>
          </Box>
          <ParagraphBody $colorName="--cimigo-blue" $fontWeight={600}>
            {moment(timeLineItem.date).format("MMM").toUpperCase()}
          </ParagraphBody>
          <ParagraphExtraSmall $colorName="--cimigo-blue" $fontWeight={600}>
            {moment(timeLineItem.date).year()}
          </ParagraphExtraSmall>
          {timeLineItem?.isFirstWave && (
            <ParagraphExtraSmall $colorName="--cimigo-blue" $fontWeight={600}>
              (First wave)
            </ParagraphExtraSmall>
          )}
          {timeLineItem?.isLastWave && (
            <ParagraphExtraSmall $colorName="--cimigo-blue" $fontWeight={600}>
              (Last wave)
            </ParagraphExtraSmall>
          )}
        </>
      ) : timeLineItem.state === ETimelineType.IN_PROGRESS ? (
        <>
          <ParagraphBody $colorName="--warning-dark" $fontWeight={600}>
            In progress
          </ParagraphBody>
          <Box className={classes.lineWrapper}>
            <Box className={clsx(classes.line, classes.inProgressLine)}></Box>
            <Box className={classes.circleInProgress} onClick={onSelect}>
              <Box className={classes.circle}></Box>
            </Box>
            <Box className={clsx(classes.line, classes.inProgressLine)}></Box>
          </Box>
          <ParagraphBody $colorName="--warning-dark" $fontWeight={600}>
            {moment(timeLineItem.date).format("MMM").toUpperCase()}
          </ParagraphBody>
          <ParagraphExtraSmall $colorName="--warning-dark" $fontWeight={600}>
            {moment(timeLineItem.date).year()}
          </ParagraphExtraSmall>
          {timeLineItem?.isFirstWave && (
            <ParagraphExtraSmall $colorName="--warning-dark" $fontWeight={600}>
              (First wave)
            </ParagraphExtraSmall>
          )}
          {timeLineItem?.isLastWave && (
            <ParagraphExtraSmall $colorName="--warning-dark" $fontWeight={600}>
              (Last wave)
            </ParagraphExtraSmall>
          )}
        </>
      ) : (
        <>
          <Box sx={{ height: "24px" }}></Box>
          <Box className={classes.lineWrapper}>
            <Box className={classes.line}></Box>
            <Box className={classes.circle}></Box>
            <Box className={classes.line}></Box>
          </Box>
          <ParagraphBody $colorName="--gray-40" $fontWeight={600}>
            {moment(timeLineItem.date).format("MMM").toUpperCase()}
          </ParagraphBody>
          <ParagraphExtraSmall $colorName="--gray-40" $fontWeight={600}>
            {moment(timeLineItem.date).year()}
          </ParagraphExtraSmall>
          {timeLineItem?.isFirstWave && (
            <ParagraphExtraSmall $colorName="--gray-40" $fontWeight={600}>
              (First wave)
            </ParagraphExtraSmall>
          )}
          {timeLineItem?.isLastWave && (
            <ParagraphExtraSmall $colorName="--gray-40" $fontWeight={600}>
              (Last wave)
            </ParagraphExtraSmall>
          )}
        </>
      )}
    </Box>
  );
});

export default TimeLineItem;
