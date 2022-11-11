import { useMemo} from "react";
import {
  Grid,
} from "@mui/material";
import { useForm} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import Heading5 from "components/common/text/Heading5";
import InputTextfield from "components/common/inputs/InputTextfield";

export interface VideoYoutubeFormData {
  linkVideo: string;
}

interface Props {
  onChangeStep?: () => void;
  onSubmit: (data: FormData) => void;
}


// eslint-disable-next-line no-empty-pattern
const PopupStarRating = ({onChangeStep, onSubmit}: Props) => {
  const { t, i18n } = useTranslation();
  
  const schema = useMemo(() => {
    return yup.object().shape({
      linkVideo: yup.string().required("Video is required"),
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[i18n.language]);

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<VideoYoutubeFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data: VideoYoutubeFormData) => {
    const form = new FormData()
    if (data.linkVideo) form.append('linkVideo', data.linkVideo)
    onSubmit(form)
  }

  return (
    <>
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
        <ParagraphSmall $colorName="--eerie-black">If your video ads have been made public on YouTube, this is the preferred method. The advantage of this method is that you can upload large files with no size restrictions.</ParagraphSmall>
        <Grid
          className={classes.videoUp}
        >
            <Grid className={classes.boxUploading}> 
                <Grid className={classes.boxUploadingTitle}>
                  <Heading4 $colorName="--gray-90" className={classes.titleUploadFile}>Select video from Youtube</Heading4>
                  <ParagraphSmall $colorName="--gray-60">Enter your Youtube video link in the following box and press Load video button</ParagraphSmall>   
                </Grid>
                <Grid className={classes.boxUploadingFile}>
                  <Grid className={classes.boxInput}>
                    <InputTextfield
                    fullWidth
                    placeholder="e.g: https://youtu.be/PwO8ttltUqA"
                    inputRef={register("linkVideo")}
                    autoFocus
                    autoComplete="off"
                    type="text"
                    errorMessage={errors.linkVideo?.message}
                    />
                  </Grid> 
                    <Button btnType={BtnType.Primary} className={classes.btnUpload} type="submit">Load video</Button> 
                </Grid>
            </Grid>
            </Grid>
          <Grid sx={{mt: 2}}>
              <Heading5 className={classes.textTitleFooter} translation-key="">Youtube video requirements:</Heading5>
                <div className={classes.textInfo}>
                  <ParagraphSmall $colorName="--eerie-black" translation-key="">
                    The video from YouTube must be available in the <span>public mode.</span>.
                  </ParagraphSmall>
                </div>
                <div className={classes.textInfo}>
                  <ParagraphSmall $colorName="--eerie-black" translation-key="">Maximum video duration is <span>2 minutes</span>.</ParagraphSmall>
                </div>
          </Grid>
        </Grid>
      </>
  );
};

export default PopupStarRating;
