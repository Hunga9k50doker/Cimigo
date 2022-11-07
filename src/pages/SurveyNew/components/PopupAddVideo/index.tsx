import { useState, useMemo} from "react";
import {
  Dialog,
  Step,
  StepConnector,
  Stepper,
} from "@mui/material";
import classes from "./styles.module.scss";
import { useTranslation } from "react-i18next";
import Heading3 from "components/common/text/Heading3"
import ButtonCLose from "components/common/buttons/ButtonClose"
import {DialogTitle} from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import SmartDisplayOutlinedIcon from '@mui/icons-material/SmartDisplayOutlined';
import {IconInformation, IconScenesStep} from "components/svgs";
import UploadVideoFromDevice from "./components/UploadVideoFromDevice";
import UploadVideoFromYoutube from "./components/UploadVideoFromYoutube";
import { Video } from "models/video";
import * as yup from 'yup';
import {EAddVideoType} from  "models/adtraction_test";
import { RPStepLabel, RPStepIconBox} from "pages/SurveyNew/components";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import { AttachmentService } from "services/attachment";
import { setLoading, setErrorMess } from "redux/reducers/Status/actionTypes";
import { getVideosRequest } from "redux/reducers/Project/actionTypes";
import { useDispatch } from "react-redux";
import { Project } from "models/project";


export enum EStep {
  UPLOAD_VIDEO,
  INFORMATION,
  SCENES,
}


interface Props {
  isOpen: boolean;
  onClose: () => void;
  itemEdit?: Video;
  onSubmit: (data: FormData) => void;
  type?: number;
  project: Project;
}



const PopupAddVideo = (props: Props) => {

  const { onClose, isOpen, type, itemEdit, onSubmit, project} = props;

  const dispatch = useDispatch()
  
  const { t, i18n } = useTranslation();

  const steps = useMemo(() => {
    return [
      { id: EStep.UPLOAD_VIDEO, name: "Upload video", icon: <SmartDisplayOutlinedIcon/> },
      { id: EStep.INFORMATION, name: "Information", icon: <IconInformation/> },
      { id: EStep.SCENES, name: "Scenes", icon: <IconScenesStep/>, optional: "optional" },
    ];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const [activeStep, setActiveStep] = useState<EStep>(EStep.UPLOAD_VIDEO);

  const handleNextStep = () => {
    setActiveStep(EStep.INFORMATION);
   
  };

  const getUploadType = () => {
    switch (type) {
      case EAddVideoType.From_Device:
        return  <UploadVideoFromDevice
          onChangeStep={handleNextStep}
          onSubmit={onAddOrEditVideoFromDevice}
          project={project}
          // onSubmit={_onSubmit}
        />
      case EAddVideoType.From_Youtube:
        return <UploadVideoFromYoutube
          onChangeStep={handleNextStep}
          // onSubmit={onAddOrEditVideoFromDevice}
          onSubmit={_onSubmit}
        />
    }
  }
  const _onSubmit = () => {
   
  }

  const onAddOrEditVideoFromDevice = (data: Video) => {
    // dispatch(setLoading(true));
    // AttachmentService.create(data)
    //   .then(() => {
    //     dispatch(getVideosRequest(project.id))
    //   })
    //   .catch(e => dispatch(setErrorMess(e)))
    //   .finally(() => dispatch(setLoading(false)))
    console.log(data);
  } 
  console.log(onAddOrEditVideoFromDevice);

  const _onClose = () => {
    onClose()
  }


  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
        <DialogTitle>
          <Heading3 translation-key="">
            Upload video from device
          </Heading3>
          <ButtonCLose
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers>
            <Stepper
              alternativeLabel
              activeStep={activeStep}
              classes={{ root: classes.rootStepper }}
              connector={
                <StepConnector
                  classes={{
                    root: classes.rootConnector,
                    active: classes.activeConnector,
                  }}
                />
              }
            >
          {steps.map((item, index) => {
            return (
              <Step key={index}>     
                <RPStepLabel
                  icon={item.icon}
                  StepIconComponent={({ completed, active }) =>             
                    <>
                      {completed? <RPStepIconBox $active={completed} >{item.icon}</RPStepIconBox>
                      : <RPStepIconBox $active={active}>{item.icon}</RPStepIconBox>}       
                    </>               
                  }
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel,
                  }}
                >
                  {item.name}{" "}                    
                  <ParagraphExtraSmall $colorName={"--gray-60"}>
                      {item.optional}
                  </ParagraphExtraSmall>  
                </RPStepLabel>
              </Step>
            );
          })}
          </Stepper>
          {activeStep === EStep.UPLOAD_VIDEO && 
          <>{getUploadType()}</>
          }
        </DialogContent>
    </Dialog>
  );
};

export default PopupAddVideo;
