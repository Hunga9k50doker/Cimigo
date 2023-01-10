import { memo } from "react";
import classes from "./styles.module.scss";

const ArrowIconCustom = memo(() => {
  return (
    <div>
      <div className={classes.arrow1}></div>
      <div className={classes.arrow2}></div>
    </div>
  );
});

export default ArrowIconCustom;
