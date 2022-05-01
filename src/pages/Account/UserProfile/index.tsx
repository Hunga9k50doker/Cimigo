import { Button, Grid, MenuItem, FormControl, InputAdornment, Select } from "@mui/material"
import { useRef, useState } from "react";
import classes from './styles.module.scss';
import { CameraAlt, Report } from '@mui/icons-material';
import Inputs from "components/Inputs";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useForm } from "react-hook-form";
import UseAuth from "hooks/useAuth";
import images from "config/images";
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";

const schema = yup.object().shape({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup.string().email('Please enter a valid email address').required('Email is required.'),
    phone: yup.string().matches(/(((\+|)84)|0)(3|5|7|8|9)+([0-9]{8})\b/, { message: "Please enter a valid phone number.", excludeEmptyString: true }).required('Phone is required.'),
    company: yup.string().required('Company is required.'),
    countryId: yup.object().shape({
        id: yup.number().required("Country is required"),
        name: yup.string().required()
    }).required(),
})
export interface AttributeFormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryId: OptionItem;
    company: string
}

const UserProfile = (props) => {
    const { user } = UseAuth();
    const [countries, setCountries] = useState<OptionItem[]>([])
    const { register, handleSubmit, control, formState: { errors } } = useForm<AttributeFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });
    const onSubmit = (data) => console.log(data);
    return (<form onSubmit={handleSubmit(onSubmit)} className={classes.form}>
        <Grid className={classes.rowInfo}>
            <div className={classes.personalImage}>
                <img src={user?.avatar || images.icProfile} alt="" className={classes.avatar} />
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
            <InputSelect
                title="Country"
                name="countryId"
                control={control}

                selectProps={{
                    options: countries,
                    placeholder: "Vietnam",
                    className: classes.customSelect
                }}
                errorMessage={(errors.countryId as any)?.id?.message}
            />
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