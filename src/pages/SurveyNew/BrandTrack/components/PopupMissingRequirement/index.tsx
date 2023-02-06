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
  isValidBrandList: boolean,
  isValidBrandDispositionAndEquity: boolean,
  isValidBrandAssetRecognition: boolean,
  onClose: () => void
  onScrollSection: (section: SETUP_SURVEY_SECTION) => void,
}

const PopupMissingRequirement = ({ isOpen, isValidBasic, isValidBrandList, isValidBrandDispositionAndEquity, isValidBrandAssetRecognition, onClose, onScrollSection }: Props) => {

  const { t } = useTranslation()

  const { project } = useSelector((state: ReducerType) => state.project)

  const minMainBrand = useMemo(() => ProjectHelper.minMainBrand(project), [project])
  const minCompetingBrand = useMemo(() => ProjectHelper.minCompetingBrand(project), [project])

  const minCompetitiveBrand = useMemo(() => ProjectHelper.minCompetitiveBrand(project), [project])
  const minEquityAttributes = useMemo(() => ProjectHelper.minEquityAttributes(project), [project])

  const minBrandAssetRecognition = useMemo(() => ProjectHelper.minBrandAssetRecognition(project), [project])

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
          <Heading3 $colorName='--cimigo-blue-dark-3' translation-key="setup_survey_popup_missing_required_title">{t("setup_survey_popup_missing_required_title")}</Heading3>
        </Box>
        <ButtonClose $backgroundColor='--eerie-black-5' $colorName='--eerie-black-40' onClick={onClose} />
      </DialogTitleConfirm>
      <DialogContentConfirm dividers>
        <ParagraphBody $colorName='--gray-80' translation-key="setup_survey_popup_missing_required_subtitle">{t("setup_survey_popup_missing_required_subtitle")}</ParagraphBody>
        <ul className={classes.list}>
          {!isValidBasic && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'translation-key="setup_survey_popup_missing_required_basic_information_required">
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.basic_information)} className="cursor-pointer underline" translation-key="setup_survey_popup_missing_required_basic_information">{t("setup_survey_popup_missing_required_basic_information")}</span> {t("setup_survey_popup_missing_required_basic_information_required")}
            </ParagraphBody>
          )}
          {!isValidBrandList && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.brand_list)} className="cursor-pointer underline">Building your brand list</span> minimum of {minMainBrand} main brand(s) and {minCompetingBrand} competing brand(s) are required
            </ParagraphBody>
          )}
          {!isValidBrandDispositionAndEquity && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.brand_disposition_and_equity)} className="cursor-pointer underline">Brand disposition and equity</span> minimum of {minCompetitiveBrand} competing brand(s) and {minEquityAttributes} equity attribute(s) are required
            </ParagraphBody>
          )}
          {!isValidBrandAssetRecognition && (
            <ParagraphBody variant="body2" variantMapping={{ body2: "li" }} className={classes.itemText} $colorName='--gray-80'>
              <span onClick={() => onScrollSection(SETUP_SURVEY_SECTION.brand_asset_recognition)} className="cursor-pointer underline">Brand asset recognition</span> minimum of {minBrandAssetRecognition} brand asset(s) are required
            </ParagraphBody>
          )}
        </ul>
        <ParagraphBody mt={4} $colorName='--gray-80' translation-key="setup_survey_popup_missing_required_remind">{t("setup_survey_popup_missing_required_remind")}</ParagraphBody>
      </DialogContentConfirm>
      <DialogActionsConfirm>
        <Button
          btnType={BtnType.Raised}
          children={<TextBtnSmall translation-key="common_ok_got_it">{t("common_ok_got_it")}</TextBtnSmall>}
          onClick={onClose}
        />
      </DialogActionsConfirm>
    </Dialog>
  )
}
export default PopupMissingRequirement;