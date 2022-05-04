import { Button, Grid, MenuItem, FormControl, InputAdornment, Select } from "@mui/material"
import { useEffect, useMemo, useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import CountryService from "services/country";
import { VALIDATION } from "config/constans";
export interface DataForm {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryId: OptionItem;
    company: string
}

const UserProfile = (props) => {

    const { t, i18n } = useTranslation()
    const schema = useMemo(()=>{
        return yup.object().shape({
            firstName: yup.string()
            .required(t('field_first_name_vali_required')),
            lastName: yup.string()
            .required(t('field_last_name_vali_required')),
            email: yup.string()
            .email(t('field_email_vali_email'))
            .required(t('field_email_vali_required')),
            phone: yup.string().matches(VALIDATION.phone, 
            { message: t('field_phone_number_vali_phone'), excludeEmptyString: true }),
            company: yup.string(),
            countryId: yup.object().shape({
                id: yup.number().required(t('field_country_vali_required')),
                name: yup.string().required()
              }).required(),
        })
    }, [i18n.language])
    const dispatch = useDispatch()
    useEffect(() => {
        const fetchData = async () => {
          dispatch(setLoading(true))
          const data = await CountryService.getCountries({ take: 9999 })
            .catch((e) => {
              dispatch(setErrorMess(e))
              return null
            })
          setCountries(data?.data || [])
          dispatch(setLoading(false))
        }
        fetchData()
      }, [dispatch])

    const { user } = UseAuth();
    const [countries, setCountries] = useState<OptionItem[]>([])
    const { register, handleSubmit, control, formState: { errors } } = useForm<DataForm>({
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
                title={t('field_first_name')}
                translation-key="field_first_name"
                name="firstName"
                type="text"
                placeholder="Nguyen"
                inputRef={register('firstName')}
                errorMessage={errors.firstName?.message}
            />
            <Inputs
                title={t('field_last_name')}
                translation-key="field_last_name"
                name="lastName"
                type="text"
                placeholder="Anh"
                inputRef={register('lastName')}
                errorMessage={errors.lastName?.message}
            />
        </Grid>
        <Grid className={classes.inputFull}>
            <Inputs
                title={t('field_email')}
                translation-key="field_email"
                name="email"
                type="text"
                placeholder="anhnguyen@cimigo.com"
                inputRef={register('email')}
                errorMessage={errors.email?.message}
            />
        </Grid>
        <Grid className={classes.inputFlex}>
            <Inputs
                title={t('field_phone_number')}
                name="phone"
                optional
                type="text"
                placeholder={t('field_phone_number_placeholder')}
                translation-key-placeholder="field_phone_number_placeholder"
                inputRef={register('phone')}
                errorMessage={errors.phone?.message}
            />
            <InputSelect
                title={t('field_country')}
                name="countryId"
                control={control}
                selectProps={{
                    options: countries,
                    className: classes.customSelect,
                    placeholder:"Vietnam",
                }}
                errorMessage={(errors.countryId as any)?.id?.message}
            />
        </Grid>
        <Grid className={classes.inputFull}>
            <Inputs
                title={t('field_company')}
                translation-key="field_company"
                optional
                name="company"
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