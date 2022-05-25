import { Dialog, Grid, IconButton } from "@mui/material";
import Buttons from "components/Buttons";
import classes from "./styles.module.scss";
import Images from "config/images";
import { useTranslation } from "react-i18next";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  onYes: () => void;
}

const PopupConfirmCancelOrder = (props: Props) => {
  const { t } = useTranslation();
  const { isOpen, onYes, onClose } = props;

  return (
    <Dialog open={isOpen} classes={{ paper: classes.paper }} onClose={onClose}>
      <Grid>
        <Grid className={classes.header}>
          <IconButton onClick={onClose} className={classes.shadowIcClose}>
            <img src={Images.icClose} alt="" />
          </IconButton>
        </Grid>
        <Grid className={classes.title}>
          <span translation-key="common_popup_cancel_payment_title">
            {t("common_popup_cancel_payment_title")}
          </span>
          <p translation-key="common_popup_cancel_payment_sub">
            {t("common_popup_cancel_payment_sub")}
          </p>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons
            children={t("common_popup_cancel_payment_no")}
            translation-key="common_popup_cancel_payment_no"
            btnType="TransparentBlue"
            padding="12px 16px 12px 16px"
            onClick={onClose}
          />
          <Buttons
            children={t("common_popup_cancel_payment_yes")}
            translation-key="common_popup_cancel_payment_yes"
            btnType="Red"
            padding="12px 16px 12px 16px"
            onClick={onYes}
          />
        </Grid>
      </Grid>
    </Dialog>
  );
};

export default PopupConfirmCancelOrder;
