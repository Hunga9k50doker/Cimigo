import { memo, useState, useMemo, useEffect } from 'react';
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
  }

  const openMenuEmail = (event) => {
    setAnchorEl(event.currentTarget);
  }

  const onPrint = () => {
    var fileToLoad:any = project?.solution?.howToSetUpSurveyFile
    var fileReader = new FileReader();
    var base64;
    if(typeof(fileToLoad) === 'object'){
    fileReader.onload = (fileLoadEvent) => {
        base64 = fileLoadEvent.target.result;
        const pdfBlob = new Blob([base64], {type: 'application/pdf'});
        const url = URL.createObjectURL(pdfBlob);
        printJS({
            printable: url, 
            type: 'pdf', 
            base64: true,
        })
    };
    fileReader.readAsDataURL(fileToLoad);
  }
  }
  const _onClose = () => {
    onClose()
  }

  const _onSubmit = () => {

  }

  useEffect(() => {
    if (!isOpen) {
      clearForm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])
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
                {/* {project.solution?.howToSetUpSurveyDialogTitle} */}
            </Heading3>
        </Grid>
        <ButtonClose onClick={onClose}>
        </ButtonClose>
      </DialogTitle>
      <DialogContent dividers>
        <Grid sx={{paddingBottom: '24px'}}>
            <Grid sx={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '24px'}}>
                <Heading2 $colorName="--cimigo-blue">
                    {/* {project.solution?.howToSetUpSurveyPageTitle} */}
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
                            vertical: 230,
                            horizontal: 611,
                        }}
                        transformOrigin={{
                            vertical:180,
                            horizontal: 925,
                        }}
                        className={classes.popOverEmail}
                        >
                            <form onSubmit={handleSubmit(_onSubmit)}>
                            <Grid sx={{display: 'flex', padding: '10px', alignItems: 'flex-start', background: 'var(--gray-5)'}}>
                                <Grid container spacing={1} direction="column" sx={{marginRight: '10px'}}>
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
                                <Button btnType={BtnType.Primary} type="submit"  >
                                    <NearMeIcon fontSize="small" sx={{marginRight: '7px'}}/>
                                <TextBtnSmall transition-key="">Send</TextBtnSmall>
                                </Button>
                            </Grid>   
                            </form>                       
                        </Popover>
                    </Grid>
                </Grid>
            </Grid>
            <Grid className={classes.contentContainer}>
                {/* <ParagraphBody dangerouslySetInnerHTML={{ __html: project.solution?.howToSetUpSurveyContent || '' }}></ParagraphBody> */}
            </Grid>
        </Grid>
      </DialogContent>
    </Dialog>
  );
});
export default PopupHowToSetupPackTestSurvey;



