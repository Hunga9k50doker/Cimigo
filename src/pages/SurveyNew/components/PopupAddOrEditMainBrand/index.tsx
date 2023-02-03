import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { Grid, Dialog } from "@mui/material";
import { Project } from "models/project";
import { DialogTitle } from "components/common/dialogs/DialogTitle";
import { DialogContent } from "components/common/dialogs/DialogContent";
import { DialogActions } from "components/common/dialogs/DialogActions";
import Heading3 from "components/common/text/Heading3";
import ParagraphBody from "components/common/text/ParagraphBody"
import TextBtnSmall from "components/common/text/TextBtnSmall";
import Button, { BtnType } from "components/common/buttons/Button";
import ButtonCLose from "components/common/buttons/ButtonClose";
import classes from "./styles.module.scss";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import InputTextfield from "components/common/inputs/InputTextfield";
import { useTranslation } from "react-i18next";
import { AdditionalBrand } from "models/additional_brand";
import ParagraphSmall from "components/common/text/ParagraphSmall";

interface MainBrandForm {
  brand: string;
  variant: string;
  manufacturer: string;
}
interface Props {
  isOpen: boolean;
  onClose: () => void;
  project?: Project;
  onSubmit: (data: MainBrandForm) => void;
  mainBrand: AdditionalBrand;
}

const PopupAddOrEditMainBrand = (props: Props) => {
  const { isOpen, project, mainBrand, onClose, onSubmit } = props;

  const { t, i18n } = useTranslation();

  const schema = useMemo(() => {
    return yup.object().shape({
      brand: yup.string().required("Brand name is required"),
      variant: yup.string().required("Brand variant is required"),
      manufacturer: yup.string().nullable(),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i18n.language]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<MainBrandForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const _onSubmit = (data) => {
    onSubmit(data)
  };

  const clearForm = () => {
    reset({
      brand: "",
      variant: "",
      manufacturer: "",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      clearForm()
    } else {
      if(mainBrand) {
        reset({
          brand: mainBrand.brand,
          variant: mainBrand.variant,
          manufacturer: mainBrand?.manufacturer,
        });
      }
    }
  }, [isOpen])

  const _onClose = () => {
    onClose()
  }

  return (
    <Dialog
      scroll="paper"
      open={isOpen}
      onClose={() => _onClose()}
      classes={{ paper: classes.paper }}
    >
      <form className={classes.form} onSubmit={handleSubmit(_onSubmit)}>
        <DialogTitle $backgroundColor="--white">
          <Heading3 $colorName="--gray-90">
            Your main brand
          </Heading3>
          <ButtonCLose
            $backgroundColor="--eerie-black-5"
            $colorName="--eerie-black-40"
            onClick={() => _onClose()}>
          </ButtonCLose>
        </DialogTitle>
        <DialogContent dividers sx={{marginBottom: "8px"}}>
          <ParagraphBody $colorName="--eerie-black" mb={3}>
            What is your main brand to track?
          </ParagraphBody>
          <Grid container rowSpacing={2} columnSpacing={3}>
            <Grid item xs={12} md={6}>
              <ParagraphSmall $colorName="--gray-80">
                Brand name
              </ParagraphSmall>
              <InputTextfield
                className={classes.inputField}
                placeholder="e.g. Coca-Cola"
                type="text"
                autoComplete="off"
                inputRef={register("brand")}
                errorMessage={errors.brand?.message}
              />
            </Grid>
            <Grid item xs={12} md={6} pt={{xs: 2, md: 0}}>
              <ParagraphSmall $colorName="--gray-80">
                Brand variant
              </ParagraphSmall>
              <InputTextfield
                className={classes.inputField}
                placeholder="e.g. Light"
                type="text"
                autoComplete="off"
                inputRef={register("variant")}
                errorMessage={errors.variant?.message}
              />
            </Grid>
            <Grid item xs={12} pt={{xs: 2}}>
              <ParagraphSmall $colorName="--gray-80">
                Manufacturer (optional)
              </ParagraphSmall>
              <InputTextfield
                className={classes.inputField}
                placeholder="e.g. The Coca-cola company"
                type="text"
                autoComplete="off"
                inputRef={register("manufacturer")}
                errorMessage={errors.manufacturer?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions className={classes.footer}>
          <Button
            btnType={BtnType.Secondary}
            translation-key="common_cancel"
            children={<TextBtnSmall>{t("common_cancel")}</TextBtnSmall>}
            className={classes.btnCancel}
            onClick={onClose}
          />
          <Button
            btnType={BtnType.Raised}
            type="submit"
            translation-key="common_save"
            children={<TextBtnSmall>{t("common_save")}</TextBtnSmall>}
            className={classes.btnSave}
          />
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default PopupAddOrEditMainBrand;
