import { Grid } from "@mui/material"
import clsx from "clsx";
import Button, { BtnType } from "components/common/buttons/Button";
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import TextBtnSmall from "components/common/text/TextBtnSmall";
import HeartPlus from "components/icons/IconHeartPlus";
import PopupConfirmDeleteBrandAsset from "components/PopupConfirmDeleteBrandAsset";
import { editableProject } from "helpers/project";
import { BrandAsset } from "models/brand_asset";
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components";
import BrandAssetItem from "pages/SurveyNew/components/BrandAssetItem";
import PopupAddOrEditBrandAsset from "pages/SurveyNew/components/PopupAddOrEditBrandAsset";
import { memo, useMemo, useState } from "react"
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { getBrandAssetsRequest } from "redux/reducers/Project/actionTypes";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { BrandAssetService } from "services/brand_asset";
import classes from "./styles.module.scss"

interface BrandAssetRecognitionProps {
  project: Project;
}

const BrandAssetRecognition = memo(({ project }: BrandAssetRecognitionProps) => {
  const { t } = useTranslation()
  const dispatch = useDispatch()
  
  const editable = useMemo(() => editableProject(project), [project])
  const maxBrandAssetRecognition = useMemo(() => project?.solution?.maxBrandAssetRecognition || 0, [project])
  
  const [openPopupAddOrEditBrandAsset, setOpenPopupAddOrEditBrandAsset] = useState<boolean>(false)
  const [openPopupConfirmDeleteBrandAsset, setOpenPopupConfirmDeleteBrandAsset] = useState<boolean>(false)
  const [brandAssetEdit, setBrandAssetEdit] = useState<BrandAsset>(null)
  const [brandAssetDelete, setBrandAssetDelete] = useState<BrandAsset>(null)

  const onOpenPopupAddOrEditBrandAsset = () => {
    setOpenPopupAddOrEditBrandAsset(true)
  }
  const onClosePopupAddOrEditBrandAsset = () => {
    setBrandAssetEdit(null)
    setOpenPopupAddOrEditBrandAsset(false)
  }
  const handleAddOrEditBrandAsset = (data: FormData) => {
    data.append('projectId', `${project.id}`)
    if (brandAssetEdit) {
      dispatch(setLoading(true))
      BrandAssetService.update(brandAssetEdit.id, data)
        .then(() => {
          dispatch(getBrandAssetsRequest(project.id))
          onClosePopupAddOrEditBrandAsset()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      BrandAssetService.create(data)
        .then(() => {
          dispatch(getBrandAssetsRequest(project.id))
          onClosePopupAddOrEditBrandAsset()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }

  const handleDeleteBrandAsset = () => {
    if(brandAssetDelete) {
      BrandAssetService.delete(brandAssetDelete?.id)
        .then(() => {
          dispatch(getBrandAssetsRequest(project.id))
          onClosePopupConfirmDeleteBrandAsset()
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
  }
  const onOpenPopupConfirmDeleteBrandAsset = (brandAsset) => {
    setBrandAssetDelete(brandAsset)
    setOpenPopupConfirmDeleteBrandAsset(true)
  }
  const onClosePopupConfirmDeleteBrandAsset = () => {
    setBrandAssetDelete(null)
    setOpenPopupConfirmDeleteBrandAsset(false)
  }
  return (
    <>
      <Grid id={SETUP_SURVEY_SECTION.additional_attributes} mt={4}>
        <Heading4
          $fontSizeMobile={"16px"}
          $colorName="--eerie-black"
          sx={{ display: "inline-block", verticalAlign: "middle" }}
        >
          STEP 4 (OPTIONAL): Brand asset recognition
        </Heading4>
        <MaxChip
          sx={{ ml: 1 }}
          label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxBrandAssetRecognition}</ParagraphSmall>}
        />
        <ParagraphBody $colorName="--eerie-black" mb={ 3 } mt={ 1 }>Brand assets are recognisable elements that embody a brand's identity. From logos and typography to taglines, brand assets make it easy to identify a brand, help it stand out from competitors and cue brand associations.</ParagraphBody>
        <ParagraphBody $colorName="--eerie-black">Cimigo recommend measuring brand asset recognition for your brand and a key competitor brand (as a comparison).</ParagraphBody>
        <Grid className={clsx({[classes.brandAssetsWrapper]: project?.brandAssets?.length > 0})}>
          {project?.brandAssets?.map(assetItem => (
            <BrandAssetItem 
              brandAsset={assetItem}
              editable={editable}
              onPopupEditBrandAsset={() => {
                setBrandAssetEdit(assetItem)
                onOpenPopupAddOrEditBrandAsset()
              }}
              onOpenPopupConfirmDelete={() => onOpenPopupConfirmDeleteBrandAsset(assetItem)}
            />
          ))}
        </Grid>
        <Button
          disabled={!editable || project?.brandAssets?.length >= maxBrandAssetRecognition}
          className={classes.btnAddBrand}
          btnType={BtnType.Outlined}
          children={<TextBtnSmall>Add brand asset</TextBtnSmall>}
          startIcon={<HeartPlus sx={{ fontSize: "14px !important" }} />}
          onClick={onOpenPopupAddOrEditBrandAsset}
          sx={{  width: { xs: "100%", sm: "auto" } }}
        />
        {project?.brandAssets?.length >= maxBrandAssetRecognition && (
            <ParagraphSmall $colorName="--gray-60" sx={{mt: 1}}>You have reached the limit of {maxBrandAssetRecognition} brand assets.</ParagraphSmall>
          )}
      </Grid>
      <PopupAddOrEditBrandAsset
        isOpen={openPopupAddOrEditBrandAsset}
        onClose={onClosePopupAddOrEditBrandAsset}
        project={project}
        onSubmit={handleAddOrEditBrandAsset}
        brandAsset={brandAssetEdit}
      />
      <PopupConfirmDeleteBrandAsset
        isOpen={openPopupConfirmDeleteBrandAsset}
        onCancel={onClosePopupConfirmDeleteBrandAsset}
        onDelete={handleDeleteBrandAsset}
      />
    </>
  )
})

export default BrandAssetRecognition