import { useState, useEffect, useMemo } from "react";
import {
  Grid,
  Dialog,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
import DragIndicatorIcon from '@mui/icons-material/DragIndicator';
import * as yup from "yup";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import Heading5 from "components/common/text/Heading5";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import { Project } from "models/project";
import { arrayEmojis } from "models/custom_question";
import { fCurrency2, fCurrency2VND } from 'utils/formatNumber';
import { PriceService } from "helpers/price";
import { CreateOrEditCustomQuestionInput, CustomQuestion, CustomQuestionType, ECustomQuestionType } from "models/custom_question";
import Button, { BtnType } from "components/common/buttons/Button";
import InputTextfield from "components/common/inputs/InputTextfield";
import InputLineTextfield from "components/common/inputs/InputLineTextfield";
import InputSelect from "components/common/inputs/InputSelect";
import ButtonCLose from "components/common/buttons/ButtonClose";
import Emoji from "components/common/images/Emojis";
import classes from "./styles.module.scss";
import Toggle from "components/Toggle";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import { OptionItem, emojiFaces, FaceType } from "models/general";
import { useTranslation } from "react-i18next";

export interface SmileyRatingForm {
  title: string;
  invertScale: boolean;
  customQuestionEmojis: {
    id?: number;
    label: string;
    emojiId: number;  
   }[],
  customQuestionAttributes?: {
    id?: number;
    attribute?: string;
  }[],
}

interface Props {
  isOpen: boolean;
  project: Project;
  questionEdit: CustomQuestion;
  questionType: CustomQuestionType;
  onClose: () => void;
  onSubmit: (data: CreateOrEditCustomQuestionInput) => void;
}

const PopupSmileyRating = (props: Props) => {
  const { t, i18n } = useTranslation();

  const { configs } = useSelector((state: ReducerType) => state.user)

  const { onClose, project, questionEdit, questionType, isOpen, onSubmit } = props;
  
  const [focusEleIdx, setFocusEleIdx] = useState(-1);
  
  const [isInvertScale, setIsInvertScale] = useState(false);

  const schema = useMemo(() => {
    return yup.object().shape({
          title: yup.string().required("Question is required"),
          invertScale: yup.boolean().required(),
          customQuestionEmojis: yup
          .array(
            yup.object({
              id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
              label: yup.string().required("Label is required"),
              emojiId: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
            })
          ),
          customQuestionAttributes: yup
            .array(
              yup.object({
                id: yup.number().transform(value => (isNaN(value) ? undefined : value)).notRequired(),
                attribute: yup.string().required("Attribute is required"),
              })
            )
            .required(),
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
  },[i18n.language]);
   
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SmileyRatingForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const { fields: fieldsAttributes, append: appendAttribute, remove: removeAttribute, move: moveAttribute } = useFieldArray({
    control,
    name: "customQuestionAttributes"
  });
  const { fields: fieldsEmojis, append: appendEmojis, remove: removeEmojis} = useFieldArray({
    control,
    name: "customQuestionEmojis"
  });

  const onChangeOption = (item: OptionItem) => {
      switch (item.id) {
          case FaceType.FIVE:
            removeEmojis();
            appendEmojis(arrayEmojis);
            break;  
          case FaceType.THREE:
            removeEmojis();
            appendEmojis([arrayEmojis[0], arrayEmojis[2], arrayEmojis[4]]);
            break;
          default:
            removeEmojis();
            appendEmojis(arrayEmojis);
      }
  }

  const isShowMultiAttributes = useMemo(() => !!fieldsAttributes?.length, [fieldsAttributes])

  const price = useMemo(() => {
    if (!questionType) return
    return PriceService.getCustomQuestionSmileyRatingCost(questionType, fieldsAttributes.length, configs)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionType, fieldsAttributes])

  const onAddAttribute = () => {
    if (fieldsAttributes?.length >= questionType.maxAttribute) return

    appendAttribute({
        attribute: ''
    })
    setFocusEleIdx(fieldsAttributes?.length ?? 0)
  };

  const onToggleMultipleAttributes = () => {
    if (isShowMultiAttributes) {
      removeAttribute()
    } else {
      onAddAttribute()
    }
  }
  const onToggleInvertScale = () => {
    setIsInvertScale(!isInvertScale);
    fieldsEmojis.reverse()
  }

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) return
    moveAttribute(source.index, destination.index)
  };

  const clearForm = () => {
    reset({
      title: "",
      invertScale: false,
      customQuestionEmojis: [],
      customQuestionAttributes: [],
    })
  };

  const _onSubmit = (value: SmileyRatingForm) => {
    const data: CreateOrEditCustomQuestionInput = {
      projectId: project.id,
      title: value.title,
      invertScale: value.invertScale,
      typeId: ECustomQuestionType.Smiley_Rating,
      customQuestionEmojis: value.customQuestionEmojis?.map(it => ({
        id: it.id,
        label: it.label,
        emojiId: it.emojiId
      })),
      customQuestionAttributes: value.customQuestionAttributes?.map(it => ({
        id: it.id,
        attribute: it.attribute
      }))
    }
   onSubmit(data);
  };

  const onDeleteAttribute = (index: number) => () => {
    removeAttribute(index)
  };

  const _onClose = () => {
    onClose()
  }

  useEffect(() => {
    if (questionEdit) {
      reset({
        title: questionEdit.title,
        invertScale: questionEdit.invertScale,
        customQuestionEmojis: questionEdit.customQuestionEmojis?.map(it => ({
          id: it.id,
          label: it.label,
          emojiId: it.emojiId
        })),
        customQuestionAttributes: questionEdit.customQuestionAttributes?.map(it => ({
          id: it.id,
          attribute: it.attribute
        })),
      })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionEdit])

  useEffect(() => {
    if (!isOpen && !questionEdit) {
      clearForm()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  }, [isOpen, questionEdit])

  useEffect(() => {
    appendEmojis(arrayEmojis);
  // eslint-disable-next-line react-hooks/exhaustive-deps 
  },[])

  return (
    <Dialog
      scroll= "paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle>
          <Heading3 translation-key="">
            Add Smiley Rating
          </Heading3>
          <ButtonCLose
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers>
          <Grid className={classes.classForm}>
            <ParagraphBody $colorName="--eerie-black" translation-key="" className={classes.titleAdvice} >
                The price of this demand will change based on the number of
                attributes you add, ${fCurrency2(questionType?.price || 0)} for the first attribute, ${fCurrency2(questionType?.priceAttribute || 0)} for each
                subsequent attribute.
            </ParagraphBody>
            <Heading5
              translation-key="setup_survey_popup_question_title"
            >
              {t("setup_survey_popup_question_title")}
            </Heading5>
            <InputTextfield
              className={classes.inputQuestion}
              translation-key-placeholder="setup_survey_popup_enter_question_placeholder"
              placeholder={t("setup_survey_popup_enter_question_placeholder")}
              startAdornment={
                <InputAdornment position="start">
                  <Tooltip
                    translation-key="setup_survey_popup_question_tooltip_icon"
                    title={t("setup_survey_popup_question_tooltip_icon")}
                  >
                    <div className={classes.iconLanguage}>{project?.surveyLanguage}</div>
                  </Tooltip>
                </InputAdornment>
              }
              type="text"
              autoComplete="off"
              autoFocus
              inputProps={{ tabIndex: 1 }}
              inputRef={register("title")}
              errorMessage={errors.title?.message}
            />
            <Grid className={classes.smileyRatingContainer}>
              <Grid className={classes.emojiHeader}>
                <Heading5>Smiley scale</Heading5>
                <InputSelect
                className={classes.selectBox}
                selectProps={
                  {
                  defaultValue: emojiFaces[0],
                  options: emojiFaces,
                  onChange:(val: any) => (onChangeOption(val))  
                }}
                />
              </Grid>
              <Grid className={classes.emojiContent}>
                {fieldsEmojis?.map((field, index) => ( 
                  <div className={classes.emojiItem} key={index}>
                    <Emoji emojiId={field.emojiId}/>
                    <InputLineTextfield
                    className={classes.inputEmojis}
                    type="text"
                    placeholder="Enter label"
                    autoComplete="off"
                    inputProps={{tabIndex:1}}
                    autoFocus
                    inputRef={register(`customQuestionEmojis.${index}.label`)}
                    errorMessage={errors.customQuestionEmojis?.[index]?.label?.message}
                    startAdornment={
                      <InputAdornment position="start">
                        <Tooltip
                          translation-key="setup_survey_popup_question_tooltip_icon"
                          title={t("setup_survey_popup_question_tooltip_icon")}
                        >
                          <div className={classes.iconLanguage}>{project?.surveyLanguage}</div>
                        </Tooltip>
                      </InputAdornment>
                      }
                      />
                  </div>
                ))}                             
            </Grid>        
            </Grid>
            <Grid className={classes.invertScaleContainer}>
              <Heading5 $colorName={!isInvertScale && "--gray-60"} translation-key="">
                Invert scale
              </Heading5>
              <Controller
                name="invertScale"
                control={control}
                render = {({field: {onChange}}) => 
                <Toggle
                checked={isInvertScale}
                className={classes.toggle}
                onChange={(value: any) => {
                  onToggleInvertScale()
                  return onChange(value)
                }}
                />}
              />
            </Grid>
            <Grid>
              <div className={classes.multiAttributeControl}>
              <Heading5 $colorName={!isShowMultiAttributes && "--gray-60"} translation-key="">
                  Multiple attributes
                </Heading5>
                <Toggle
                  checked={isShowMultiAttributes}
                  className={classes.toggle}
                  onChange={onToggleMultipleAttributes}
                />
              </div>
              <ParagraphBody $colorName={isShowMultiAttributes ? "--gray-80" : "--gray-60"}>
                Your question will be evaluated based on the following list of
                attributes.
              </ParagraphBody>
              {!!fieldsAttributes?.length && (
                <Grid sx={{ position: "relative", marginTop: "24px" }}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable-list-multiple-attributes">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {fieldsAttributes?.map((field, index) => (
                            <Draggable
                              draggableId={field.id}
                              index={index}
                              key={field.id}
                            >
                              {(provided) => (
                                <div
                                  className={classes.rowInputAttributeControl}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className={classes.rowInputAttribute}>
                                    <DragIndicatorIcon className={classes.iconDotsDrag}/>                               
                                    <Grid className={classes.inputContainer}>
                                        <InputLineTextfield
                                          className={classes.inputAttribute}
                                          type="text"
                                          placeholder="Enter attribute"
                                          autoComplete="off"
                                          inputProps={{tabIndex:index + 2}}
                                          autoFocus={index === focusEleIdx}
                                          onFocus={() => setFocusEleIdx(-1)}
                                          inputRef={register(`customQuestionAttributes.${index}.attribute`)}
                                          errorMessage={errors.customQuestionAttributes?.[index]?.attribute?.message}
                                        />
                                    </Grid>
                                  </div>
                                  {fieldsAttributes?.length > 1 && (
                                    <CloseIcon
                                    type="button"
                                    className={classes.closeInputAttribute}
                                    onClick={onDeleteAttribute(index)}
                                    >
                                  </CloseIcon>
                                  ) }
                                </div>
                              )}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </div>
                      )}
                    </Droppable>
                  </DragDropContext>
                  {fieldsAttributes?.length < questionType.maxAttribute && (
                    <Grid className={classes.addList}>
                        <div onClick={onAddAttribute} className={classes.addOptions}>
                        <PlaylistAddIcon className={classes.IconListAdd}/>
                        <ParagraphBody $colorName="--eerie-black-65" translation-key="setup_survey_popup_add_answer_title">
                            {t("setup_survey_popup_add_answer_title")}
                        </ParagraphBody>
                        </div>
                    </Grid>
                  )}
                </Grid>
              )}
            </Grid>
          </Grid>
          </DialogContent>
          <DialogActions className={classes.footer}>
          <Grid className={classes.costContainer}>
            <Heading5 $colorName="--cimigo-green-dark"> US$ {fCurrency2(price?.priceUSD || 0)} ({fCurrency2VND(price?.priceVND || 0)} VND) VND</Heading5>
            <ParagraphExtraSmall $colorName="--gray-90">Tax exclusive</ParagraphExtraSmall>
          </Grid>
          <Button
            btnType={BtnType.Raised}
            type="submit"
            translation-key="setup_survey_popup_save_question_title"
            children={<TextBtnSmall>{t("setup_survey_popup_save_question_title")}</TextBtnSmall>}
            className={classes.btnSave}
          />
        </DialogActions>
        </form>
    </Dialog>
  );
};

export default PopupSmileyRating;
