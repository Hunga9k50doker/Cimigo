import * as yup from "yup";
import images from "config/images";
import { memo, useEffect, useMemo, useState } from "react";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import classes from "./styles.module.scss";
import clsx from "clsx";
import {
  Box,
  Divider,
  Grid,
  Radio,
  RadioGroup,
} from "@mui/material";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import { EPaymentMethod } from "models/general";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InfoOutlined } from "@mui/icons-material";
import TooltipCustom from "components/Tooltip";
import { VALIDATION } from "config/constans";
import { ChangePaymentMethodFormData, Payment } from "models/payment";
import { User } from "models/user";
import { ConfigData } from "models/config";
import { useTranslation } from "react-i18next";
import PopupConfirmCancelOrder from "../PopupConfirmCancelOrder";

interface Props {
  user: User;
  configs: ConfigData;
  payment: Payment;
  onConfirm: (data: ChangePaymentMethodFormData) => void;
  onCancelPayment: () => void;
}

const ChangePaymentMethod = memo(
  ({ user, configs, payment, onConfirm, onCancelPayment }: Props) => {
    const { t, i18n } = useTranslation();

    const [isConfirmCancel, setIsConfirmCancel] = useState<boolean>(false);

    const schema = useMemo(() => {
      return yup.object().shape({
        paymentMethodId: yup.number(),
        contactName: yup.string().when("paymentMethodId", {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup.string().required(t("field_contact_name_vali_required")),
          otherwise: yup.string(),
        }),
        contactEmail: yup
          .string()
          .email()
          .when("paymentMethodId", {
            is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
            then: yup
              .string()
              .email(t("field_contact_email_vali_email"))
              .required(t("field_contact_email_vali_required")),
            otherwise: yup.string().email(t("field_contact_email_vali_email")),
          }),
        contactPhone: yup.string().when("paymentMethodId", {
          is: (val: number) => val === EPaymentMethod.MAKE_AN_ORDER,
          then: yup
            .string()
            .matches(VALIDATION.phone, {
              message: t("field_contact_phone_number_vali_phone"),
              excludeEmptyString: true,
            })
            .required(t("field_contact_phone_vali_required")),
          otherwise: yup.string().matches(VALIDATION.phone, {
            message: t("field_contact_phone_number_vali_phone"),
            excludeEmptyString: true,
          }),
        }),
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [i18n.language]);

    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      watch,
      reset,
      setValue
    } = useForm<ChangePaymentMethodFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: {
        paymentMethodId: null,
      },
    });

    useEffect(() => {
      if (!user) return;
      reset({
        paymentMethodId: null,
        contactName: user?.fullName || "",
        contactEmail: user?.email || "",
        contactPhone: user?.phone || "",
      });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    const onShowConfirmCancel = () => {
      setIsConfirmCancel(true);
    }

    const onCloseConfirmCancel = () => {
      setIsConfirmCancel(false);
    }

    return (
      <Grid>
        <p className={classes.changePaymentMethodTitle} translation-key="payment_billing_change_method_title">{t('payment_billing_change_method_title')}</p>
        <p className={classes.changePaymentMethodSubTitle} translation-key="payment_billing_change_method_subTitle">{t('payment_billing_change_method_subTitle')}</p>
        <Grid component={'form'} className={classes.root1} onSubmit={handleSubmit(onConfirm)} noValidate autoComplete="off">
          <Divider className={classes.divider1} />
          <Grid classes={{ root: classes.left }}>
            <p translation-key="payment_billing_sub_tab_payment_method">{t('payment_billing_sub_tab_payment_method')}:</p>
            <Controller
              name="paymentMethodId"
              control={control}
              render={({ field }) => <RadioGroup
                name={field.name}
                value={field.value}
                ref={field.ref}
                onBlur={field.onBlur}
                classes={{ root: classes.radioGroup }}
              >
                <Box className={classes.lable}>
                  <Radio 
                    checked={field.value === EPaymentMethod.BANK_TRANSFER}
                    onChange={() => setValue("paymentMethodId", EPaymentMethod.BANK_TRANSFER)} 
                    classes={{ root: classes.rootRadio, checked: classes.checkRadio }} 
                  />
                  <Grid classes={{ root: classes.order }}>
                    <Grid onClick={() => setValue("paymentMethodId", EPaymentMethod.BANK_TRANSFER)} classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_bank_transfer">
                      <img src={images.icBank} alt="" />{t('payment_billing_sub_tab_payment_method_bank_transfer')}
                    </Grid>
                    <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_bank_transfer_sub">{t('payment_billing_sub_tab_payment_method_bank_transfer_sub')}</p>
                  </Grid>
                </Box>
                <Box className={classes.lable}>
                  <Radio 
                    checked={field.value === EPaymentMethod.ONEPAY_GENERAL}
                    onChange={() => setValue("paymentMethodId", EPaymentMethod.ONEPAY_GENERAL)} 
                    classes={{ root: classes.rootRadio, checked: classes.checkRadio }} 
                  />
                  <Grid classes={{ root: classes.order }}>
                    <Grid onClick={() => setValue("paymentMethodId", EPaymentMethod.ONEPAY_GENERAL)} classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_onepay">
                      <img src={images.icInternetBanking} alt="" />{t("payment_billing_sub_tab_payment_method_onepay")}
                    </Grid>
                    <Grid className={classes.methodImg}>
                      <img src={images.imgVisa} alt="" />
                      <img src={images.imgMastercard} alt="" />
                      <img src={images.imgAmericanExpress} alt="" />
                      <img src={images.imgJCB} alt="" />
                      <img src={images.imgUnionpay} alt="" />
                    </Grid>
                    <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_onepay_sub">
                      {t("payment_billing_sub_tab_payment_method_onepay_sub")}
                    </p>
                  </Grid>
                </Box>
                <Box className={classes.lable}>
                  <Radio 
                    checked={field.value === EPaymentMethod.MAKE_AN_ORDER}
                    onChange={() => setValue("paymentMethodId", EPaymentMethod.MAKE_AN_ORDER)} 
                    classes={{ root: classes.rootRadio, checked: classes.checkRadio }} 
                  />
                  <Grid classes={{ root: classes.order }}>
                    <Grid onClick={() => setValue("paymentMethodId", EPaymentMethod.MAKE_AN_ORDER)} classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_make_an_order"><img src={images.icOrder} alt="" />
                      {t('payment_billing_sub_tab_payment_method_make_an_order')}
                    </Grid>
                    <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_make_an_order_sub">
                      {t('payment_billing_sub_tab_payment_method_make_an_order_sub')}
                    </p>
                    {Number(watch("paymentMethodId")) === EPaymentMethod.MAKE_AN_ORDER && (
                      <Box>
                        <Inputs
                          title={t('field_contact_name')}
                          translation-key="field_contact_name"
                          name="contactName"
                          placeholder={t('field_contact_name_placeholder')}
                          translation-key-placeholder="field_contact_name_placeholder"
                          inputRef={register('contactName')}
                          errorMessage={errors.contactName?.message}
                        />
                        <Inputs
                          title={t('field_contact_email')}
                          translation-key="field_contact_email"
                          name="contactEmail"
                          placeholder={t('field_contact_email_placeholder')}
                          translation-key-placeholder="field_contact_email_placeholder"
                          inputRef={register('contactEmail')}
                          errorMessage={errors.contactEmail?.message}
                        />
                        <Inputs
                          title={t('field_contact_phone')}
                          translation-key="field_contact_phone"
                          name="contactPhone"
                          placeholder={t('field_contact_phone_placeholder')}
                          translation-key-placeholder="field_contact_phone_placeholder"
                          inputRef={register('contactPhone')}
                          errorMessage={errors.contactPhone?.message}
                        />
                      </Box>
                    )}
                  </Grid>
                </Box>
              </RadioGroup>
              }
            />
            <Divider className={classes.divider1} />
          </Grid>
          <Grid classes={{ root: classes.right }}>
            <Grid classes={{ root: classes.sumaryBox }}>
              <Grid classes={{ root: classes.bodyOrder }}>
                <p translation-key="payment_billing_sub_tab_payment_summary">{t('payment_billing_sub_tab_payment_summary')}</p>
                <div className={classes.flexOrder}>
                  <span translation-key="common_sample_size">{t('common_sample_size')} {`(${payment?.sampleSize || 0})`}</span>
                  <span>{`$`}{fCurrency2(payment?.sampleSizeCostUSD || 0)}</span>
                </div>
                {payment?.customQuestions?.length > 0 && (
                  <div className={classes.flexOrder}>
                    <span translation-key="common_custom_question">{t("common_custom_question")} {`(${payment?.customQuestions?.length})`}</span>
                    <span>{`$`}{fCurrency2(payment?.customQuestionCostUSD)}</span>
                </div>
                )}
                <div className={clsx(classes.flexOrder, classes.isMobile)}>
                  <span translation-key="common_vat">{t('common_vat', { percent: (configs?.vat || 0) * 100 })}</span>
                  <span>{`$`}{fCurrency2(payment?.vatUSD || 0)}</span>
                </div>
                <Divider />
                <div className={clsx(classes.flexOrder, classes.notMobile)}>
                  <span translation-key="common_sub_total">{t('common_sub_total')}</span>
                  <span>{`$`}{fCurrency2(payment?.amountUSD || 0)}</span>
                </div>
                <div className={clsx(classes.flexOrder, classes.notMobile)}>
                  <span translation-key="common_vat">{t('common_vat', { percent: (configs?.vat || 0) * 100 })}</span>
                  <span>{`$`}{fCurrency2(payment?.vatUSD || 0)}</span>
                </div>
                <Divider className={classes.notMobile} />
                <div className={classes.flexTotal}>
                  <span translation-key="common_total">{t('common_total')} (USD)</span>
                  <a>{`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</a>
                </div>
                <span>({fCurrency2VND(payment?.totalAmount || 0)} VND)</span>
                <div className={classes.chargedBy} translation-key="payment_billing_sub_tab_payment_note">{t("payment_billing_sub_tab_payment_note")}
                  <TooltipCustom popperClass={classes.popperClass} translation-key="payment_billing_sub_tab_payment_note_tooltip" title={t("payment_billing_sub_tab_payment_note_tooltip")}>
                    <InfoOutlined />
                  </TooltipCustom>
                </div>
              </Grid>
              <Buttons type="submit" disabled={!Number(watch("paymentMethodId"))} children={t('payment_billing_sub_tab_payment_summary_place_order')} translation-key="payment_billing_sub_tab_payment_summary_place_order" btnType="Blue" width="100%" padding="11px" className={classes.btn} />
            </Grid>
            <div className={classes.cancelPayment} translation-key="common_cancel_payment"><span onClick={onShowConfirmCancel}>{t("common_cancel_payment")}</span></div>
          </Grid>
          <Grid className={classes.flexTotalMobile}>
            <Grid>
              <p translation-key="common_total">{t('common_total')} (USD)</p>
              <a style={{ marginBottom: 4 }}>{`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</a>
              <span>({fCurrency2VND(payment?.totalAmount || 0)} VND)</span>
            </Grid>
            <Buttons type="submit" disabled={!Number(watch("paymentMethodId"))} children={t('payment_billing_sub_tab_payment_summary_place_order')} translation-key="payment_billing_sub_tab_payment_summary_place_order" btnType="Blue" padding="11px" className={classes.btnMobile} />
          </Grid>
        </Grid>
        <PopupConfirmCancelOrder
          isOpen={isConfirmCancel}
          onClose={onCloseConfirmCancel}
          onYes={onCancelPayment}
        />
      </Grid>
    );
  }
);

export default ChangePaymentMethod;
