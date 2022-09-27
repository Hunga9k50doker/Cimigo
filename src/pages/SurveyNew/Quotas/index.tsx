import { ETabRightPanel, QUOTAS_SECTION } from "models/project"
import { memo, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch, useSelector } from "react-redux"
import { ReducerType } from "redux/reducers"
import { RightPanelAction, Content, LeftContent, MobileAction, PageRoot, PageTitle, PageTitleLeft, PageTitleText, RightContent, RightPanel, RightPanelBody, RightPanelContent, RPStepConnector, RPStepContent, RPStepIconBox, RPStepLabel, RPStepper, TabRightPanel } from "../components"
import LockIcon from "../components/LockIcon"
import classes from "./styles.module.scss"
import Button, { BtnType } from "components/common/buttons/Button";
import TextBtnSecondary from "components/common/text/TextBtnSecondary";
import { ArrowForward, Check as CheckIcon, Done, InfoOutlined, Restore, WarningAmber } from "@mui/icons-material"
import { Badge, Box, Grid, IconButton, Step, Tab, Table, TableBody, TableCell, TableHead, TableRow, useMediaQuery, useTheme } from "@mui/material"
import TabPanelBox from "components/TabPanelBox"
import Heading5 from "components/common/text/Heading5"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { editableProject } from "helpers/project"
import { PriceService } from "helpers/price"
import CostSummary from "../components/CostSummary"
import ControlCheckbox from "components/common/control/ControlCheckbox"
import InputCheckbox from "components/common/inputs/InputCheckbox"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { QuotaService } from "services/quota"
import { QuotaTable } from "models/Admin/quota"
import { ProjectService } from "services/project"
import { setProjectReducer } from "redux/reducers/Project/actionTypes";
import { Quota, QuotaTableRow } from "models/quota"
import ParagraphBody from "components/common/text/ParagraphBody"
import clsx from "clsx"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { PROJECT } from "config/constans"
import BasicTooltip from "components/common/tooltip/BasicTooltip"
import images from "config/images"
import React from "react"
import InputTextfield from "components/common/inputs/InputTextfield"
import { push } from "connected-react-router"
import { routes } from "routers/routes"
import PopupInvalidQuota from "../components/PopupInvalidQuota"
import AgreeQuotaWarning from "./components/AgreeQuotaWarning"
import { Helmet } from "react-helmet";

interface QuotasProps {
  projectId: number;
  isHaveChangePrice: boolean;
  tabRightPanel: ETabRightPanel;
  onChangeTabRightPanel: (tab: number) => void;
}

