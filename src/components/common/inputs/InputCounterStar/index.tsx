import { memo } from 'react';
import classes from './styles.module.scss';
import { Grid } from "@mui/material";
import RemoveIcon from '@mui/icons-material/Remove';
import AddIcon from '@mui/icons-material/Add';


interface InputsProps {
    maxStars?: number,
    minStars?: number,
    value?: number,
    onChangeRemoveStar?: () => void,
    onChangeAddStar?: () => void,
}
const InputCounterStar = memo((props: InputsProps) => {

  const { maxStars, minStars, value, onChangeRemoveStar, onChangeAddStar} = props;

  return (         
    <div className={classes.contentNumberStar}>
      <button className={classes.btnActionStar} type="button" onClick={onChangeRemoveStar} disabled={value === minStars}>
          <RemoveIcon/>
      </button>
      <Grid className={classes.numberStarValue}>
          <input 
          value={value} 
          readOnly
          />
      </Grid>                       
      <button className={classes.btnActionStar} type="button" onClick={onChangeAddStar} disabled={value === maxStars}>
        <AddIcon/>
      </button>
    </div>                                          
  );
});
export default InputCounterStar;



