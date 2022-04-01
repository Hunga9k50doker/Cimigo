import { memo, useState, useEffect } from 'react';
import { Collapse, Dialog, Grid, IconButton, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';

import Buttons from 'components/Buttons';
import Images from "config/images";
import { UserAttribute } from 'models/user_attribute';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from 'react-hook-form';
import Inputs from 'components/Inputs';

const schema = yup.object().shape({
  start: yup.string().required('Start is required.'),
  end: yup.string().required('End is required.'),
})

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
      open={isAdd || !!itemEdit}
      onClose={onCancel}
      classes={{ paper: classes.paper }}
    >
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid className={classes.root}>
          <Grid className={classes.header}>
            <p className={classes.title}>{itemEdit ? 'Edit your own attribute' : 'Add your own attribute'}</p>
            <IconButton onClick={onCancel}>
              <img src={Images.icClose} alt='' />
            </IconButton>
          </Grid>
          <Grid className={classes.body}>
            <p>Your attribute will be asked as a 10-point scales. Please enter the start point label corresponds to 1, and the end point label corresponds to 10 in the boxes below. Also add the local translation for those labels, they will be used in the survey to elicit responses from consumers.</p>
            <Grid className={classes.listNumberMobile}>
              <div className={classes.textMobile}>
                <p>Start label</p>
                <p>End label</p>
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
                        title="Start point label"
                        name="start"
                        placeholder="Enter product brand"
                        inputRef={register('start')}
                        errorMessage={errors.start?.message}
                      />
                    </Grid>
                    <Grid item xs={4} className={classes.listNumber}>
                      <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                    </Grid>
                    <Grid item xs={4} className={classes.listTextRight}>
                      <Inputs
                        title="End point label"
                        name="end"
                        placeholder="Enter end point label"
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
                    fontWeight: expanded ? 600 : 400,
                    marginLeft: expanded ? "0px" : "12px"
                  }}>
                  How to write a good scale question?
                </p>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                  <p>Cimigo recommend that as a minimum that you add descriptions to the start and end points. Scales are shown from left (with lowest number) to right (with highest numbers) and we recommend the lowest number being the negative or disagree end of your scale whilst the highest number is the positive agree end of the scale. Alternatively, you may have opposing characteristics anchored at either end of the scale.</p>
                </Collapse>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.btn}>
            <Buttons type="submit" children={itemEdit ? 'Edit attribute' : 'Add attribute'} btnType='Blue' padding='13px 16px' />
          </Grid>
        </Grid>
      </form>
    </Dialog>
  );
});
export default PopupAddOrEditAttribute;



