import { MoreVert } from "@mui/icons-material";
import { Box, Grid, IconButton } from "@mui/material"
import ParagraphBody from "components/common/text/ParagraphBody";
import ParagraphSmall from "components/common/text/ParagraphSmall";
import { Pack } from "models/pack"
import { memo} from "react"
import images from "config/images";
import classes from './styles.module.scss';
import ShowMoreText from "react-show-more-text";
import Heading5 from "components/common/text/Heading5";

interface VideoItemProps {
  item: Pack;
  editable: boolean;
  onAction: (currentTarget: any, item: Pack) => void;
}

const VideoItem = memo(({ item, editable, onAction }: VideoItemProps) => {
  return (
    <Grid item className={classes.root}>
      <Box className={classes.box}>
        <Grid className={classes.body}>
          {editable && (
            <IconButton
              className={classes.iconAction}
              onClick={(e) => onAction(e.currentTarget, item)}
            >
              <MoreVert />
            </IconButton>
          )}
          <video className={classes.video} src={item.image} />
        </Grid>
        <Grid className={classes.footer}>
            <Grid className={classes.footerTitle}>
                <Heading5 mb={1}>Tet holiday adtraction 2021 - Tet holidayadtraction 2021 - Tet holidayadt</Heading5>
                <Box className={classes.chipDuration}>
                    <img src={images.icScenes} alt="icon scenes"/>
                    <ParagraphBody $colorName="--cimigo-green-dark-2">5</ParagraphBody>
                </Box>
            </Grid>
            <Grid sx={{mt: 2}}>
                <Box className={classes.textItem}>
                    <img src={images.icBranding} alt="icon branding"/>
                    <ParagraphSmall $colorName="--eerie-black">Mirinda soda ice cream</ParagraphSmall>
                </Box>
                <Box className={classes.textItem}>
                    <img src={images.icProduct} alt="icon branding"/>
                    <ParagraphSmall $colorName="--eerie-black">Mirinda soda ice cream</ParagraphSmall>
                </Box>
                <Box className={classes.textItem}>
                    <img src={images.icMessage} alt="icon branding"/>
                    <ShowMoreText
                    lines={2}
                    more="Show more"
                    less="Show less"
                    anchorClass={classes.textControl}
                    expanded={false}
                    width={480}
                    className={classes.wrapperText}
                    >
                      
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
                      consectetur venenatis blandit. Praesent vehicula, libero non pretium
                      vulputate, lacus arcu facilisis lectus, sed feugiat tellus nulla eu
                      dolor. Nulla porta bibendum lectus quis euismod. Aliquam volutpat
                      ultricies porttitor. Cras risus nisi, accumsan vel cursus ut,
                      sollicitudin vitae dolor. Fusce scelerisque eleifend lectus in bibendum.
                      Suspendisse lacinia egestas felis a volutpat.
                    
                    </ShowMoreText>
                </Box>
            </Grid>
        </Grid>
      </Box>
    </Grid>
  )
})

export default VideoItem