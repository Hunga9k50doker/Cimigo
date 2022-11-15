import { useEffect, useMemo } from "react";
import {
  Grid,
  Box,
} from "@mui/material";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphBody from "components/common/text/ParagraphBody";
import SubTitle from "components/common/text/SubTitle";
import InputLineTextfield from "components/common/inputs/InputLineTextfield";
import Heading6 from "components/common/text/Heading6";
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import CloseIcon from '@mui/icons-material/Close';
import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import { IconBranding, IconMessage, IconProduct } from "components/icons";
import { EVIDEO_TYPE, VIDEO_UPLOAD_STEP, VIDEO_YOUTUBE_STEP, INFORMATION_STEP, SCENES_STEP } from "models/video";
import moment from "moment";
import TimePicker from "components/common/inputs/TimePicker";

const MAX_SCENES = 20;

export interface ScenesForm {
  scenes: {
    id?: number;
    name: string;
    startTime: Date;
    endTime: Date;
  }[];
}

const defaultValues: Partial<ScenesForm> = {
  scenes: []
}

interface Props {
  type: EVIDEO_TYPE,
  videoFromDevice?: VIDEO_UPLOAD_STEP,
  videoFromYoutube?: VIDEO_YOUTUBE_STEP,
  information: INFORMATION_STEP,
  data?: SCENES_STEP,
  onBack: () => void;
  onSubmit: (data: SCENES_STEP) => void;
}

