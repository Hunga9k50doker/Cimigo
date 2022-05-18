import { Button, Divider, Grid, useMediaQuery, useTheme } from "@mui/material"
import Inputs from "components/Inputs";
import { memo, useEffect, useMemo, useState } from "react"
import { useForm } from "react-hook-form";
import classes from './styles.module.scss';
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
import InputSelect from "components/InputsSelect";
import { VALIDATION } from "config/constans";
import { OptionItem } from "models/general";
import { setErrorMess, setLoading, setSuccessMess } from "redux/reducers/Status/actionTypes";
import { useDispatch } from "react-redux";
import UserService from "services/user";
import { UpdatePaymentInfo } from "models/user";
import CountryService from "services/country";
import { PaymentInfo } from "models/payment_info";

interface Props {

}

export interface PaymentFormData {
    fullName: string,
    companyName: string,
    email: string,
    phone: string,
    countryId: OptionItem,
    companyAddress: string,
    taxCode: string
}

const PaymentInfoPage = memo((props: Props) => {

    const { t, i18n } = useTranslation()
    const [countries, setCountries] = useState<OptionItem[]>([])
    const [paymentInfo, setPaymentInfo] = useState<PaymentInfo>()
    const dispatch = useDispatch()
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(600));

    const schema = useMemo(() => {
        return yup.object().shape({
            fullName: yup.string().required(t('field_full_name_vali_required')),
            companyName: yup.string().required(t('field_company_vali_required')),
            email: yup.string().email(t('field_email_vali_email'))
                .required(t('field_email_vali_required')),
            phone: yup.string().matches(VALIDATION.phone, { message: t('field_phone_number_vali_phone'), excludeEmptyString: true })
                .required(t('field_phone_number_vali_required')),
            countryId: yup.object().shape({
                id: yup.number().required(t('field_country_vali_required')),
                name: yup.string().required()
            }).required(),
            companyAddress: yup.string().required(t('field_company_address_vali_required')),
            taxCode: yup.string(),
        })
    }, [i18n.language])

    const { register, handleSubmit, formState: { errors }, reset, control } = useForm<PaymentFormData>({
        resolver: yupResolver(schema),
        mode: 'onChange'
    });

    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true))
            await Promise.all([
                CountryService.getCountries({ take: 9999 }),
                UserService.getPaymentInfo()
            ])
                .then(res => {
                    setCountries(res[0].data)
                    setPaymentInfo(res[1])
                })
            dispatch(setLoading(false))
        }
        fetchData()
    }, [dispatch])

    useEffect(() => {
        reset({
            fullName: paymentInfo?.fullName || '',
            companyName: paymentInfo?.companyName || '',
            email: paymentInfo?.email || '',
            phone: paymentInfo?.phone || '',
            countryId: paymentInfo?.country ? { id: paymentInfo.country.id, name: paymentInfo.country.name } : undefined,
            companyAddress: paymentInfo?.companyAddress || '',
            taxCode: paymentInfo?.taxCode || ''
        })
    }, [paymentInfo, reset])

    const onSubmit = (data: PaymentFormData) => {
        const form: UpdatePaymentInfo = {
            fullName: data.fullName,
            companyName: data.companyName,
            companyAddress: data.companyAddress,
            email: data.email,
            phone: data.phone,
            countryId: data.countryId.id,
            taxCode: data.taxCode || '',
        }
        dispatch(setLoading(true))
        UserService.updatePaymentInfo(form)
            .then((res) => {
                dispatch(setSuccessMess(res.message))
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)))
    }

    return (
        <Grid className={classes.root}>
            <p className={classes.title}>Payment information</p>
            <p className={classes.subTitle}>This payment information will be populated as the default value when purchasing an order.</p>
            <Divider className={classes.divider} />
            <form className={classes.form} onSubmit={handleSubmit(onSubmit)} >
                <Grid container spacing={isMobile ? 0 : 1}>
                    <Grid item xs={12} sm={6}>
                        <Inputs
                            title={t('field_full_name')}
                            translation-key="field_full_name"
                            placeholder={t('field_full_name_placeholder')}
                            translation-key-placeholder="field_full_name_placeholder"
                            name="fullName"
                            inputRef={register('fullName')}
                            errorMessage={errors.fullName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <Inputs
                            title={t('field_company')}
                            translation-key="field_company"
                            placeholder={t('field_company_placeholder')}
                            translation-key-placeholder="field_company_placeholder"
                            name="companyName"
                            inputRef={register('companyName')}
                            errorMessage={errors.companyName?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
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
                    <Grid item xs={12} sm={6}>
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
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <InputSelect
                            title={t('field_country')}
                            name="countryId"
                            control={control}
                            selectProps={{
                                options: countries,
                                placeholder: t('field_country_placeholder'),
                            }}
                            errorMessage={(errors.countryId as any)?.id?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Inputs
                            title={t('field_company_address')}
                            translation-key="field_company_address"
                            placeholder={t('field_company_address_placeholder')}
                            translation-key-placeholder="field_company_address_placeholder"
                            name="companyAddress"
                            inputRef={register('companyAddress')}
                            errorMessage={errors.companyAddress?.message}
                        />
                    </Grid>
                    <Grid item xs={12} sm={12}>
                        <Inputs
                            optional
                            title={t('field_tax_code_for_invoice')}
                            translation-key="field_tax_code_for_invoice"
                            placeholder={t('field_tax_code_for_invoice_placeholder')}
                            translation-key-placeholder="field_tax_code_for_invoice_placeholder"
                            name="taxCode"
                            inputRef={register('taxCode')}
                            errorMessage={errors.taxCode?.message}
                        />
                    </Grid>
                </Grid>
                <Button type='submit' children='Save changes' className={classes.btnSave} />
            </form>
        </Grid>
    )
})
export default PaymentInfoPage