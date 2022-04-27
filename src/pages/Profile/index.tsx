import { Button, Grid, Icon, IconButton, Menu, MenuItem, MenuList, FormControl, InputAdornment, Select } from "@mui/material"
import Footer from "components/Footer"
import Header from "components/Header"
import { useRef, useState } from "react";
import classes from './styles.module.scss';
import icUserProfile from '@mui/icons-material/PersonOutline';
import icChangePassword from '@mui/icons-material/Loop';
import iconMenuOpen from 'assets/img/icon/menu-open.svg';
import icPaymentInfo from '@mui/icons-material/Payment';
import icLogout from '@mui/icons-material/Logout';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import icDoubleArrowLeft from '@mui/icons-material/KeyboardDoubleArrowLeft';
import icReport from '@mui/icons-material/Report';
import clsx from "clsx";
import SvgIcon from '@mui/material/SvgIcon';
import Inputs from "components/Inputs";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import UseAuth from "hooks/useAuth";
import images from "config/images";

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup.string().email('Please enter a valid email address').required('Email is required.'),
    phone: yup.string().matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, { message: "Please enter a valid phone number.", excludeEmptyString: true }).required('Phone is required.'),
    company: yup.string().required('Company is required.'),
})
export interface AttributeFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    company: string
}
const Profile = () => {

    const {  logout,user } = UseAuth();
    const [isOpen, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const anchorRef = useRef(null);
    const [country, setCountry] = useState("Vietnam");// <--------------(Like this).
    const handleChangeSelect = event => {
        setCountry(event.target.value);
    };
    const { register, handleSubmit, formState: { errors } } = useForm<AttributeFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });
    const onSubmit = (data) => console.log(data);
    const dataMenuList = [
        {
            icon: icUserProfile,
            link: "",
            name: "User profile",
        },
        {
            icon: icChangePassword,
            link: "",
            name: "Change password",
        },
        {
            icon: icPaymentInfo,
            link: "",
            name: "Payment info",
        },
    ]
    return (
        <Grid className={classes.root}>
            <Header project />
            <Grid className={classes.main}>
                <Menu open={isOpen}
                    onClose={() => setOpen(false)}
                    anchorEl={anchorRef.current}
                    classes={{ paper: classes.rootMenu }}
                >
                    {dataMenuList.map(item => (
                        <MenuItem key={item.name} className={classes.itemsOfToggle}>
                            <a href={item.link} className={classes.aItemMenu}>
                                <SvgIcon component={item.icon} className={classes.icon}></SvgIcon>
                                <p>{item.name}</p>
                            </a>
                        </MenuItem>
                    ))}
                    <Grid className={classes.lineOfMenu}></Grid>
                    <Button className={classes.btnOfMenu} onClick={logout}>
                        <Icon component={icLogout}></Icon>
                        <p>Logout</p>
                    </Button>
                </Menu>
                <div className={classes.menuList}>
                    <MenuList >
                        {dataMenuList.map(item => (
                            <MenuItem key={item.name} className={classes.border}>
                                <a href={item.link} className={classes.aItemMenuList}>
                                    <SvgIcon component={item.icon} className={classes.icon}></SvgIcon>
                                    <p>{item.name}</p>
                                </a>
                            </MenuItem>
                        ))}
                    </MenuList>
                    <Grid className={classes.lineOfMenuList}></Grid>
                    <Button className={classes.btnOfMenuList} onClick={logout}>
                        <Icon component={icLogout}></Icon>
                        <p>Logout</p>
                    </Button>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                     <IconButton className={classes.toggleMenu}
                        ref={anchorRef}
                        onClick={() => setOpen(true)}
                    >
                        <SvgIcon component={icDoubleArrowLeft} ></SvgIcon>
                    </IconButton> 
                  
                    <Grid sx={{ display: 'flex', marginBottom: "35px" }}>
                        <div className={classes.personalImage}>
                            <img src={user?.avatar || images.icProfile} alt="" className={classes.avatar}/>
                            <label htmlFor="upload-photo" className={classes.uploadAvatar}>
                                <CameraAltIcon></CameraAltIcon>
                            </label>
                            <input type="file" id="upload-photo" />
                        </div>
                        <div className={classes.personalInfo}>
                            <p className={classes.name}>Nguyen Thi Anh Nguyen</p>
                            <p className={classes.country}>Cimigo, Vietnam</p>
                        </div>
                    </Grid>
                    <Grid className={classes.inputFlex}>
                        <Inputs
                            title="First name"
                            name="First name"
                            type="text"
                            placeholder="Nguyen"
                            inputRef={register('firstName')}
                            errorMessage={errors.firstName?.message}
                        />
                        <Inputs
                            title="Last name"
                            name="Last name"
                            type="text"
                            placeholder="Anh"
                            inputRef={register('lastName')}
                            errorMessage={errors.lastName?.message}
                        />
                    </Grid>
                    <Grid className={classes.inputFull}>
                        <Inputs
                            title="Email"
                            name="Email"
                            type="text"
                            placeholder="anhnguyen@cimigo.com"
                            inputRef={register('email')}
                            errorMessage={errors.email?.message}
                        />
                    </Grid>
                    <Grid className={classes.inputFlex}>
                        <Inputs
                            title="Phone number"
                            name="Phone number"
                            type="text"
                            placeholder="+8477348125"
                            inputRef={register('phone')}
                            errorMessage={errors.phone?.message}
                        />
                        <Grid sx={{ width: "100%" }}>
                            <FormControl fullWidth className={classes.selectOfForm}>
                                <p>Country</p>
                                <Select
                                    value={country}
                                    className={classes.inner}
                                    onChange={handleChangeSelect}
                                    sx={{ maxHeight: "48px" }}
                                >
                                    {/* map */}
                                    <MenuItem value="Vietnam">Vietnam</MenuItem>
                                    <MenuItem value="English">English</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid className={classes.inputFull}>
                        <Inputs
                            title="Company"
                            name="Company"
                            type="text"
                            placeholder="Cimigo"
                            endAdornment={
                                <InputAdornment position="end">
                                    <SvgIcon component={icReport} className={classes.iconReport}></SvgIcon>
                                </InputAdornment>
                            }
                            inputRef={register('company')}
                            errorMessage={errors.company?.message}
                        />
                    </Grid>
                    <Button type='submit' children='Save changes' className={classes.btnSave} />
                </form>
            </Grid>
            <Footer />
        </Grid>
    )
}

export default Profile