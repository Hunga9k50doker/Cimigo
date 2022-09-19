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
import { memo, useEffect, useState } from "react";
import Inputs from "components/Inputs";
import { Folder } from "models/folder";

export interface RenameProjectFormData {
  name: string;
}

interface PopupConfirmCreateOrEditFolderProps {
  isOpen: boolean;
  folder?: Folder;
  onCancel: () => void;
  onSubmit: (name: string, id?: number) => void;
}

const PopupConfirmCreateOrEditFolder = memo(
  (props: PopupConfirmCreateOrEditFolderProps) => {
    const { t } = useTranslation();

    const { onCancel, onSubmit, folder, isOpen } = props;
    const [name, setName] = useState<string>("");
    useEffect(() => {
      if (folder) {
        setName(folder.name);
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [folder]);

    const _onCancel = () => {
      setName("");
      onCancel();
    };

    const _onSubmit = () => {
      if (!name) return;
      onSubmit(name, folder?.id);
      setName("");
    };

    return (
      <Dialog
        scroll="paper"
        open={isOpen}
        onClose={_onCancel}
        classes={{ paper: classes.paper }}
      >
        <DialogTitleConfirm>
          <Box display="flex">
            <Heading3 $colorName="--cimigo-blue-dark-3" translation-key="">
              {folder ? "Rename folder" : "Create folder"}
            </Heading3>
          </Box>
          <ButtonClose
            $backgroundColor="--eerie-black-5"
            $colorName="--eerie-black-40"
            onClick={_onCancel}
          />
        </DialogTitleConfirm>
        <DialogContentConfirm dividers>
          {!folder ? (
            <>
              <ParagraphBody
                $colorName="--gray-80"
                className={classes.description}
              >
                Create a new folder to store your projects
              </ParagraphBody>
            </>
          ) : (
            <>
              <ParagraphBody
                $colorName="--gray-80"
                className={classes.description}
              >
                Rename “<span>{folder?.name}</span>” folder to:
              </ParagraphBody>
            </>
          )}
          <Inputs
            sx={{ margin: "16px 0px" }}
            name="name"
            placeholder={t("project_mgmt_create_folder_placeholder")}
            translation-key-placeholder="project_mgmt_create_folder_placeholder"
            value={name}
            onChange={(e: any) => {
              setName(e.target.value || "");
            }}
          />
        </DialogContentConfirm>
        <DialogActionsConfirm className={classes.btn}>
          <Button
            btnType={BtnType.Secondary}
            onClick={_onCancel}
            translation-key="common_cancel"
          >
            {t("common_cancel")}
          </Button>
          {folder ? (
            <>
              <Button
                btnType={BtnType.Raised}
                translation-key="common_rename"
                children={<TextBtnSmall>Rename</TextBtnSmall>}
                type="button"
                onClick={_onSubmit}
              />
            </>
          ) : (
            <>
              <Button
                btnType={BtnType.Raised}
                translation-key="common_save"
                children={<TextBtnSmall>Save</TextBtnSmall>}
                type="button"
                onClick={_onSubmit}
              />
            </>
          )}
        </DialogActionsConfirm>
      </Dialog>
    );
  }
);
export default PopupConfirmCreateOrEditFolder;
