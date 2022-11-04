import { Grid, ListItemIcon, MenuItem, Box } from "@mui/material"
import Button, { BtnType } from "components/common/buttons/Button"
import Heading4 from "components/common/text/Heading4"
import ParagraphBody from "components/common/text/ParagraphBody"
import ParagraphSmall from "components/common/text/ParagraphSmall"
import { Project, SETUP_SURVEY_SECTION } from "models/project"
import { MaxChip } from "pages/SurveyNew/components"
import { memo, useMemo, useState } from "react"
// import PackItem from "../../SetupSurvey/components/PackItem"
import { Edit as EditIcon, DeleteForever as DeleteForeverIcon } from '@mui/icons-material';
import TextBtnSmall from "components/common/text/TextBtnSmall"
import { useTranslation } from "react-i18next"
import { useDispatch } from "react-redux"
import { editableProject } from "helpers/project"
import PopupConfirmDelete from "components/PopupConfirmDelete"
import { Video } from "models/video"
import { Menu } from "components/common/memu/Menu";
import { VideoService } from "services/video"
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes"
import { getPacksRequest, getVideosRequest } from "redux/reducers/Project/actionTypes"
import PopupPack from "pages/SurveyNew/components/PopupPack"
import ProjectHelper from "helpers/project";
import NoteWarning from "components/common/warnings/NoteWarning";
import ParagraphExtraSmall from "components/common/text/ParagraphExtraSmall"
import BackupOutlinedIcon from '@mui/icons-material/BackupOutlined';
import YouTubeIcon from '@mui/icons-material/YouTube';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import classes from "./styles.module.scss";
import VideoItem from "../VideoItem";
import {IconAddVideoMenu} from "components/ssvg";
import PopupAddVideo from "pages/SurveyNew/components/PopupAddVideo";
import {EAddVideoType} from "models/adtraction_test";

interface AddVideosProps {
  project: Project
}

