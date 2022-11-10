import { useEffect, useMemo} from "react";
import {
  Grid,
  Box,
} from "@mui/material";
import { useForm, useFieldArray} from "react-hook-form";
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
import { IconBranding, IconMessage, IconProduct } from "components/svg";

const MAX_SCENES = 20;

export interface ScenesForm {
    scenes: {
      id?: number;
      scenesName?: string;
      startTime?: string;
      endTime?: string;
    }[];
}

interface Props {
  // onChangeStep?: () => void;
  // onSubmit: (data: FormData) => void;
}


// eslint-disable-next-line no-empty-pattern
const Scenes = ({}: Props) => {
  const { t, i18n } = useTranslation();
  const schema = useMemo(() => {
    return yup.object().shape({
      scenes: yup
        .array(yup.object({
          id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
          scenesName: yup.string().required("Scenes name is required"),
          startTime: yup.string().required("Start time is required"),
          endTime: yup.string().required("End time is required"),
        }))
        .required(),
      })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[i18n.language]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ScenesForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields: fieldsScenes, append: appendScenes, remove: removeScenes, move: moveScenes } = useFieldArray({
    control,
    name: "scenes"
  });

  const onAddScenes= () => {
    if (fieldsScenes?.length >= MAX_SCENES) return
    appendScenes({
      scenesName: '',
      startTime: '',
      endTime: '',
    })
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    moveScenes(source.index, destination.index)
  };

  const clearForm = () => {
    reset({
      scenes: [],
    })
  };

  const onDeleteScenes = (index: number) => () => {
    removeScenes(index)
  };

  const _onSubmit = (data: ScenesForm) => {

  }

  return (
    <>
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
       <Grid className={classes.root}>
            <Grid className={classes.containerInformation} xs={7}>
                <Box sx={{mb:3}}>
                    <Heading4 $colorName="--eerie-black">Define scenes</Heading4>
                    <ParagraphSmall $colorName="--gray-80" className={classes.subInformation}>If you already have some key scenes, let us know.</ParagraphSmall>
                </Box>
                <Grid>
                <Grid container spacing={3} className={classes.boxSubTitle}>
                    <Grid item xs={6}>
                      <SubTitle>Scene name</SubTitle>
                    </Grid>
                    <Grid item xs>
                      <SubTitle sx={{ml: 1}}>Start time</SubTitle>
                    </Grid>
                    <Grid item xs>
                      <SubTitle sx={{ml: 1}}>End time</SubTitle>
                    </Grid>
                </Grid>

                {!!fieldsScenes?.length && (
                   <DragDropContext onDragEnd={onDragEnd}>
                     <Droppable droppableId="droppable-list-multiple-attributes">
                      {(provided)=> (
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
                                  <Grid  className={classes.textNumberScenes}>
                                  <SubTitle $colorName="--gray-80">Scene {index+1} </SubTitle>
                                  </Grid>
                                  <div className={classes.rowScenesControl}
                                  >
                                  <Grid 
                                  container
                                  rowSpacing={1}
                                  columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                  className={classes.containerInputScenes}
                                  >
                                      <Grid item xs={6} className={classes.textContent}>
                                        <InputLineTextfield
                                        placeholder="e.g. Mở bật nắp chai"
                                        inputProps={{ tabIndex: 1}}
                                        inputRef={register(`scenes.${index}.scenesName`)}
                                        errorMessage={errors.scenes?.[index]?.scenesName?.message}
                                        />
                                      </Grid>
                                      <Grid item xs={6} className={classes.boxTime}>
                                      <Grid>
                                        <InputLineTextfield
                                        placeholder="Start time"
                                        inputProps={{ tabIndex: 1}}
                                        inputRef={register(`scenes.${index}.startTime`)}
                                        errorMessage={errors.scenes?.[index]?.startTime?.message}
                                        />
                                      </Grid>
                                      <ParagraphSmall  $colorName="--eerie-black" className={classes.textTo}>to</ParagraphSmall>
                                      <Grid sx={{paddingLeft: "24px"}}>
                                        <InputLineTextfield
                                        placeholder="End time"
                                        inputProps={{ tabIndex: 1}}
                                        inputRef={register(`scenes.${index}.endTime`)}
                                        errorMessage={errors.scenes?.[index]?.endTime?.message}
                                        />
                                      </Grid>
                                      </Grid>
                                  </Grid>
                                  <CloseIcon
                                  onClick={onDeleteScenes(index)}
                                  type="button"
                                  className={classes.closeInputAttribute}
                                  >
                                  </CloseIcon>
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
                        <ParagraphBody $colorName="--eerie-black-65" translation-key="">
                        Click to add scene
                        </ParagraphBody>
                      </div>
                    </Grid>
                </Grid>   
            </Grid>
            <Grid className={classes.boxVideo} xs={5}>
              <div>
                <iframe width="300" height="168.75" className={classes.iframeVideo}
                src="https://www.youtube.com/embed/wlBr9QCucZs" 
                title="YouTube video player" frameBorder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen>
                </iframe> 
              </div>
              <Grid className={classes.boxInformationVideo}>
                  <Heading6 $colorName="--eerie-black">Tet holiday adtraction 2021 - Tet holiday</Heading6>
                  <Grid sx={{mt: 2}}>
                  <Box className={classes.textItem}>
                      <IconBranding/>
                      <Grid sx={{flex: 1}}>  
                          <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>Mirinda soda ice cream Mirinda soda ice creamMirinda soda ice creamMirinda soda ice creamMirinda soda ice creamMirinda soda ice cream</ParagraphSmall>
                      </Grid>
                  </Box>
                  <Box className={classes.textItem}>
                      <IconProduct/>
                      <Grid sx={{flex: 1}}>  
                          <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>Mirinda soda ice cream Mirinda soda ice creamMirinda soda ice creamMirinda soda ice creamMirinda soda ice creamMirinda soda ice cream</ParagraphSmall>
                      </Grid>
                  </Box>
                  <Box className={classes.textItem}>
                      <IconMessage/>
                      <Grid sx={{flex: 1}}>  
                      <ParagraphSmall $colorName="--eerie-black" className={classes.textMessage}>
                          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                          consectetur venenatis blandit. Praesent vehicula, libero non pretium
                          vulputate, lacus arcu facilisis lectus, sed feugiat tellus nulla eu
                          dolor. Nulla porta bibendum lectus quis euismod. Aliquam volutpat
                          ultricies porttitor. Cras risus nisi, accumsan vel cursus ut,
                          sollicitudin vitae dolor. Fusce scelerisque eleifend lectus in bibendum.
                          Suspendisse lacinia egestas felis a volutpat.
                      </ParagraphSmall>               
                      </Grid>
                  </Box>
            </Grid>
              </Grid>              
            </Grid>
        </Grid> 
        <Grid className={classes.boxAction}>
          <Button btnType={BtnType.Secondary}>Back</Button>
          <Button btnType={BtnType.Primary} type="submit" className={classes.btnSave}>
              Save
          </Button>
        </Grid>
    </Grid>
  </>
  );
};

export default Scenes;
