import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { memo, useEffect, useState, useRef } from "react";
import classes from './styles.module.scss';
import cimigoLogo from 'assets/img/cimigo_logo.svg';
import iconMenuOpen from 'assets/img/icon/menu-open.svg';
import clsx from "clsx";
import UseAuth from "hooks/useAuth";
import { useHistory } from 'react-router-dom';
import Buttons from "components/Buttons";
import { routes, routesOutside } from "routers/routes";
import images from "config/images";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useTranslation } from "react-i18next";
import { KeyboardArrowDown } from "@mui/icons-material";
import { Lang, langSupports } from "models/general";

interface HeaderProps {
  project?: boolean;
  detail?: string;
}

const Header = memo((props: HeaderProps) => {
  const { t, i18n } = useTranslation()

  const { project, detail } = props;
  const history = useHistory();
  const dispatch = useDispatch()
  const { isLoggedIn, logout,user } = UseAuth();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [isScrolling, setScrolling] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
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


  const dataList = [
    {
      link: routesOutside(i18n.language).overview,
      name: "Overview",
    },
    {
      link: routesOutside(i18n.language).howItWorks,
      name: "How it works",
    },
    {
      link: routesOutside(i18n.language).solution,
      name: "Solution",
    },
    {
      link: routesOutside(i18n.language).faq,
      name: "FAQ",
    }
  ]


  const onGoHome = () => {
    if (isLoggedIn) dispatch(push(routes.project.management))
    else dispatch(push(routes.login))
  }

  const changeLanguage = (lang: string) => {
    if (lang === i18n.language) return
    i18n.changeLanguage(lang)
    setAnchorElLang(null)
  }


  return (
    <header className={classes.root}>
      <div className={classes.container}>
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
              <MenuItem key={item.name} className={classes.itemsOfToggle}>
                <a href={item.link} >
                  {item.name}
                </a>
              </MenuItem>
            ))}
            <Grid className={classes.lineOfToggle} />
            <button className={classes.buttonOfToggle} onClick={() => history.push(routes.login)}>
                <img src={images.icArrowLogin} alt="" className={classes.icButtonOfToggle} />
                <span>Login</span>
            </button>
            <button className={classes.buttonOfToggle} onClick={() => history.push(routes.register)}>
                <img src={images.icArrowRegister} alt="" className={classes.icButtonOfToggle} />
                <span>Register</span>
            </button>
          </Menu>
        </li>
        <a onClick={onGoHome}>
          <div className={classes.imgContainer}>
            <img src={cimigoLogo} alt="cimigo" />
          </div>
        </a>
        {isLoggedIn &&
          <div className={classes.linkProject}>
            {project &&
              <div className={classes.linkTextHome} onClick={() => history.push(routes.project.management)} >
                <img src={images.icHomeMobile} alt='' />
                <span>Projects</span>
              </div>
            }
            {detail &&
              <p className={classes.linkTexDetail}>
                <img src={images.icNextMobile} alt='' />
                <span className={classes.detail}>{detail}</span>
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
                    <a href={item.link} className={classes.routerItem}>
                      {item.name}
                    </a>
                  </li>
                ))}
              </div>
            }
            <li className={classes.item}>
              <Buttons
                className={classes.btnChangeLang}
                children={langSupports?.find(it => it.key === i18n.language).name}
                padding="7px 10px"
                onClick={(e) => setAnchorElLang(e.currentTarget)} endIcon={<KeyboardArrowDown />}
              />
              <Buttons 
                className={classes.btnChangeLang2}
                children={langSupports?.find(it => it.key === i18n.language).key}
                padding="7px 10px"
                onClick={(e) => setAnchorElLang(e.currentTarget)} endIcon={<KeyboardArrowDown />}
              />
              <Menu
                anchorEl={anchorElLang}
                open={Boolean(anchorElLang)}
                onClose={() => setAnchorElLang(null)}
                classes={{ paper: clsx(classes.menuProfile, classes.menuLang) }}
              >
                {langSupports.map(it => (
                  <MenuItem key={it.key} onClick={() => changeLanguage(it.key)} className={clsx(classes.itemAciton, { [classes.active]: it.key === i18n.language })}>
                    {/* <p>{it.name}</p> */}
                    <p className={classes.itName}>{it.name}</p>
                    <p className={classes.itKey}>{it.key}</p>
                  </MenuItem>
                ))}
              </Menu>
            </li>
            {isLoggedIn ?
              <li className={classes.item}>
                <IconButton className={classes.itemBtn}>
                  <img src={images.icHelp} alt="" className={classes.icHelp} />
                </IconButton>
                <IconButton onClick={handleClick} className={classes.itemBtn}>
                  <img src={user?.avatar || images.icProfile} alt="" className={classes.avatar} referrerPolicy="no-referrer" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openProfile}
                  onClose={handleClose}
                  classes={{ paper: classes.menuProfile }}
                >
                  {/* <MenuItem className={classes.itemAciton}>
                    <img src={images.icProfile} alt="" />
                    <p>My account</p>
                  </MenuItem> */}
                  <MenuItem className={classes.itemAciton} onClick={logout}>
                    <img src={images.icLogout} alt="" />
                    <p>Log out</p>
                  </MenuItem>
                </Menu>
              </li>
              :
              <li className={classes.item}>
                <a className={classes.btnLogin}>
                  <Buttons btnType="TransparentBlue" children="Log in" padding="6px 16px" onClick={() => history.push(routes.login)} />
                </a>
                <a className={classes.btnLogout}>
                  <Buttons btnType="Blue" children="Register" padding="6px 16px" onClick={() => history.push(routes.register)} />
                </a>
              </li>
            }
          </ul>
        </nav>
      </div>
    </header>
  )
})

export default Header