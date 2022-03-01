import { Box, MenuItem } from "@mui/material";
import React, { memo, useEffect, useState, useRef } from "react";
import classes from './styles.module.scss';
import cimigoLogo from 'assets/img/cimigo_logo.svg';
import iconMenuOpen from 'assets/img/icon/menu-open.svg';
import clsx from "clsx";
import UseAuth from "hooks/useAuth";
import { useHistory } from 'react-router-dom';
import PopoverMenu from "components/PopoverMenu";
import Container from "components/Container";
import Buttons from "components/Buttons";
import { routes } from "routers/routes";

interface HeaderProps {

}

const Header = memo((props: HeaderProps) => {
  const history = useHistory()
  const { isLoggedIn } = UseAuth();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [isScrolling, setScrolling] = useState(false);

  const handleScroll = () => {
    setScrolling(window.scrollY !== 0)
  }

  function _handleScroll(e: any) {
    handleScroll();
  }

  useEffect(() => {
    window.addEventListener('scroll', _handleScroll);
    return () => {
      window.removeEventListener('scroll', _handleScroll);
    }
  }, [])
  const cimigoUrl = process.env.REACT_APP_CIMIGO_URL;

  const dataList = [
    {
      name: "Solutions",
    },
    {
      name: "Pricing",
    },
    {
      name: "Resources",
    }
  ]

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
              {dataList.map(item => (
                <MenuItem key={item.name} className={classes.menuItem}>
                  <a href={cimigoUrl}>
                    {item.name}
                  </a>
                </MenuItem>
              ))}
            </Box>
          </PopoverMenu>
        </li>
        <a href={cimigoUrl}>
          <div className={classes.imgContainer}>
            <img src={cimigoLogo} alt="cimigo" />
          </div>
        </a>
        <nav className={classes.navBar}>
          <ul className={classes.listMenu}>
            <div className={classes.listItem}>
              {dataList.map(item => (
                <li key={item.name} className={classes.item}>
                  <a className={classes.routerItem}>
                    {item.name}
                  </a>
                </li>
              ))}
            </div>
            <li className={classes.item}>
              <a href={cimigoUrl} className={classes.btnLogin}>
                <Buttons btnType="TransparentBlue" children="Log in" padding="6px 16px" onClick={() => history.push(routes.login)}/>
              </a>
              <a href={cimigoUrl}>
                <Buttons btnType="Blue" children="Register" padding="7px 16px" onClick={() => history.push(routes.register)}/>
              </a>
            </li>
          </ul>
        </nav>
      </Container>
    </header>
  )
})

export default Header