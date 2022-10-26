import { Grid, ListItemIcon, MenuItem, Box } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components"
import { memo, useMemo, useState } from "react"
// import PackItem from "../../SetupSurvey/components/PackItem"
import { AddAPhoto, Edit as EditIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { editableProject } from "helpers/project"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { Pack } from "models/pack"
import { Menu } from "components/common/memu/Menu";
import { PackService } from "services/pack"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { getPacksRequest } from "redux/reducers/Project/actionTypes"
import PopupPack from "pages/SurveyNew/components/PopupPack"
import ProjectHelper from "helpers/project";
import NoteWarning from "components/common/warnings/NoteWarning";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import { t } from "i18next"
import { icCustomQuestions } from "models/custom_question"
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classes from "./styles.module.scss";
import images from "config/images";
import VideoItem from "../VideoItem";

interface AddVideosProps {
  project: Project
}

const AddVideos = memo(({ project }: AddVideosProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [addNewPack, setAddNewPack] = useState<boolean>(false);
  const [packAction, setPackAction] = useState<Pack>();
  const [packEdit, setPackEdit] = useState<Pack>();
  const [packDelete, setPackDelete] = useState<Pack>();
  const [anchorElPack, setAnchorElPack] = useState<null | HTMLElement>(null);
  const [anchorElMenuQuestions, setAnchorElMenuQuestions] = useState<null | HTMLElement>(null);

  const maxPack = useMemo(() => project?.solution?.maxPack || 0, [project])

  const editable = useMemo(() => editableProject(project), [project])

  const enableAddPacks = useMemo(() => {
    return maxPack > (project?.packs?.length || 0)
  }, [maxPack, project])

  const packNeedMore = useMemo(() => ProjectHelper.packNeedMore(project), [project])

  const onDeletePack = () => {
    if (!packDelete) return
    dispatch(setLoading(true))
    PackService.delete(packDelete.id)
      .then(() => {
        dispatch(getPacksRequest(project.id))
        setPackDelete(null)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onAction = (currentTarget: any, item: Pack) => {
    setAnchorElPack(currentTarget)
    setPackAction(item)
  }

  const onCloseMenu = () => {
    setAnchorElPack(null)
    setPackAction(null)
  }

  const handleEdit = () => {
    if (!packAction) return
    setPackEdit(packAction)
    onCloseMenu()
  }

  const handleDelete = () => {
    if (!packAction) return
    setPackDelete(packAction)
    onCloseMenu()
  }

  const onCloseAddOrEditPack = () => {
    setAddNewPack(false)
    setPackEdit(null)
  }

  const onAddOrEditPack = (data: FormData) => {
    data.append('projectId', `${project.id}`)
    if (packEdit) {
      dispatch(setLoading(true))
      PackService.update(packEdit.id, data)
        .then(() => {
          dispatch(getPacksRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      PackService.create(data)
        .then(() => {
          dispatch(getPacksRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    onCloseAddOrEditPack()
  }

  const handleClickMenuQuestions = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuQuestions(event.currentTarget)
  }

  const handleCloseMenuQuestions = () => {
    setAnchorElMenuQuestions(null);
  }
  return (
    <Grid id={SETUP_SURVEY_SECTION.add_video}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key="setup_survey_summary_pack"
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        STEP 1: Add videos that want you to test
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxPack}</ParagraphSmall>} />
      <ParagraphBody $colorName="--gray-80" mt={1} translation-key="">
      Please upload your advertising videos that you want to include in this test. Your advertising videos  are compared to a benchmark of over 500 advertisements, to find out specific strengths and weaknesses.
      </ParagraphBody>
      {/* {!!packNeedMore && (
        <NoteWarning>
          <ParagraphSmall translation-key="setup_add_packs_note_warning" 
          $colorName="--warning-dark" 
          sx={{"& > span": {fontWeight: 600}}}
          dangerouslySetInnerHTML={{
          __html: t("setup_add_packs_note_warning", {
          number: packNeedMore,}),
          }}>
          </ParagraphSmall>
      </NoteWarning>
      )} */}
      {/* {!!project?.packs?.length && (
        <Box mt={{ xs: 3, sm: 2 }} >
          <Grid spacing={2} container>
            {project?.packs?.map((item, index) => (
              <PackItem
                key={index}
                item={item}
                editable={editable}
                onAction={onAction}
              />
            ))}
          </Grid>
        </Box>
        )} */}
          <Box mt={{ xs: 3, sm: 3 }} >
            <Grid spacing={2} container>
              {project?.packs?.map((item, index) => (
                <VideoItem
                  key={index}
                  item={item}
                  editable={editable}
                  onAction={onAction}
                />
              ))}
            </Grid>
          </Box>
          <Button
            sx={{ mt: 3, width: { xs: "100%", sm: "auto" } }}
            onClick={handleClickMenuQuestions}
            // disabled={!editable || project?.customQuestions?.length >= maxCustomQuestion}
            btnType={BtnType.Outlined}
            translation-key=""
            startIcon={<img src={images.icAddVideo} alt="icon add video"/>}
            children={<TextBtnSmall>Add videos</TextBtnSmall>}
            endIcon={<ArrowDropDownIcon sx={{ fontSize: "16px !important" }} />}
          />
          {/* {(editable && questions.length >= maxCustomQuestion) && <ParagraphSmall mt={1} $colorName="--red-error" translation-key="setup_survey_custom_question_error_max">{t("setup_survey_custom_question_error_max", { max: maxCustomQuestion })}</ParagraphSmall>} */}
        {/* </>
      )} */}
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuQuestions}
        open={Boolean(anchorElMenuQuestions)}
        onClose={handleCloseMenuQuestions}
      >
          <MenuItem className={classes.menuItem}>
            <BackupOutlinedIcon sx={{color: 'var(--cimigo-blue-light-1)'}}/>
            <ParagraphExtraSmall className={classes.menuItemText}>From your device</ParagraphExtraSmall>
          </MenuItem>
          <MenuItem className={classes.menuItem}>
            <YouTubeIcon sx={{color: '#DD352E'}}/>
            <ParagraphExtraSmall className={classes.menuItemText}>From Youtube</ParagraphExtraSmall>
          </MenuItem>
      </Menu>
      {/* {!enableAddPacks && (
        <ParagraphSmall mt={1} translation-key="setup_survey_add_pack_error_max" $colorName="--red-error">{t('setup_survey_add_pack_error_max', { number: maxPack })}</ParagraphSmall>
      )} */}
      <Menu
        $minWidth={"120px"}
        anchorEl={anchorElPack}
        open={Boolean(anchorElPack)}
        onClose={onCloseMenu}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <MenuItem onClick={handleEdit}>
          <ListItemIcon>
            <EditIcon fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_edit">{t('common_edit')}</ParagraphBody>
        </MenuItem>
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <DeleteForeverIcon sx={{ color: "var(--red-error) !important" }} fontSize="small" />
          </ListItemIcon>
          <ParagraphBody translation-key="common_delete">{t('common_delete')}</ParagraphBody>
        </MenuItem>
      </Menu>
      <PopupPack
        isOpen={addNewPack}
        itemEdit={packEdit}
        onCancel={onCloseAddOrEditPack}
        onSubmit={onAddOrEditPack}
      />
      <PopupConfirmDelete
        isOpen={!!packDelete}
        title={t('setup_survey_pack_confirm_delete_title')}
        description={t('setup_survey_pack_confirm_delete_sub_title')}
        onCancel={() => setPackDelete(null)}
        onDelete={onDeletePack}
      />
    </Grid>
  )
})

export default AddVideos