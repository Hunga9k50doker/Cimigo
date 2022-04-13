import { memo } from "react";
import classes from './styles.module.scss';
import clsx from "clsx";
import { ProjectStatus } from "models/project";

interface LabelStatusMobileProps {
  typeStatus: ProjectStatus,
}

const LabelStatusMobile = memo((props: LabelStatusMobileProps) => {
  const statusLabel = () => {
    switch (typeStatus) {
      case ProjectStatus.AWAIT_PAYMENT:
        return "Await Payment";
      case ProjectStatus.DRAFT:
        return "Draft";
      case ProjectStatus.IN_PROGRESS:
        return "In Progress";
      case ProjectStatus.COMPLETED:
        return "Completed";
      default: return typeStatus;
    }
  };
  const { typeStatus, ...rest } = props;

  return (
    <div
      className={clsx(
        classes.root,
        typeStatus === ProjectStatus.AWAIT_PAYMENT ? classes.red : "",
        typeStatus === ProjectStatus.DRAFT ? classes.gray : "",
        typeStatus === ProjectStatus.IN_PROGRESS ? classes.yellow : "",
        typeStatus === ProjectStatus.COMPLETED ? classes.green : "",
      )
      }
      {...rest}
    >
      <div/><p>{statusLabel()}</p>
    </div >
  );
});
export default LabelStatusMobile;