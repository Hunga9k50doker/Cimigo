import { SyntheticEvent, useState, useEffect } from "react";
import {
  Button,
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "react-beautiful-dnd";
import classes from "./styles.module.scss";
import * as yup from "yup";
import IconListAdd from "assets/img/icon/ic-list-add-svgrepo-com.svg";
import Toggle from "components/Toggle";
import Inputs from "components/Inputs";
import Images from "config/images";
import { UserAttribute } from "models/user_attribute";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/common/text/ParagraphBody"
import HeadingTitle from "components/common/text/Heading5"
import HeadingTitlePopup from "components/common/text/Heading3"
import InputAttributes from "components/common/inputs/InputAttributes"
export interface AttributeFormData {
  title?: string;
  from?:number;
  to?:number;
  attributes?: UserAttribute[];
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  //onSubmit: (data: UserAttribute) => void;
}

const PopupNumericScale = (props: Props) => {
  const { t } = useTranslation();

  const { onClose, isOpen } = props;

  const [multipleAttributes, setMultipleAttributes] = useState(false);

  const [focusEleIdx, setFocusEleIdx] = useState(-1);
  
  const onToggleMultipleAttributes = () => {
    setMultipleAttributes(!multipleAttributes);
  };

  const initListAttributes = [
    {
      id: "1",
    },
    {
      id: "2",
    },
  ];
  
  const schema = yup.object().shape({
    title: yup.string().required("Question is required"),
    from: yup.number().typeError('Required').integer().required("Required"),
    to: yup.number().typeError('Required').required("Required").min(yup.ref("from"),"Greater from"),
    attributes: yup
      .array(
        yup.object({
          id: yup.number().notRequired(),
          start: yup.string().required("Label left is required"),
          end: yup.string().required("Label right is required"),
        })
      )
      .required(),
  });


  const {
    register,
    watch,
    setValue,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const attributes = watch("attributes");

  const initAttribute = () => {
    const list = [];
    for (let i: number = 0; i < initListAttributes.length; ++i) {
      list.push({ id: i + 1 });
    }
    setValue("attributes", list);
  };

  const reorder = (items, startIndex, endIndex) => {
    const result: UserAttribute[] = Array.from(items);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    return result;
  };

  const onDragEnd = ({ destination, source }: DropResult) => {
    if (!destination) {
      return;
    }
    const result = reorder(attributes, source.index, destination.index);
    setValue("attributes", result);
  };

  const handleChangeInputAtt =
    (value: string, index: number, callback: boolean) =>
    (event: SyntheticEvent<EventTarget>) => {
      const find_pos = attributes.findIndex((att) => att.id === index);
      const new_arr = [...attributes];
      const element = event.currentTarget as HTMLInputElement;
      new_arr[find_pos][value] = element.value;
      setValue("attributes", new_arr);
    };

  const checkAllAttNotValueStart = () => {
    return !!attributes.find(({ start }) => !start);
  };

  const checkAllAttNotValueEnd = () => {
    return !!attributes.find(({ end }) => !end);
  };

  const clearForm = () => {
    reset({
      title: "",
      from: null,
      to: null,
      attributes: [],
    });
    initAttribute();
  };

  const _onSubmit = (data: AttributeFormData) => {
    if (attributes.length !== 0) {
      const atribute = {
        title: data.title,
        attributes: data.attributes.map((item) => ({
          start: item.start,
          end: item.end
        })),
      };
      //onSubmit(atribute);
      clearForm();
    }
  };

  const addInputAtt = () => {
    const maxAttributes = Math.max(...attributes.map((att) => att.id), 0);
    const new_attributes = {
      id: maxAttributes + 1,
      userId: null,
      start: "",
      end: "",
      createdAt: null,
      updatedAt: null
    };
    setFocusEleIdx(attributes.length);
    setValue("attributes", [...attributes,new_attributes]);
  };

  const deleteInputAtt = (id: number) => () => {
    if (attributes?.length <= initListAttributes?.length) {
      return;
    }
    const updated_attributes = [...attributes].filter((ans) => ans.id !== id);
    setValue("attributes", updated_attributes);
  };

  useEffect(() => {
    initAttribute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      classes={{ paper: classes.paper }}
    >
      <DialogTitle className={classes.header}>
        <Grid className={classes.content}>
          <HeadingTitlePopup translation-key="">
            Add numeric scale
          </HeadingTitlePopup>
          <CloseIcon 
          className={classes.iconClose}
          onClick={() => onClose()}>
          </CloseIcon>
        </Grid>
      </DialogTitle>
      <form className={classes.formControl} onSubmit={handleSubmit(_onSubmit)}>
        <DialogContent sx={{ padding: "0px", paddingBottom: "10px" }}>
          <Grid className={classes.classForm}>
            <ParagraphBody colorName="#1C1C1C" className={classes.titleAdvice}>
              The price of this demand will change based on the number of
              attributes you add, $149 for the first attribute, $32 for each
              subsequent attribute.
            </ParagraphBody>
            <HeadingTitle
              translation-key="setup_survey_popup_question_title"
            >
              {t("setup_survey_popup_question_title")}
            </HeadingTitle>
            <Inputs
              className={classes.inputQuestion}
              translation-key-placeholder="setup_survey_popup_enter_question_placeholder"
              placeholder={t("setup_survey_popup_enter_question_placeholder")}
              startAdornment={
                <InputAdornment position="start">
                  <Tooltip
                    translation-key="setup_survey_popup_question_tooltip_icon"
                    title={t("setup_survey_popup_question_tooltip_icon")}
                  >
                    <div className={classes.iconLanguage}>en</div>
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
            <Grid className={classes.scaleRangeContainer}>
              <HeadingTitle>Scale Range</HeadingTitle>
              <div className={classes.contentScaleRange}>
                <ParagraphBody colorName="rgba(28, 28, 28, 0.65)">From</ParagraphBody>
                <Grid>
                  <Controller
                    name="from"
                    control={control}
                    render={({ field }) => <InputAttributes
                      className={classes.fromScale}
                      fullWidth
                      type="number"
                      placeholder="0"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      onWheel={e => e.target instanceof HTMLElement && e.target.blur()}
                      autoComplete="off"
                      inputProps={{tabIndex:2}}
                    />}
                  />
                  <div className={classes.errAtt}>{errors.from?.message}</div>
                </Grid>
                <ParagraphBody colorName="rgba(28, 28, 28, 0.65)">to</ParagraphBody>
                <Grid>
                  <Controller
                      name="to"
                      control={control}
                      render={({ field }) => <InputAttributes
                        className={classes.toScale}
                        width="36px"
                        fullWidth
                        type="number"
                        placeholder="max"
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        onWheel={e => e.target instanceof HTMLElement && e.target.blur()}
                        autoComplete="off"
                        inputProps={{tabIndex:3}}
                      />}
                    />
                    <div className={classes.errAtt}>{errors.to?.message}</div>
                </Grid>
              </div> 
            </Grid>
            <Grid>
              <div className={classes.multiAttributeControl}>
                <HeadingTitle colorName={!multipleAttributes && "#767676" } translation-key="">
                  Multiple attributes
                </HeadingTitle>
                <Toggle
                  className={classes.toggleMultipleAttributes}
                  onChange={onToggleMultipleAttributes}
                />
              </div>
              <ParagraphBody colorName={multipleAttributes ? "#494949" : "#767676"}>
                Your question will be evaluated based on the following list of
                attributes.
              </ParagraphBody>
              {multipleAttributes && (
                <Grid sx={{ position: "relative", marginTop: "24px" }}>
                  <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable-list-multiple-attributes">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                        >
                          {attributes?.map((att, index) => (
                            <Draggable
                              draggableId={att.id.toString()}
                              index={index}
                              key={att.id}
                            >
                              {(provided) => (
                                <div
                                  className={classes.rowInputAttributeControl}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <div className={classes.rowInputAttribute}>
                                    <img
                                      className={classes.iconDotsDrag}
                                      src={Images.icDrag}
                                      alt=""
                                    />
                                    <ParagraphBody colorName="#494949">Attribute {att.id}</ParagraphBody>
                                    <Grid
                                      container
                                      rowSpacing={1}
                                      columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                                    >
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.inputContainer}
                                      >
                                        <Controller
                                          name="attributes"
                                          control={control}
                                          render={({ field }) => <InputAttributes
                                            width="100%"
                                            className={classes.inputAttribute}
                                            type="text"
                                            placeholder="Left label"
                                            onBlur={field.onBlur}
                                            onChange={handleChangeInputAtt(
                                              "start",
                                              att.id,
                                              checkAllAttNotValueStart()
                                            )}
                                            onWheel={e => e.target instanceof HTMLElement && e.target.blur()}
                                            autoComplete="off"
                                            inputProps={{tabIndex:index + 4}}
                                            autoFocus={index === focusEleIdx}
                                          />}
                                        />
                                        <div className={classes.errAtt}>
                                          {!att.start && !!errors.attributes?.length &&
                                            errors.attributes[index]?.start
                                              ?.message}
                                        </div>
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.inputContainer}
                                      >
                                        <Controller
                                          name="attributes"
                                          control={control}
                                          render={({ field }) => <InputAttributes
                                            className={classes.inputAttribute}
                                            width="100%"
                                            type="text"
                                            placeholder="Right label"
                                            onBlur={field.onBlur}
                                            onChange={handleChangeInputAtt(
                                              "end",
                                              att.id,
                                              checkAllAttNotValueEnd()
                                            )}
                                            onWheel={e => e.target instanceof HTMLElement && e.target.blur()}
                                            autoComplete="off"
                                            inputProps={{tabIndex:index + 5}}
                                          />}
                                        />
                                        <div className={classes.errAtt}>
                                          {!att.end && !!errors.attributes?.length &&
                                            errors.attributes[index]?.end
                                              ?.message}
                                        </div>
                                      </Grid>
                                    </Grid>
                                  </div>
                                  {attributes?.length > initListAttributes.length && (
                                    <button
                                    type="button"
                                    className={classes.closeInputAttribute}
                                    onClick={deleteInputAtt(att.id)}
                                    >
                                    <img src={Images.icDeleteAnswer} alt="" />
                                  </button>
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
                  <Grid className={classes.addList}>
                    <button type="button" className={classes.addOptions} onClick={addInputAtt}>
                      <img
                        src={IconListAdd}
                        className={classes.IconListAdd}
                        alt=""
                      />
                      <ParagraphBody colorName="rgba(28, 28, 28, 0.65)" translation-key="setup_survey_popup_add_answer_title">
                        {t("setup_survey_popup_add_answer_title")}
                      </ParagraphBody>
                    </button>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Grid className={classes.costContainer}>
            <HeadingTitle colorName="#7C9911" fontSize="18px"> US$ 149 (3,240,258 VND)</HeadingTitle>
            <span>Tax exclusive</span>
          </Grid>
          <Button
            type="submit"
            translation-key="setup_survey_popup_save_question_title"
            children={t("setup_survey_popup_save_question_title")}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopupNumericScale;
