import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";

interface LabelStatusProps {
  typeStatus: string,
}

const LabelStatus = memo((props: LabelStatusProps) => {
  const statusLabel = () => {
    switch (typeStatus) {
      case "awaitPayment":
        return "Await Payment";
      case "draft":
        return "Draft";
      case "inProgress":
        return "In Progress";
      case "completed":
        return "Completed";
      default: return typeStatus;
    }
  };
  const { typeStatus, ...rest } = props;

  return (
    <div
      className={clsx(
        classes.root,
        typeStatus === "awaitPayment" ? classes.red : "",
        typeStatus === "draft" ? classes.gray : "",
        typeStatus === "inProgress" ? classes.yellow : "",
        typeStatus === "completed" ? classes.green : "",
      )
      }
      {...rest}
    >
      {statusLabel()}
    </div >
  );
});
export default LabelStatus;
