import { memo } from "react";
import Images from "config/images";
import { EmojisId } from "models/custom_question";

interface Props extends React.ImgHTMLAttributes<HTMLImageElement> {
    emojiId?: number;
    className?: string;
}

const Emoji = memo((props: Props) => {
  const { emojiId, className } = props;
  
  const renderImage = (emojiId) => {
    switch (emojiId) {
        case EmojisId.LAUGH:
            return Images.imgLaugh;
        case EmojisId.SMILE:
            return Images.imgSmile;
        case EmojisId.MEH:
            return Images.imgMeh;
         case EmojisId.SAD:
            return Images.imgSad;
        default:
            return Images.imgPain;
    }
  }
  return (
     <img src={renderImage(emojiId)} alt="emoji" className={className}/>
  );
});
export default Emoji;