import classes from './styles.module.scss';
import Header from "components/Header";
import Footer from "components/Footer";
import { PersonOutline, Loop, Logout, Payment, CameraAlt, KeyboardDoubleArrowLeft, Report } from '@mui/icons-material';
import { Button, Grid, Icon, MenuItem, ListItem, MenuList, Menu, Popper, Grow, ClickAwayListener, Paper, IconButton, List, ListItemText } from "@mui/material"
import UseAuth from "hooks/useAuth";
import { matchPath, Redirect, Route, Switch, useParams, Link, NavLink } from "react-router-dom";
import UserProfile from './UserProfile';
import { routes } from "routers/routes";
import clsx from 'clsx';
import { useState, useRef } from 'react';

const Account = () => {
  const [isOpen, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };
  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setOpen(false);
  };

  const dataMenuList = [
    {
      icon: PersonOutline,
      path: routes.account.userProfile,
      name: "User profile",
    },
    {
      icon: Loop,
      path: routes.account.changePassword,
      name: "Change password",
    },
    {
      icon: Payment,
      path: routes.account.paymentInfo,
      name: "Payment",
    },

  ]
  const { logout } = UseAuth();
  const activeRoute = (routeName: string, exact: boolean = false) => {
    const match = matchPath(window.location.pathname, {
      path: routeName,
      exact: exact
    })
    return !!match
  };

  const links = (
    <List>
      {dataMenuList.map((route, key) => {
        const active: boolean = activeRoute(route.path);
        return (
          <NavLink to={route.path} key={key} activeClassName="active" onClick={handleClose}>
            <ListItem button className={clsx(classes.border, { [classes.borderActive]: active })} >
              {typeof route.icon === 'string' ? (
                <Icon>
                  {route.icon}
                </Icon>) :
                (<route.icon />)
              }
              <ListItemText className={classes.routeName}
                primary={route.name}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
    </List>
  );
  return (
    <Grid className={classes.root}>
      <Header project />
      <Grid className={classes.main}>
        <div className={classes.menuList}>
          {links}
          <Grid className={classes.lineOfMenuList}></Grid>
          <Button className={classes.btnOfMenuList} onClick={logout}>
            <Icon component={Logout}></Icon>
            <p>Logout</p>
          </Button>
        </div>
        <div className={classes.content}>
          <Switch>
            <Route exact path={routes.account.userProfile} render={(routeProps) => <UserProfile {...routeProps} />} />
            <Redirect from={routes.account.root} to={routes.account.userProfile} />
          </Switch>
          <div className={classes.toggleMenu}>
            <IconButton
              ref={anchorRef}
              onClick={handleToggle}
              className={classes.btnArrow}
            >
              <KeyboardDoubleArrowLeft></KeyboardDoubleArrowLeft>
            </IconButton>
            <Popper className={classes.positionPopper}
              open={isOpen}
              anchorEl={anchorRef.current}
              role={undefined}
              placement="bottom-start"
              transition
              disablePortal
            >
              <Paper>
                <ClickAwayListener onClickAway={handleClose}>
                  <MenuList
                    autoFocusItem={isOpen}
                    id="composition-menu"
                    aria-labelledby="composition-button"
                  >
                    {links}
                    <Grid className={classes.lineOfMenuToggle}></Grid>
                    <Button className={classes.btnOfMenuToggle} onClick={logout}>
                      <Icon component={Logout}></Icon>
                      <p>Logout</p>
                    </Button>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Popper>
          </div>
        </div>
      </Grid>
      <Footer />
    </Grid>
  );
};
export default Account;

