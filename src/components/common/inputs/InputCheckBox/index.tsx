import { memo } from "react";
import { Checkbox as CheckBoxMUI, CheckboxProps as CkeckboxPropsMUI } from "@mui/material";

interface ButtonProps extends CkeckboxPropsMUI {
  padding?: string;
  margin?: string;
}

const Checkbox = memo((props: ButtonProps) => {
  const { padding, margin, className, sx = {}, ...rest } = props;
  return (
    <CheckBoxMUI
      className={className}
      {...rest}
      sx={{...sx,  padding: padding, margin: margin}}
    />
  );
});
export default Checkbox;