import { Box, Dialog } from '@mui/material';
import classes from "./styles.module.scss";
import { useTranslation } from 'react-i18next';
import { DialogTitleConfirm } from 'components/common/dialogs/DialogTitle';
import Heading3 from 'components/common/text/Heading3';
import ButtonClose from 'components/common/buttons/ButtonClose';
import { DialogContentConfirm } from 'components/common/dialogs/DialogContent';
import { DialogActionsConfirm } from 'components/common/dialogs/DialogActions';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSmall from 'components/common/text/TextBtnSmall';
import { SETUP_SURVEY_SECTION } from 'models/project';
import { Warning as WarningIcon } from '@mui/icons-material';
import ParagraphBody from 'components/common/text/ParagraphBody';
import { useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { useMemo } from 'react';
import ProjectHelper from 'helpers/project';

interface Props {
  isOpen: boolean,
  isValidBasic: boolean,
  isValidPacks: boolean,
  isValidAdditionalBrand: boolean,
  isValidEyeTracking: boolean,
  onClose: () => void
  onScrollSection: (section: SETUP_SURVEY_SECTION) => void,
}

const PopupMissingRequirement = ({ isOpen, isValidBasic, isValidPacks, isValidAdditionalBrand, isValidEyeTracking, onClose, onScrollSection }: Props) => {

  const { t } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const minPack = useMemo(() => ProjectHelper.minPack(project?.solution), [project?.solution])

  const minAdditionalBrand = useMemo(() => ProjectHelper.minAdditionalBrand(project?.solution), [project?.solution])

  const minEyeTrackingPack = useMemo(() => ProjectHelper.minEyeTrackingPack(project?.solution), [project?.solution])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitleConfirm>
        <Box display="flex">
          <WarningIcon sx={{ fontSize: 32, color: "var(--warning)", mr: 2 }} />
          <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="">{"Missing some requirement"}</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onClose} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody $colorName='--gray-80'>Some of the sections below must be completed before proceeding to the next step:</ParagraphBody>
        <ul className={classes.list}>
          {!isValidBasic && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.basic_information)} className="cursor-pointer underline">Basic information</span> (require all information)
            </ParagraphBody>
          )}
          {!isValidPacks && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.upload_packs)} className="cursor-pointer underline">Upload packs</span> (minimum of {minPack} packs are required)
            </ParagraphBody>
          )}
          {!isValidAdditionalBrand && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.additional_brand_list)} className="cursor-pointer underline">Additional brands list</span> (minimum of {minAdditionalBrand} brands are required)
            </ParagraphBody>
          )}
          {!isValidEyeTracking && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.eye_tracking)} className="cursor-pointer underline">Eye-tracking</span> (minimum of {minEyeTrackingPack} additional competitor packs are required)
            </ParagraphBody>
          )}
        </ul>
        <ParagraphBody mt={4} $colorName='--gray-80'>Please complete these above before proceeding to the next step.</ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Raised}
          translation-key=""
          children={<TextBtnSmall>OK, I got it</TextBtnSmall>}
          onClick={onClose}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
}
export default PopupMissingRequirement;