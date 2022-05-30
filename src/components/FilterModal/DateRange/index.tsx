import classes from "./styles.module.scss";
import { memo, useState } from "react";
import { CurrentValue } from "..";
import Inputs from "components/Inputs";
import moment from "moment";
import { Popover } from "@mui/material";
import {
  DateRange as ReactDateRange,
  Range,
  RangeFocus,
  RangeKeyDict,
} from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

interface DateRangeProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dateRange: Range[];
  setDateRange: React.Dispatch<React.SetStateAction<Range[]>>;
  currentValue: CurrentValue[];
  setCurrentValue: React.Dispatch<React.SetStateAction<CurrentValue[]>>;
  index: number;
}

const DateRange = memo((props: DateRangeProps) => {
  const {
    open,
    setOpen,
    dateRange,
    setDateRange,
    currentValue,
    setCurrentValue,
    index,
  } = props;
  const [anchorDateRange, setAnchorDateRange] =
    useState<HTMLButtonElement | null>(null);

  const preventKeyPress = (event: React.SyntheticEvent) => {
    event.preventDefault();
  };

  const handleOpenPopupDateRange = (
    event: React.MouseEvent<HTMLInputElement>
  ) => {
    setAnchorDateRange(event.currentTarget);
    setOpen(true);
  };

  return (
    <div className={classes.dateRange}>
      <div className={classes.dateInput}>
        <p className={classes.dateInputTitle}>Start date</p>
        <Inputs
          value={
            dateRange[0]?.startDate
              ? moment(dateRange[0]?.startDate)
                  .locale("en")
                  .format("MMMM DD, YYYY")
              : ""
          }
          placeholder="From..."
          onKeyPress={preventKeyPress}
          onClick={handleOpenPopupDateRange}
        />
      </div>
      <div className={classes.dateInput}>
        <p className={classes.dateInputTitle}>End date</p>
        <Inputs
          value={
            dateRange[0]?.endDate
              ? moment(dateRange[0]?.endDate)
                  .locale("en")
                  .format("MMMM DD, YYYY")
              : ""
          }
          placeholder="To..."
          onKeyPress={preventKeyPress}
          onClick={handleOpenPopupDateRange}
        />
      </div>
      <Popover
        open={open}
        anchorEl={anchorDateRange}
        onClose={() => setOpen(false)}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <ReactDateRange
          editableDateInputs={true}
          startDatePlaceholder="From..."
          endDatePlaceholder="To..."
          rangeColors={["#1f61a9"]}
          ranges={dateRange}
          onChange={(item: RangeKeyDict) => {
            const currentValueNew = [...currentValue];
            currentValueNew[index].value = [item.selection];
            setCurrentValue(currentValueNew);
            setDateRange([item.selection]);
          }}
          onRangeFocusChange={(item: RangeFocus) => {
            if (item[0] === 0 && item[1] === 0) {
              setOpen(false);
            }
          }}
        />
      </Popover>
    </div>
  );
});

export default DateRange;
