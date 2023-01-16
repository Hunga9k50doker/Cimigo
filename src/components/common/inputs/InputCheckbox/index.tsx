import { Checkbox, CheckboxProps } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss'
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import clsx from "clsx";
interface Props extends CheckboxProps {
  cleanPadding?: boolean;
  checkboxColorType?: string;
}

const InputCheckbox = memo(({ cleanPadding, checkboxColorType, ...rest}: Props) => {
  return <Checkbox
    className={clsx(classes.root, {[classes.cleanPadding]: cleanPadding}, {[classes.blueRoot]: checkboxColorType === "blue"})}
    icon={<CheckBoxOutlineBlankIcon className={clsx(classes.icon, {[classes.blueCheckboxIcon]: checkboxColorType === "blue"})} />}
    checkedIcon={<CheckIcon className={clsx(classes.checkIcon, {[classes.blueCheckboxCheckIcon]: checkboxColorType === "blue"})} fontSize="small" />}
    {...rest}
  />
})

export default InputCheckbox