import React, { memo } from "react";
import { Button } from "@mui/material";
import clsx from "clsx";
import classes from './styles.module.scss';

interface ButtonsProps {
  btnType?: string;
  children?: string;
  onClick?: (e?: any) => void;
  type?: any;
  disabled?: boolean;
  width?: number;
  padding?: string;
}

const Buttons = memo((props: ButtonsProps) => {
  const { width, padding, btnType, children, onClick, ...rest } = props;
  console.log(onClick, 'onClick', props)
  return (
    <Button
      className={clsx(
        classes.root,
        btnType === "Blue" ? classes.btnBlue : "",
        btnType === "TransparentBlue" ? classes.btnTransparentBlue : "",
      )}
      type="button"
      {...rest}
      onClick={onClick}
      sx={{minWidth: width, padding: padding}}
    >
      {children}
    </Button>
  );
});
export default Buttons;
