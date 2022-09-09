import { Accordion, AccordionSummary, Box, Grid, IconButton, ListItem, ListItemButton, MenuItem } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { editableProject } from "helpers/project"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { ProjectAttribute } from "models/project_attribute"
import { UserAttribute } from "models/user_attribute"
import PopupManatoryAttributes from "pages/Survey/components/PopupManatoryAttributes"
import { MaxChip, Tip } from "pages/SurveyNew/compoments"
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import classes from "./styles.module.scss"
import { Edit as EditIcon, DeleteForever as DeleteForeverIcon, KeyboardArrowDown, ExpandMore, LightbulbOutlined } from "@mui/icons-material"
import Button, { BtnType } from "components/common/buttons/Button"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { Menu } from "components/common/memu/Menu"
import PopupPreDefinedList from "pages/Survey/components/PopupPre-definedList"
import PopupAddOrEditAttribute, { UserAttributeFormData } from "pages/Survey/components/PopupAddOrEditAttribute"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { ProjectAttributeService } from "services/project_attribute"
import { getProjectAttributesRequest, getUserAttributesRequest } from "redux/reducers/Project/actionTypes"
import { UserAttributeService } from "services/user_attribute"
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import PopupConfirmDelete from "components/PopupConfirmDelete"

enum AttributeShowType {
  Project = 1,
  User
}

interface AttributeShow {
  id: number,
  start: string,
  end: string,
  data: ProjectAttribute | UserAttribute,
  type: AttributeShowType
}

interface AdditionalAttributesProps {
  project: Project;
}


