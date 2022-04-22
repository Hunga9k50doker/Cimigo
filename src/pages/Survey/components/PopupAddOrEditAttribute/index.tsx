import { memo, useState, useEffect, useMemo } from 'react';
import { Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { UserAttribute } from 'models/user_attribute';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import Inputs from 'components/Inputs';
import { useTranslation } from 'react-i18next';


export interface UserAttributeFormData {
  start: string;
  end: string,
}


interface Props {
  isAdd?: boolean,
  itemEdit?: UserAttribute,
  onCancel: () => void,
  onSubmit: (data: UserAttributeFormData) => void,
}

const PopupAddOrEditAttribute = memo((props: Props) => {
  const { isAdd, itemEdit, onCancel, onSubmit } = props;

  const { t, i18n } = useTranslation()

  const schema = useMemo(() => {
    return yup.object().shape({
      start: yup.string().required(t('setup_survey_popup_your_own_att_start_point_label_required')),
      end: yup.string().required(t('setup_survey_popup_your_own_att_end_point_label_required')),
    })
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
  }, [isAdd, itemEdit])

  useEffect(() => {
    if (itemEdit) {
      reset({
        start: itemEdit.start,
        end: itemEdit.end
      })
    }
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
            <p className={classes.title} translation-key="setup_survey_popup_edit_your_own_att_title">{t('setup_survey_popup_edit_your_own_att_title')}</p>
          ) : (
            <p className={classes.title} translation-key="setup_survey_popup_add_your_own_att_title">{t('setup_survey_popup_add_your_own_att_title')}</p>
          )}
          <IconButton onClick={onCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </DialogTitle>
        <DialogContent className={classes.body} dividers>
          <p translation-key="setup_survey_popup_your_own_att_sub_title">{t('setup_survey_popup_your_own_att_sub_title')}</p>
          <Grid className={classes.listNumberMobile}>
            <div className={classes.textMobile}>
              <p translation-key="setup_survey_add_att_start_label">{t('setup_survey_add_att_start_label')}</p>
              <p translation-key="setup_survey_add_att_end_label">{t('setup_survey_add_att_end_label')}</p>
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
                    <Inputs
                      title={t('setup_survey_popup_your_own_att_start_point_label')}
                      translation-key="setup_survey_popup_your_own_att_start_point_label"
                      name="start"
                      placeholder={t('setup_survey_popup_your_own_att_start_point_label_placeholder')}
                      translation-key-placeholder="setup_survey_popup_your_own_att_start_point_label_placeholder"
                      inputRef={register('start')}
                      errorMessage={errors.start?.message}
                    />
                  </Grid>
                  <Grid item xs={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={4} className={classes.listTextRight}>
                    <Inputs
                      title={t('setup_survey_popup_your_own_att_end_point_label')}
                      translation-key="setup_survey_popup_your_own_att_end_point_label"
                      name="end"
                      placeholder={t('setup_survey_popup_your_own_att_end_point_label_placeholder')}
                      translation-key-placeholder="setup_survey_popup_your_own_att_end_point_label_placeholder"
                      inputRef={register('end')}
                      errorMessage={errors.end?.message}
                    />
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          </Grid>
          <Grid className={classes.tips}>
            <img src={expanded ? Images.icTipGray : Images.icTipBlue} alt="" onClick={handleExpandClick} />
            <div style={{ display: expanded ? "flex" : "none" }} className={classes.border} />
            <Grid className={classes.collapse} >
              <p
                onClick={handleExpandClick}
                style={{
                  color: expanded ? "rgba(28, 28, 28, 0.65)" : "#1F61A9",
                  fontWeight: expanded ? 600 : 500,
                  marginLeft: expanded ? "0px" : "12px"
                }}
                translation-key="setup_survey_popup_your_own_att_tip_title"
              >
                {t('setup_survey_popup_your_own_att_tip_title')}
              </p>
              <Collapse in={expanded} timeout="auto" unmountOnExit>
                <p translation-key="setup_survey_popup_your_own_att_tip_sub">{t('setup_survey_popup_your_own_att_tip_sub')}</p>
              </Collapse>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.btn}>
          <Buttons
            type="submit"
            children={itemEdit ? t('setup_survey_add_att_btn_edit') : t('setup_survey_add_att_btn_add')}
            translation-key={itemEdit ? 'setup_survey_add_att_btn_edit' : 'setup_survey_add_att_btn_add'}
            btnType='Blue'
            padding='10px 16px'
          />
        </DialogActions>
      </form>
    </Dialog>
  );
});
export default PopupAddOrEditAttribute;



