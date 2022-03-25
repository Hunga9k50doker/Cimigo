import React, { memo, useState } from 'react';
import { Checkbox, Collapse, Dialog, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";

const dataLists = [
  {
    firstText: "This pack is masculine",
    lastText: "This pack is femimine",
  },
  {
    firstText: "This pack suggests the brand setting the trends",
    lastText: "This pack suggests the brand mimics others",
  },
  {
    firstText: "Is a contemporary looking brand",
    lastText: "It is an old looking brand",
  },
  {
    firstText: "This pack is eye catching",
    lastText: "I would never notice this pack",
  },
  {
    firstText: "This pack suggests the brand setting the trends",
    lastText: "This pack suggests the brand setting the trends",
  },
  {
    firstText: "This pack is masculine",
    lastText: "This pack is femimine",
  },
  {
    firstText: "This pack suggests the brand setting the trends",
    lastText: "This pack suggests the brand mimics others",
  },
  {
    firstText: "Is a contemporary looking brand",
    lastText: "It is an old looking brand",
  },

]

interface PopupCreateFolderProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}


const PopupPreDefinedList = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen } = props;
  const [check, setCheck] = useState()
  const [selectedIndex, setSelectedIndex] = useState("")

  const handleClickCollapse = index => {
    if (selectedIndex === index) {
      setSelectedIndex("")
    } else {
      setSelectedIndex(index)
    }
  }

  const handleListItemClick = (e) => {
    setCheck(e);
  };

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Add attributes</p>
          <IconButton onClick={onClickCancel}>
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
            {dataLists.map((item, index: any) => (
              <Grid
                className={classes.attributesMobile}
                key={index}
                onClick={() => { handleClickCollapse(index) }}
                style={{ background: index === selectedIndex ? '#EEEEEE' : '' }}
              >
                <Grid classes={{ root: classes.rootCollapseMobile }}>
                  <Checkbox
                    onChange={(e) => handleListItemClick(e.target.checked)}
                    classes={{ root: classes.rootCheckboxMobile }}
                    onClick={e => e.stopPropagation()}
                    sx={{
                      color: "rgba(28, 28, 28, 0.4)",
                      '&.Mui-checked': {
                        color: "rgba(28, 28, 28, 0.4)",
                      },
                    }}
                  />
                  {index === selectedIndex ? '' :
                    <p className={classes.titleAttributesMobile} >{item.firstText}</p>
                  }
                  <Collapse
                    in={index === selectedIndex}
                    timeout="auto"
                    unmountOnExit
                  >
                    <div className={classes.CollapseAttributesMobile}>
                      <p>Start label: <span>{item.firstText}</span></p>
                      <p>End label: <span>{item.lastText}</span></p>
                    </div>
                  </Collapse >
                </Grid>
                <img style={{ transform: index === selectedIndex ? 'rotate(180deg)' : 'rotate(0deg)' }} src={Images.icShowGray} alt='' />
              </Grid>
            ))}
          </Grid>
          {/* ==========================Desktop========================= */}

          <Grid container classes={{ root: classes.rootList }}>
            {dataLists.map((item, index) => (
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
                        onChange={(e) => handleListItemClick(e.target.checked)}
                        classes={{ root: classes.rootCheckbox }}
                        icon={<img src={Images.icCheck} alt="" />}
                        checkedIcon={<img src={Images.icCheckActive} alt="" />} />
                    </Grid>
                    <Grid item xs={4} className={classes.listTextLeft}>
                      <p>{item.firstText}</p>
                    </Grid>
                    <Grid item xs={4} className={classes.listNumber}>
                      <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                    </Grid>
                    <Grid item xs={4} className={classes.listTextRight}>
                      <p>{item.lastText}</p>
                    </Grid>
                  </Grid>
                </ListItemText>
              </ListItem>
            ))}
          </Grid>
        </Grid>
        <Grid className={classes.btn}>
          <Buttons children="Add attributes" btnType='Blue' padding='13px 16px' width='25%' onClick={onClickCancel} />
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupPreDefinedList;