const Scenes = ({ type, videoFromDevice, videoFromYoutube, information, data, onBack, onSubmit }: Props) => {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      scenes: yup
        .array(yup.object({
          id: yup.number().empty().notRequired(),
          name: yup.string().required(t("setup_adtraction_test_popup_video_scenes_validate")),
          startTime: yup.date().typeError(t("setup_adtraction_test_popup_video_start_time_validate")).required(t("setup_adtraction_test_popup_video_start_time_validate")),
          endTime: yup.date().typeError(t("setup_adtraction_test_popup_video_end_time_validate")).required(t("setup_adtraction_test_popup_video_end_time_validate")),
        }))
        .required(),
    })
  }, [i18n.language]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ScenesForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: defaultValues
  });

  const { fields: fieldsScenes, append: appendScenes, remove: removeScenes, move: moveScenes } = useFieldArray({
    control,
    name: "scenes"
  });

  const onAddScenes = () => {
    if (fieldsScenes?.length >= MAX_SCENES) return
    appendScenes({
      name: '',
      startTime: null,
      endTime: null,
    })
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    moveScenes(source.index, destination.index)
  };

  useEffect(() => {
    if (data) {
      console.log(data, "====data====");
      reset({
        scenes: data.scenes.map(item => ({
          id: item.id,
          name: item.name,
          startTime: moment().startOf("day").add(item.startTime, "seconds").toDate(),
          endTime: moment().startOf("day").add(item.endTime, "seconds").toDate(),
        }))
      })
    }
  }, [data])

  const onDeleteScenes = (index: number) => () => {
    removeScenes(index)
  };

  const _onSubmit = (data: ScenesForm) => {
    onSubmit({
      scenes: data.scenes.map(item => ({
        id: item.id,
        name: item.name,
        startTime: moment(item.startTime).diff(moment().startOf("day"), 'seconds'),
        endTime: moment(item.endTime).diff(moment().startOf("day"), 'seconds')
      }))
    })
  }

  return (
    <>
      <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
        <Grid className={classes.root} container>
          <Grid className={classes.containerInformation} item xs={8}>
            <Box sx={{ mb: 3 }}>
              <Heading4 $colorName="--eerie-black" translation-key="setup_adtraction_test_popup_video_title">{t("setup_adtraction_test_popup_video_title")}</Heading4>
              <ParagraphSmall $colorName="--gray-80" className={classes.subInformation} translation-key="setup_adtraction_test_popup_video__sub_title">{t("setup_adtraction_test_popup_video__sub_title")}</ParagraphSmall>
            </Box>
            <Grid>
              <Grid container className={classes.boxSubTitle}>
                <Grid item xs={4}>
                  <SubTitle translation-key="setup_adtraction_test_popup_video_sub_scene_name">{t("setup_adtraction_test_popup_video_sub_scene_name")}</SubTitle>
                </Grid>
                <Grid item xs={3} className={classes.boxTitleStart}>
                  <SubTitle translation-key="setup_adtraction_test_popup_video_sub_star_time">{t("setup_adtraction_test_popup_video_sub_star_time")}</SubTitle>
                </Grid>
                <Grid item xs={3} className={classes.boxTitleEnd}>
                  <SubTitle translation-key="setup_adtraction_test_popup_video_sub_end_time">{t("setup_adtraction_test_popup_video_sub_end_time")}</SubTitle>
                </Grid>
              </Grid>

              {!!fieldsScenes?.length && (
                <DragDropContext onDragEnd={onDragEnd}>
                  <Droppable droppableId="droppable-list-multiple-attributes">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                      >
                        {fieldsScenes?.map((field, index) => (
                          <Draggable
                            draggableId={field.id}
                            index={index}
                            key={field.id}
                          >
                            {(provided) => (
                              <div
                                className={classes.draggableBox}
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <div className={classes.rowScenesControl}>
                                  <Grid
                                    container
                                    rowSpacing={1}
                                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    className={classes.containerInputScenes}
                                  >
                                    <Grid item xs={6} className={classes.textContent}>
                                      <InputLineTextfield
                                        translation-key-placeholder="setup_adtraction_test_popup_video_scene_name_placeholder"
                                        placeholder={t("setup_adtraction_test_popup_video_scene_name_placeholder")}
                                        inputProps={{ tabIndex: 1 }}
                                        inputRef={register(`scenes.${index}.name`)}
                                        errorMessage={errors.scenes?.[index]?.name?.message}
                                      />
                                    </Grid>
                                    <Grid item xs={6} className={classes.boxTime}>
                                      <Grid>
                                        <Controller
                                          name={`scenes.${index}.startTime`}
                                          control={control}
                                          render={({ field }) => (
                                            <TimePicker
                                              value={field.value as any}
                                              onChange={field.onChange}
                                              errorMessage={errors.scenes?.[index]?.startTime?.message}
                                            />
                                          )}
                                        />
                                      </Grid>
                                      <ParagraphSmall $colorName="--eerie-black" className={classes.textTo} translation-key="setup_adtraction_test_popup_video_to">{t("setup_adtraction_test_popup_video_to")}</ParagraphSmall>
                                      <Grid sx={{ paddingLeft: "24px" }}>
                                      <Controller
                                          name={`scenes.${index}.endTime`}
                                          control={control}
                                          render={({ field }) => (
                                            <TimePicker
                                              value={field.value as any}
                                              onChange={field.onChange}
                                              errorMessage={errors.scenes?.[index]?.endTime?.message}
                                            />
                                          )}
                                        />
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                  <div className={classes.closeInputAttribute}>
                                    <Grid className={classes.textNumberScenes}>
                                        <SubTitle $colorName="--gray-80" translation-key="setup_adtraction_test_popup_video_scene_number">{t("setup_adtraction_test_popup_video_scene_number", {number: index+1})}</SubTitle>
                                    </Grid>
                                    <CloseIcon
                                      onClick={onDeleteScenes(index)}
                                      type="button"
                                      sx={{color: "var(--eerie-black-65)"}}
                                    >
                                    </CloseIcon>
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))}
                      </div>
                    )}
                  </Droppable>
                </DragDropContext>
              )}
              <Grid className={classes.addList}>
                <div className={classes.addOptions} onClick={onAddScenes}>
                  <PlaylistAddIcon className={classes.IconListAdd} />
                  <ParagraphBody $colorName="--eerie-black-65" translation-key="setup_adtraction_test_popup_video_click_add_scene">
                    {t("setup_adtraction_test_popup_video_click_add_scene")}
                  </ParagraphBody>
                </div>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.boxVideo} item xs={4}>
            <div>
              {(type === EVIDEO_TYPE.UPLOAD && !!videoFromDevice) && (
                <video
                  width="300"
                  height="168.75"
                  className={classes.iframeVideo}
                  title="Video from device"
                  controls
                  src={videoFromDevice?.attachment.url}
                >
                </video>
              )}
              {(type === EVIDEO_TYPE.YOUTUBE && !!videoFromYoutube) && (
                <iframe
                  width="300"
                  height="168.75"
                  className={classes.iframeVideo}
                  src={`https://www.youtube.com/embed/${videoFromYoutube.id}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen>
                </iframe>
              )}
            </div>
            <Grid className={classes.boxInformationVideo}>
              <Heading6 $colorName="--eerie-black">{information?.name}</Heading6>
              <Grid sx={{ mt: 2 }}>
                <Box className={classes.textItem}>
                  <IconBranding />
                  <Grid sx={{ flex: 1 }}>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>{information?.brand}</ParagraphSmall>
                  </Grid>
                </Box>
                <Box className={classes.textItem}>
                  <IconProduct />
                  <Grid sx={{ flex: 1 }}>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>{information?.product}</ParagraphSmall>
                  </Grid>
                </Box>
                <Box className={classes.textItem}>
                  <IconMessage />
                  <Grid sx={{ flex: 1 }}>
                    <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>
                      {information?.keyMessage}
                    </ParagraphSmall>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid className={classes.boxAction}>
          <Button
            btnType={BtnType.Secondary}
            onClick={onBack}
            translation-key="common_back"
          >
            {t("common_back")}
          </Button>
          <Button
            btnType={BtnType.Primary}
            type="submit"
            className={classes.btnSave}
            translation-key="common_save"
          >
            {t("common_save")}
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default Scenes;
