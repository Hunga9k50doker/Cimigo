import { Grid, IconButton, Menu, MenuItem } from "@mui/material";
import { memo, useEffect, useState, useRef, useMemo } from "react";
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
import { langSupports } from "models/general";
import { Project } from "models/project";
import Inputs from "components/Inputs";
import { ProjectService } from "services/project";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { getProjectRequest } from "redux/reducers/Project/actionTypes";

interface HeaderProps {
  project?: boolean;
  detail?: Project;
}

const Header = memo((props: HeaderProps) => {
  const { t, i18n } = useTranslation()

  const { project, detail } = props;
  const history = useHistory();
  const dispatch = useDispatch()
  const { isLoggedIn, logout, user } = UseAuth();
  const anchorRef = useRef(null);
  const [isOpen, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [anchorElLang, setAnchorElLang] = useState<null | HTMLElement>(null);
  const openProfile = Boolean(anchorEl);
  const [isEdit, setIsEdit] = useState(false);
  const [projectName, setProjectName] = useState<string>('');

  const handleClick = (e: any) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const dataList = useMemo(() => {
    return [
      {
        link: routesOutside(i18n.language)?.overview,
        name: t('header_menu_overview'),
      },
      {
        link: routesOutside(i18n.language)?.howItWorks,
        name: t('header_menu_how_it_works'),
      },
      {
        link: routesOutside(i18n.language)?.solution,
        name: t('header_menu_solution'),
      },
      {
        link: routesOutside(i18n.language)?.faq,
        name: t('header_menu_FAQ'),
      }
    ]
  }, [i18n.language])


  const onGoHome = () => {
    if (isLoggedIn) dispatch(push(routes.project.management))
    else dispatch(push(routes.login))
  }

  const changeLanguage = (lang: string) => {
    setAnchorElLang(null)
    if (lang === i18n.language) return
    i18n.changeLanguage(lang, () => {
      window.location.reload()
    })
  }

  const handleEditProjectName = () => {
    setIsEdit(true)
    setProjectName(detail.name)
  }

  const isValidProjectName = () => {
    return projectName && detail && projectName !== detail.name
  }

  const onCloseChangeProjectName = () => {
    setProjectName('')
    setIsEdit(false)
  }

  const onChangeProjectName = () => {
    if (!isValidProjectName()) {
      onCloseChangeProjectName()
      return
    }
    dispatch(setLoading(true))
    ProjectService.renameProject(detail.id, {
      name: projectName
    })
      .then(() => {
        onCloseChangeProjectName()
        dispatch(getProjectRequest(detail.id))
      })
      .catch((e) => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(true)))
  }

  return (
    <header className={classes.root} id="header">
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
                  <p>{item.name}</p>
                </a>
              </MenuItem>
            ))}
            <Grid className={classes.lineOfToggle} />
            <button className={classes.buttonOfToggle} onClick={() => history.push(routes.login)}>
              <img src={images.icArrowLogin} alt="" className={classes.icButtonOfToggle} />
              <span translation-key="header_login">{t('header_login')}</span>
            </button>
            <button className={classes.buttonOfToggle} onClick={() => history.push(routes.register)}>
              <img src={images.icArrowRegister} alt="" className={classes.icButtonOfToggle} />
              <span translation-key="header_register">{t('header_register')}</span>
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
                <span translation-key="header_projects">{t('header_projects')}</span>
              </div>
            }
            {detail &&
              <div className={classes.linkTexDetail}>
                <img src={images.icNextMobile} alt='' />
                {!isEdit ? (
                  <a className={classes.detail} onClick={handleEditProjectName}>{detail.name}</a>
                ) : (
                  <div className={classes.editBox}>
                    <Inputs
                      name=""
                      size="small"
                      value={projectName}
                      onChange={(e) => setProjectName(e.target.value)}
                      placeholder={t('field_project_name_placeholder')}
                      translation-key-placeholder="field_project_name_placeholder"
                    />
                    <Buttons
                      nowrap
                      btnType="Blue"
                      translation-key="common_save"
                      children={t('common_save')}
                      padding="3px 13px"
                      startIcon={<img src={images.icSaveWhite} alt="" />}
                      onClick={onChangeProjectName}
                    />
                  </div>
                )}
              </div>
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
                    <p className={classes.itName}>{it.name}</p>
                  </MenuItem>
                ))}
              </Menu>
            </li>
            {isLoggedIn ?
              <li className={classes.item}>
                {/* <IconButton className={classes.itemBtn}>
                  <img src={images.icHelp} alt="" className={classes.icHelp} />
                </IconButton> */}
                <IconButton onClick={handleClick} className={classes.itemBtn}>
                  <img src={user?.avatar || images.icProfile} alt="" className={clsx(classes.avatar, {[classes.avatarEmpty]: !user?.avatar})} referrerPolicy="no-referrer" />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={openProfile}
                  onClose={handleClose}
                  classes={{ paper: classes.menuProfile }}
                >
                  {/* <MenuItem className={classes.itemAciton}>
                    <img src={images.icProfile} alt="" />
                    <p translation-key="auth_my_account">{t('auth_my_account')}</p>
                  </MenuItem> */}
                  <MenuItem className={classes.itemAciton} onClick={logout}>
                    <img src={images.icLogout} alt="" />
                    <p translation-key="auth_log_out">{t('auth_log_out')}</p>
                  </MenuItem>
                </Menu>
              </li>
              :
              <li className={classes.item}>
                <a className={classes.btnLogin}>
                  <Buttons btnType="TransparentBlue" children={t('header_login')} translation-key="header_login" padding="6px 16px" onClick={() => history.push(routes.login)} />
                </a>
                <a className={classes.btnLogout}>
                  <Buttons btnType="Blue" children={t('header_register')} translation-key="header_register" padding="6px 16px" onClick={() => history.push(routes.register)} />
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