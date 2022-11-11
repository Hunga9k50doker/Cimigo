import { useMemo, useState} from "react";
import {
  Grid,
  Box,
  RadioGroup, Radio,
  useMediaQuery, useTheme, FormControlLabel
} from "@mui/material";
import { useForm, Controller} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import classes from "./styles.module.scss";
import * as yup from "yup";
import { useTranslation } from "react-i18next";
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import Heading5 from "components/common/text/Heading5";
import InputTextfield from "components/common/inputs/InputTextfield";
import BasicTooltip from "components/common/tooltip/BasicTooltip";
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Heading6 from "components/common/text/Heading6";
import {EVIDEO_MARKETING_STAGE} from "models/general";

const CHARACTER_LIMIT = 200;

export interface InformationForm {
  videoName: string;
  brandName: string;
  productName: string;
  keyMessage: string;
  launchId: number;
}

interface Props {
  // onChangeStep?: () => void;
  // onSubmit: (data: FormData) => void;
}


// eslint-disable-next-line no-empty-pattern
const Information = ({}: Props) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down(600));

  const [character, setCharacter] = useState(0);

  const schema = useMemo(() => {
    return yup.object().shape({
      videoName: yup.string().required("Video name is required"),
      brandName: yup.string().required("Brand name is required"),
      productName: yup.string().required("Product name is required"),
      keyMessage: yup.string().required("Key name is required"),
      launchId: yup.number(),
        })
      // eslint-disable-next-line react-hooks/exhaustive-deps
      },[i18n.language]);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    register,
    watch,
  } = useForm<InformationForm>({
    resolver: yupResolver(schema),
    mode: "onChange",
    defaultValues: {
      launchId: EVIDEO_MARKETING_STAGE.PRE_LAUNCH,
    },
  });

  const _onSubmit = (data: InformationForm) => {
    console.log(data);
  }

  const handleChangeCharacter = (e) => {
    setCharacter(e.target.value.length);
  };

  const handleChangeLaunch = (e) => {
    const  value  = e.target.value;
    setValue("launchId", value);
  }

  return (
    <>
    <Grid component="form" onSubmit={handleSubmit(_onSubmit)}>
       <Grid className={classes.root}>
            <Grid className={classes.containerInformation}>
                <Box sx={{mb:3}}>
                    <Heading4 $colorName="--eerie-black">Video information</Heading4>
                    <ParagraphSmall $colorName="--gray-80">Please enter some information about your video.</ParagraphSmall>
                </Box>
                <Box sx={{mb:3}}>
                    <Heading5 $colorName="--eerie-black">Video name</Heading5>
                    <ParagraphSmall $colorName="--gray-80" sx={{mb: 1}}>This name will be used to distinguish videos in the results.</ParagraphSmall>
                    <InputTextfield
                    placeholder="Enter video name"
                    type="text"
                    autoFocus
                    autoComplete="off"
                    inputRef={register("videoName")}
                    errorMessage={errors.videoName?.message}
                    />
                </Box>
                <Box> 
                    <Box className={classes.boxMarketingStage}>
                        <Heading5 $colorName="--eerie-black">Marketing stage</Heading5>
                        <BasicTooltip arrow title={
                        <div>
                            <Heading6>What is the key message?</Heading6>
                            <ParagraphExtraSmall>A key message is the main point of information you want your audience to hear, understand, and remember throughout your video ads.</ParagraphExtraSmall>
                        </div>
                        }>
                            <HelpOutlineIcon sx={{ml: 1, fontSize: "16px", color: "var(--gray-40)"}}></HelpOutlineIcon>
                        </BasicTooltip>
                    </Box>
                    <ParagraphSmall $colorName="--gray-80">Is this video available on the market (post-launch) or in the testing stage (pre-launch)?</ParagraphSmall>
                    <Box sx={{mt:1}}>
                      <Controller
                      name="launchId"
                      control={control}
                      render={({ field }) => (
                        <RadioGroup
                        name={field.name}
                        value={field.value}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={handleChangeLaunch}
                        classes={{ root: classes.radioGroup }}
                        >
                            <FormControlLabel
                            className={classes.boxRadio} 
                            control={
                              <Radio
                              value={EVIDEO_MARKETING_STAGE.POST_LAUNCH}
                              classes={{
                              root: classes.rootRadio,
                              checked: classes.checkRadio,
                              }}
                              />
                            }
                            label={<ParagraphSmall $colorName="--eerie-black">Post-launch</ParagraphSmall>}              
                            />
                            <FormControlLabel 
                            control={
                              <Radio
                              value={EVIDEO_MARKETING_STAGE.PRE_LAUNCH}
                              classes={{
                              root: classes.rootRadio,
                              checked: classes.checkRadio,
                              }}
                              />
                            }
                            label={<ParagraphSmall $colorName="--eerie-black">Pre-launch</ParagraphSmall>}              
                            />
                        </RadioGroup>
                      )}
                      />
                    </Box>
                    <Box sx={{mt:3}}>
                        <Heading5 $colorName="--eerie-black">Brand-related information:</Heading5>
                        <ParagraphSmall $colorName="--eerie-black">Please enter the information below about your product mentioned in the video.</ParagraphSmall>
                        <Grid container columnSpacing={isMobile ? 0 : 2} rowSpacing={2} className={classes.containerInput}>
                          <Grid item xs={12} sm={6}>
                              <InputTextfield
                              title="Brand name"
                              placeholder="e.g. Pepsi"
                              type="text"
                              autoFocus
                              autoComplete="off"
                              inputRef={register("brandName")}
                              errorMessage={errors.brandName?.message}
                              />
                          </Grid>
                          <Grid item xs={12} sm={6}>
                              <InputTextfield
                              title="Product name"
                              placeholder="e.g. Pepsi Zero Sugar"
                              type="text"
                              autoFocus
                              autoComplete="off"
                              inputRef={register("productName")}
                              errorMessage={errors.productName?.message}
                              />
                          </Grid>
                          <Grid item xs={12}>
                            <Box className={classes.boxKeyMessage}>
                              <ParagraphSmall $colorName="--eerie-black">Key message of your video</ParagraphSmall>
                              <BasicTooltip arrow title={
                              <div>
                                  <Heading6>What is the key message?</Heading6>
                                  <ParagraphExtraSmall>A key message is the main point of information you want your audience to hear, understand, and remember throughout your video ads.</ParagraphExtraSmall>
                              </div>
                              }>
                                  <HelpOutlineIcon sx={{ml: 1, fontSize: "16px", color: "var(--gray-40)"}}></HelpOutlineIcon>
                              </BasicTooltip>
                            </Box>
                            <Grid className={classes.boxInputTextArea}>
                            <InputTextfield
                            placeholder="Enter key message"
                            className={classes.inputTextArea}
                            onChange={handleChangeCharacter}
                            infor={`${character}/${CHARACTER_LIMIT}`}
                            inputRef={register("keyMessage")}
                            inputProps={{
                            maxLength: CHARACTER_LIMIT,
                            }}
                            errorMessage={errors.keyMessage?.message}
                            />
                            </Grid>
                          </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Grid>
            <Grid>
              <iframe width="300" height="168.75" className={classes.iframeVideo}
              src="https://www.youtube.com/embed/wlBr9QCucZs" 
              title="YouTube video player" frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen>
              </iframe>               
            </Grid>
        </Grid> 
        <Grid className={classes.boxAction}>
          <Button btnType={BtnType.Primary} type="submit" className={classes.btnNext}>
              Next
          </Button>
        </Grid>
    </Grid>
  </>
  );
};

export default Information;
