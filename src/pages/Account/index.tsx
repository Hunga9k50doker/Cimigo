import classes from './styles.module.scss';
import Header from "components/Header";
import Footer from "components/Footer";
import { PersonOutline, Loop, Logout, Payment, CameraAlt, KeyboardDoubleArrowLeft } from '@mui/icons-material';
import { Button, Grid, Icon, MenuItem, ListItem, MenuList, Popper, ClickAwayListener, Paper, IconButton, List, ListItemText } from "@mui/material"
import UseAuth from "hooks/useAuth";
import { matchPath, Redirect, Route, Switch, NavLink } from "react-router-dom";
import UserProfile from './UserProfile';
import { routes } from "routers/routes";
import clsx from 'clsx';
import { useState, useRef } from 'react';


const Account = () => {
  const { logout } = UseAuth();
  const [isOpen, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const activeRoute = (routeName: string, exact: boolean = false) => {
    const match = matchPath(window.location.pathname, {
      path: routeName,
      exact: exact
    })
    return !!match
  };
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event | React.SyntheticEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
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

  const links = (
    <List>
      {dataMenuList.map((route, key) => {
        const active: boolean = activeRoute(route.path);
        return (
          <NavLink to={route.path} key={key} activeClassName="active" onClick={handleClose}>
            <ListItem button className={clsx(classes.border, { [classes.borderActive]: active })} >
              {typeof route.icon === 'string' ? (<Icon>{route.icon}</Icon>) : (<route.icon />)}
              <ListItemText 
                className={classes.routeName}
                primary={route.name}
                disableTypography={true}
              />
            </ListItem>
          </NavLink>
        );
      })}
      <Grid className={classes.lineList}></Grid>
      <Button className={classes.btnLogout} onClick={logout}>
        <Icon component={Logout}></Icon>
        <p>Logout</p>
      </Button>
    </List>
  );
  return (
    <Grid className={classes.root}>
      <Header project />
      <Grid className={classes.main}>
        <div className={classes.menuList}>
          {links}
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
                  <MenuList autoFocusItem={isOpen}>{links}</MenuList>
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

