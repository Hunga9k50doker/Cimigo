import { memo, useEffect, useState } from 'react';
import { Checkbox, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Project } from 'models/project';
import { ProjectAttribute } from 'models/project_attribute';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';

interface Props {
  isOpen: boolean,
  project: Project,
  maxSelect: number,
  projectAttributes: ProjectAttribute[],
  onClose: () => void,
  onSubmit: (attributeIds: number[]) => void,
}

const PopupPreDefinedList = memo((props: Props) => {
  const { isOpen, project, maxSelect, projectAttributes, onClose, onSubmit } = props;

  const { t } = useTranslation()

  const [expanded, setExpanded] = useState<number>()
  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributesSelected, setAttributesSelected] = useState<number[]>([])

  const handleClickCollapse = (item: Attribute) => {
    if (item.id === expanded) {
      setExpanded(null)
    } else {
      setExpanded(item.id)
    }
  }

  const onChange = (item: Attribute) => {
    if (isDisabled(item)) return
    let _attributesSelected = [...attributesSelected]
    if (_attributesSelected.includes(item.id)) {
      _attributesSelected = _attributesSelected.filter(it => it !== item.id)
    } else {
      _attributesSelected.push(item.id)
    }
    setAttributesSelected(_attributesSelected)
  }

  const _onSubmit = () => {
    if (!attributesSelected?.length) {
      onClose()
      return
    }
    onSubmit(attributesSelected)
  }

  useEffect(() => {
    if (!isOpen) {
      setExpanded(null)
      setAttributes([])
      setAttributesSelected([])
    }
  }, [isOpen])

  useEffect(() => {
    if (project?.solutionId && isOpen) {
      AdditionalAttributeService.getAdditionalAttributes({ take: 9999, typeId: AttributeType.PRE_DEFINED, solutionId: project.solutionId })
        .then((res) => {
          const ids = projectAttributes.map(it => it.attributeId)
          const data = (res.data as Attribute[]).filter(it => !ids.includes(it.id))
          setAttributes(data)
        })
    }
  }, [isOpen, project])

  const isDisabled = (item: Attribute) => {
    return !attributesSelected.includes(item.id) && maxSelect <= attributesSelected.length
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <p className={classes.title} translation-key="setup_survey_add_att_popup_pre_defined_title">{t('setup_survey_add_att_popup_pre_defined_title')}</p>
        <IconButton onClick={onClose}>
          <img src={Images.icClose} alt='' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <p translation-key="setup_survey_add_att_popup_pre_defined_sub_title">{t('setup_survey_add_att_popup_pre_defined_sub_title')}</p>
        <Grid className={classes.listNumberMobile}>
          <div className={classes.textMobile}>
            <p translation-key="setup_survey_add_att_start_point_label">{t('setup_survey_add_att_start_point_label')}</p>
            <p translation-key="setup_survey_add_att_end_point_label">{t('setup_survey_add_att_end_point_label')}</p>
          </div>
          <div className={classes.numberMobile}>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
        </Grid>
        {/* ==========================Mobile========================= */}

        <Grid container classes={{ root: classes.rootListMobile }}>
          {attributes.map((item, index: any) => (
            <Grid
              className={classes.attributesMobile}
              key={index}
              onClick={() => { handleClickCollapse(item) }}
              style={{ background: item.id === expanded ? '#EEEEEE' : '' }}
            >
              <Grid classes={{ root: classes.rootCollapseMobile }}>
                <Checkbox
                  disabled={isDisabled(item)}
                  checked={attributesSelected.includes(item.id)}
                  onChange={(e) => onChange(item)}
                  classes={{ root: classes.rootCheckboxMobile }}
                  onClick={e => e.stopPropagation()}
                  icon={<img src={Images.icCheck} alt="" />}
                  checkedIcon={<img src={Images.icCheckActive} alt="" />}
                />
                {item.id === expanded ? '' :
                  <p className={classes.titleAttributesMobile} >{item.start}</p>
                }
                <Collapse
                  in={item.id === expanded}
                  timeout={0}
                  unmountOnExit
                >
                  <div className={classes.CollapseAttributesMobile}>
                    <p translation-key="setup_survey_add_att_start_label">{t('setup_survey_add_att_start_label')}: <span>{item.start}</span></p>
                    <p translation-key="setup_survey_add_att_end_label">{t('setup_survey_add_att_end_label')}: <span>{item.end}</span></p>
                  </div>
                </Collapse >
              </Grid>
              <img style={{ transform: item.id === expanded ? 'rotate(180deg)' : 'rotate(0deg)' }} src={Images.icShowGray} alt='' />
            </Grid>
          ))}
        </Grid>
        {/* ==========================Desktop========================= */}

        <Grid container classes={{ root: classes.rootList }}>
          {attributes.map((item, index) => (
            <ListItem
              alignItems="center"
              component="div"
              key={index}
              classes={{ root: classes.rootListItem }}
              disablePadding
            >
              <ListItemText>
                <Grid className={clsx(classes.listFlex, { [classes.listFlexChecked]: attributesSelected.includes(item.id) })}>
                  <Grid>
                    <Checkbox
                      disabled={isDisabled(item)}
                      checked={attributesSelected.includes(item.id)}
                      onChange={(e) => onChange(item)}
                      classes={{ root: classes.rootCheckbox }}
                      icon={<img src={Images.icCheck} alt="" />}
                      checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                  </Grid>
                  <Grid item xs={4} className={classes.listTextLeft}>
                    <p>{item.start}</p>
                  </Grid>
                  <Grid item xs={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={4} className={classes.listTextRight}>
                    <p>{item.end}</p>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.btn}>
        <Buttons children={t('setup_survey_add_att_btn_add')} translation-key="setup_survey_add_att_btn_add" btnType='Blue' padding='10px 16px' width='25%' onClick={_onSubmit} />
      </DialogActions>
    </Dialog>
  );
});
export default PopupPreDefinedList;



