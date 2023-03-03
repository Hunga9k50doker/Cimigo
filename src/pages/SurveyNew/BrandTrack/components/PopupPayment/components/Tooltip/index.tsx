import React from "react";
import { Box, Tooltip, Grid } from "@mui/material";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { useTranslation } from "react-i18next";
import Heading5 from "components/common/text/Heading5";
import classes from "./styles.module.scss";
import Button, { BtnType } from "components/common/buttons/Button";
import Span from "../Span";

function TooltipCancelPayment({ onCancelPayment }) {
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const { t } = useTranslation();

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };
  return (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        arrow
        classes={{ popper: classes.boxTooltip }}
        placement="top"
        PopperProps={{
          disablePortal: true,
        }}
        onClose={handleTooltipClose}
        open={openTooltip}
        disableFocusListener
        disableHoverListener
        disableTouchListener
        title={
          <Grid className={classes.boxTooltipTitle}>
            <Heading5 mb={3} $colorName="--gray-02">
              Change payment method?
            </Heading5>
            <Box display={"flex"}>
              <Button
                btnType={BtnType.Secondary}
                width={"150px"}
                margin={"0 16px 0 0"}
                children={"No, keep it"}
                onClick={handleTooltipClose}
              ></Button>
              <Button btnType={BtnType.Primary} width={"150px"} children={" Yes, Change it"} onClick={onCancelPayment}></Button>
            </Box>
          </Grid>
        }
      >
        <Span translation-key="brand_track_popup_paynow_action_1" onClick={handleTooltipOpen}>
          {t("brand_track_popup_paynow_action_1")}
        </Span>
      </Tooltip>
    </ClickAwayListener>
  );
}

export default TooltipCancelPayment;