const AddVideos = memo(({ project }: AddVideosProps) => {

  const { t } = useTranslation()
  const dispatch = useDispatch()

  const [addNewVideo, setAddNewVideo] = useState<boolean>(false);
  const [videoAction, setVideoAction] = useState<Video>();
  const [videoEdit, setVideoEdit] = useState<Video>();
  const [videoDelete, setVideoDelete] = useState<Video>();
  const [anchorElVideo, setAnchorElVideo] = useState<null | HTMLElement>(null);
  const [anchorElMenuAddVideo, setAnchorElMenuAddVideo] = useState<null | HTMLElement>(null);
  const [typeAddVideo, setTypeAddVideo] = useState(null);

  const maxVideo = useMemo(() => project?.solution?.maxPack || 0, [project])

  const editable = useMemo(() => editableProject(project), [project])

  const enableAddVideos = useMemo(() => {
    return maxVideo > (project?.packs?.length || 0)
  }, [maxVideo, project])

  const videoNeedMore = useMemo(() => ProjectHelper.packNeedMore(project), [project])

  const onOpenPopupAddVideo = (type: EAddVideoType) => {
    switch (type) {
      case EAddVideoType.From_Device:
        setAddNewVideo(true);
        setTypeAddVideo(EAddVideoType.From_Device);
        break;
      case EAddVideoType.From_Youtube:
        setAddNewVideo(true);
        setTypeAddVideo(EAddVideoType.From_Youtube);
        break;
      default:
        break;
    }
    handleCloseMenuAddVideo();
  }

  const onDeleteVideo = () => {
    if (!videoDelete) return
    dispatch(setLoading(true))
    VideoService.delete(videoDelete.id)
      .then(() => {
        dispatch(getVideosRequest(project.id))
        setVideoDelete(null)
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onAction = (currentTarget: any, item: Video) => {
    setAnchorElVideo(currentTarget)
    setVideoAction(item)
  }

  const onCloseMenu = () => {
    setAnchorElVideo(null)
    setVideoAction(null)
  }

  const handleEdit = () => {
    if (!videoAction) return
    setVideoEdit(videoAction)
    onCloseMenu()
  }

  const handleDelete = () => {
    if (!videoAction) return
    setVideoDelete(videoAction)
    onCloseMenu()
  }

  const onCloseAddOrEditVideo = () => {
    setAddNewVideo(false)
    setVideoEdit(null)
  }

  const onAddOrEditVideo = (data: FormData) => {
    data.append('projectId', `${project.id}`)
    if (videoEdit) {
      dispatch(setLoading(true))
      VideoService.update(videoEdit.id, data)
        .then(() => {
          dispatch(getVideosRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    } else {
      dispatch(setLoading(true))
      VideoService.create(data)
        .then(() => {
          dispatch(getVideosRequest(project.id))
        })
        .catch((e) => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    onCloseAddOrEditVideo()
  }

  const handleClickMenuAddVideo= (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorElMenuAddVideo(event.currentTarget)
  }

  const handleCloseMenuAddVideo = () => {
    setAnchorElMenuAddVideo(null);
  }

  return (
    <Grid id={SETUP_SURVEY_SECTION.add_video}>
      <Heading4
        $fontSizeMobile={"16px"}
        $colorName="--eerie-black"
        translation-key=""
        sx={{ display: "inline-block", verticalAlign: "middle" }}
      >
        STEP 1: Add videos that want you to test
      </Heading4>
      <MaxChip sx={{ ml: 1 }} label={<ParagraphSmall $colorName="--eerie-black">{t('common_max')} {maxVideo}</ParagraphSmall>} />
      <ParagraphBody $colorName="--gray-80" mt={1} translation-key="">
      Please upload your advertising videos that you want to include in this test. Your advertising videos  are compared to a benchmark of over 500 advertisements, to find out specific strengths and weaknesses.
      </ParagraphBody>
      {!!videoNeedMore && (
        <NoteWarning>
          <ParagraphSmall translation-key="setup_add_packs_note_warning" 
          $colorName="--warning-dark" 
          sx={{"& > span": {fontWeight: 600}}}
          dangerouslySetInnerHTML={{
          __html: t("setup_add_packs_note_warning", {
          number: videoNeedMore,}),
          }}>
          </ParagraphSmall>
      </NoteWarning>
      )}
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
            onClick={handleClickMenuAddVideo}
            // disabled={!editable || project?.customQuestions?.length >= maxCustomQuestion}
            btnType={BtnType.Outlined}
            translation-key=""
            startIcon={<IconAddVideoMenu/>}
            children={<TextBtnSmall>Add videos</TextBtnSmall>}
            endIcon={<ArrowDropDownIcon sx={{ fontSize: "16px !important" }} />}
          />
      <Menu
        $minWidth={"unset"}
        anchorEl={anchorElMenuAddVideo}
        open={Boolean(anchorElMenuAddVideo)}
        onClose={handleCloseMenuAddVideo}
      >
          <MenuItem className={classes.menuItem} onClick={() => onOpenPopupAddVideo(EAddVideoType.From_Device)}>
            <BackupOutlinedIcon sx={{color: 'var(--cimigo-blue-light-1)'}}/>
            <ParagraphExtraSmall className={classes.menuItemText}>From your device</ParagraphExtraSmall>
          </MenuItem>
          <MenuItem className={classes.menuItem} onClick={() => onOpenPopupAddVideo(EAddVideoType.From_Youtube)}>
            <YouTubeIcon sx={{color: '#DD352E'}}/>
            <ParagraphExtraSmall className={classes.menuItemText}>From Youtube</ParagraphExtraSmall>
          </MenuItem>
      </Menu>
      {/* {!enableAddPacks && (
        <ParagraphSmall mt={1} translation-key="setup_survey_add_pack_error_max" $colorName="--red-error">{t('setup_survey_add_pack_error_max', { number: maxPack })}</ParagraphSmall>
      )} */}
      <Menu
        $minWidth={"120px"}
        anchorEl={anchorElVideo}
        open={Boolean(anchorElVideo)}
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
      {/* <PopupPack
        isOpen={addNewVideo}
        itemEdit={videoEdit}
        onCancel={onCloseAddOrEditVideo}
        onSubmit={onAddOrEditVideo}
      /> */}
      <PopupAddVideo
      isOpen={addNewVideo}
      itemEdit={videoEdit}
      onClose={onCloseAddOrEditVideo}
      type={typeAddVideo}
      onSubmit={onAddOrEditVideo}
      />
      <PopupConfirmDelete
        isOpen={!!videoDelete}
        title={t('setup_survey_pack_confirm_delete_title')}
        description={t('setup_survey_pack_confirm_delete_sub_title')}
        onCancel={() => setVideoDelete(null)}
        onDelete={onDeleteVideo}
      />

    </Grid>
  )
})

export default AddVideos