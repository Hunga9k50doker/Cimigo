import { Info } from "@mui/icons-material"
import { Box, Dialog } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import ButtonClose from "components/common/buttons/ButtonClose"
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions"
import { DialogContentConfirm } from "components/common/dialogs/DialogContent"
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle"
import Heading3 from "components/common/text/Heading3"
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { memo } from "react"
import { useTranslation } from "react-i18next"
import classes from "./styles.module.scss"

interface PopupConfirmQuotaAllocationProps {
  isOpen: boolean,
  onCancel: () => void,
  onConfirm: () => void,
  onRedirectQuotas: () => void
}

const PopupConfirmQuotaAllocation = memo(({ isOpen, onCancel, onConfirm, onRedirectQuotas }: PopupConfirmQuotaAllocationProps) => {

  const { t } = useTranslation()

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <Info sx={{ fontSize: 32, color: "var(--gray-60)", mr: 2 }} />
          <Heading3 $colorName='--gray-90' translation-key="">Confirm quota allocation</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onCancel} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody $colorName='--gray-90' translation-key="">
          You haven’t agree with the quota allocation. Please <span onClick={onRedirectQuotas} className="underline cursor-pointer">review the quota allocation</span> before process to the next step.
        </ParagraphBody>
        <ParagraphBody mt={3} $colorName='--gray-90' translation-key="">
          Do you agree with our quota allocation?
        </ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Secondary}
          onClick={onCancel}
          translation-key="common_cancel"
          children={<TextBtnSmall>No, review quota allocation</TextBtnSmall>}
        />
        <Button
          btnType={BtnType.Raised}
          translation-key=""
          children={<TextBtnSmall>Yes, process the payment</TextBtnSmall>}
          onClick={onConfirm}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
})

export default PopupConfirmQuotaAllocation