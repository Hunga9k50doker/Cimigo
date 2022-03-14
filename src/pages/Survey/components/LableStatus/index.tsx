import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";

interface LabelStatusProps {
  typeStatus: string,
}

const LabelStatus = memo((props: LabelStatusProps) => {
  const statusLabel = () => {
    switch (typeStatus) {
      case "currentPack":
        return "Current pack";
      case "testPack":
        return "Test pack";
      case "competitorPack":
        return "Competitor pack";
      default: return typeStatus;
    }
  };
  const { typeStatus, ...rest } = props;

  return (
    <div
      className={clsx(
        classes.root,
        typeStatus === "currentPack" ? classes.green : "",
        typeStatus === "testPack" ? classes.blue : "",
        typeStatus === "competitorPack" ? classes.brown : "",
      )
      }
      {...rest}
    >
      {statusLabel()}
    </div >
  );
});
export default LabelStatus;
