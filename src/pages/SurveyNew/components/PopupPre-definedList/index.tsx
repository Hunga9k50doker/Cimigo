import { memo, useEffect, useMemo, useState } from 'react';
import { Chip, Collapse, Dialog, Grid, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import classes from './styles.module.scss';
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
import InputCheckbox from 'components/common/inputs/InputCheckbox';
import { ExpandLess, ExpandMore, UnfoldMore, UnfoldLess } from '@mui/icons-material';
import { ReactComponent as ArrowBreak } from 'assets/img/icon/arrow-break.svg';
import _ from 'lodash';

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

  const [attributes, setAttributes] = useState<Attribute[]>([])
  const [attributesSelected, setAttributesSelected] = useState<number[]>([])
  const [attributesSelectedByCategory, setAttributesSelectedByCategory] = useState({})
  const [openAttributeCategory, setOpenAttributeCategory] = useState([]);

  const handleClick = (index) => {
    const tempOpen = [...openAttributeCategory]
    tempOpen[index] = !tempOpen[index]
    setOpenAttributeCategory(tempOpen);
  };
  
  const handleExpandAll = () => {
    const tempOpen = openAttributeCategory.map( ()=> true)
    setOpenAttributeCategory(tempOpen);
  };
  
  const handleCollapseAll = () => {
    const tempOpen = openAttributeCategory.map(() => false)
    setOpenAttributeCategory(tempOpen);
  };

  const onChange = (item: Attribute) => {
    if (isDisabled(item)) return
    let _attributesSelected = [...attributesSelected]
    if (_attributesSelected.includes(item.id)) {
      _attributesSelected = _attributesSelected.filter(it => it !== item.id)
      if(item?.category){
        setAttributesSelectedByCategory((prev) => ({...prev, [item.category.id] : attributesSelectedByCategory[item.category.id] - 1}))
      } else {
        setAttributesSelectedByCategory((prev) => ({...prev, undefined : attributesSelectedByCategory["undefined"] - 1}))
      }
    } else {
      _attributesSelected.push(item.id)
      if(item?.category){
        setAttributesSelectedByCategory((prev) => ({...prev, [item.category.id] : attributesSelectedByCategory[item.category.id] + 1}))
      } else {
        setAttributesSelectedByCategory((prev) => ({...prev, undefined : attributesSelectedByCategory["undefined"] + 1}))
      }
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

  const listAttributes = useMemo(()=>{
    return _.groupBy(attributes, (item)=>item?.category?.id)
  }, [attributes])

  useEffect(()=>{
    let tempOpen = []
    let tempAttributesSelectedByCategory = {}
    Object.keys(listAttributes).map((att) => {
      tempOpen.push(false)
      tempAttributesSelectedByCategory = {...tempAttributesSelectedByCategory, [att]: 0}
      setAttributesSelectedByCategory(tempAttributesSelectedByCategory)
    })
    setOpenAttributeCategory(tempOpen)
  }, [listAttributes])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle $bgColor="--white">
        <Heading3 $colorName="--gray-90" translation-key="setup_survey_add_att_popup_pre_defined_title">Add attributes</Heading3>
        <ButtonClose $backgroundColor="--eerie-black-5" $colorName="--eerie-black-40" onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <ParagraphBody $colorName="--eerie-black" translation-key="setup_survey_add_att_popup_pre_defined_sub_title">{t('setup_survey_add_att_popup_pre_defined_sub_title')}</ParagraphBody>
        <ParagraphSmall $colorName="--gray-80" className={classes.unfoldWrapper}>
          <div className={classes.unfoldItemWrapper} onClick={handleExpandAll}>
            <UnfoldMore/> Expand all
          </div>
          <div className={classes.lineDivide}></div>
          <div className={classes.unfoldItemWrapper} onClick={handleCollapseAll}>
            <UnfoldLess/> Collapse all
          </div>
        </ParagraphSmall>

        <Grid container classes={{ root: classes.rootList }}>
          {
            Object.keys(listAttributes).map((item, indexCategory)=>{
              return (
                <div key={indexCategory}>
                  <ListItemButton classes={{ root: clsx(classes.rootListItem) }} onClick={()=>handleClick(indexCategory)}>
                    <ListItemText classes={{ root: clsx(classes.attributeTitle) }} primary={item === "undefined" ? "Other" : listAttributes[item][0]?.category?.name} />
                    <Chip
                      sx={{ height: 24, backgroundColor: "var(--cimigo-blue-light-4)", "& .MuiChip-label": { px: 2 } }}
                      label={<ParagraphSmall $colorName="--cimigo-blue-dark-1">{listAttributes[item].length}</ParagraphSmall>}
                      color="secondary"
                      classes={{ root: classes.numberOfAttibute }}
                    />
                    <ParagraphSmall $colorName="--cimigo-blue" className={classes.numberOfSelected}>{attributesSelectedByCategory[item]} selected</ParagraphSmall>
                    {openAttributeCategory[indexCategory] ? <ExpandLess /> : <ExpandMore />}
                  </ListItemButton>
                  <Collapse in={openAttributeCategory[indexCategory]} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                      {listAttributes[item]?.map((item, index) => (
                        <ListItem
                          alignItems="center"
                          component="div"
                          key={item?.id}
                          classes={{ root: clsx(classes.rootListItem, {[classes.disabled]: isDisabled(item)}) }}
                          disablePadding
                          onClick={() => onChange(item)}
                        >
                          {item?.contentTypeId === 1 ? (
                            <ListItemText>
                              <Grid className={clsx(classes.listFlex, { [classes.listFlexChecked]: attributesSelected.includes(item.id) })}>
                                <Grid>
                                  <InputCheckbox
                                    disabled={isDisabled(item)}
                                    checked={attributesSelected.includes(item.id)}
                                    classes={{ root: classes.rootCheckbox }}
                                    />
                                </Grid>
                                <Grid item>
                                  <ParagraphExtraSmall $colorName="--eerie-black">{item.start}</ParagraphExtraSmall>
                                </Grid>
                              </Grid>
                            </ListItemText>
                          ) : (
                            <ListItemText>
                              <Grid className={clsx(classes.listFlex, { [classes.listFlexChecked]: attributesSelected.includes(item.id) })}>
                                <Grid>
                                  <InputCheckbox
                                    disabled={isDisabled(item)}
                                    checked={attributesSelected.includes(item.id)}
                                    classes={{ root: classes.rootCheckbox }}
                                    />
                                </Grid>
                                <Grid item xs={4} className={classes.listTextLeft}>
                                  <ParagraphExtraSmall $colorName="--eerie-black">{item.start}</ParagraphExtraSmall>
                                </Grid>
                                <Grid item xs={4} className={classes.arrowBreak}>
                                  <ArrowBreak/>
                                </Grid>
                                <Grid item xs={4} className={classes.listTextRight}>
                                  <ParagraphExtraSmall $colorName="--eerie-black">{item.end}</ParagraphExtraSmall>
                                </Grid>
                              </Grid>
                            </ListItemText>
                          )}
                        </ListItem>
                      ))}
                    </List>
                  </Collapse>
                </div>
              )
            })
          }
        </Grid> 
      </DialogContent>
      <DialogActions className={classes.dialogActionsWrapper}> 
        <ParagraphSmall $colorName="--cimigo-blue-dark-2" className={classes.remaining}>Remaining: {maxSelect - attributesSelected.length}</ParagraphSmall>
        <Button className={clsx(classes.btn, classes.hideOnMobile)} children={t('common_cancel')} translation-key="common_cancel" btnType={BtnType.Secondary} onClick={onClose}/>
        <Button className={clsx(classes.btn, classes.btnAdd)} children="Add" translation-key="setup_survey_add_att_btn_add" btnType={BtnType.Raised} onClick={_onSubmit}/>
        <Button className={clsx(classes.btn, classes.hideOnDesktop)} children={t('common_cancel')} translation-key="common_cancel" btnType={BtnType.Secondary} onClick={onClose}/>
      </DialogActions>
    </Dialog>
  );
});
export default PopupPreDefinedList;
