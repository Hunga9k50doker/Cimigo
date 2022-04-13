import { memo } from "react";
import classes from './styles.module.scss';
import { OptionItemT } from "models/general";
import clsx from "clsx";
import InputCreatableSelect from "components/InputCreatableSelect";
import { useEffect } from "react";
import { useState } from "react";
import { Dialog, Grid, IconButton } from "@mui/material";
import Images from "config/images";
import Buttons from "components/Buttons";

export enum EFilterType {
  SELECT = 'SELECT'
}

export interface FilterOption {
  name: string,
  key: string,
  type: EFilterType.SELECT,
  creatable?: boolean,
  placeholder?: string
}

export interface FilterValue {
  [key: string]: OptionItemT<any>[]
}

interface CurrentValue extends FilterOption {
  value: OptionItemT<any>[]
}

interface FilderModalProps {
  isOpen: boolean,
  filterOptions: FilterOption[],
  filterValue: FilterValue,
  onClose: () => void
  getFilterOption: (name: string) => OptionItemT<any>[]
  onChange: (filterValue: FilterValue) => void
}

const FilderModal = memo(({ isOpen, filterOptions, filterValue, onClose, getFilterOption, onChange }: FilderModalProps) => {
  const [currentValue, setCurrentValue] = useState<CurrentValue[]>([])

  const handleClose = () => {
    onClose();
  }

  useEffect(() => {
    if (!isOpen) return
    const value: CurrentValue[] = []
    Object.keys(filterValue).forEach((key) => {
      const item = filterOptions?.find(it => it.key === key)
      if (item && filterValue[key].length) {
        value.push({
          ...item,
          value: filterValue[key]
        })
      }
    })
    if (!value.length) {
      value.push({
        ...filterOptions[0],
        value: []
      })
    }
    setCurrentValue(value)
  }, [filterValue, filterOptions, isOpen])

  const onChangeFilter = (item: FilterOption) => {
    let currentValueNew = [...currentValue]
    const i = currentValueNew.findIndex(it => it.key === item.key)
    if (i !== -1) {
      currentValueNew = currentValueNew.filter(temp => temp.key !== item.key);
    } else {
      currentValueNew = [
        ...currentValueNew,
        { ...item, value: [] }
      ]
    }
    currentValueNew = currentValueNew.filter(temp => temp.key === item.key || !!temp.value.length);
    if (!currentValueNew.length) {
      currentValueNew = [{
        ...filterOptions[0],
        value: []
      }]
    }
    setCurrentValue(currentValueNew)
  }

  const _onChange = () => {
    const value: FilterValue = {}
    filterOptions.forEach(option => {
      const item = currentValue.find(it => it.key === option.key)
      value[option.key] = item?.value || []
    })
    onChange && onChange(value)
    handleClose()
  }

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
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <div className={classes.filterOption}>
            {filterOptions.map((item, i) => (
              <div
                onClick={() => onChangeFilter(item)}
                className={clsx(classes.filterOptionItem, {
                  [classes.filterOptionItemActive]: !!currentValue?.find(it => it.key === item.key)
                })}
                key={i}
              >
                <span>{item.name}</span>
              </div>
            ))}
          </div>
          <div className={classes.filterValue}>
            {currentValue?.map((item, i) => (
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
                      const currentValueNew = [...currentValue]
                      currentValueNew[i].value = value
                      setCurrentValue(currentValueNew)
                    }
                  }}
                />
              </div>
            ))}
          </div>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons onClick={_onChange} children={'Go'} btnType='Blue' padding='13px 16px' />
        </Grid>
      </Grid>
    </Dialog>
  )
})

export default FilderModal;