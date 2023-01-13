import { Checkbox, CheckboxProps } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss'
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import clsx from "clsx";
interface Props extends CheckboxProps {
  cleanPadding?: boolean;
  iconClassName?: string;
  checkedIconClassName?: string;
}

const InputCheckbox = memo(({ cleanPadding, iconClassName, checkedIconClassName, ...rest}: Props) => {
  return <Checkbox
    className={clsx(classes.root, {[classes.cleanPadding]: cleanPadding})}
    icon={<CheckBoxOutlineBlankIcon className={clsx(classes.icon, iconClassName)} />}
    checkedIcon={<CheckIcon className={clsx(classes.checkIcon, checkedIconClassName)} fontSize="small" />}
    {...rest}
  />
})

export default InputCheckbox