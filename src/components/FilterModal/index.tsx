import { memo } from "react";
import classes from "./styles.module.scss";
import { OptionItemT } from "models/general";
import clsx from "clsx";
import InputCreatableSelect from "components/InputCreatableSelect";
import { useEffect } from "react";
import { useState } from "react";
import { Dialog, Grid, IconButton, Popover } from "@mui/material";
import Images from "config/images";
import Buttons from "components/Buttons";
import { DateRange, Range, RangeFocus, RangeKeyDict } from "react-date-range";
import Inputs from "components/Inputs";
import moment from "moment";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

export enum EFilterType {
  SELECT = "SELECT",
  DATE_RANGE = "DATE_RANGE",
}

export interface FilterOption {
  name: string;
  key: string;
  type: EFilterType;
  creatable?: boolean;
  placeholder?: string;
}

export interface FilterValue {
  [key: string]: OptionItemT<any>[] | Range[];
}

interface CurrentValue extends FilterOption {
  value: OptionItemT<any>[] | Range[];
}

interface FilderModalProps {
  isOpen: boolean;
  filterOptions: FilterOption[];
  filterValue: FilterValue;
  onClose: () => void;
  getFilterOption: (name: string) => OptionItemT<any>[] | Range[];
  onChange: (filterValue: FilterValue) => void;
}

const FilderModal = memo(
  ({
    isOpen,
    filterOptions,
    filterValue,
    onClose,
    getFilterOption,
    onChange,
  }: FilderModalProps) => {
    const [currentValue, setCurrentValue] = useState<CurrentValue[]>([]);
    const [anchorDateRange, setAnchorDateRange] =
      useState<HTMLButtonElement | null>(null);
    const [openPopupDateRange, setOpenPopupDateRange] =
      useState<boolean>(false);
    const [dateRange, setDateRange] = useState<Range[]>([
      {
        startDate: null,
        endDate: null,
        key: "selection",
      },
    ]);

    const handleClose = () => {
      onClose();
    };

    useEffect(() => {
      if (!isOpen) return;
      const value: CurrentValue[] = [];
      Object.keys(filterValue).forEach((key) => {
        const item = filterOptions?.find((it) => it.key === key);
        if (item && filterValue[key].length) {
          value.push({
            ...item,
            value: filterValue[key],
          });
        }
      });
      if (!value.length) {
        value.push({
          ...filterOptions[0],
          value: [],
        });
      }
      setCurrentValue(value);
    }, [filterValue, filterOptions, isOpen]);

    const onChangeFilter = (item: FilterOption) => {
      let currentValueNew = [...currentValue];
      const i = currentValueNew.findIndex((it) => it.key === item.key);
      if (i !== -1) {
        currentValueNew = currentValueNew.filter(
          (temp) => temp.key !== item.key
        );
      } else {
        currentValueNew = [...currentValueNew, { ...item, value: [] }];
      }
      currentValueNew = currentValueNew.filter(
        (temp) => temp.key === item.key || !!temp.value.length
      );
      if (!currentValueNew.length) {
        currentValueNew = [
          {
            ...filterOptions[0],
            value: [],
          },
        ];
      }
      setCurrentValue(currentValueNew);
    };

    const _onChange = () => {
      const value: FilterValue = {};
      filterOptions.forEach((option) => {
        const item = currentValue.find((it) => it.key === option.key);
        value[option.key] = item?.value || [];
      });
      onChange && onChange(value);
      handleClose();
    };

    const preventKeyPress = (event: React.SyntheticEvent) => {
      event.preventDefault();
    };

    const handleSelectDateRange = (
      event: React.MouseEvent<HTMLInputElement>
    ) => {
      setAnchorDateRange(event.currentTarget);
      setOpenPopupDateRange(true);
    };

    const renderFilter = () => {
      return (
        <>
          {currentValue?.map((item, i) => {
            switch (item.type) {
              case EFilterType.SELECT:
                return (
                  <div className={classes.filterValueItem} key={i}>
                    <InputCreatableSelect
                      fullWidth
                      title={item.name}
                      creatable={!!item.creatable}
                      selectProps={{
                        value: item.value,
                        menuPosition: "fixed",
                        options: getFilterOption(item.key) || [],
                        isClearable: true,
                        isMulti: true,
                        placeholder: item.placeholder,
                        onChange: (value: OptionItemT<any>[]) => {
                          const currentValueNew = [...currentValue];
                          currentValueNew[i].value = value;
                          setCurrentValue(currentValueNew);
                        },
                      }}
                    />
                  </div>
                );
              case EFilterType.DATE_RANGE:
                return (
                  <div className={classes.dateRange} key={i}>
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
                        onClick={handleSelectDateRange}
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
                        onClick={handleSelectDateRange}
                      />
                    </div>
                    <Popover
                      open={openPopupDateRange}
                      anchorEl={anchorDateRange}
                      onClose={() => setOpenPopupDateRange(false)}
                      anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "left",
                      }}
                    >
                      <DateRange
                        editableDateInputs={true}
                        startDatePlaceholder="From..."
                        endDatePlaceholder="To..."
                        ranges={dateRange}
                        onChange={(item: RangeKeyDict) => {
                          const currentValueNew = [...currentValue];
                          currentValueNew[i].value = [item.selection];
                          setCurrentValue(currentValueNew);
                          setDateRange([item.selection]);
                        }}
                        onRangeFocusChange={(item: RangeFocus) => {
                          if (item[0] === 0 && item[1] === 0) {
                            setOpenPopupDateRange(false);
                          }
                        }}
                      />
                    </Popover>
                  </div>
                );
              default:
                return <></>;
            }
          })}
        </>
      );
    };

    return (
      <Dialog
        open={isOpen}
        onClose={handleClose}
        classes={{ paper: classes.paper }}
      >
        <Grid className={classes.root}>
          <Grid className={classes.header}>
            <p className={classes.title}>Please select search filter(s): </p>
            <IconButton onClick={handleClose}>
              <img src={Images.icClose} alt="" />
            </IconButton>
          </Grid>
          <Grid className={classes.body}>
            <div className={classes.filterOption}>
              {filterOptions.map((item, i) => (
                <div
                  onClick={() => onChangeFilter(item)}
                  className={clsx(classes.filterOptionItem, {
                    [classes.filterOptionItemActive]: !!currentValue?.find(
                      (it) => it.key === item.key
                    ),
                  })}
                  key={i}
                >
                  <span>{item.name}</span>
                </div>
              ))}
            </div>
            <div className={classes.filterValue}>{renderFilter()}</div>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons
              onClick={_onChange}
              children={"Go"}
              btnType="Blue"
              padding="10px 16px"
            />
          </Grid>
        </Grid>
      </Dialog>
    );
  }
);

export default FilderModal;
