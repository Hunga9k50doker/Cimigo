import { memo, useState, useMemo, useEffect } from 'react';
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes"
import printJS from "print-js";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import {  Dialog, Grid } from '@mui/material';
import Popover from '@mui/material/Popover';
import HelpIcon from '@mui/icons-material/Help';
import PrintIcon from '@mui/icons-material/Print';
import NearMeIcon from '@mui/icons-material/NearMe';
import ForwardToInboxTwoToneIcon from '@mui/icons-material/ForwardToInboxTwoTone';
import classes from './styles.module.scss';
import { Project } from 'models/project';
import { useTranslation } from 'react-i18next';
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import Heading3 from "components/common/text/Heading3";
import Heading2 from "components/common/text/Heading2";
import TextBtnSmall from 'components/common/text/TextBtnSmall';
import ButtonClose from "components/common/buttons/ButtonClose";
import InputTextField from "components/common/inputs/InputTextfield";
import Button, {BtnType} from "components/common/buttons/Button";
import ParagraphBody from 'components/common/text/ParagraphBody';
import { AttachmentService } from 'services/attachment';
import {ProjectService} from 'services/project';
interface EmailForm {
    name: string,
    email: string,
}
interface Props {
  isOpen: boolean,
  project: Project,
  onClose: () => void,
}

const PopupHowToSetupPackTestSurvey = memo((props: Props) => {
  const { isOpen, project, onClose } = props;

  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()
  
  const [anchorEl, setAnchorEl] = useState(null);

  const schema = useMemo(() => {
    return yup.object().shape({
      name: yup.string().required("Name is required"),
      email: yup.string()
      .email(t("field_email_vali_email"))
      .required(t("field_email_vali_required")),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EmailForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const clearForm = () => {
    reset({
      name: "",
      email: ""
    })
  };

  const handleClosePopoverEmail = () => {
    setAnchorEl(null);
    clearForm();
  }

  const openMenuEmail = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const onPrint = () => {
    dispatch(setLoading(true))
    AttachmentService.blobToBase64(project.solution?.howToSetUpSurveyFile)
    .then(res => {
      printJS({
        printable: res,
        type: 'pdf',
        base64: true,
      })
    })
    .catch((e) => dispatch(setErrorMess(e)))
    .finally(() => dispatch(setLoading(false)))
  }

  const _onClose = () => {
    onClose()
  }

  const _onSubmit = (data: EmailForm) => {
    dispatch(setLoading(true))
    ProjectService.sendEmailHowToSetupSurvey(data.name, data.email)
      .then(() => {
        dispatch(setSuccessMess("Send email successfully!"))
        handleClosePopoverEmail()
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  };

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={_onClose}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle>
        <Grid sx={{display: 'flex', alignItems: 'center'}}>
            <HelpIcon sx={{marginRight: '19px'}}/>
            <Heading3 translation-key="">
                {project.solution?.howToSetUpSurveyDialogTitle}
            </Heading3>
        </Grid>
        <ButtonClose onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent dividers>
        <Grid sx={{paddingBottom: '24px'}}>
            <Grid sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px'}}>
                <Heading2 $colorName="--cimigo-blue">
                    {project.solution?.howToSetUpSurveyPageTitle}
                </Heading2>
                <Grid className={classes.iconContainer}>
                    <div className={classes.iconAction} onClick={onPrint}>
                        <PrintIcon/>
                    </div>
                    <Grid>
                        <div onClick={openMenuEmail} className={classes.iconAction}>
                            <ForwardToInboxTwoToneIcon/>
                        </div>
                        <Popover
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleClosePopoverEmail}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        className={classes.popOverEmail}
                        >
                            <Grid sx={{padding: '10px', background: 'var(--gray-5)'}} component="form" onSubmit={handleSubmit(_onSubmit)}>
                                <Grid container spacing={1} direction="column">
                                  <Grid item>
                                    <InputTextField
                                        translation-key-placeholder=""
                                        placeholder="Enter your name"
                                        autoFocus={true}
                                        inputProps={{tabIndex: 1}}
                                        type="text"
                                        autoComplete="off"
                                        inputRef={register('name')}
                                        errorMessage={errors.name?.message}
                                    />
                                  </Grid>
                                  <Grid item>
                                    <InputTextField
                                        translation-key-placeholder="field_email_placeholder"
                                        placeholder={t("field_email_placeholder")}
                                        type="text"
                                        inputProps={{tabIndex: 2}}
                                        autoComplete="off"
                                        inputRef={register('email')}
                                        errorMessage={errors.email?.message}
                                    />
                                  </Grid>
                                </Grid>
                                <Button btnType={BtnType.Primary} type="submit" sx={{marginTop: '8px'}}>
                                    <NearMeIcon fontSize="small" sx={{marginRight: '7px'}}/>
                                <TextBtnSmall transition-key="">Send</TextBtnSmall>
                                </Button>
                            </Grid>                        
                        </Popover>
                    </Grid>
                </Grid>
            </Grid>
            <Grid className={classes.contentContainer}>
                <ParagraphBody dangerouslySetInnerHTML={{ __html: project.solution?.howToSetUpSurveyContent || '' }}></ParagraphBody>
            </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});
export default PopupHowToSetupPackTestSurvey;



