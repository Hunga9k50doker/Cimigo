import { Grid, TableHead, TableRow, TableCell, TableBody, Table, useMediaQuery, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import classes from './styles.module.scss';
import Images from "config/images";

const rows = [
  {
    strata: "Rural",
    region: "North",
    provinces: "Ha Noi",
    size: "90",
  },
  {
    strata: "Rural",
    region: "North",
    provinces: "Ha Noi",
    size: "90",
  },
  {
    strata: "Rural",
    region: "North",
    provinces: "Ha Noi",
    size: "90",
  },
  {
    strata: "Rural",
    region: "North",
    provinces: "Ha Noi",
    size: "90",
  },
]

const Quotas = () => {
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  return (
    <>
     

      <Grid className={classes.noSetup}>
        <img src={Images.icSad} alt=""/>
        <p>No target setup</p>
        <span>You need to specify your target consumers to see the quotas setup table.</span>
        <a>Set up target</a>
      </Grid>
    </>
  )
}

export default Quotas;