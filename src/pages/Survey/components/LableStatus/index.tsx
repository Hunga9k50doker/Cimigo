import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { OptionItem } from "models/general";
import { PackType } from "models/pack";

interface LabelStatusProps {
  status: OptionItem
}

const LabelStatus = memo((props: LabelStatusProps) => {
  
  const { status, ...rest } = props;

  return (
    <div
      className={clsx(
        classes.root,
        status.id === PackType.Current_Pack ? classes.green : "",
        status.id === PackType.Test_Pack ? classes.blue : "",
        status.id === PackType.Competitor_Pack ? classes.brown : "",
      )
      }
      {...rest}
    >
      {status.name}
    </div >
  );
});
export default LabelStatus;
