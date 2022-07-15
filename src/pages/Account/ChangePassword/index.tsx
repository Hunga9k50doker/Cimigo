import { Divider, Grid } from "@mui/material";
import { memo, useMemo, useState, useEffect } from "react";
import classes from "./styles.module.scss";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Inputs from "components/Inputs";
import { VALIDATION } from "config/constans";
import { useTranslation } from "react-i18next";
import Buttons from "components/Buttons";
import {
  setErrorMess,
  setLoading,
  setSuccessMess,
} from "redux/reducers/Status/actionTypes";
import UserService from "services/user";
import { useDispatch } from "react-redux";

interface Props { }

interface DataForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const ChangePassword = memo((props: Props) => {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [isEmptyPassword, setIsEmptyPassword] = useState(false)

  useEffect(() => {
    dispatch(setLoading(true));
    UserService.checkEmptyPassword()
      .then((res) => {
        setIsEmptyPassword(res)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  }, [])

  const schema = useMemo(() => {
    return yup.object().shape({
      currentPassword: isEmptyPassword ? yup.string() : yup.string().required(t("field_current_password_vali_required")),
      newPassword: yup
        .string()
        .matches(VALIDATION.password, {
          message: t("field_new_password_vali_password"),
          excludeEmptyString: true,
        })
        .required(t("field_new_password_vali_required")),
      confirmPassword: yup
        .string()
        .oneOf(
          [yup.ref("newPassword")],
          t("field_confirm_new_password_vali_password_do_not_match")
        )
        .required(t("field_confirm_new_password_vali_required")),
    });
  }, [i18n.language, isEmptyPassword]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<DataForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = (data: DataForm) => {
    dispatch(setLoading(true));
    UserService.changePassword(data)
      .then((res) => {
        dispatch(setSuccessMess(res.message));
        if (isEmptyPassword){
          setIsEmptyPassword(false)
        }
        reset();
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <Grid className={classes.root}>
      <p className={classes.title} translation-key="auth_change_password_title">
        {t("auth_change_password_title")}
      </p>
      <p
        className={classes.subTitle}
        translation-key="auth_change_password_sub"
      >
        {t("auth_change_password_sub")}
      </p>
      <Divider className={classes.divider} />
      {isEmptyPassword &&
        <p
          className={classes.emptyPasswordTitle}
          translation-key="auth_change_empty_password"
        >
          {t("auth_change_empty_password")}
        </p>
      }
      <form
        onSubmit={handleSubmit(onSubmit)}
        name="change-password"
        noValidate
        autoComplete="off"
        className={classes.form}
      >
        {
          !isEmptyPassword &&
          <Inputs
            title={t("field_current_password")}
            translation-key="field_current_password"
            name="currentPassword"
            placeholder={t("field_current_password_placeholder")}
            translation-key-placeholder="field_current_password_placeholder"
            type="password"
            showEyes
            inputRef={register("currentPassword")}
            errorMessage={errors.currentPassword?.message}
          />
        }
        <Inputs
          title={t("field_new_password")}
          translation-key="field_new_password"
          name="newPassword"
          placeholder={t("field_new_password_placeholder")}
          translation-key-placeholder="field_new_password_placeholder"
          type="password"
          showEyes
          inputRef={register("newPassword")}
          errorMessage={errors.newPassword?.message}
        />
        <Inputs
          title={t("field_confirm_new_password")}
          translation-key="field_confirm_new_password"
          name="confirmPassword"
          placeholder={t("field_confirm_new_password_placeholder")}
          translation-key-placeholder="field_confirm_new_password_placeholder"
          type="password"
          showEyes
          inputRef={register("confirmPassword")}
          errorMessage={errors.confirmPassword?.message}
        />
        <Buttons
          type={"submit"}
          children={t("reset_password_btn_submit")}
          translation-key="reset_password_btn_submit"
          btnType="Blue"
          padding="12px 10px"
          className={classes.btnSubmit}
        />
      </form>
    </Grid>
  );
});

export default ChangePassword;
