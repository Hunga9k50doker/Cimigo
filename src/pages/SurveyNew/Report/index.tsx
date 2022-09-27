import { Box, Grid } from '@mui/material';
import { memo } from 'react';
import classes from './styles.module.scss';
import Images from "config/images";
import { useDispatch, useSelector } from 'react-redux';
import { ReducerType } from 'redux/reducers';
import { ProjectStatus } from 'models/project';
import { Download } from '@mui/icons-material';
import { AttachmentService } from 'services/attachment';
import FileSaver from 'file-saver';
import { setErrorMess, setLoading } from 'redux/reducers/Status/actionTypes';
import { t } from 'i18next';
import { Content, LeftContent, PageRoot } from '../components';
import Button, { BtnType } from 'components/common/buttons/Button';
import TextBtnSecondary from 'components/common/text/TextBtnSecondary';
import { Helmet } from "react-helmet";

interface Props {
  projectId: number,
}

const Report = memo(({ projectId }: Props) => {

  const dispatch = useDispatch()


  const { project } = useSelector((state: ReducerType) => state.project)

  const hasReport = () => {
    return project && (project.reports?.length || project.dataStudio) && project.status === ProjectStatus.COMPLETED
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
    <PageRoot>
      <Helmet>
        <title>{`RapidSurvey - ${project?.name} - Results`}</title>
      </Helmet>
      <LeftContent>
        <Content className={classes.root}>
          {hasReport() ? (
            <Grid className={classes.content}>
              {!!project.reports?.length && (
                <Box display={"flex"} justifyContent="flex-end">
                  <Button
                    btnType={BtnType.Raised}
                    startIcon={<Download />}
                    onClick={onDownLoad}
                    children={<TextBtnSecondary translation-key="report_btn_download">{t('report_btn_download')}</TextBtnSecondary>}
                  />
                </Box>
              )}
              <Box mt={2} sx={{ minHeight: '600px' }}>
                {!!project.dataStudio && (
                  <iframe
                    width="100%"
                    height="800"
                    src={project.dataStudio}
                    allowFullScreen
                    frameBorder={0}
                    className={classes.iframe}
                    title="data-studio"
                  >
                  </iframe>
                )}
              </Box>
            </Grid>
          ) : (
            <Grid className={classes.noSetup}>
              <img src={Images.icSad} alt="" />
              <p translation-key="report_coming_soon">{t('report_coming_soon')}</p>
            </Grid>
          )}
        </Content>
      </LeftContent>
    </PageRoot>
  )
})

export default Report;