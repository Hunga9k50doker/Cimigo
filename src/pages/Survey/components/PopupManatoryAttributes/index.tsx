import { memo, useEffect, useState } from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { Project } from 'models/project';

interface Props {
  isOpen: boolean,
  project: Project,
  onClose: () => void,
}


const PopupManatoryAttributes = memo((props: Props) => {
  const { isOpen, project, onClose } = props;

  const [attributes, setAttributes] = useState<Attribute[]>([])

  useEffect(() => {
    if (project?.solutionId) {
      AdditionalAttributeService.getAdditionalAttributes({ take: 9999, typeId: AttributeType.MANATORY, solutionId: project.solutionId })
        .then((res) => {
          setAttributes(res.data)
        })
    }
  }, [project])

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <p className={classes.title}>Manatory attributes</p>
        <IconButton onClick={onClose}>
          <img src={Images.icClose} alt='icon close' />
        </IconButton>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
        <p>Consumers will be asked their associations with the pack tested to all of the following mandatory attributes.</p>
        <Grid container classes={{ root: classes.rootList }}>
          {attributes.map((item) => (
            <ListItem
              alignItems="center"
              component="div"
              key={item.id}
              classes={{ root: classes.rootListItem }}
              disablePadding
            >
              <ListItemText>
                <Grid className={classes.listFlex}>
                  <Grid item xs={12} sm={4} className={classes.listTextLeft}>
                    <p>{item.start}</p>
                  </Grid>
                  <Grid item xs={12} sm={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={12} sm={4} className={classes.listTextRight}>
                    <p>{item.end}</p>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions className={classes.btn}>
        <Buttons children="Close" btnType='Blue' padding='10px 16px' width='25%' onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
});
export default PopupManatoryAttributes;



