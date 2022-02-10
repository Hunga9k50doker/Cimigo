import { useRef, useState } from "react";
import useStyles from "./styles";
import { Box, Grid, MenuItem } from "@mui/material";
import clsx from "clsx";
import cimigoLogo from 'assets/img/cimigo_logo.svg';
import iconMenuOpen from 'assets/img/icon/menu-open.svg';
import Container from "components/Container";
import PopoverMenu from "components/PopoverMenu";

interface HeaderProps {

}

const Header = (props: HeaderProps) => {
  const classes = useStyles();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);

  const cimigoUrl = process.env.REACT_APP_CIMIGO_URL;

  return (
    <header className={classes.root}>
      <Container className={classes.container}>
        <li className={clsx(classes.item, classes.menuAction)}>
          <button
            ref={anchorRef}
            onClick={() => setOpen(true)}
          >
            <img src={iconMenuOpen} alt="menu-action" />
          </button>
          <PopoverMenu
            open={isOpen}
            paperClass={classes.menuActionPaper}
            arrowClass={classes.menuActionArrow}
            onClose={() => setOpen(false)}
            anchorEl={anchorRef.current}
          >
            <Box sx={{ py: 0 }}>
              <MenuItem className={classes.menuItem}>
                <a href={`${cimigoUrl}/solutions.html`}>
                  Solutions
                </a>
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <a href={`${cimigoUrl}/news.html`}>
                  News
                </a>
              </MenuItem>
              <MenuItem className={classes.menuItem}>
                <a href={`${cimigoUrl}/reports.html`}>
                  Reports
                </a>
              </MenuItem>
              <MenuItem className={clsx(classes.menuItem, classes.menuItemLast)}>
                <a href={`${cimigoUrl}/case-studies.html`}>
                  Case studies
                </a>
              </MenuItem>
            </Box>
          </PopoverMenu>
        </li>
        <a href={cimigoUrl}>
          <div className={classes.imgContainer}>
            <img src={cimigoLogo} alt="" />
          </div>
        </a>
        <nav className={classes.navBar}>
          <ul className={classes.listMenu}>
            <li className={classes.item}>
              <a className={classes.routerItem}>
                Solutions
              </a>
            </li>
            <li className={classes.item}>
              <a className={classes.routerItem}>
                People
              </a>
            </li>
            <li className={classes.item}>
              <a className={classes.routerItem}>
                Resources
              </a>
            </li>
            <li className={classes.item}>
              <a href={cimigoUrl} className={classes.btn}>
                <button className={classes.btnLogin}>
                  Log in
                </button>
                <button className={classes.btnRegister}>
                  Register
                </button>
              </a>
            </li>
            {/* <li className={clsx(classes.item, classes.searchWrapper)}>
              <a className={classes.btnSearch} href={cimigoUrl}>
                <img src={iconSearch} alt="search-wrapper"/>
              </a>
            </li> */}
          </ul>
        </nav>
      </Container>
    </header>
  );
};

export default Header;