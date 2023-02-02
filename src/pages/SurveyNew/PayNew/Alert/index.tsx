import { Box } from "@mui/material";
import { memo, useEffect, useState } from "react";
import classes from "./styles.module.scss";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloseIcon from "@mui/icons-material/Close";
import Heading4 from "components/common/text/Heading4";
import Button, { BtnType } from "components/common/buttons/Button";
import WarningIcon from "@mui/icons-material/Warning";
import InfoIcon from "@mui/icons-material/Info";

export enum AlerType {
  Success = "Success",
  Default = "Default",
  Warning = "Warning",
}
interface AlertProp {
  type?: AlerType;
  content?: React.ReactNode;
  title?: string;
}
const Alert = memo((props: AlertProp) => {
  const { type, content, title, ...rest } = props;
  const [closeAlert, setCloseAlert] = useState("");
  const [borderLeft, setBorderLeft] = useState("");
  useEffect(() => {
    switch (type) {
      case "Success":
        setBorderLeft("4px solid var(--cimigo-green-dark) !important");
        break;
      case "Warning":
        setBorderLeft("4px solid var(--warning-dark) !important");
        break;
      default:
        setBorderLeft("4px solid var(--cimigo-blue) !important");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Box
      className={classes.alert}
      sx={{ display: closeAlert, borderLeft: borderLeft }}
      {...rest}
    >
      <Box className={classes.left}>
        {type === "Success" && (
          <Box className={classes.iconSuccess}>
            <CheckCircleIcon />
          </Box>
        )}
        {type === "Warning" && (
          <Box className={classes.iconWarning}>
            <WarningIcon />
          </Box>
        )}
        {type === "Default" && (
          <Box className={classes.iconDefault}>
            <InfoIcon />
          </Box>
        )}
        <Box className={classes.content}>
          <Heading4 $colorName={"--eerie-black"}>{title}</Heading4>
          {content}
        </Box>
      </Box>
      <Box className={classes.right}>
        <Box className={classes.btnClose}>
          <Button
            startIcon={<CloseIcon />}
            btnType={BtnType.Text}
            onClick={() => {
              setCloseAlert("none !important");
            }}
          />
        </Box>
      </Box>
    </Box>
  );
});
export default Alert;
