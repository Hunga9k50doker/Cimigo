import { Box, Grid } from '@mui/material';
import { memo } from 'react';
import classes from './styles.module.scss';
import Images from "config/images";
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { ProjectStatus } from 'models/project';
import Buttons from 'components/Buttons';
import { Download } from '@mui/icons-material';
import { AttachmentService } from 'services/attachment';
import FileSaver from 'file-saver';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';

interface Props {
  projectId: number,
}

const Report = memo(({ projectId }: Props) => {

  const dispatch = useDispatch()


  const { project } = useSelector((state: ReducerType) => state.project)

  const hasReport = () => {
    return project && project.reports?.length && project.dataStudio && project.status === ProjectStatus.COMPLETED
  }

  const onDownLoad = () => {
    dispatch(setLoading(true))
    AttachmentService.download(project.reports[0].id)
      .then(res => {
        FileSaver.saveAs(res.data, project.reports[0].fileName)
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  return (
    <>
      {hasReport() ? (
        <Grid classes={{ root: classes.root }}>
          <Box display={"flex"} justifyContent="flex-end">
            <Buttons onClick={onDownLoad} btnType="Blue" padding="11px 18px"><Download sx={{ marginRight: 1 }} /> Download report</Buttons>
          </Box>
          <Box mt={2}>
            <iframe
              width="100%"
              height="800"
              src={project.dataStudio}
              allowFullScreen
              frameBorder={0}
              className={classes.iframe}
            >
            </iframe>
          </Box>
        </Grid>
      ) : (
        <Grid className={classes.noSetup}>
          <img src={Images.icSad} alt="" />
          <p>Coming soon</p>
          <span>No report setup.</span>
        </Grid>
      )}
    </>
  )
})

export default Report;