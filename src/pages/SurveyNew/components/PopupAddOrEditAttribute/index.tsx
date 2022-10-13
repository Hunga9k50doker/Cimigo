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
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';


export interface UserAttributeFormData {
  start: string;
  end: string,
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
      start: yup.string().required(t('setup_survey_popup_your_own_att_start_point_label_required')),
      end: yup.string().required(t('setup_survey_popup_your_own_att_end_point_label_required')),
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
        start: '',
        end: ''
      })
      setExpanded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdd, itemEdit])

  useEffect(() => {
    if (itemEdit) {
      reset({
        start: itemEdit.start,
        end: itemEdit.end
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
        <DialogTitle className={classes.header}>
          {itemEdit ? (
            <Heading3 $colorName="--ghost-white" translation-key="setup_survey_popup_edit_your_own_att_title">{t('setup_survey_popup_edit_your_own_att_title')}</Heading3>
          ) : (
            <Heading3 $colorName="--ghost-white" translation-key="setup_survey_popup_add_your_own_att_title">{t('setup_survey_popup_add_your_own_att_title')}</Heading3>
          )}
          <ButtonClose onClick={onCancel}>
          </ButtonClose>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          <ParagraphSmall sx={{fontSize: "16px !important"}} $colorName="--eerie-black" translation-key="setup_survey_popup_your_own_att_sub_title">{t('setup_survey_popup_your_own_att_sub_title')}</ParagraphSmall>
          <Grid className={classes.listNumberMobile}>
            <div className={classes.textMobile}>
              <ParagraphExtraSmall translation-key="setup_survey_add_att_start_label">{t('setup_survey_add_att_start_label')}</ParagraphExtraSmall>
              <ParagraphExtraSmall translation-key="setup_survey_add_att_end_label">{t('setup_survey_add_att_end_label')}</ParagraphExtraSmall>
            </div>
            <div className={classes.numberMobile}>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
          </Grid>
          <Grid container classes={{ root: classes.rootList }}>
            <ListItem
              alignItems="center"
              component="div"
              classes={{ root: classes.rootListItem }}
              disablePadding
            >
              <ListItemText>
                <Grid className={classes.listFlex}>
                  <Grid item xs={4} className={classes.listTextLeft}>
                    <InputTextField
                      className={classes.inputPoint}
                      title={t('setup_survey_popup_your_own_att_start_point_label')}
                      translation-key="setup_survey_popup_your_own_att_start_point_label"
                      name="start"
                      placeholder={t('setup_survey_popup_your_own_att_start_point_label_placeholder')}
                      translation-key-placeholder="setup_survey_popup_your_own_att_start_point_label_placeholder"
                      inputRef={register('start')}
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
                      errorMessage={errors.start?.message}
                    />
                  </Grid>
                  <Grid item xs={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={4} className={classes.listTextRight}>
                    <InputTextField
                      className={classes.inputPoint}
                      title={t('setup_survey_popup_your_own_att_end_point_label')}
                      translation-key="setup_survey_popup_your_own_att_end_point_label"
                      name="end"
                      placeholder={t('setup_survey_popup_your_own_att_end_point_label_placeholder')}
                      translation-key-placeholder="setup_survey_popup_your_own_att_end_point_label_placeholder"
                      inputRef={register('end')}
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
                      errorMessage={errors.end?.message}
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
                  color: expanded ? "var(--eerie-black-65)" : "var(--cimigo-blue)",
                  marginLeft: expanded ? "0px" : "12px"
                }}
                translation-key="setup_survey_popup_your_own_att_tip_title"
              >
                {t('setup_survey_popup_your_own_att_tip_title')}
              </Heading6>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <ParagraphSmall translation-key="setup_survey_popup_your_own_att_tip_sub">{t('setup_survey_popup_your_own_att_tip_sub')}</ParagraphSmall>
              </Collapse>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.btn}>
          <Button btnType={BtnType.Secondary} onClick={onCancel} translation-key="common_cancel">{t('common_cancel')}</Button>
          <Button
            type="submit"
            children={itemEdit ? t('setup_survey_add_att_btn_edit') : t('setup_survey_add_att_btn_add')}
            translation-key={itemEdit ? 'setup_survey_add_att_btn_edit' : 'setup_survey_add_att_btn_add'}
            btnType={BtnType.Raised}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupAddOrEditAttribute;