const AdditionalAttributes = memo(({ project }: AdditionalAttributesProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()


  const [openPopupMandatory, setOpenPopupMandatory] = useState(false)
  const [openPopupPreDefined, setOpenPopupPreDefined] = useState(false)

  const [openPopupAddAttributes, setOpenPopupAddAttributes] = useState(false)
  const [userAttributeEdit, setUserAttributeEdit] = useState<UserAttribute>()
  const [userAttributeDelete, setUserAttributeDelete] = useState<UserAttribute>()
  const [projectAttributeDelete, setProjectAttributeDelete] = useState<ProjectAttribute>()
  const [anchorElMenuAttributes, setAnchorElMenuAttributes] = useState<null | HTMLElement>(null);

  const editable = useMemo(() => editableProject(project), [project])

  const maxAdditionalAttribute = useMemo(() => project?.solution?.maxAdditionalAttribute || 0, [project])

  const enableAdditionalAttributes = useMemo(() => {
    return maxAdditionalAttribute > ((project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0))
  }, [maxAdditionalAttribute, project])

  const attributes: AttributeShow[] = useMemo(() => {
    return [
      ...(project?.projectAttributes?.map(it => ({
        id: it.id,
        start: it.attribute.start,
        end: it.attribute.end,
        type: AttributeShowType.Project,
        data: it
      })) || []),
      ...(project?.userAttributes?.map(it => ({
        id: it.id,
        start: it.start,
        end: it.end,
        type: AttributeShowType.User,
        data: it
      })) || [])
    ]
  }, [project])

  const onEditUserAttribute = (item: UserAttribute) => {
    setUserAttributeEdit(item)
  }

  const onShowConfirmDeleteAttribute = (item: AttributeShow) => {
    switch (item.type) {
      case AttributeShowType.User:
        setUserAttributeDelete(item.data as UserAttribute)
        break;
      case AttributeShowType.Project:
        setProjectAttributeDelete(item.data as ProjectAttribute)
        break;
    }
  }

  const handleClickMenuAttributes = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuAttributes(event.currentTarget)
  }

  const handleCloseMenuAttributes = () => {
    setAnchorElMenuAttributes(null);
  }

  const onOpenPopupPreDefined = () => {
    setOpenPopupPreDefined(true)
    handleCloseMenuAttributes()
  }

  const onOpenPopupAddAttributes = () => {
    setOpenPopupAddAttributes(true)
    handleCloseMenuAttributes()
  }

  const onClosePopupAttribute = () => {
    setOpenPopupAddAttributes(false)
    setUserAttributeEdit(null)
  }

  const onAddProjectAttribute = (attributeIds: number[]) => {
    if (!attributeIds?.length) {
      setOpenPopupPreDefined(false)
      return
    }
    dispatch(setLoading(true))
    ProjectAttributeService.create({
      projectId: project.id,
      attributeIds: attributeIds
    })
      .then(() => {
        dispatch(getProjectAttributesRequest(project.id))
        setOpenPopupPreDefined(false)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onAddOrEditUserAttribute = (data: UserAttributeFormData) => {
    if (userAttributeEdit) {
      dispatch(setLoading(true))
      UserAttributeService.update(userAttributeEdit.id, {
        start: data.start,
        end: data.end
      })
        .then(() => {
          dispatch(getUserAttributesRequest(project.id))
          onClosePopupAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      UserAttributeService.create({
        projectId: project.id,
        start: data.start,
        end: data.end
      })
        .then(() => {
          dispatch(getUserAttributesRequest(project.id))
          onClosePopupAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onCloseConfirmDeleteAttribute = () => {
    setUserAttributeDelete(null)
    setProjectAttributeDelete(null)
  }
  
  const onDeleteAttribute = () => {
    if (userAttributeDelete) {
      dispatch(setLoading(true))
      UserAttributeService.delete(userAttributeDelete.id)
        .then(() => {
          dispatch(getUserAttributesRequest(project.id))
          onCloseConfirmDeleteAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    if (projectAttributeDelete) {
      dispatch(setLoading(true))
      ProjectAttributeService.delete(projectAttributeDelete.id)
        .then(() => {
          dispatch(getProjectAttributesRequest(project.id))
          onCloseConfirmDeleteAttribute()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.additional_attributes} mt={4}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_add_att_title"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        {t('setup_survey_add_att_title', { step: 4 })}
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall>{t('common_max')} {maxAdditionalAttribute}</ParagraphSmall>} />
      <ParagraphBody
        $colorName="--gray-80"
        mt={1}
        translation-key="setup_survey_add_att_sub_title_1,setup_survey_add_att_sub_title_2,setup_survey_add_att_sub_title_3"
      >
        {t('setup_survey_add_att_sub_title_1')} <span className={classes.subtitleLink} onClick={() => setOpenPopupMandatory(true)}>{t('setup_survey_add_att_sub_title_2')}</span>. {t('setup_survey_add_att_sub_title_3')}
      </ParagraphBody>
      {/* =======start desktop===== */}
      <Grid className={classes.rootList} mt={2}>
        {attributes?.map((item, index) => (
          <ListItem
            alignItems="center"
            component="div"
            key={index}
            className={classes.rootListItem}
            secondaryAction={
              <div className={classes.btnAction}>
                {editable && (
                  <>
                    {item.type === AttributeShowType.User && (
                      <IconButton onClick={() => onEditUserAttribute(item.data as any)} className={classes.iconAction} edge="end" aria-label="Edit">
                        <EditIcon sx={{ fontSize: "20px" }} />
                      </IconButton>
                    )}
                    <IconButton onClick={() => onShowConfirmDeleteAttribute(item)} className={classes.iconAction} edge="end" aria-label="Delete">
                      <DeleteForeverIcon sx={{ fontSize: "20px", color: "var(--red-error)" }} />
                    </IconButton>
                  </>
                )}
              </div>
            }
            disablePadding
          >
            <ListItemButton className={classes.listItem}>
              <Grid display="flex" alignItems="center" justifyContent="center">
                <Grid className={classes.listTextLeft}>
                  <ParagraphSmall $colorName="--eerie-black">{item.start}</ParagraphSmall>
                </Grid>
                <Grid className={classes.listNumber}>
                  <div>{[...Array(10)].map((_, index) => (<span key={index}>{index + 1}</span>))}</div>
                </Grid>
                <Grid className={classes.listTextRight}>
                  <ParagraphSmall $colorName="--eerie-black">{item.end}</ParagraphSmall>
                </Grid>
              </Grid>
            </ListItemButton>
          </ListItem>
        ))}
      </Grid>
      {/* =======end desktop===== */}
      {/* =======start mobile===== */}
      <Grid className={classes.rootListMobile} mt={3}>
        {attributes?.map((item, index) => (
          <Accordion key={index} className={classes.itemListMobile}>
            <AccordionSummary
              expandIcon={<ExpandMore />}
            >
              <Box>
                <ParagraphSmall className={classes.listMobileTitle} >{item.start}</ParagraphSmall>
                <Box className={classes.listMobileContent}>
                  <ParagraphExtraSmall className={classes.listMobileText}>
                    <span translation-key="setup_survey_add_att_start_label">{t("setup_survey_add_att_start_label")}: </span>{item.start}
                  </ParagraphExtraSmall>
                  <ParagraphExtraSmall mt={1} className={classes.listMobileText}>
                    <span translation-key="setup_survey_add_att_end_label">{t("setup_survey_add_att_end_label")}: </span>{item.end}
                  </ParagraphExtraSmall>
                </Box>
                {editable && (
                  <Box className={classes.listMobileAction}>
                    {item.type === AttributeShowType.User && (
                      <Button
                        onClick={(e) => { e.stopPropagation(); onEditUserAttribute(item.data as any) }}
                        btnType={BtnType.Text}
                        translation-key="common_edit"
                        children={<ParagraphExtraSmall>{t('common_edit')}</ParagraphExtraSmall>}
                      />
                    )}
                    <Button
                      onClick={(e) => { e.stopPropagation(); onShowConfirmDeleteAttribute(item) }}
                      className={classes.listMobileActionDelete}
                      btnType={BtnType.Text}
                      translation-key="common_delete"
                      children={<ParagraphExtraSmall>{t('common_delete')}</ParagraphExtraSmall>}
                    />
                  </Box>
                )}
              </Box>
            </AccordionSummary>
          </Accordion>
        ))}
      </Grid>
      {/* =======end mobile===== */}
      <Button
        sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
        onClick={handleClickMenuAttributes}
        disabled={!enableAdditionalAttributes || !editable}
        btnType={BtnType.Outlined}
        translation-key="setup_survey_add_att_menu_action_placeholder"
        children={<TextBtnSmall>{t('setup_survey_add_att_menu_action_placeholder')}</TextBtnSmall>}
        endIcon={<KeyboardArrowDown sx={{ fontSize: "16px !important" }} />}
      />
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuAttributes}
        open={Boolean(anchorElMenuAttributes)}
        onClose={handleCloseMenuAttributes}
      >
        <MenuItem onClick={onOpenPopupPreDefined}>
          <ParagraphBody translation-key="setup_survey_add_att_menu_action_from_pre_defined_list">{t('setup_survey_add_att_menu_action_from_pre_defined_list')}</ParagraphBody>
        </MenuItem>
        <MenuItem onClick={onOpenPopupAddAttributes}>
          <ParagraphBody translation-key="setup_survey_add_att_menu_action_your_own_attribute">{t('setup_survey_add_att_menu_action_your_own_attribute')}</ParagraphBody>
        </MenuItem>
      </Menu>
      {!enableAdditionalAttributes && (
        <ParagraphSmall mt={1} translation-key="setup_survey_add_att_error_max" $colorName="--red-error">{t('setup_survey_add_att_error_max', { max: maxAdditionalAttribute })}</ParagraphSmall>
      )}
      <Tip sx={{ mt: { sm: 3, xs: 1 } }}>
        <LightbulbOutlined />
        <ParagraphSmall translation-key="setup_survey_add_att_tip" dangerouslySetInnerHTML={{ __html: t('setup_survey_add_att_tip') }}/>
      </Tip>
      <PopupManatoryAttributes
        isOpen={openPopupMandatory}
        project={project}
        onClose={() => setOpenPopupMandatory(false)}
      />
      <PopupPreDefinedList
        isOpen={openPopupPreDefined}
        project={project}
        projectAttributes={project?.projectAttributes}
        maxSelect={(project?.solution?.maxAdditionalAttribute || 0) - ((project?.projectAttributes?.length || 0) + (project?.userAttributes?.length || 0))}
        onClose={() => setOpenPopupPreDefined(false)}
        onSubmit={onAddProjectAttribute}
      />
      <PopupAddOrEditAttribute
        isAdd={openPopupAddAttributes}
        itemEdit={userAttributeEdit}
        onCancel={() => onClosePopupAttribute()}
        onSubmit={onAddOrEditUserAttribute}
      />
      <PopupConfirmDelete
        isOpen={!!userAttributeDelete || !!projectAttributeDelete}
        title={t('setup_survey_add_att_confirm_delete_title')}
        description={t('setup_survey_add_att_confirm_delete_sub')}
        onCancel={() => onCloseConfirmDeleteAttribute()}
        onDelete={onDeleteAttribute}
      />
    </Grid>
  )
})

export default AdditionalAttributes