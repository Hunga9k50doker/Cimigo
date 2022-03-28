import { Box, IconButton, Menu, MenuItem } from "@mui/material";
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
import images from "config/images";

interface HeaderProps {
  project?: boolean;
  detail?: string;
}

const Header = memo((props: HeaderProps) => {
  const { project, detail } = props;
  const history = useHistory();
  const { isLoggedIn, logout } = UseAuth();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [isScrolling, setScrolling] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);

  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
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
          <IconButton
            ref={anchorRef}
            onClick={() => setOpen(true)}
          >
            <img src={iconMenuOpen} alt="menu-action" />
          </IconButton>
          <Menu
            open={isOpen}
            onClose={() => setOpen(false)}
            anchorEl={anchorRef.current}
            classes={{ paper: classes.rootMenu }}
          >
            {dataList.map(item => (
              <MenuItem key={item.name}>
                <a href={cimigoUrl}>
                  {item.name}
                </a>
              </MenuItem>
            ))}
          </Menu>
        </li>
        <a href={cimigoUrl}>
          <div className={classes.imgContainer}>
            <img src={cimigoLogo} alt="cimigo" />
          </div>
        </a>
        {isLoggedIn &&
          <div className={classes.linkProject}>
            {project &&
              <div className={classes.linkTextHome} >
                <img src={images.icHomeMobile} alt='' onClick={() => history.push(routes.project.management)} />
                <span>Projects</span>
              </div>
            }
            {detail &&
              <p className={classes.linkTexDetail}>
                <img src={images.icNextMobile} alt='' />
                <span>{detail}</span>
              </p>
            }
          </div>
        }
        <nav className={classes.navBar}>
          <ul className={classes.listMenu}>
            {isLoggedIn ? "" :
              <div className={classes.listItem}>
                {dataList.map(item => (
                  <li key={item.name} className={classes.item}>
                    <a className={classes.routerItem}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </div>
            }
            {isLoggedIn ?
              <li className={classes.item}>
                <IconButton className={classes.itemBtn}>
                  <img src={images.icHelp} alt="" />
                </IconButton>
                <IconButton onClick={handleClick} className={classes.itemBtn}>
                  <img src={images.icProfile} alt="" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openProfile}
                  onClose={handleClose}
                  classes={{ paper: classes.menuProfile }}
                >
                  <MenuItem className={classes.itemAciton}>
                    <img src={images.icProfile} alt="" />
                    <p>My account</p>
                  </MenuItem>
                  <MenuItem className={classes.itemAciton} onClick={logout}>
                    <img src={images.icLogout} alt="" />
                    <p>Log out</p>
                  </MenuItem>
                </Menu>
              </li>
              :
              <li className={classes.item}>
                <a href={cimigoUrl} className={classes.btnLogin}>
                  <Buttons btnType="TransparentBlue" children="Log in" padding="6px 16px" onClick={() => history.push(routes.login)} />
                </a>
                <a href={cimigoUrl} className={classes.btnLogout}>
                  <Buttons btnType="Blue" children="Register" padding="6px 16px" onClick={() => history.push(routes.register)} />
                </a>
              </li>
            }
          </ul>
        </nav>
      </Container>
    </header>
  )
})

export default Header