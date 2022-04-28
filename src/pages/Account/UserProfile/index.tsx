import { Button, Grid, MenuItem,  FormControl, InputAdornment, Select } from "@mui/material"
import { useRef, useState } from "react";
import classes from './styles.module.scss';
import{CameraAlt,Report}  from '@mui/icons-material';
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

const UserProfile = (props) => {
    const {  logout,user } = UseAuth();
    const [isOpen, setOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const anchorRef = useRef(null);
    const [country, setCountry] = useState("Vietnam");
    const handleChangeSelect = event => {
        setCountry(event.target.value);
    };
    const { register, handleSubmit, formState: { errors } } = useForm<AttributeFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });
    const onSubmit = (data) => console.log(data);
    return ( <form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
                    <Grid className={classes.rowInfo}>
                        <div className={classes.personalImage}>
                            <img src={user?.avatar || images.icProfile} alt="" className={classes.avatar}/>
                            <label htmlFor="upload-photo" className={classes.uploadAvatar}>
                                <CameraAlt></CameraAlt>
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
                                    <Report className={classes.iconReport}></Report>
                                </InputAdornment>
                            }
                            inputRef={register('company')}
                            errorMessage={errors.company?.message}
                        />
                    </Grid>
                    <Button type='submit' children='Save changes' className={classes.btnSave} />
                </form>
    )
}

export default UserProfile