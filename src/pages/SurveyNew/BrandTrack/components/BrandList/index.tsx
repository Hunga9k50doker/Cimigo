import { Grid, IconButton, ListItem, ListItemButton } from "@mui/material"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { memo, useEffect, useMemo, useState } from "react"
import { Edit as EditIcon, PlayArrow, Add as AddIcon, Edit, Stars } from '@mui/icons-material';
import classes from "./styles.module.scss"
import ProjectHelper, { editableProject } from "helpers/project"
import NoteWarning from "components/common/warnings/NoteWarning"
import TextBtnSmall from "components/common/text/TextBtnSmall"
import Button, { BtnType } from "components/common/buttons/Button"
import AddBrand from "components/icons/IconAddBrand"
import { AdditionalBrand, EBrandType } from "models/additional_brand"
import { useDispatch } from "react-redux"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { AdditionalBrandService } from "services/additional_brand"
import { getAdditionalBrandsRequest } from "redux/reducers/Project/actionTypes"
import PopupAddOrEditMainBrand from "pages/SurveyNew/components/PopupAddOrEditMainBrand"
import PopupAddOrEditCompetingBrand from "pages/SurveyNew/components/PopupAddOrEditCompetingBrand"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { useTranslation } from "react-i18next"
import ParagraphBodyUnderline from "components/common/text/ParagraphBodyUnderline"
import CloseIcon from '@mui/icons-material/Close';

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

  const [isOpenAddOrEditMainBrandModal, setIsOpenAddOrEditMainBrandModal] = useState<boolean>(false)
  const [mainBrandData, setMainBrandData] = useState<AdditionalBrand[]>([])
  const [mainBrandEdit, setMainBrandEdit] = useState<AdditionalBrand>(null)
  
  const [isOpenAddOrEditCompetingBrandModal, setIsOpenAddOrEditCompetingBrandModal] = useState<boolean>(false)
  const [numberOfCompetingBrandDisplayed, setNumberOfCompetingBrandDisplayed] = useState<number>(0)
  const [competingBrandDatas, setCompetingBrandDatas] = useState<AdditionalBrand[]>([])
  const [competingBrandEdit, setCompetingBrandEdit] = useState<AdditionalBrand>(null)

  const [competingBrandDelete, setCompetingBrandDelete] = useState<AdditionalBrand>(null)

  const maxMainBrand = useMemo(() => project?.solution?.maxMainBrand || 0, [project])
  const maxCompetingBrand = useMemo(() => project?.solution?.maxCompetingBrand || 0, [project])
  const competingBrandNeedMore = useMemo(() => ProjectHelper.competingBrandNeedMore(project) || 0, [project])
  const editable = useMemo(() => editableProject(project), [project])

  useEffect(() => {
    const _mainBrand = project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.MAIN)
    const _competingBrands = project?.additionalBrands?.filter((item) => item?.typeId === EBrandType.COMPETING)
    if(_mainBrand?.length > 0) {
      setMainBrandData(_mainBrand)
    }
    setCompetingBrandDatas(_competingBrands)
    if(_competingBrands?.length > 3) {
      setNumberOfCompetingBrandDisplayed(3)
    } else {
      setNumberOfCompetingBrandDisplayed(_competingBrands?.length)
    }
  }, [project])

  const onOpenAddOrEditMainBrandModal = () => {
    setIsOpenAddOrEditMainBrandModal(true)
  }
  const onCloseAddOrEditMainBrandModal = () => {
    setIsOpenAddOrEditMainBrandModal(false)
  }
  const onAddOrEditMainBrand = (data: BrandForm) => {
    if (mainBrandEdit?.id) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(mainBrandEdit.id, {
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
        typeId: EBrandType.MAIN,
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
          onCloseAddOrEditMainBrandModal()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      AdditionalBrandService.create({
        projectId: project.id,
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
        typeId: EBrandType.MAIN,
      })
        .then(() => {
          dispatch(getAdditionalBrandsRequest(project.id))
          onCloseAddOrEditMainBrandModal()
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const onEditCompetingBrand = (competingBrand: AdditionalBrand) => {
    setCompetingBrandEdit(competingBrand)
    setIsOpenAddOrEditCompetingBrandModal(true)
  }
  const onAddCompetingBrand = () => {
    setCompetingBrandEdit(null)
    setIsOpenAddOrEditCompetingBrandModal(true)
  }
  const onCloseAddOrEditCompetingBrandModal = () => {
    setIsOpenAddOrEditCompetingBrandModal(false)
  }
  const onAddOrEditCompetingBrand = (data: BrandForm) => {
    if (competingBrandEdit?.id) {
      dispatch(setLoading(true))
      AdditionalBrandService.update(competingBrandEdit.id, {
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
        typeId: EBrandType.COMPETING,
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
        brand: data.brand,
        manufacturer: data.manufacturer,
        variant: data.variant,
        typeId: EBrandType.COMPETING,
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
    if(competingBrandDatas.length - numberOfCompetingBrandDisplayed > 3) {
      setNumberOfCompetingBrandDisplayed(numberOfCompetingBrandDisplayed + 3)
    } else {
      setNumberOfCompetingBrandDisplayed(competingBrandDatas.length)
    }
  }

  return (
    <>
      <Grid id={SETUP_SURVEY_SECTION.upload_packs} mt={4}>
        <Heading4
          $fontSizeMobile={"16px"}
          $colorName="--eerie-black"
          sx={{ display: "inline-block", verticalAlign: "middle" }}
        >
          STEP 2: Building your brand list
        </Heading4>
        <ParagraphBody $colorName="--eerie-black" mb={ 3 } mt={ 1 }>The first step to tracking brand performance is to identify the main brand you want to track and a list of competing brands in the same category.</ParagraphBody>
        <Grid mb={3}>
          <div className={classes.mainBrandTitle}>
            <PlayArrow sx={{height: "18px"}}/>
            <ParagraphBody $fontWeight={600} $colorName="--eerie-black">
              Main brand to track
            </ParagraphBody>
          </div>
          <ParagraphBody $colorName="--eerie-black" mb={ 2 } ml={ 3 }>Which is the brand, variant and manufacturer you are performance tracking?</ParagraphBody>
          {mainBrandData?.map(mainItem => (
            <div className={classes.mainBrand}>
              <ParagraphSmall $colorName="--cimigo-blue-dark-1" $fontWeight={500} sx={{display: "flex", alignItems: "center", gap: "8px"}}>
                <Stars sx={{color: "var(--cimigo-blue-dark-1)", fontSize: "20px"}}/> {mainItem.brand}
              </ParagraphSmall>
              {editable && (
                <Button
                  btnType={BtnType.Text}
                  children={<TextBtnSmall sx={{ color: "var(--cimigo-blue-dark-1) !important" }}>Edit</TextBtnSmall>}
                  startIcon={<Edit sx={{ color: "var(--cimigo-blue-dark-1)", fontSize: "16px !important" }} />}
                  onClick={() => {
                    onOpenAddOrEditMainBrandModal()
                    setMainBrandEdit(mainItem)
                  }}
                />
              )}
            </div>
          ))}
          {editable && mainBrandData.length < maxMainBrand && (
            <Button
              className={classes.btnAddMainBrand}
              btnType={BtnType.Outlined}
              children={<TextBtnSmall>Add main brand</TextBtnSmall>}
              startIcon={<AddIcon sx={{ fontSize: "16px !important" }} />}
              onClick={onOpenAddOrEditMainBrandModal}
            />
          )}
        </Grid>
        <Grid>
          <div className={classes.competingBrandTitle}>
            <PlayArrow sx={{height: "18px"}}/>
            <ParagraphBody $fontWeight={600} $colorName="--eerie-black">
              Competing brand list
            </ParagraphBody>
          </div>
          <ParagraphBody $colorName="--eerie-black" mb={ 4 } ml={ 3 }>Please add other brands in your category. To understand awareness and use, we ask that you add all brands and variants that make up your category.</ParagraphBody>
          <ParagraphBody $colorName="--eerie-black" mb={ 2 } ml={ 3 }>You should aim to cover 80% of or more of market share or sales in the market.</ParagraphBody> 
          {!!competingBrandNeedMore && (
            <NoteWarning ml={ 3 }>
              <ParagraphSmall $colorName="--warning-dark">Require at least {competingBrandNeedMore} more brands</ParagraphSmall>
            </NoteWarning>
          )}
          <Grid className={classes.rootList} ml={3}>
            {competingBrandDatas?.map((item, index) => (
              index < numberOfCompetingBrandDisplayed && (
                <ListItem
                  alignItems="center"
                  component="div"
                  key={item?.id}
                  className={classes.rootListItem}
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
              )
            ))}
            {competingBrandDatas?.length > numberOfCompetingBrandDisplayed && (
              <ParagraphBodyUnderline sx={{ margin: "8px 0 0 16px" }} onClick={onShowMoreCompetingBrand}>
                {competingBrandDatas?.length - numberOfCompetingBrandDisplayed > 3 ? "+ 3 more brands" : `+ ${competingBrandDatas?.length - numberOfCompetingBrandDisplayed} more brands`}
              </ParagraphBodyUnderline>
            )}
          </Grid>
          <Button
            disabled={!editable || competingBrandDatas?.length >= maxCompetingBrand}
            className={classes.btnAddBrand}
            btnType={BtnType.Outlined}
            children={<TextBtnSmall>Add new brand</TextBtnSmall>}
            startIcon={<AddBrand sx={{ fontSize: "16px !important" }} />}
            onClick={onAddCompetingBrand}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          />
          {competingBrandDatas?.length >= maxCompetingBrand && (
            <ParagraphSmall $colorName="--gray-60" mt={1} ml={3}>You have reached the limit of {maxCompetingBrand} brands</ParagraphSmall>
          )}
        </Grid>
      </Grid>
      <PopupAddOrEditMainBrand
        isOpen={isOpenAddOrEditMainBrandModal}
        onClose={onCloseAddOrEditMainBrandModal}
        mainBrand={mainBrandEdit}
        project={project}
        onSubmit={onAddOrEditMainBrand}
      />
      <PopupAddOrEditCompetingBrand
        isOpen={isOpenAddOrEditCompetingBrandModal}
        onClose={onCloseAddOrEditCompetingBrandModal}
        brand={competingBrandEdit}
        project={project}
        onSubmit={onAddOrEditCompetingBrand}
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