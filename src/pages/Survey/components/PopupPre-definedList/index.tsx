import { memo, useEffect, useState } from 'react';
import { Collapse, Dialog, Grid, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';
import Images from "config/images";
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Project } from 'models/project';
import { ProjectAttribute } from 'models/project_attribute';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphSmall from 'components/common/text/ParagraphSmall';
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import ParagraphBody from 'components/common/text/ParagraphBody';
import InputCheckBox from 'components/common/inputs/InputCheckbox';

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      <DialogTitle>
        <Heading3 translation-key="setup_survey_add_att_popup_pre_defined_title">{t('setup_survey_add_att_popup_pre_defined_title')}</Heading3>
        <ButtonClose onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <ParagraphBody $colorName="--eerie-black" translation-key="setup_survey_add_att_popup_pre_defined_sub_title">{t('setup_survey_add_att_popup_pre_defined_sub_title')}</ParagraphBody>
        <Grid className={classes.listNumberMobile}>
          <div className={classes.textMobile}>
            <ParagraphExtraSmall translation-key="setup_survey_add_att_start_point_label">{t('setup_survey_add_att_start_point_label')}</ParagraphExtraSmall>
            <ParagraphExtraSmall translation-key="setup_survey_add_att_end_point_label">{t('setup_survey_add_att_end_point_label')}</ParagraphExtraSmall>
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
                <InputCheckBox
                  disabled={isDisabled(item)}
                  checked={attributesSelected.includes(item.id)}
                  onChange={(e) => onChange(item)}
                  classes={{ root: classes.rootCheckbox }}
                  onClick={e => e.stopPropagation()}
                />
                {item.id === expanded &&
                  <ParagraphSmall $colorName="--eerie-black" className={classes.titleAttributesMobile} >{item.start}</ParagraphSmall>
                }
                <Collapse
                  in={item.id === expanded}
                  timeout={0}
                  unmountOnExit
                >
                  <div>
                    <ParagraphExtraSmall sx={{fontWeight: '600 !important', marginBottom:'10px'}} $colorName="--eerie-black" translation-key="setup_survey_add_att_start_label">{t('setup_survey_add_att_start_label')}: &nbsp;<ParagraphExtraSmall sx={{display: 'inline'}}>{item.start}</ParagraphExtraSmall></ParagraphExtraSmall>
                    <ParagraphExtraSmall sx={{fontWeight: '600 !important'}}$colorName="--eerie-black" translation-key="setup_survey_add_att_end_label">{t('setup_survey_add_att_end_label')}:&nbsp;<ParagraphExtraSmall sx={{display: 'inline'}}>{item.end}</ParagraphExtraSmall></ParagraphExtraSmall>
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
              classes={{ root: clsx(classes.rootListItem, {[classes.disabled]: isDisabled(item)}) }}
              disablePadding
              onClick={() => onChange(item)}
            >
              <ListItemText>
                <Grid className={clsx(classes.listFlex, { [classes.listFlexChecked]: attributesSelected.includes(item.id) })}>
                  <Grid>
                    <InputCheckBox
                      disabled={isDisabled(item)}
                      checked={attributesSelected.includes(item.id)}
                      classes={{ root: classes.rootCheckbox }}
                      />
                  </Grid>
                  <Grid item xs={4} className={classes.listTextLeft}>
                    <ParagraphExtraSmall $colorName="--eerie-black">{item.start}</ParagraphExtraSmall>
                  </Grid>
                  <Grid item xs={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={4} className={classes.listTextRight}>
                    <ParagraphExtraSmall $colorName="--eerie-black">{item.end}</ParagraphExtraSmall>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions> 
      <Button className={classes.btn} children={t('setup_survey_add_att_btn_add')} translation-key="setup_survey_add_att_btn_add" btnType={BtnType.Raised} onClick={_onSubmit}/>
      </DialogActions>
    </Dialog>
  );
});
export default PopupPreDefinedList;



