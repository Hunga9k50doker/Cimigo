import { useForm } from "react-hook-form";
import {
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  InputAdornment,
} from "@mui/material";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "components/Inputs";
import { CustomQuestion, CustomQuestionFormData, ECustomQuestionType } from "models/custom_question";
import { useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomQuestion) => void;
  questionEdit: CustomQuestion;
  language: string;
}

const PopupOpenQuestion = (props: Props) => {
  const { t } = useTranslation();

  const { onClose, isOpen, onSubmit, questionEdit, language } = props;

  const schema = useMemo(() => {
    return yup.object().shape({
      title: yup.string().required("Question title is required"),
    });
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CustomQuestionFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  useEffect(() => {
    if (questionEdit) {
      reset({
        title: questionEdit?.title,
      });
    } else {
      clearForm();
    }
  }, [questionEdit]);

  const _onSubmit = (data: CustomQuestionFormData) => {
    const question: CustomQuestion = {
      typeId: ECustomQuestionType.Open_Question,
      title: data.title,
    };
    onSubmit(question);
    clearForm();
  };

  const clearForm = () => {
    reset({
      title: "",
    });
  };

  return (
    <Dialog
      open={isOpen}
      onClose={() => onClose()}
      classes={{ paper: classes.paper }}
    >
      <DialogContent sx={{ padding: "0px" }}>
        <Grid className={classes.content}>
          <div className={classes.titlePopup} translation-key="setup_survey_popup_add_open_question_title">{t("setup_survey_popup_add_open_question_title")}</div>
          <IconButton
            className={classes.iconClose}
            onClick={() => onClose()}
          ></IconButton>
        </Grid>
        <Grid className={classes.classform}>
          <form
            onSubmit={handleSubmit(_onSubmit)}
            className={classes.formControl}
          >
            <p className={classes.title} translation-key="setup_survey_popup_question_title">{t("setup_survey_popup_question_title")}</p>
            <Inputs
              className={classes.inputQuestion}
              translation-key-placeholder="setup_survey_popup_enter_question_placeholder"
              placeholder={t("setup_survey_popup_enter_question_placeholder")}
              startAdornment={
                <InputAdornment position="start">
                  <div className={classes.iconLanguage}>{language}</div>
                </InputAdornment>
              }
              type="text"
              inputRef={register("title")}
              errorMessage={errors.title?.message}
              autoComplete="off"
            />
            <Grid>
              <Button
                type="submit"
                translation-key="setup_survey_popup_save_question_title"
                children={t("setup_survey_popup_save_question_title")}
                className={classes.btnSave}
              />
            </Grid>
          </form>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};

export default PopupOpenQuestion;
