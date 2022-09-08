import { memo, useEffect, useState } from 'react';
import { Dialog, Grid, ListItem, ListItemText } from '@mui/material';
import classes from './styles.module.scss';
import { AdditionalAttributeService } from 'services/additional_attribute';
import { Attribute, AttributeType } from 'models/Admin/attribute';
import { Project } from 'models/project';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ButtonClose from "components/common/buttons/ButtonClose";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphExtraSmall from 'components/common/text/ParagraphExtraSmall';
import ParagraphBody from 'components/common/text/ParagraphBody';
interface Props {
  isOpen: boolean,
  project: Project,
  onClose: () => void,
}


const PopupManatoryAttributes = memo((props: Props) => {
  const { isOpen, project, onClose } = props;
  const { t } = useTranslation()

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
      <DialogTitle>
        <Heading3 translation-key="setup_survey_add_att_popup_m_att_title">{t('setup_survey_add_att_popup_m_att_title')}</Heading3>
        <ButtonClose onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent className={classes.body} dividers>
      <ParagraphBody $colorName="--eerie-black" translation-key="setup_survey_add_att_popup_m_att_sub_title">{t('setup_survey_add_att_popup_m_att_sub_title')}</ParagraphBody>
        <Grid container sx={{paddingTop:"24px"}}>
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
                    <ParagraphExtraSmall $colorName="--eerie-black">{item.start}</ParagraphExtraSmall>
                    <ParagraphExtraSmall $colorName="--eerie-black" className={classes.listTextRightMoblie}>{item.end}</ParagraphExtraSmall>
                  </Grid>
                  <Grid item xs={12} sm={4} className={classes.listNumber}>
                    <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                  </Grid>
                  <Grid item xs={12} sm={4} className={classes.listTextRight}>
                  <ParagraphExtraSmall $colorName="--eerie-black">{item.end}</ParagraphExtraSmall>
                  </Grid>
                </Grid>
              </ListItemText>
            </ListItem>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button className={classes.btn} children={t('common_close')} translation-key="common_close" btnType={BtnType.Raised} width="123px" onClick={onClose} />
      </DialogActions>
    </Dialog>
  );
});
export default PopupManatoryAttributes;



