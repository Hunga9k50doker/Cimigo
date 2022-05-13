import { useForm } from "react-hook-form";
import {
  Button,
  IconButton,
  Grid,
  Dialog,
  DialogContent,
  InputAdornment,
  Input,
} from "@mui/material";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "components/Inputs";
import { CustomQuestion } from "models/custom_question";
import { ECustomQuestionType } from "pages/Survey/SetupSurvey";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CustomQuestion) => void;
}

const schema = yup.object().shape({
  inputQues: yup.string().required("Question title is required."),
});
export interface AttributeFormData {
  inputQues: string;
}

const PopupAddQuestion = (props: Props) => {
  const { onClose, isOpen, onSubmit } = props;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AttributeFormData>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data: AttributeFormData) => {
    const question: CustomQuestion = {
      typeId: ECustomQuestionType.Open_Question,
      title: data.inputQues,
    };
    onSubmit(question);
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} classes={{ paper: classes.paper }}>
      <DialogContent sx={{ padding: "0px" }}>
        <Grid className={classes.content}>
          <div className={classes.titlePopup}>Add open question</div>
          <IconButton
            className={classes.iconClose}
            onClick={onClose}
          ></IconButton>
        </Grid>
        <Grid className={classes.classform}>
          <form
            onSubmit={handleSubmit(_onSubmit)}
            className={classes.formControl}
          >
            <p className={classes.title}>Question title</p>
            <Inputs
              className={classes.inputQuestion}
              placeholder="Enter question title"
              startAdornment={
                <InputAdornment position="start">
                  <div className={classes.iconVI}>VI</div>
                </InputAdornment>
              }
              name="inputQuestion"
              type="text"
              inputRef={register("inputQues")}
              errorMessage={errors.inputQues?.message}
            />
            <Grid>
              <Button
                type="submit"
                children="Save question"
                className={classes.btnSave}
              />
            </Grid>
          </form>
        </Grid>
      </DialogContent>
    </Dialog>
  );
};
export default PopupAddQuestion;
