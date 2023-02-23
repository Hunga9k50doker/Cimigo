import { Box, Grid } from "@mui/material";
import Button, { BtnType } from "components/common/buttons/Button";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { memo } from "react";
import classes from "./styles.module.scss";
import { ArrowBack } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import clsx from "clsx";
import moment from "moment";
import { IconDownload } from "components/icons";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { AttachmentService } from "services/attachment";
import FileSaver from "file-saver";
import { IReport } from "../..";

interface Props {
  isOpen: boolean;
  report: IReport;
  onClose: () => void;
}

const Dashboard = memo(({ isOpen, report, onClose }: Props) => {
  const dispatch = useDispatch();
  
  const onDownLoad = () => {
    dispatch(setLoading(true));
    AttachmentService.download(report?.attachment?.id)
      .then((res) => {
        FileSaver.saveAs(res.data, report?.attachment?.fileName);
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)));
  };

  return (
    <Grid className={clsx(classes.root, { [classes.hidden]: !isOpen })}>
      <Grid sx={{ display: "flex", justifyContent: "space-between" }} my={1} className={classes.actionWrapper}>
        <Button
          btnType={BtnType.Text}
          children={
            <ParagraphSmall $colorName="--cimigo-blue" $fontWeight={500} translation-key="">
              Results - {moment(report?.date).format("MMM").toUpperCase()} {moment(report?.date).year()}
            </ParagraphSmall>
          }
          startIcon={<ArrowBack sx={{ fontSize: "22px !important" }} />}
          sx={{ width: { xs: "100%", sm: "auto" } }}
          onClick={onClose}
        />
        {report && (
          <Button
            btnType={BtnType.Text}
            children={
              <ParagraphSmall $colorName="--cimigo-blue" $fontWeight={500} translation-key="">
                Download
              </ParagraphSmall>
            }
            startIcon={<IconDownload sx={{ fontSize: "11px !important" }} />}
            sx={{ width: { xs: "100%", sm: "auto" } }}
            onClick={onDownLoad}
          />
        )}
      </Grid>
      <Grid className={classes.dashboard}>
        <Box mt={2} sx={{ minHeight: "600px" }}>
          {!!report?.dataStudio && (
            <iframe
              width="100%"
              height="800"
              src={report?.dataStudio}
              allowFullScreen
              frameBorder={0}
              className={classes.iframe}
              title="data-studio"
            ></iframe>
          )}
        </Box>
      </Grid>
    </Grid>
  );
});

export default Dashboard;
