import { Checkbox, CheckboxProps } from "@mui/material";
import { memo } from "react";
import classes from './styles.module.scss'
import CheckIcon from '@mui/icons-material/Check';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
interface Props extends CheckboxProps {

}

const InputCheckbox = memo((props: Props) => {

  return <Checkbox
    className={classes.root}
    icon = {<CheckBoxOutlineBlankIcon className={classes.icon} />}
    checkedIcon = {<CheckIcon className={classes.checkIcon} fontSize="small"/>}
    {...props}
  />
})

export default InputCheckbox