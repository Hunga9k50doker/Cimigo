import { SyntheticEvent, useState, useEffect } from "react";
import {
  Grid,
  Dialog,
  DialogTitle,
  DialogActions,
  DialogContent,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import PlaylistAddIcon from '@mui/icons-material/PlaylistAdd';
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
import Toggle from "components/Toggle";
import Images from "config/images";
import { UserAttribute } from "models/user_attribute";
import { useTranslation } from "react-i18next";
import ParagraphBody from "components/common/text/ParagraphBody"
import Heading5 from "components/common/text/Heading5"
import Heading3 from "components/common/text/Heading3"
import InputLineTextfield from "components/common/inputs/InputLineTextfield"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import ButtonCLose from "components/common/buttons/ButtonClose"
import Button, { BtnType } from "components/common/buttons/Button"
import ButtonSmall from "components/common/text/ButtonSmall"
import InputTextfield from "components/common/inputs/InputTextfield"

export interface AttributeFormData {
  title?: string;
  from?:number;
  to?:number;
  attributes?: any;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
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
      list.push({ index: i + 1 });
    }
    setValue("attributes", list);
  };

  const reorder = (items, startIndex, endIndex) => {
    const result = Array.from(items);
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
      const find_pos = attributes.findIndex((att) => att.index === index);
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
      const attribute = {
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
    const maxAttributes = Math.max(...attributes.map((att) => att.index), 0);
    const new_attributes = {
      index: maxAttributes + 1,
      id: null,
      userId: null,
      start: "",
      end: "",
    };
    setFocusEleIdx(attributes.length);
    setValue("attributes", [...attributes,new_attributes]);
  };

  const deleteInputAtt = (index: number) => () => {
    if (attributes?.length <= initListAttributes?.length) {
      return;
    }
    const updated_attributes = [...attributes].filter((att) => att.index !== index);
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
          <Heading3 translation-key="">
            Add numeric scale
          </Heading3 >
          <ButtonCLose
          onClick={() => onClose()}>
          </ButtonCLose>
        </Grid>
      </DialogTitle>
      <form className={classes.formControl} onSubmit={handleSubmit(_onSubmit)}>
        <DialogContent sx={{ padding: "0px", paddingBottom: "10px" }}>
          <Grid className={classes.classForm}>
            <ParagraphBody colorName="--eerie-black" translation-key="" className={classes.titleAdvice} >
              The price of this demand will change based on the number of
              attributes you add, $149 for the first attribute, $32 for each
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
              <Heading5>Scale Range</Heading5>
              <div className={classes.contentScaleRange}>
                <ParagraphBody colorName="--eerie-black-65">From</ParagraphBody>
                <Grid className={classes.gridFromScale}>
                  <Controller
                    name="from"
                    control={control}
                    render={({ field }) => <InputLineTextfield
                      className={classes.fromScale}
                      fullWidth
                      type="number"
                      placeholder="0"
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      autoComplete="off"
                      inputProps={{tabIndex:2}}
                      errorMessage={errors.from?.message}
                    />}
                  />                
                </Grid>
                <ParagraphBody colorName="--eerie-black-65">to</ParagraphBody>
                <Grid>
                  <Controller
                      name="to"
                      control={control}
                      render={({ field }) => <InputLineTextfield
                        className={classes.toScale}
                        fullWidth
                        type="number"
                        placeholder="max"
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        autoComplete="off"
                        inputProps={{tabIndex:3}}
                        errorMessage={errors.to?.message}
                      />}
                    />
                </Grid>
              </div> 
            </Grid>
            <Grid>
              <div className={classes.multiAttributeControl}>
                <Heading5 colorName={!multipleAttributes && "--gray-60"} translation-key="">
                  Multiple attributes
                </Heading5>
                <Toggle
                  className={classes.toggleMultipleAttributes}
                  onChange={onToggleMultipleAttributes}
                />
              </div>
              <ParagraphBody colorName={multipleAttributes ? "--gray-80" : "--gray-60"}>
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
                              draggableId={att.index.toString()}
                              index={index}
                              key={att.index}
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
                                    <ParagraphBody colorName="--gray-80" className={classes.attributeTitle}>Attribute {att.id}</ParagraphBody>
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
                                          render={({ field }) => <InputLineTextfield
                                            className={classes.inputAttribute}
                                            type="text"
                                            placeholder="Left label"
                                            onBlur={field.onBlur}
                                            onChange={handleChangeInputAtt(
                                              "start",
                                              att.index,
                                              checkAllAttNotValueStart()
                                            )}
                                            autoComplete="off"
                                            inputProps={{tabIndex:index + 4}}
                                            autoFocus={index === focusEleIdx}
                                            errorMessage={!att.start && !!errors.attributes?.length &&
                                              errors.attributes[index]?.start
                                                ?.message}
                                          />}
                                        />
                                      </Grid>
                                      <Grid
                                        item
                                        xs={6}
                                        className={classes.inputContainer}
                                      >
                                        <Controller
                                          name="attributes"
                                          control={control}
                                          render={({ field }) => <InputLineTextfield
                                            className={classes.inputAttribute}
                                            type="text"
                                            placeholder="Right label"
                                            onBlur={field.onBlur}
                                            onChange={handleChangeInputAtt(
                                              "end",
                                              att.index,
                                              checkAllAttNotValueEnd()
                                            )}
                                            autoComplete="off"
                                            inputProps={{tabIndex:index + 5}}
                                            errorMessage={!att.end && !!errors.attributes?.length &&
                                              errors.attributes[index]?.end
                                                ?.message}
                                          />}
                                        />
                                      </Grid>
                                    </Grid>
                                  </div>
                                  {attributes?.length > initListAttributes.length && (
                                    <CloseIcon
                                    type="button"
                                    className={classes.closeInputAttribute}
                                    onClick={deleteInputAtt(att.index)}
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
                  <Grid className={classes.addList}>
                    <div onClick={addInputAtt} className={classes.addOptions}>
                      <PlaylistAddIcon className={classes.IconListAdd}/>
                      <ParagraphBody colorName="--eerie-black-65" translation-key="setup_survey_popup_add_answer_title">
                        {t("setup_survey_popup_add_answer_title")}
                      </ParagraphBody>
                    </div>
                  </Grid>
                </Grid>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Grid className={classes.costContainer}>
            <Heading5 colorName="--cimigo-green-dark"> US$ 149 (3,240,258 VND)</Heading5>
            <ParagraphExtraSmall colorName="--gray-90">Tax exclusive</ParagraphExtraSmall>
          </Grid>
          <Button
            btnType={BtnType.Raised}
            type="submit"
            translation-key="setup_survey_popup_save_question_title"
            children={<ButtonSmall>{t("setup_survey_popup_save_question_title")}</ButtonSmall>}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopupNumericScale;
