import React, { memo } from 'react';
import { Dialog, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
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
  {
    firstText: "This pack is eye catching",
    lastText: "I would never notice this pack",
  },
  {
    firstText: "This pack suggests the brand setting the trends",
    lastText: "This pack suggests the brand setting the trends",
  }
]

interface PopupCreateFolderProps {
  onClickCancel?: () => void,
  onClickOpen?: boolean,
}


const PopupManatoryAttributes = memo((props: PopupCreateFolderProps) => {
  const { onClickCancel, onClickOpen } = props;

  return (
    <Dialog
      open={onClickOpen}
      classes={{ paper: classes.paper }}
    >
      <Grid className={classes.root}>
        <Grid className={classes.header}>
          <p className={classes.title}>Manatory attributes</p>
          <IconButton onClick={onClickCancel}>
            <img src={Images.icClose} alt='' />
          </IconButton>
        </Grid>
        <Grid className={classes.body}>
          <p>Consumers will be asked their associations with the pack tested to all of the following mandatory attributes.</p>
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
          <Grid className={classes.btn}>
            <Buttons children="Close" btnType='Blue' padding='13px 16px' width='25%' onClick={onClickCancel} />
          </Grid>
        </Grid>
      </Grid>
    </Dialog>
  );
});
export default PopupManatoryAttributes;



