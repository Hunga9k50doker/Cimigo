import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import { memo } from "react";
import { Project } from "models/project";
import { DateItem } from "../../SelectDate";
import moment from "moment";
import { PaymentSchedulePreview } from "models/payment_schedule";

interface PopupConfirmMakeAnOrderProps {
  project?: Project;
  isOpen: boolean;
  paymentSchedule:PaymentSchedulePreview;
  selectedDate: DateItem;
  onCancel: () => void;
  onSubmit: () => void;
}

const PopupConfirmMakeAnOrder = memo((props: PopupConfirmMakeAnOrderProps) => {
  const { t, i18n } = useTranslation();

  const { onCancel, onSubmit, isOpen, project, selectedDate, paymentSchedule } = props;

  const _onCancel = () => {
    onCancel();
  };

  const _onSubmit = () => {
    onSubmit();
  };
  
  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={_onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm className={classes.headerDialog}>
        <Box display="flex">
          <Heading3 $colorName="--gray-90">
            Confirm making an order
          </Heading3>
        </Box>
        <ButtonClose
          $backgroundColor="--eerie-black-5"
          $colorName="--eerie-black-40"
          onClick={_onCancel}
        />
      </DialogTitleConfirm>
      <DialogContentConfirm sx={{ paddingTop: "24px" }} dividers>
        <Box sx={{ paddingTop: "24px" }}>
          <ParagraphBody $colorName="--eerie-black" className={classes.description}>
            Please confirm to make an order for <span>{project?.name}</span> project.
          </ParagraphBody>
          <ParagraphBody pt={3} $colorName="--eerie-black" className={classes.description}>
            The fieldwork will be kicked off at beginning of <span>{moment(selectedDate?.date).format("MMM yyyy")}</span>.
          </ParagraphBody>
          <ParagraphBody pt={3} $colorName="--eerie-black" className={classes.description}>
            <span>Note:</span> For the project to start, you will need to make the first
            payment by <span>{moment(paymentSchedule?.dueDate).format("MMM DD, yyyy")}</span>. Subsequent payments will be made every {paymentSchedule?.scheduledMonths}{" "}
            months.
          </ParagraphBody>
        </Box>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Secondary}
          onClick={_onCancel}
          translation-key="common_cancel"
        >
          {t("common_cancel")}
        </Button>
        <Button
          btnType={BtnType.Raised}
          children={
            <TextBtnSmall>
              Make an order
            </TextBtnSmall>
          }
          type="submit"
          onClick={_onSubmit}
        />
      </DialogActionsConfirm>
    </Dialog>
  );
});
export default PopupConfirmMakeAnOrder;
