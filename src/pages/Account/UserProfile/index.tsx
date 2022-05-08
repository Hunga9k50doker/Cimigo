import { Button, Grid, MenuItem, FormControl, InputAdornment, Select } from "@mui/material"
import { memo, useEffect, useMemo, useRef, useState } from "react";
import classes from './styles.module.scss';
import { Camera, CameraAlt, Report } from '@mui/icons-material';
import Inputs from "components/Inputs";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Controller, useForm } from "react-hook-form";
import images from "config/images";
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { useTranslation } from "react-i18next";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import CountryService from "services/country";
import { VALIDATION } from "config/constans";
import UploadImage from "components/UploadImage";
import { User } from "models/user"

export interface DataForm {
    avatar: File | string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    countryId: OptionItem;
    company: string;
    fullName: string;
}

interface Props {
    itemEdit?: User;
    onSubmit: (data: FormData) => void
}

const UserProfile = memo(({ itemEdit, onSubmit }: Props) => {
    const dispatch = useDispatch()
    const { t, i18n } = useTranslation()
    const schema = useMemo(() => {
        return yup.object().shape({
            avatar: yup.mixed(),
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
    const [countries, setCountries] = useState<OptionItem[]>([])
    const { register, handleSubmit, control, formState: { errors }, reset } = useForm<DataForm>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

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

    useEffect(() => {
        if (itemEdit !== null) {
            reset({
                avatar: itemEdit.avatar || '',
                firstName: itemEdit.firstName || '',
                lastName: itemEdit.lastName || '',
                email: itemEdit.email || '',
                countryId: itemEdit.country ? { id: itemEdit.country.id, name: itemEdit.country.name } : undefined,
                company: itemEdit.company || '',
                phone: itemEdit.phone || '',
            })
        }
    }, [reset])
    const _onSubmit = (data: DataForm) => {
        const form = new FormData()
        form.append('firstName', data.firstName)
        form.append('lastName', data.lastName)
        form.append('email', data.email)
        form.append('countryId', `${data.countryId.id}`)
        form.append('company', data.company)
        form.append('phone', data.phone)
        if (typeof data.avatar === 'object') form.append('avatar', data.avatar)
        onSubmit(form)
    }

    return (<form onSubmit={handleSubmit(_onSubmit)} className={classes.form} >
        <Grid className={classes.rowInfo}>
            <div className={classes.personalImage} >
                <Controller
                    name="avatar"
                    control={control}
                    render={({ field }) => <UploadImage
                        file={field.value || itemEdit?.avatar || images.icProfile}
                        errorMessage={errors.avatar?.message}
                        onChange={(value) => field.onChange(value)}
                    />}
                />
                <label htmlFor="upload" className={classes.uploadAvatar}>
                    <CameraAlt></CameraAlt>
                </label>
            </div>
            <div className={classes.personalInfo}>
                <p className={classes.name} >{itemEdit?.fullName || ''}</p>
                <p className={classes.country}>{itemEdit?.company || ''}</p>
            </div>
        </Grid>
        <Grid className={classes.inputFlex}>
            <Inputs
                title={t('field_first_name')}
                translation-key="field_first_name"
                name="firstName"
                type="text"
                placeholder={t('field_first_name_placeholder')}
                translation-key-placeholder="field_first_name_placeholder"
                inputRef={register('firstName')}
                errorMessage={errors.firstName?.message}
            />
            <Inputs
                title={t('field_last_name')}
                translation-key="field_last_name"
                name="lastName"
                type="text"
                placeholder={t('field_last_name_placeholder')}
                translation-key-placeholder="field_last_name_placeholder"
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
                placeholder={t('field_email_placeholder')}
                translation-key-placeholder="field_email_placeholder"
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
                    placeholder: t('field_country_placeholder'),
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
})
export default UserProfile