import { Grid, IconButton, ListItem, ListItemButton } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useMemo, useState } from "react"
import { Edit as EditIcon, PlayArrow, Add as AddIcon, Edit, Stars } from '@mui/icons-material';
import classes from "./styles.module.scss"
import ProjectHelper, { editableProject } from "helpers/project"
import NoteWarning from "components/common/warnings/NoteWarning"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import Button, { BtnType } from "components/common/buttons/Button"
import IconNewLabelFilled from "components/icons/IconNewLabelFilled"
import { AdditionalBrand, EBrandType } from "models/additional_brand"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AdditionalBrandService } from "services/additional_brand"
import { getAdditionalBrandsRequest } from "redux/reducers/Project/actionTypes"
import PopupAddOrEditAdditionalBrand from "pages/SurveyNew/components/PopupAddOrEditAdditionalBrand"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { useTranslation } from "react-i18next"
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline"
import CloseIcon from '@mui/icons-material/Close';
import clsx from "clsx"

interface BrandListProps {
  project: Project
}
interface BrandForm {
  brand: string;
  variant: string;
  manufacturer: string;
}

const BrandList = memo(({ project }: BrandListProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [isOpenAddOrEditBrandModal, setIsOpenAddOrEditBrandModal] = useState<boolean>(false)
  const [brandEdit, setBrandEdit] = useState<AdditionalBrand>(null)
  const [brandType, setBrandType] = useState<EBrandType>(EBrandType.MAIN)
  const [showMoreCompetingBrand, setShowMoreCompetingBrand] = useState<boolean>(false)
  const [competingBrandDelete, setCompetingBrandDelete] = useState<AdditionalBrand>(null)

  const mainBrandDatas = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN) || [], [project])
  const competingBrandDatas = useMemo(() => project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING) || [], [project])

  const maxMainBrand = useMemo(() => project?.solution?.maxMainBrand || 0, [project])
  const maxCompetingBrand = useMemo(() => project?.solution?.maxCompetingBrand || 0, [project])
  const mainBrandNeedMore = useMemo(() => ProjectHelper.mainBrandNeedMore(project) || 0, [project])
  const competingBrandNeedMore = useMemo(() => ProjectHelper.competingBrandNeedMore(project) || 0, [project])
  const editable = useMemo(() => editableProject(project), [project])

  const onAddMainBrand = () => {
    setBrandType(EBrandType.MAIN)
    setIsOpenAddOrEditBrandModal(true)
  }
  const onEditMainBrand = (mainBrand: AdditionalBrand) => {
    setBrandEdit(mainBrand)
    setBrandType(EBrandType.MAIN)
    setIsOpenAddOrEditBrandModal(true)
  }
  
  const onAddCompetingBrand = () => {
    setBrandType(EBrandType.COMPETING)
    setIsOpenAddOrEditBrandModal(true)
  }
  const onEditCompetingBrand = (competingBrand: AdditionalBrand) => {
    setBrandEdit(competingBrand)
    setBrandType(EBrandType.COMPETING)
    setIsOpenAddOrEditBrandModal(true)
  }
  
  const onClosePopupAddOrEditBrand = () => {
    setBrandEdit(null)
    setIsOpenAddOrEditBrandModal(false)
  }

  const handleAddOrEditBrand = (data: BrandForm) => {
    if (brandEdit?.id) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(brandEdit.id, {
        typeId: brandType,
        ...data
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      AdditionalBrandService.create({
        projectId: project.id,
        typeId: brandType,
        ...data
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onShowConfirmDeleteCompetingBrand = (competingBrand: AdditionalBrand) => {
    setCompetingBrandDelete(competingBrand)
  }
  const onCloseConfirmDeleteCompetingBrand = () => {
    setCompetingBrandDelete(null)
  }
  const onDeleteCompetingBrand = () => {
    if (!competingBrandDelete) return
    dispatch(setLoading(true))
    AdditionalBrandService.delete(competingBrandDelete.id)
      .then(() => {
        dispatch(getAdditionalBrandsRequest(project.id))
        onCloseConfirmDeleteCompetingBrand()
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onShowMoreCompetingBrand = () => {
    setShowMoreCompetingBrand(!showMoreCompetingBrand)
  }

  return (
    <>
      <Grid id={SETUP_SURVEY_SECTION.brand_list} mt={4}>
        <Heading4
          $fontSizeMobile={"16px"}
          $colorName="--eerie-black"
          sx={{ display: "inline-block", verticalAlign: "middle" }}
          translation-key="setup_brand_track_brand_list_title"
        >
          {t('setup_brand_track_brand_list_title', { step: 2 })}
        </Heading4>
        <ParagraphBody $colorName="--eerie-black" mb={ 3 } mt={ 1 } translation-key="setup_brand_track_brand_list_sub_title">{t("setup_brand_track_brand_list_sub_title")}</ParagraphBody>
        <Grid mb={3}>
          <div className={classes.mainBrandTitle}>
            <PlayArrow sx={{height: "18px"}}/>
            <ParagraphBody $fontWeight={600} $colorName="--eerie-black" translation-key="setup_brand_track_brand_list_main_brand_title">
              {t("setup_brand_track_brand_list_main_brand_title")}
            </ParagraphBody>
          </div>
          <ParagraphBody $colorName="--eerie-black" mb={ 2 } ml={ 3 } translation-key="setup_brand_track_brand_list_main_brand_sub_title">{t("setup_brand_track_brand_list_main_brand_sub_title")}</ParagraphBody>
          {!!mainBrandNeedMore && (
            <NoteWarning ml={ 3 } mb = { 2 }>
              <ParagraphSmall $colorName="--warning-dark" translation-key="setup_brand_track_brand_list_main_brand_need_more">{t("setup_brand_track_brand_list_main_brand_need_more", { number: mainBrandNeedMore })}</ParagraphSmall>
            </NoteWarning>
          )}
          {mainBrandDatas?.map(mainItem => (
            <div className={classes.mainBrand}>
              <ParagraphSmall $colorName="--cimigo-blue-dark-1" $fontWeight={500} sx={{display: "flex", alignItems: "center", gap: "8px"}}>
                <Stars sx={{color: "var(--cimigo-blue-dark-1)", fontSize: "20px"}}/> {mainItem.brand}
              </ParagraphSmall>
              {editable && (
                <Button
                  btnType={BtnType.Text}
                  children={<TextBtnSmall sx={{ color: "var(--cimigo-blue-dark-1) !important" }} translation-key="common_edit">{t("common_edit")}</TextBtnSmall>}
                  startIcon={<Edit sx={{ color: "var(--cimigo-blue-dark-1)", fontSize: "16px !important" }} />}
                  onClick={() => {
                    onEditMainBrand(mainItem)
                  }}
                />
              )}
            </div>
          ))}
          {editable && mainBrandDatas.length < maxMainBrand && (
            <Button
              className={classes.btnAddMainBrand}
              btnType={BtnType.Outlined}
              children={<TextBtnSmall translation-key="setup_brand_track_brand_list_main_brand_add_btn">{t("setup_brand_track_brand_list_main_brand_add_btn")}</TextBtnSmall>}
              startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
              onClick={onAddMainBrand}
            />
          )}
        </Grid>
        <Grid>
          <div className={classes.competingBrandTitle}>
            <PlayArrow sx={{height: "18px"}}/>
            <ParagraphBody $fontWeight={600} $colorName="--eerie-black" translation-key="setup_brand_track_brand_list_competing_brand_title">
              {t("setup_brand_track_brand_list_competing_brand_title")}
            </ParagraphBody>
          </div>
          <ParagraphBody $colorName="--eerie-black" mb={ 4 } ml={ 3 } translation-key="setup_brand_track_brand_list_competing_brand_sub_title_1">{t("setup_brand_track_brand_list_competing_brand_sub_title_1")}</ParagraphBody>
          <ParagraphBody $colorName="--eerie-black" mb={ 2 } ml={ 3 } translation-key="setup_brand_track_brand_list_competing_brand_sub_title_2">{t("setup_brand_track_brand_list_competing_brand_sub_title_2")}</ParagraphBody> 
          {!!competingBrandNeedMore && (
            <NoteWarning ml={ 3 }>
              <ParagraphSmall $colorName="--warning-dark" translation-key="setup_brand_track_brand_list_competing_brand_need_more">
                {t("setup_brand_track_brand_list_competing_brand_need_more", {number: competingBrandNeedMore})}
              </ParagraphSmall>
            </NoteWarning>
          )}
          <Grid className={classes.rootList} ml={3}>
            {competingBrandDatas?.map((item, index) => (
              <ListItem
                alignItems="center"
                component="div"
                key={item?.id}
                className={clsx(classes.rootListItem, { [classes.notDisplayed]: index > 2 && !showMoreCompetingBrand })}
                secondaryAction={
                  <div className={classes.btnAction}>
                    {editable && (
                      <>
                        <IconButton onClick={() => onEditCompetingBrand(item)} className={classes.iconAction} edge="end" aria-label="Edit">
                          <EditIcon sx={{ fontSize: "20px" }} />
                        </IconButton>
                        <IconButton onClick={() => onShowConfirmDeleteCompetingBrand(item)} className={classes.iconAction} edge="end" aria-label="Delete">
                          <CloseIcon sx={{ fontSize: "20px", color: "var(--gray-60)" }} />
                        </IconButton>
                      </>
                    )}
                  </div>
                }
                disablePadding
              >
                <ListItemButton className={classes.listItem}>
                  <ParagraphSmall $colorName="--eerie-black">{item.brand}</ParagraphSmall>
                </ListItemButton>
              </ListItem>
            ))}
            {competingBrandDatas?.length > 3 && (
              showMoreCompetingBrand ? (
                <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreCompetingBrand} translation-key="common_less_brands_text">
                  {t("common_less_brands_text", {number: competingBrandDatas?.length - 3})}
                </ParagraphBodyUnderline>
                ) : (
                <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreCompetingBrand} translation-key="common_more_brands_text">
                  {t("common_more_brands_text", {number: competingBrandDatas?.length - 3})}
                </ParagraphBodyUnderline>)
            )}
          </Grid>
          <Button
            disabled={!editable || competingBrandDatas?.length >= maxCompetingBrand}
            className={classes.btnAddBrand}
            btnType={BtnType.Outlined}
            children={<TextBtnSmall translation-key="setup_brand_track_brand_list_competing_brand_add_btn">{t("setup_brand_track_brand_list_competing_brand_add_btn")}</TextBtnSmall>}
            startIcon={<IconNewLabelFilled sx={{ fontSize: "16px !important" }} />}
            onClick={onAddCompetingBrand}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          />
          {competingBrandDatas?.length >= maxCompetingBrand && (
            <ParagraphSmall $colorName="--gray-60" mt={1} ml={3} translation-key="setup_brand_track_brand_list_competing_brand_reach_limit">
              {t("setup_brand_track_brand_list_competing_brand_reach_limit", {number: maxCompetingBrand})}
            </ParagraphSmall>
          )}
        </Grid>
      </Grid>
      <PopupAddOrEditAdditionalBrand
        isOpen={isOpenAddOrEditBrandModal}
        onClose={onClosePopupAddOrEditBrand}
        brand={brandEdit}
        project={project}
        onSubmit={handleAddOrEditBrand}
        brandType={brandType}
      />
      <PopupConfirmDelete
        isOpen={!!competingBrandDelete}
        title={t('setup_survey_add_brand_confirm_delete_title')}
        description={t('setup_survey_add_brand_confirm_delete_sub_title')}
        onCancel={() => onCloseConfirmDeleteCompetingBrand()}
        onDelete={onDeleteCompetingBrand}
      />
    </>
  )
})

export default BrandList