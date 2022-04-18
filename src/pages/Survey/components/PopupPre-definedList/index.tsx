import { memo, useEffect, useState } from 'react';
import { Checkbox, Collapse, Dialog, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Project } from 'models/project';
import { ProjectAttribute } from 'models/project_attribute';

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
    if (maxSelect <= attributesSelected.length) return
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
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Add attributes</p>
          <IconButton onClick={onClose}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p>The following list of attributes are pre-defined by Cimigo over projects. Your may select the attributes that might be relevant to your project.</p>
          <Grid className={classes.listNumberMobile}>
            <div className={classes.textMobile}>
              <p>Start point label</p>
              <p>End point label</p>
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
                      <p>Start label: <span>{item.start}</span></p>
                      <p>End label: <span>{item.end}</span></p>
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
                  <Grid className={classes.listFlex}>
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
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Add attributes" btnType='Blue' padding='10px 16px' width='25%' onClick={_onSubmit} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupPreDefinedList;



