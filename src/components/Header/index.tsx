import { Box, Button, Grid, MenuItem } from "@mui/material";
import React, { memo, useEffect, useState, useRef } from "react";
import classes from './styles.module.scss';
import cimigoLogo from 'assets/img/cimigo_logo.svg';
import iconSearch from 'assets/img/icon/search.svg';
import iconMenuOpen from 'assets/img/icon/menu-open.svg';
import iconMenuClose from 'assets/img/icon/menu-close.svg';
import clsx from "clsx";
import UseAuth from "hooks/useAuth";
import { NavLink, Link } from 'react-router-dom';
import PopoverMenu from "components/PopoverMenu";
import Container from "components/Container";

interface HeaderProps {

}

const Header = memo((props: HeaderProps) => {
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
  const cimigoUrl =  process.env.REACT_APP_CIMIGO_URL;
  return (
    <header className={classes.root}>
      <Container className={classes.container}>
        <a href={cimigoUrl}>
          <div className={classes.imgContainer}>
            <img src={cimigoLogo} alt="cimigo" />
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
                Pricing
              </a>
            </li>
            <li className={classes.item}>
              <a className={classes.routerItem}>
                Resources
              </a>
            </li>
            <li className={classes.item}>
              <a href={cimigoUrl}>
                <button className={classes.btnSubscribe}>
                  Subscribe
                </button>
              </a>
            </li>
            <li className={clsx(classes.item, classes.menuAction)}>
              <button
                ref={anchorRef}
                onClick={() => setOpen(true)}
              >
                <img src={iconMenuOpen} alt="menu-action"/>
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
                    <a href={cimigoUrl}>
                      Home
                    </a>
                  </MenuItem>
                  <MenuItem className={classes.menuItem}>
                    <a href={`${cimigoUrl}/people.html`}>
                      People
                    </a>
                  </MenuItem>
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
            
          </ul>
        </nav>
      </Container>
    </header>
  )
  // return (
  //   <header className={clsx(classes.headerRoot, { [classes.headerScroll]: isScrolling })} >
  //     <Container className={classes.headerWrapper} maxWidth="lg">
  //       <Box className={classes.headerContainer}>
  //         <Grid
  //           container
  //           alignItems="center"
  //           justify="space-between"
  //           wrap="nowrap"
  //           className={classes.headerNav}
  //         >
  //           <Grid
  //             item
  //             container
  //             alignItems="center"
  //             justify="flex-start"
  //             className={classes.navLogoBox}
  //           >
  //             <Link to={routes.home}><LogoImage src={cimigoLogo} /></Link>
  //           </Grid>
  //           <Grid
  //             item
  //             container
  //             justify="center"
  //             alignItems="center"
  //             className={classes.navMenuBox}
  //           >
  //             <ul className={classes.navMenu}>
  //               <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.home}>Home</NavLink></li>
  //               <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.home}>Plan</NavLink></li>
  //               {
  //                 isLoggedIn ? (
  //                   <>
  //                     <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.myProject}>My Project</NavLink></li>
  //                     <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.myDashboard}>My Dashboard</NavLink></li>
  //                   </>
  //                 ) : (
  //                   <>
  //                     <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.home}>Dashboard</NavLink></li>
  //                   </>
  //                 )
  //               }
  //               <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.home}>FAQ</NavLink></li>
  //               <li><NavLink exact className={classes.navlink} activeClassName={classes.navlinkActive} to={routes.home}>Contact</NavLink></li>
  //             </ul>
  //           </Grid>
  //           <Grid
  //             item
  //             container
  //             justify="flex-end"
  //             alignItems="center"
  //             className={classes.logoControlBox}
  //           >
  //             <div className={classes.languages}>
  //               <Languages/>
  //             </div>
  //             {isLoggedIn ? (
  //               <>
  //                 <UserAccount />
  //               </>
  //             ) : (
  //               <>
  //                 <Link to={routes.register}>
  //                   <Button
  //                     className={classes.headerButton}
  //                     variant="contained"
  //                     color="secondary"
  //                   >
  //                     Register
  //                   </Button>
  //                 </Link>
  //                 <Link to={routes.login}>
  //                   <Button
  //                     className={classes.headerButton}
  //                     variant="contained"
  //                     color="primary"
  //                   >
  //                     Login
  //                 </Button>
  //                 </Link>
  //               </>
  //             )}
  //           </Grid>
  //         </Grid>
  //       </Box>
  //     </Container>
  //   </header>
  // )
})

export default Header