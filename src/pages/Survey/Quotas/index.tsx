import { Grid, TableHead, TableRow, TableCell, TableBody, Table } from '@mui/material';
import classes from './styles.module.scss';
// import Images from "config/images";

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
  return (
    <>
      <Grid>
        <p className={classes.title}>Quotas</p>
        <p className={classes.subTitle}>The following quota tables are suggested by Cimigo, based on your selection of target criteria. The sample design is automatically allocated in proportion to the population for the best result.</p>
        <p className={classes.subTitle}>We recommend that you leave these unchanged unless you have compelling reasons to change them.</p>

        {/* ==========================Table Provinces========================== */}
        <Table className={classes.tableProvinces}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Strata</TableCell>
              <TableCell>Region</TableCell>
              <TableCell>Provinces</TableCell>
              <TableCell align='center'>Representative sample size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {rows.map((row, index) => (
              <TableRow
                key={index}
              >
                <TableCell>{row.strata}</TableCell>
                <TableCell>{row.region}</TableCell>
                <TableCell>{row.provinces}</TableCell>
                <TableCell align='center'>{row.size}</TableCell>
              </TableRow>
            ))}
            <TableRow className={classes.rowTotal}>
              <TableCell align="right" colSpan={3}>Total</TableCell>
              <TableCell align="center">9999</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ==========================Table Economic class========================== */}
        <Table className={classes.tableProvinces}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Strata</TableCell>
              <TableCell>Economic class</TableCell>
              <TableCell align='center'>Representative sample size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {rows.map((row, index) => (
              <TableRow
                key={index}
              >
                <TableCell>{row.strata}</TableCell>
                <TableCell>{row.provinces}</TableCell>
                <TableCell align='center'>{row.size}</TableCell>
              </TableRow>
            ))}
            <TableRow className={classes.rowTotal}>
              <TableCell align="right" colSpan={2}>Total</TableCell>
              <TableCell align="center">9999</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ==========================Table Age========================== */}
        <Table className={classes.tableProvinces}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Gender</TableCell>
              <TableCell>Age</TableCell>
              <TableCell align='center'>Representative sample size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {rows.map((row, index) => (
              <TableRow
                key={index}
              >
                <TableCell>{row.strata}</TableCell>
                <TableCell>{row.provinces}</TableCell>
                <TableCell align='center'>{row.size}</TableCell>
              </TableRow>
            ))}
            <TableRow className={classes.rowTotal}>
              <TableCell align="right" colSpan={2}>Total</TableCell>
              <TableCell align="center">9999</TableCell>
            </TableRow>
          </TableBody>
        </Table>

        {/* ==========================Table Age of child========================== */}
        <Table className={classes.tableProvinces}>
          <TableHead className={classes.tableHead}>
            <TableRow>
              <TableCell>Age of child</TableCell>
              <TableCell align='center'>Representative sample size</TableCell>
            </TableRow>
          </TableHead>
          <TableBody className={classes.tableBody}>
            {rows.map((row, index) => (
              <TableRow
                key={index}
              >
                <TableCell>{row.strata}</TableCell>
                <TableCell align='center'>{row.size}</TableCell>
              </TableRow>
            ))}
            <TableRow className={classes.rowTotal}>
              <TableCell align="right" colSpan={1}>Total</TableCell>
              <TableCell align="center">9999</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </Grid>

      {/* <Grid className={classes.noSetup}>
        <img src={Images.icSad} alt=""/>
        <p>No target setup</p>
        <span>You need to specify your target consumers to see the quotas setup table.</span>
        <a>Set up target</a>
      </Grid> */}
    </>
  )
}

export default Quotas;