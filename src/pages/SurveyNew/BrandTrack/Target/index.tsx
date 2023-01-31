import {
  ArrowCircleDownRounded,
  ArrowCircleUpRounded,
  ArrowForward,
} from "@mui/icons-material";
import { Tab, Badge, Step, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading4 from "components/common/text/Heading4";
import Heading5 from "components/common/text/Heading5";
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import TabPanelBox from "components/TabPanelBox";
import { usePrice } from "helpers/price";
import ProjectHelper, { editableProject } from "helpers/project";
import { ETabRightPanel, TARGET_SECTION } from "models/project";
import { memo, useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ReducerType } from "redux/reducers";
import {
  Content,
  LeftContent,
  MobileAction,
  MobileOutline,
  ModalMobile,
  PageRoot,
  PageTitle,
  PageTitleLeft,
  PageTitleText,
  RightContent,
  RightPanel,
  RightPanelAction,
  RightPanelBody,
  RightPanelContent,
  RPStepConnector,
  RPStepContent,
  RPStepIconBox,
  RPStepLabel,
  RPStepper,
  TabRightPanel,
} from "../../components";
import CostSummary from "../../components/CostSummary";
import LockIcon from "../../components/LockIcon";
import classes from "./styles.module.scss";
import SelectTargetBox from "pages/SurveyNew/Target/SelectTargetBox";
interface BrandTrackProps {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  toggleOutlineMobile: boolean;
  onChangeTabRightPanel: (tab: number) => void;
  onToggleViewOutlineMobile: () => void;
}
const BrandTrack = memo(
  ({
    isHaveChangePrice,
    tabRightPanel,
    toggleOutlineMobile,
    onChangeTabRightPanel,
    onToggleViewOutlineMobile,
  }: BrandTrackProps) => {
    const { t } = useTranslation();

    const { project } = useSelector((state: ReducerType) => state.project);
    const [clickNextQuotas, setClickNextQuotas] = useState<boolean>(false);

    const editable = useMemo(() => editableProject(project), [project]);

    const { price } = usePrice();

    const isValidTarget = useMemo(() => {
      return ProjectHelper.isValidTarget(project);
    }, [project]);

    const scrollToElement = (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      const content = document.getElementById(TARGET_SECTION.SAMPLE_SIZE);
      document.getElementById(TARGET_SECTION.CONTENT).scrollTo({
        behavior: "smooth",
        top: el.offsetTop - content.offsetTop,
      });
    };
    const onNextQuotas = () => {
      setClickNextQuotas(true);
    };
    return (
      <PageRoot className={classes.root}>
        <LeftContent>
          <PageTitle>
            <PageTitleLeft>
              <PageTitleText translation-key="target_title_left_panel">
                {t("target_title_left_panel")}
              </PageTitleText>
              {!editable && <LockIcon status={project?.status} />}
            </PageTitleLeft>
          </PageTitle>
          <Content id={TARGET_SECTION.CONTENT}>
            <Grid>
              <ParagraphBody
                $colorName={"--gray-80"}
                $fontWeight={400}
                className={classes.descriptionPlan}
                translation-key="brand_track_your_plan"
                dangerouslySetInnerHTML={{
                  __html: t("brand_track_your_plan", {
                    sampleSize: project?.sampleSize,
                  }),
                }}
              ></ParagraphBody>
            </Grid>
            <Grid mt={4} id={TARGET_SECTION.SELECT_TARGET}>
              <Heading4
                $fontSizeMobile={"16px"}
                $colorName="--eerie-black"
                translation-key="brand_track_who_do_you_want_target_title"
              >
                {t("brand_track_who_do_you_want_target_title")}
              </Heading4>
              <ParagraphBody
                $colorName="--gray-80"
                mt={1}
                translation-key="brand_track_who_do_you_want_target_sub_title"
              >
                {t("brand_track_who_do_you_want_target_sub_title")}
              </ParagraphBody>
              <SelectTargetBox
                project={project}
                clickNextQuotas={clickNextQuotas}
                setClickNextQuotas={setClickNextQuotas}
              />
            </Grid>
          </Content>
          <MobileAction>
            <Button
              fullWidth
              btnType={BtnType.Raised}
              children={
                <TextBtnSecondary translation-key="target_next_btn">
                  {t("target_next_btn")}
                </TextBtnSecondary>
              }
              endIcon={<ArrowForward />}
              padding="13px 8px !important"
              onClick={onNextQuotas}
            />
            <MobileOutline onClick={onToggleViewOutlineMobile}>
              <ParagraphSmall
                $colorName="--cimigo-blue"
                translation-key="common_btn_view_outline"
              >
                {t("common_btn_view_outline")}
              </ParagraphSmall>
              <ArrowCircleUpRounded />
            </MobileOutline>
            <ModalMobile
              $toggleOutlineMobile={toggleOutlineMobile}
            ></ModalMobile>
          </MobileAction>
        </LeftContent>
        <RightContent $toggleOutlineMobile={toggleOutlineMobile}>
          <RightPanel>
            <MobileOutline onClick={onToggleViewOutlineMobile}>
              <ParagraphSmall
                $colorName="--cimigo-blue"
                translation-key="common_btn_close_outline"
              >
                {t("common_btn_close_outline")}
              </ParagraphSmall>
              <ArrowCircleDownRounded />
            </MobileOutline>
            <TabRightPanel
              value={tabRightPanel}
              onChange={(_, value) => onChangeTabRightPanel(value)}
            >
              <Tab
                translation-key="project_right_panel_outline"
                label={t("project_right_panel_outline")}
                value={ETabRightPanel.OUTLINE}
              />
              <Tab
                label={
                  <Badge
                    color="secondary"
                    variant="dot"
                    invisible={!isHaveChangePrice}
                    translation-key="project_right_panel_cost_summary"
                  >
                    {t("project_right_panel_cost_summary")}
                  </Badge>
                }
                value={ETabRightPanel.COST_SUMMARY}
              />
            </TabRightPanel>
            <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
              <RightPanelContent>
                <RightPanelBody>
                  <RPStepper
                    orientation="vertical"
                    connector={<RPStepConnector />}
                  >
                    <Step active={isValidTarget} expanded>
                      <RPStepLabel
                        onClick={() =>
                          scrollToElement(TARGET_SECTION.SELECT_TARGET)
                        }
                        StepIconComponent={({ active }) => (
                          <RPStepIconBox $active={active}>
                            <span className={classes.numberOutline}>1</span>
                          </RPStepIconBox>
                        )}
                      >
                        <Heading5
                          className="title"
                          $colorName="--gray-90"
                          translation-key="brand_track_project_right_panel_step_criteria_title"
                        >
                          {t(
                            "brand_track_project_right_panel_step_criteria_title"
                          )}
                        </Heading5>
                      </RPStepLabel>
                      <RPStepContent>
                        <ParagraphExtraSmall
                          className={classes.descriptionStep}
                          $colorName="--gray-80"
                          translation-key="brand_track_project_right_panel_step_criteria_sub_title"
                        >
                          {t(
                            "brand_track_project_right_panel_step_criteria_sub_title"
                          )}
                        </ParagraphExtraSmall>
                      </RPStepContent>
                    </Step>
                  </RPStepper>
                </RightPanelBody>
                <RightPanelAction>
                  <Button
                    fullWidth
                    btnType={BtnType.Raised}
                    children={
                      <TextBtnSecondary translation-key="target_next_btn_review">
                        {t("target_next_btn_review")}
                      </TextBtnSecondary>
                    }
                    endIcon={<ArrowForward />}
                    padding="13px 8px !important"
                    onClick={onNextQuotas}
                  />
                </RightPanelAction>
              </RightPanelContent>
            </TabPanelBox>
            <TabPanelBox
              value={tabRightPanel}
              index={ETabRightPanel.COST_SUMMARY}
            >
              <RightPanelContent>
                <RightPanelBody>
                  <CostSummary project={project} price={price} />
                </RightPanelBody>
                <RightPanelAction>
                  <Button
                    fullWidth
                    btnType={BtnType.Raised}
                    children={
                      <TextBtnSecondary translation-key="target_next_btn_review">
                        {t("target_next_btn_review")}
                      </TextBtnSecondary>
                    }
                    endIcon={<ArrowForward />}
                    padding="13px 8px !important"
                    onClick={onNextQuotas}
                  />
                </RightPanelAction>
              </RightPanelContent>
            </TabPanelBox>
          </RightPanel>
        </RightContent>
      </PageRoot>
    );
  }
);
export default BrandTrack;
