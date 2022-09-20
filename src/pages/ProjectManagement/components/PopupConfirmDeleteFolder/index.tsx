import { memo } from "react";
import { Box, Dialog } from "@mui/material";
import classes from "./styles.module.scss";

import _ from "lodash";
import { useTranslation } from "react-i18next";
import { DialogTitleConfirm } from "components/common/dialogs/DialogTitle";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import { DialogContentConfirm } from "components/common/dialogs/DialogContent";
import { DialogActionsConfirm } from "components/common/dialogs/DialogActions";
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import CancelIcon from "@mui/icons-material/Cancel";
import { Folder } from "models/folder";

interface PopupConfirmDeleteFolderProps {
  folder: Folder;
  onCancel: () => void;
  onDelete: (folderId: number) => void;
}

const PopupConfirmDeleteFolder = memo(
  (props: PopupConfirmDeleteFolderProps) => {
    const { t } = useTranslation();

    const { onCancel, onDelete, folder } = props;

    const _onCancel = () => {
      onCancel();
    };

    const _onDelete = () => {
      if (!folder.id) return;
      onDelete(folder.id);
    };

    return (
      <Dialog
        scroll="paper"
        open={!!folder}
        onClose={_onCancel}
        classes={{ paper: classes.paper }}
      >
        <DialogTitleConfirm>
          <Box display="flex">
            <CancelIcon
              sx={{ fontSize: 32, color: "var(--red-error)", mr: 2 }}
            />
            <Heading3 $colorName="--cimigo-blue-dark-3" translation-key="">
              Delete Folder?
            </Heading3>
          </Box>
          <ButtonClose
            $backgroundColor="--eerie-black-5"
            $colorName="--eerie-black-40"
            onClick={onCancel}
          />
        </DialogTitleConfirm>
        <DialogContentConfirm dividers>
          <ParagraphBody $colorName="--gray-80" className={classes.description}>
            Are you sure you want to delete the “<span>{folder?.name}</span>”
            folder?
          </ParagraphBody>
        </DialogContentConfirm>
        <DialogActionsConfirm className={classes.btn}>
          <Button
            btnType={BtnType.Secondary}
            onClick={_onCancel}
            translation-key="common_cancel"
          >
            {t("common_cancel")}
          </Button>
          <Button
            className={classes.buttonDelete}
            translation-key=""
            children={<TextBtnSmall>Delete</TextBtnSmall>}
            type="button"
            onClick={() => _onDelete()}
          />
        </DialogActionsConfirm>
      </Dialog>
    );
  }
);
export default PopupConfirmDeleteFolder;
