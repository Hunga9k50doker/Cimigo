import { memo, useState, useEffect, useMemo } from 'react';
import { Collapse, Dialog, Grid, ListItem, ListItemText, InputAdornment, Tooltip } from '@mui/material';
import classes from './styles.module.scss';
import Images from "config/images";
import { UserAttribute } from 'models/user_attribute';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import { Project } from "models/project";
import InputTextField from 'components/common/inputs/InputTextfield';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import Heading6 from "components/common/text/Heading6";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ParagraphBody from 'components/common/text/ParagraphBody';


export interface UserAttributeFormData {
  content: string;
}


interface Props {
  isAdd?: boolean,
  itemEdit?: UserAttribute,
  project: Project;
  onCancel: () => void,
  onSubmit: (data: UserAttributeFormData) => void,
}

const PopupAddOrEditAttribute = memo((props: Props) => {
  const { isAdd, itemEdit, onCancel, project, onSubmit } = props;

  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      content: yup.string().required(t('setup_survey_popup_your_own_att_start_point_label_required')),
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language])

  const [expanded, setExpanded] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const { register, handleSubmit, formState: { errors }, reset } = useForm<UserAttributeFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const _onSubmit = (data: UserAttributeFormData) => {
    onSubmit(data)
  }

  useEffect(() => {
    if (!isAdd && !itemEdit) {
      reset({
        content: '',
      })
      setExpanded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd, itemEdit])

  useEffect(() => {
    if (itemEdit) {
      reset({
        content: itemEdit.content,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemEdit])

  return (
    <Dialog
      scroll="paper"
      open={isAdd || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <form autoComplete="off" className={classes.form} noValidate onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle $bgColor="--white" className={classes.header}>
          {itemEdit ? (
            <Heading3 $colorName="--gray-90" translation-key="setup_survey_popup_edit_your_own_att_title">{t('setup_survey_popup_edit_your_own_att_title')}</Heading3>
          ) : (
            <Heading3 $colorName="--gray-90" translation-key="setup_survey_popup_add_your_own_att_title">{t('setup_survey_popup_add_your_own_att_title')}</Heading3>
          )}
          <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onCancel}>
          </ButtonClose>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          <ParagraphSmall $colorName="--eerie-black" translation-key="setup_survey_popup_your_own_att_sub_title">Your attribute will be asked as a scale for every provided pack, providing you with the participants’ agreement or disagreement with the asked attribute.</ParagraphSmall>
          <Grid container classes={{ root: classes.rootList }}>
            <ListItem
              alignItems="center"
              component="div"
              classes={{ root: classes.rootListItem }}
              disablePadding
            >
              <ListItemText>
                <Grid>
                  <Grid item>
                    <ParagraphBody $fontWeight="600" $colorName="--eerie-black">What is your own attribute?</ParagraphBody>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.subInputTitle}>Enter your attribute in the following box</ParagraphSmall>
                    <InputTextField
                      className={classes.inputPoint}
                      name="content"
                      placeholder={"e.g. This pack is durable"}
                      translation-key-placeholder="setup_survey_popup_your_own_att_start_point_label_placeholder"
                      inputRef={register('content')}
                      startAdornment={
                        <InputAdornment position="start">
                          <Tooltip
                            translation-key="setup_survey_popup_question_tooltip_icon"
                            title={t("setup_survey_popup_question_tooltip_icon")}
                          >
                            <div className={classes.iconLanguage}>{project?.surveyLanguage}</div>
                          </Tooltip>
                        </InputAdornment>
                      }
                      errorMessage={errors.content?.message}
                    />
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          </Grid>
          <Grid className={classes.tips}>
            <img src={expanded ? Images.icTipGray : Images.icTipBlue} alt="" onClick={handleExpandClick} />
            <div style={{ display: expanded ? "flex" : "none" }}className={classes.border}/>
            <Grid className={classes.collapse} > 
              <Heading6
                onClick={handleExpandClick}
                style={{
                  color: expanded ? "var(--gray-80)" : "var(--cimigo-blue)",
                  marginLeft: expanded ? "0px" : "12px"
                }}
                translation-key="setup_survey_popup_your_own_att_tip_title"
                $fontWeight="700"
              >
                Tip:
              </Heading6>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <ParagraphSmall className={classes.itemTip} translation-key="setup_survey_popup_your_own_att_tip_sub"><span className={classes.itemDotTip}></span>Keep attributes short and simple.</ParagraphSmall>
                <ParagraphSmall className={classes.itemTip} translation-key="setup_survey_popup_your_own_att_tip_sub"><span className={classes.itemDotTip}></span>Make sure there is only one possible interpretation or meaning for the attribute.</ParagraphSmall>
                <ParagraphSmall className={classes.itemTip} translation-key="setup_survey_popup_your_own_att_tip_sub"><span className={classes.itemDotTip}></span>Ensure your attributes is related to the packs.</ParagraphSmall>
              </Collapse>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.btn}>
          <Button btnType={BtnType.Secondary} onClick={onCancel} translation-key="common_cancel">{t('common_cancel')}</Button>
          <Button
            type="submit"
            children={"Save"}
            translation-key={itemEdit ? 'setup_survey_add_att_btn_edit' : 'setup_survey_add_att_btn_add'}
            btnType={BtnType.Raised}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupAddOrEditAttribute;
