import React, { memo } from "react";
import { Button } from "@mui/material";
import clsx from "clsx";
import classes from './styles.module.scss';

interface ButtonsProps {
  btnType?: string;
  children?: any;
  onClick?: (e?: any) => void;
  type?: any;
  disabled?: boolean;
  className?: any;
  width?: string;
  padding?: string;
}

const Buttons = memo((props: ButtonsProps) => {
  const { width, padding, className, btnType, children, disabled, onClick, ...rest } = props;
  return (
    <Button
      className={clsx(
        classes.root, className,
        btnType === "Blue" ? classes.btnBlue : "",
        btnType === "Red" ? classes.btnRed : "",
        btnType === "TransparentBlue" ? classes.btnTransparentBlue : "",
      )}
      classes={{ disabled: classes.btndisabled }}
      type="button"
      {...rest}
      onClick={onClick}
      disabled={disabled}
      sx={{minWidth: width, padding: padding}}
    >
      {children}
    </Button>
  );
});
export default Buttons;