const Quotas = memo(({ projectId, isHaveChangePrice, tabRightPanel, onChangeTabRightPanel }: QuotasProps) => {

  const theme = useTheme();

  const dispatch = useDispatch()

  const { t, i18n } = useTranslation()

  const { configs } = useSelector((state: ReducerType) => state.user)

  const { project } = useSelector((state: ReducerType) => state.project)

  const [quotaTables, setQuotaTables] = useState<QuotaTable[]>([]);
  const [quotas, setQuotas] = useState<Quota[]>([])
  const [quotaEdit, setQuotaEdit] = useState<number>()
  const [popupInvalidQuota, setPopupInvalidQuota] = useState(false)
  const [isShowAgreeQuotaWarning, setIsShowAgreeQuotaWarning] = useState(false)

  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  const editable = useMemo(() => editableProject(project), [project])

  const price = useMemo(() => {
    if (!project || !configs) return null
    return PriceService.getTotal(project, configs)
  }, [project, configs])

  const onSetupTarget = () => {
    dispatch(push(routes.project.detail.target.replace(':id', `${projectId}`)))
  }

  const getQuota = (quotaTableId: number) => {
    return quotas.find(it => it.quotaTable?.id === quotaTableId)
  }

  const getQuotas = async () => {
    dispatch(setLoading(true))
    QuotaService.getQuotas(project.id)
      .then((res) => {
        setQuotas(res.data)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  useEffect(() => {
    if (project?.targets?.length) {
      getQuotas()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project?.targets])

  const scrollToElement = (id: string) => {
    if (!quotas?.length) return
    const el = document.getElementById(id)
    if (!el) return
    const content = document.getElementById(`${QUOTAS_SECTION.CONTENT}-start`)
    document.getElementById(QUOTAS_SECTION.CONTENT).scrollTo({ behavior: 'smooth', top: el.offsetTop - content.offsetTop })
  }

  useEffect(() => {
    const getQuotaTables = async () => {
      QuotaService.getAll({ take: 9999 })
        .then(res => {
          setQuotaTables(res.data)
        })
    }
    getQuotaTables()
  }, [])
  
  const onToggleAgreeQuota = async (agreeQuota: boolean, redirectPay?: boolean) => {
    if (!isReadyQuotas || !editable) return
    dispatch(setLoading(true))
    return ProjectService.updateAgreeQuota(project.id, agreeQuota)
      .then(() => {
        dispatch(setProjectReducer({ ...project, agreeQuota: agreeQuota }))
        if (redirectPay) onRedirectPay()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const checkHasGroupCell = (quota: Quota, questionId: number) => {
    const question = quota.questions.find(it => it.id === questionId)
    return !!question.targetAnswers.find(it => it.targetAnswerGroup)
  }

  const getTotalSampleSize = (rows: QuotaTableRow[]) => {
    return Math.round(rows.reduce((res, item) => res + (item.sampleSize || 0), 0))
  }

  const onStartEdit = (id: number) => {
    if (!editableProject(project)) return
    if (quotaEdit) onCancel()
    setQuotaEdit(id)
  }

  const onCancel = () => {
    if (!quotaEdit) return
    const _quotas = [...quotas]
    const iTable = _quotas.findIndex(it => it.quotaTable.id === quotaEdit)
    if (iTable === -1) return
    _quotas[iTable].rows = _quotas[iTable].rows.map(it => ({
      ...it,
      sampleSize: _quotas[iTable].edited ? it.sampleSizeAdjusted : it.sampleSizeSuggestion
    }))
    setQuotas(_quotas)
    setQuotaEdit(null)
  }

  const onCloseEdit = () => {
    setQuotaEdit(null)
  }

  const onRestore = (quotaTableId: number) => {
    dispatch(setLoading(true))
    ProjectService.resetQuota(project.id, {
      quotaTableId: quotaTableId
    })
      .then((res) => {
        dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
        getQuotas()
      })
      .catch(e => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
      })
  }

  const onOpenPopupInvalidQuota = () => {
    setPopupInvalidQuota(true)
  }

  const onClosePopupInvalidQuota = () => {
    setPopupInvalidQuota(false)
  }

  const onEdit = () => {
    if (!quotaEdit || !isValidEdit()) {
      onOpenPopupInvalidQuota()
      return
    }
    const iTable = quotas.findIndex(it => it.quotaTable.id === quotaEdit)
    if (iTable === -1) return
    ProjectService.updateQuota(project.id, {
      quotaTableId: quotaEdit,
      quotas: quotas[iTable].rows.map(it => ({
        sampleSize: it.sampleSize,
        populationWeight: getPopulationWeight(it),
        answerIds: it.targetAnswers.map(it => it.id)
      }))
    })
      .then((res) => {
        dispatch(setProjectReducer({ ...project, agreeQuota: res.data.agreeQuota }))
        onCloseEdit()
        getQuotas()
      })
      .catch((e) => {
        dispatch(setErrorMess(e))
        dispatch(setLoading(false))
      })
  }

  const getPopulationWeight = (data: QuotaTableRow) => {
    return !data.sampleSize ? 0 : Math.round((data.sampleSizeSuggestion / data.sampleSize) * 10) / 10
  }

  const validPopulationWeight = (data: QuotaTableRow) => {
    return getPopulationWeight(data) >= PROJECT.QUOTA.MIN_POPULATION_WEIGHT && getPopulationWeight(data) <= PROJECT.QUOTA.MAX_POPULATION_WEIGHT
  }

  const onChangeSampleSize = (value: string, quotaTableId: number, index: number) => {
    let sampleSize: number
    if (value !== '' && !isNaN(Number(value)) && Number(value) >= 0) {
      sampleSize = Number(value)
    }
    const _quotas = [...quotas]
    const iTable = _quotas.findIndex(it => it.quotaTable.id === quotaTableId)
    if (iTable === -1) return
    _quotas[iTable].rows[index].sampleSize = sampleSize
    setQuotas(_quotas)
  }

  const isValidEdit = () => {
    if (!quotaEdit) return false
    const iTable = quotas.findIndex(it => it.quotaTable.id === quotaEdit)
    if (iTable === -1) return false
    const inValidPopulationWeight = quotas[iTable].rows.find(it => !validPopulationWeight(it))
    return !inValidPopulationWeight && project?.sampleSize === getTotalSampleSize(quotas[iTable].rows)
  }

  const getQuestion = (quota: Quota, id: number) => {
    return quota.questions.find(it => it.id === id)
  }

  const onShowAgreeQuotaWarning = () => {
    setIsShowAgreeQuotaWarning(true)
  }

  const onCloseAgreeQuotaWarning = () => {
    setIsShowAgreeQuotaWarning(false)
  }

  const onConfirmAgreeQuota = () => {
    onToggleAgreeQuota(true, true)
    onCloseAgreeQuotaWarning()
  }

  const onRedirectPay = () => {
    dispatch(push(routes.project.detail.paymentBilling.root.replace(":id", `${project.id}`)))
  }

  const isReadyQuotas = useMemo(() => {
    return !!quotas?.length && !!project?.sampleSize
  }, [project, quotas])

  const onNextPay = () => {
    if (project?.agreeQuota || !isReadyQuotas || !editable) {
      onRedirectPay()
    } else {
      onShowAgreeQuotaWarning()
    }
  }

  

  return (
    <PageRoot>
      <Helmet>
        <title>{`RapidSurvey - ${project?.name} - Quotas`}</title>
      </Helmet>
      <LeftContent>
        <PageTitle>
          <PageTitleLeft>
            <PageTitleText translation-key="quotas_title_left_panel">{t("quotas_title_left_panel")}</PageTitleText>
            {!editable && <LockIcon status={project?.status} />}
          </PageTitleLeft>
        </PageTitle>
        <Content id={QUOTAS_SECTION.CONTENT}>
          {isReadyQuotas ? (
            <>
              <ParagraphBody id={`${QUOTAS_SECTION.CONTENT}-start`} $colorName="--eerie-black" $fontWeight={500} translation-key="quotas_sub_title_1">
                {t('quotas_sub_title_1')}
              </ParagraphBody>
              <ParagraphBody mt={2} $colorName="--eerie-black" $fontWeight={500} translation-key="quotas_sub_title_2">
                {t('quotas_sub_title_2')}
              </ParagraphBody>
              <Box mt={8}>
                {quotas?.map(quota => {
                  const editing = quotaEdit === quota.quotaTable.id
                  return (
                    <Box
                      key={quota.quotaTable.id}
                      id={`${QUOTAS_SECTION.CONTENT}-item-${quota.quotaTable.id}`}
                      className={clsx(classes.tableBox, { [classes.tableBoxEditing]: editing })}
                    >
                      <Box className={classes.toolbar}>
                        <Box className={classes.tableTitle}>
                          {quota.quotaTable.title} {editing ? (
                            <span className={classes.sub} translate-key="common_in_editing_mode">({t('common_in_editing_mode')})</span>
                          ) : (
                            quota.edited && <span className={classes.sub} translation-key="common_edited">({t('common_edited')})</span>
                          )}
                        </Box>
                        <Box className={classes.tableActions}>
                          {editing ? (
                            <>
                              <Button
                                btnType={BtnType.Text}
                                className={classes.btnCancel}
                                children={<TextBtnSmall translation-key="common_cancel">{t('common_cancel')}</TextBtnSmall>}
                                onClick={onCancel}
                              />
                              <Button
                                btnType={BtnType.Primary}
                                className={classes.btnSave}
                                startIcon={<Done sx={{ fontSize: 16 }} />}
                                children={<TextBtnSmall translation-key="common_save_changes">{t('common_save_changes')}</TextBtnSmall>}
                                onClick={onEdit}
                              />
                            </>
                          ) : (
                            editable && (
                              <>
                                {quota.edited && (
                                  <BasicTooltip arrow title={t('quotas_reset_tooltip')} translation-key="quotas_reset_tooltip">
                                    <IconButton onClick={() => onRestore(quota.quotaTable.id)}>
                                      <Restore sx={{ fontSize: 24, color: "var(--eerie-black-65)" }} />
                                    </IconButton>
                                  </BasicTooltip>
                                )}
                                <BasicTooltip arrow title={t('quotas_edit_tooltip')} translation-key="quotas_edit_tooltip">
                                  <IconButton onClick={() => onStartEdit(quota.quotaTable.id)}>
                                    <img src={images.icEditCell} alt='' />
                                  </IconButton>
                                </BasicTooltip>
                              </>
                            )
                          )}
                        </Box>
                      </Box>
                      <Table>
                        <TableHead>
                          <TableRow>
                            {isMobile ? (
                              <>
                                <TableCell>{quota.quotaTable.titleCell}</TableCell>
                                <TableCell align="center" translation-key="quotas_sample_size">
                                  {t('quotas_sample_size')}
                                </TableCell>
                              </>
                            ) : (
                              <>
                                {quota.questions.map(item => (
                                  <React.Fragment key={item.id}>
                                    {checkHasGroupCell(quota, item.id) && <TableCell>{item.answerGroupName || ''}</TableCell>}
                                    <TableCell>{item.name}</TableCell>
                                  </React.Fragment>
                                ))}
                                {(quota.edited || editing) ? (
                                  <TableCell align="center" translation-key="quotas_your_adjusted_sample_size">
                                    {t('quotas_your_adjusted_sample_size')}
                                  </TableCell>
                                ) : (
                                  <TableCell align="center" translation-key="quotas_representative_sample_size">
                                    {t('quotas_representative_sample_size')}
                                  </TableCell>
                                )}
                              </>
                            )}
                            {editing && (
                              <TableCell align="center" translation-key="quotas_your_population_weights">
                                {isMobile ? (
                                  <BasicTooltip title={t('quotas_weight_tooltip')} translation-key="quotas_weight_tooltip">
                                    <span className={classes.tooltip} translation-key="quotas_weight">{t('quotas_weight')}</span>
                                  </BasicTooltip>
                                ) : (
                                  <>
                                    {t('quotas_your_population_weights')}
                                    <BasicTooltip title={t('quotas_weight_tooltip')} translation-key="quotas_weight_tooltip">
                                      <InfoOutlined className={classes.iconTooltip} />
                                    </BasicTooltip>
                                  </>
                                )}
                              </TableCell>
                            )}
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {quota.rows.map((row, index) => (
                            <TableRow key={index}>
                              {isMobile ? (
                                <TableCell>
                                  {row.targetAnswers.map(answer => (
                                    <div key={answer.id}>{getQuestion(quota, answer.questionId)?.name}: {answer.name}</div>
                                  ))}
                                </TableCell>
                              ) : (
                                row.targetAnswers.map(answer => (
                                  <React.Fragment key={answer.id}>
                                    {checkHasGroupCell(quota, answer.questionId) && <TableCell>{answer.targetAnswerGroup?.name || ''}</TableCell>}
                                    <TableCell>
                                      <BasicTooltip title={answer.description}>
                                        <div>{answer.name}</div>
                                      </BasicTooltip>
                                    </TableCell>
                                  </React.Fragment>
                                ))
                              )}
                              {editing ? (
                                <>
                                  <TableCell align="center">
                                    <InputTextfield
                                      size="small"
                                      type="number"
                                      value={row.sampleSize ?? ''}
                                      root={classes.input}
                                      onChange={(e) => onChangeSampleSize(e.target.value, quota.quotaTable.id, index)}
                                    />
                                  </TableCell>
                                  <TableCell align="center">
                                    <span className={clsx(classes.valid, { [classes.invalid]: !validPopulationWeight(row) })}>
                                      <Box
                                        sx={{
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                        }}
                                      >
                                        {getPopulationWeight(row)}{!validPopulationWeight(row) && <WarningAmber sx={{ fontSize: 16, marginLeft: 0.5 }} />}
                                      </Box>
                                    </span>
                                  </TableCell>
                                </>
                              ) : (
                                <TableCell align="center">
                                  {row.sampleSize || 0}
                                </TableCell>
                              )}
                            </TableRow>
                          ))}
                          <TableRow className={classes.total}>
                            {isMobile ? (
                              <TableCell align="right" translation-key="common_total">
                                {t('common_total')}
                              </TableCell>
                            ) : (
                              quota.questions.map((item, index) => (
                                <React.Fragment key={item.id}>
                                  {checkHasGroupCell(quota, item.id) && <TableCell className={classes.cellDesktop}></TableCell>}
                                  {index !== (quota.questions.length - 1) ? (
                                    <TableCell className={classes.cellDesktop}></TableCell>
                                  ) : (
                                    <TableCell align="right" translation-key="common_total">
                                      {t('common_total')}
                                    </TableCell>
                                  )}
                                </React.Fragment>
                              ))
                            )}
                            {editing ? (
                              <>
                                <TableCell align="center">
                                  <span className={clsx(classes.valid, { [classes.invalid]: getTotalSampleSize(quota.rows) !== project?.sampleSize })}>{getTotalSampleSize(quota.rows)}/</span><span className={classes.valid}>{project?.sampleSize || 0}</span>
                                </TableCell>
                                <TableCell align="center"></TableCell>
                              </>
                            ) : (
                              <TableCell align="center">{getTotalSampleSize(quota.rows)}</TableCell>
                            )}
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Box>
                  )
                })}
              </Box>
            </>
          ) : (
            <Grid className={classes.noSetup}>
              <img src={images.icSad} alt="" />
              <p translation-key="quotas_no_target_title">{t('quotas_no_target_title')}</p>
              <span translation-key="quotas_no_target_sub_title">{t('quotas_no_target_sub_title')}</span>
              <a onClick={onSetupTarget} translation-key="quotas_no_target_btn">{t('quotas_no_target_btn')}</a>
            </Grid>
          )}
        </Content>
        <MobileAction>
          <ControlCheckbox
            $cleanPadding={true}
            control={
              <InputCheckbox
                checked={!!project?.agreeQuota}
                disabled={!isReadyQuotas || !editable}
                onChange={(_, checked) => onToggleAgreeQuota(checked)}
              />
            }
            translation-key="project_right_panel_quotas_agree_allocation"
            label={<>{t("project_right_panel_quotas_agree_allocation")}</>}
          />
          <Button
            sx={{ mt: 2 }}
            fullWidth
            btnType={BtnType.Raised}
            children={<TextBtnSecondary translation-key="quotas_next_pay_btn">{t("quotas_next_pay_btn")}</TextBtnSecondary>}
            endIcon={<ArrowForward />}
            padding="13px 8px !important"
            onClick={onNextPay}
          />
        </MobileAction>
      </LeftContent>
      <RightContent>
        <RightPanel>
          <TabRightPanel value={tabRightPanel} onChange={(_, value) => onChangeTabRightPanel(value)}>
            <Tab label={"Outline"} value={ETabRightPanel.OUTLINE} />
            <Tab label={<Badge color="secondary" variant="dot" invisible={!isHaveChangePrice} translation-key="project_right_panel_cost_summary">{t("project_right_panel_cost_summary")}</Badge>} value={ETabRightPanel.COST_SUMMARY} />
          </TabRightPanel>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.OUTLINE}>
            <RightPanelContent>
              <RightPanelBody>
                <RPStepper orientation="vertical" connector={<RPStepConnector />}>
                  {quotaTables?.map((item) => {
                    const quota = getQuota(item.id)
                    return (
                      <Step key={item.id} active={!!quota} expanded>
                        <RPStepLabel
                          onClick={() => scrollToElement(`${QUOTAS_SECTION.CONTENT}-item-${item.id}`)}
                          StepIconComponent={({ active }) => <RPStepIconBox $active={active}><CheckIcon /></RPStepIconBox>}
                        >
                          <Heading5 className="title" $colorName="--gray-60">{item.title}</Heading5>
                        </RPStepLabel>
                        <RPStepContent>
                          {quota?.edited && (
                            <ParagraphSmall $colorName="--gray-60" translation-key="project_right_panel_quotas_you_have_adjusted">
                              {t("project_right_panel_quotas_you_have_adjusted")}
                            </ParagraphSmall>
                          )}
                        </RPStepContent>
                      </Step>
                    )
                  })}
                </RPStepper>
              </RightPanelBody>
              <RightPanelAction>
                <ControlCheckbox
                  $cleanPadding={true}
                  control={
                    <InputCheckbox
                      checked={!!project?.agreeQuota}
                      disabled={!isReadyQuotas || !editable}
                      onChange={(_, checked) => onToggleAgreeQuota(checked)}
                    />
                  }
                  translation-key="project_right_panel_quotas_agree_allocation"
                  label={<>{t("project_right_panel_quotas_agree_allocation")}</>}
                />
                <Button
                  sx={{ mt: 2 }}
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="quotas_next_pay_btn">{t("quotas_next_pay_btn")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextPay}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
          <TabPanelBox value={tabRightPanel} index={ETabRightPanel.COST_SUMMARY}>
            <RightPanelContent>
              <RightPanelBody>
                <CostSummary
                  project={project}
                  price={price}
                />
              </RightPanelBody>
              <RightPanelAction>
                <ControlCheckbox
                  $cleanPadding={true}
                  control={
                    <InputCheckbox
                      checked={!!project?.agreeQuota}
                      disabled={!isReadyQuotas || !editable}
                      onChange={(_, checked) => onToggleAgreeQuota(checked)}
                    />
                  }
                  translation-key="project_right_panel_quotas_agree_allocation"
                  label={<>{t("project_right_panel_quotas_agree_allocation")}</>}
                />
                <Button
                  sx={{ mt: 2 }}
                  fullWidth
                  btnType={BtnType.Raised}
                  children={<TextBtnSecondary translation-key="quotas_next_pay_btn">{t("quotas_next_pay_btn")}</TextBtnSecondary>}
                  endIcon={<ArrowForward />}
                  padding="13px 8px !important"
                  onClick={onNextPay}
                />
              </RightPanelAction>
            </RightPanelContent>
          </TabPanelBox>
        </RightPanel>
      </RightContent>
      <PopupInvalidQuota
        isOpen={popupInvalidQuota}
        onCancel={onClosePopupInvalidQuota}
      />
      <AgreeQuotaWarning
        isOpen={isShowAgreeQuotaWarning}
        onCancel={onCloseAgreeQuotaWarning}
        onConfirm={onConfirmAgreeQuota}
      />
    </PageRoot>
  )
})

export default Quotas