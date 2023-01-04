import { Grid } from "@mui/material"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useMemo } from "react"
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import { useTranslation } from "react-i18next"
import { editableProject } from "helpers/project"
import { useDispatch } from "react-redux"
import ControlCheckbox from "components/common/control/ControlCheckbox";
import InputCheckbox from "components/common/inputs/InputCheckbox";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import InputSelect from "components/common/inputs/InputSelect";
import { categoryTypes, OptionItemT } from "models/general";
import { HelpOutline as HelpIcon, ArrowForward, Check as CheckIcon, BurstMode as BurstModeIcon, FactCheck as FactCheckIcon, PlaylistAdd as PlaylistAddIcon, FormatAlignLeft as FormatAlignLeftIcon, RemoveRedEye as RemoveRedEyeIcon, ArrowCircleUpRounded, ArrowCircleDownRounded } from '@mui/icons-material';
import classes from "./styles.module.scss"
import TooltipWrapper from "pages/SurveyNew/components/TooltipWrapper";

interface BasicInformationForm {
  category: OptionItemT<string>;
}

interface BasicInformationProps {
  project: Project
}

const BasicInformation = memo(({ project }: BasicInformationProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const editable = useMemo(() => editableProject(project), [project])

  const schema = yup.object().shape({
    category: yup
      .object({
        id: yup.string().required("This field is required"),
      })
      .required("This field is required"),
  })

  const { register, control, handleSubmit, formState: { errors }, reset } = useForm<BasicInformationForm>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: BasicInformationForm) => {}

  return (
    <Grid component="form" autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)} id={SETUP_SURVEY_SECTION.basic_information}>
      <Heading4 $fontSizeMobile={"16px"} mb={1} $colorName="--eerie-black">STEP 1: Select your brand category</Heading4>
      <ParagraphBody $colorName="--gray-80" mb={{ xs: 1, sm: 2 }}>Please select the category in which the brand you want to perform performance tracking is active in.</ParagraphBody>
      <Grid container spacing={2} maxWidth={{ xs: "unset", sm: "684px" }}>
        <Grid item xs={12} sm={6} id={`${SETUP_SURVEY_SECTION.basic_information}-category`}>
          <InputSelect
            className={classes.selectCategory}
            name="category"
            control={control}
            selectProps={{
              options: categoryTypes,
              placeholder: "Select category",
            }}
            errorMessage={
              (errors.category as any)?.message ||
              errors.category?.id?.message
            }
          />
        </Grid>
      </Grid>
      <div>
        <div className={classes.selectPremiseWrapper}>
        <ControlCheckbox
          className={classes.selectPremise}
          $cleanPadding={true}
          control={
            <InputCheckbox/>
          }
          label="On vs Off premise"
        />
        <TooltipWrapper
          className={classes.tooltip}
          tooltipPopper={classes.tooltipPopper}
          title="On vs Off premise"
          caption="If your category exhibits different brand dynamics when used at home as opposed to on premise in outlets (e.g. drinks, tobacco) then please select this option."
        >
          <HelpIcon sx={{ fontSize: "16px", color: "var(--gray-60)" }} className={classes.helpIcon} />
        </TooltipWrapper>
        </div>
        <ParagraphSmall ml={3.5} $colorName="--gray-80">
        If your category exhibits different brand dynamics when used at home as opposed to on premise in outlets (e.g. drinks, tobacco) then please select this option.
        </ParagraphSmall>
      </div>
    </Grid>
  )
})

export default BasicInformation