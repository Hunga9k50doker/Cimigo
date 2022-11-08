import { useState, useEffect, useCallback } from "react";
import {
  duration,
  Grid,
} from "@mui/material";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import Button, { BtnType } from "components/common/buttons/Button"
import { fData } from 'utils/formatNumber';
import ErrorMessage from "components/common/text/ErrorMessage";
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { IconPlayMini } from "components/svgs";
import { useDropzone } from "react-dropzone";
import useIsMountedRef from "hooks/useIsMountedRef";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import ErrorTwoToneIcon from '@mui/icons-material/ErrorTwoTone';
import Heading5 from "components/common/text/Heading5";
import { LinearProgressWithLabel } from "../LinearProgressWithLabel";
import { Attachment, AttachmentObjectTypeId, FileUpload } from "models/attachment";
import { v4 as uuidv4 } from 'uuid';
import { Video } from "models/video";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { AttachmentService } from "services/attachment";
import { getVideosRequest } from "redux/reducers/Project/actionTypes";
import { useDispatch } from "react-redux";
import { Project } from "models/project";


const VIDEO_SIZE= 15 * 10000000;// bytes
const FILE_FORMAT = ["video/mp4", "video/avi", "video/webm", "video/x-ms-wmv", "video/x-flv", "video/mpeg", "video/quicktime", "video/x-m4v"];
const VIDEO_DURATION = 120 //seconds;
interface VideoFormData {
  video: FileUpload;
  duration: any;
}
interface Props {
  onSubmit: (data: Video) => void;
  onChangeStep?: () => void;
  project: Project;
}



// eslint-disable-next-line no-empty-pattern
const UploadVideoFromDevice= ({onSubmit, onChangeStep, project}: Props) => {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch()

  const [progress, setProgress] = useState(10);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState<string>('');
  const [fileReview, setFileReview] = useState<File>(null);
  const isMountedRef = useIsMountedRef();

  const schema = yup.object().shape({
    video: yup.mixed().required("Video is required"),
    duration: yup.number().required("Duration is required"),
  })

  const { handleSubmit, setValue } = useForm<VideoFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const convertFile = (file: File): FileUpload => {
    return {
      id: uuidv4(),
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      file: file,
      isNew: true
    }
  }


  const isValidDuration = async (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        const video = document.createElement("video");
        video.src = e.target.result as string;
        video.ondurationchange = function() {
          const duration = video.duration
          resolve(duration <= VIDEO_DURATION)
        };
        video.onerror = function () {
          resolve(false)
        }
      }
      reader.onerror = function () {
        resolve(false)
      }
    })
  }

  const getDuration = (file: File) => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsDataURL(file);
      reader.onload = function (e) {
        const video = document.createElement("video");
        video.src = e.target.result as string;
        video.ondurationchange = function() {
          const duration = video.duration
          resolve(duration)
        };
      }
    })
  }
  
  const handleDrop = useCallback(
    async (acceptedFiles) => {
      let file = convertFile(acceptedFiles[0]);
      const checkSize = file.file.size < VIDEO_SIZE;
      const checkType = FILE_FORMAT.includes(file.file.type);
      const checkDuration = await isValidDuration(file.file)
      const duration = Number(await getDuration(file.file))
      if (!checkSize) {
        setIsError('size-invalid');
        return
      }
      if (!checkType) {
        setIsError('type-invalid');
        return
      }
      if (!checkDuration) {
        setIsError('duration-invalid');
        return
      }
      setIsError('');
      setIsLoading(true);
      setFileReview(file.file)
      setValue("video", file);
      setValue("duration", duration);
      const data: Video = {
            id: file.id,
            duration: duration,
        }
      onSubmit(data);
      const config = {
        onUploadProgress: function (progress) {
          const percentCompleted = Math.round((progress.loaded / progress.total) * 100);
          setProgress(percentCompleted);
        }
      }
      dispatch(setLoading(true));
      AttachmentService.create(data)
        .then(() => {
          dispatch(getVideosRequest(project.id))
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
      setIsLoading(false);
      // onChangeStep();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isMountedRef]
  );

  const {
    getRootProps,
    getInputProps,
  } = useDropzone({
    onDrop: handleDrop,
    multiple: false,
  });

  return (
    <>
    <form>
        <ParagraphSmall $colorName="--eerie-black">Upload your video ads that you want test.</ParagraphSmall>
        <Grid
          className={classes.videoUp}
          {...getRootProps()}
        >
          <input {...getInputProps()} />
            {isLoading && (
            <Grid className={classes.boxUploading}> 
                <Grid className={classes.boxUploadingTitle}>
                  <Heading4 $colorName="--gray-90">Uploading your video</Heading4>
                  <ParagraphSmall $colorName="--gray-60">We are uploading your video file, please wait...</ParagraphSmall>   
                </Grid>
                <Grid className={classes.boxUploadingFile}>
                  <IconPlayMini/>
                  <Grid sx={{marginLeft: "8px"}}>
                    <Grid sx={{display: "flex"}}>
                      <ParagraphExtraSmall $colorName="--gray-40">{fileReview?.name}</ParagraphExtraSmall>
                      <ParagraphExtraSmall $colorName="--gray-50" sx={{ml: 1}}>{fData(fileReview?.size)}</ParagraphExtraSmall>
                    </Grid>
                    <LinearProgressWithLabel value={progress} />    
                  </Grid>
                </Grid>
            </Grid>
            )}
            {!fileReview &&
              <Grid className={classes.contentUpload}>               
              <CloudUploadOutlinedIcon/>
              <ParagraphSmall $colorName="--gray-90" sx={{mt: 2}}>Drag & drop video file to upload</ParagraphSmall>
              <ParagraphSmall $colorName="--gray-60">Your video file will be kept securely and used only in your survey.</ParagraphSmall>               
              {isError === 'size-invalid' && 
              <Grid className={classes.boxError}>
                <ErrorTwoToneIcon/>
                <ErrorMessage>{`File is larger than ${fData(VIDEO_SIZE)}`}</ErrorMessage>
              </Grid> 
              }
              {isError === 'type-invalid' && 
              <Grid className={classes.boxError}>
                <ErrorTwoToneIcon/>
                <ErrorMessage>Invalid file format</ErrorMessage>
              </Grid> 
              }
              {isError === 'duration-invalid' && 
              <Grid className={classes.boxError}>
                <ErrorTwoToneIcon/>
                <ErrorMessage>Maximum video duration is 2 minutes</ErrorMessage>
              </Grid> 
              }
                <Button btnType={BtnType.Primary} sx={{mt: 2}}>Select your video file...</Button>
              </Grid>
              }
            </Grid>
          <Grid sx={{mt: 2}}>
              <Heading5 className={classes.textTitleFooter} translation-key="">Video upload instructions:</Heading5>
                <div className={classes.textInfo}>
                <ParagraphSmall $colorName="--eerie-black" translation-key="">
                  The recommended video format is the <span>.MP4 file type</span>.
                </ParagraphSmall>
                </div>
                <div className={classes.textInfo}>
                  <ParagraphSmall $colorName="--eerie-black" translation-key="">The file size must be <span>less than 150MB</span>.</ParagraphSmall>
                </div>
                <div className={classes.textInfo}>
                  <ParagraphSmall $colorName="--eerie-black" translation-key="">Maximum video duration is <span>2 minutes</span>.</ParagraphSmall>
                </div>
                <Button btnType={BtnType.Primary} type="submit">Submit</Button>
          </Grid>
         
      </form>
    </>
  );
};

export default UploadVideoFromDevice;
