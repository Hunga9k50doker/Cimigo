import { Checkbox, CheckboxProps } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss'
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import clsx from "clsx";
interface Props extends CheckboxProps {
  cleanPadding?: boolean;
}

const InputCheckbox = memo(({ cleanPadding, ...rest}: Props) => {

  return <Checkbox
    className={clsx(classes.root, {[classes.cleanPadding]: cleanPadding})}
    icon={<CheckBoxOutlineBlankIcon className={classes.icon} />}
    checkedIcon={<CheckIcon className={classes.checkIcon} fontSize="small" />}
    {...rest}
  />
})

export default InputCheckbox