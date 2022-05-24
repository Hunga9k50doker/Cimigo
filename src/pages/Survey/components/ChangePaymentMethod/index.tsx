import * as yup from "yup";
import images from "config/images";
import { memo, useEffect, useMemo } from "react";
import { fCurrency2, fCurrency2VND } from "utils/formatNumber";
import classes from "./styles.module.scss";
import clsx from "clsx";
import {
  Box,
  Divider,
  FormControlLabel,
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
    }, [i18n.language]);

    const {
      register,
      handleSubmit,
      control,
      formState: { errors },
      watch,
      reset,
    } = useForm<ChangePaymentMethodFormData>({
      resolver: yupResolver(schema),
      mode: "onChange",
      defaultValues: {
        paymentMethodId: EPaymentMethod.MAKE_AN_ORDER,
      },
    });

    useEffect(() => {
      if (!user) return;
      reset({
        paymentMethodId: EPaymentMethod.MAKE_AN_ORDER,
        contactName: user?.fullName || "",
        contactEmail: user?.email || "",
        contactPhone: user?.phone || "",
      });
    }, [user]);

    return (
      <Grid>
        <p className={classes.changePaymentMethodTitle}>Change payment method</p>
        <p className={classes.changePaymentMethodSubTitle}>Please choose another payment method and then place the order again</p>
        <Grid component={'form'} className={classes.root1} onSubmit={handleSubmit(onConfirm)} noValidate autoComplete="off">
          <Divider className={classes.divider1} />
          <Grid classes={{ root: classes.left }}>
            <p translation-key="payment_billing_sub_tab_payment_method">{t('payment_billing_sub_tab_payment_method')}:</p>
            <Controller
              name="paymentMethodId"
              control={control}
              render={({ field }) => <RadioGroup
                {...field}
                classes={{ root: classes.radioGroup }}
              >
                <FormControlLabel
                  value={EPaymentMethod.MAKE_AN_ORDER}
                  classes={{ root: classes.lable }}
                  control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
                  label={
                    <Grid classes={{ root: classes.order }}>
                      <Grid classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_make_an_order"><img src={images.icOrder} alt="" />
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
                  }
                />
                <FormControlLabel
                  value={EPaymentMethod.BANK_TRANSFER}
                  classes={{ root: classes.lable }}
                  control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
                  label={
                    <Grid classes={{ root: classes.order }}>
                      <Grid classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_bank_transfer"><img src={images.icBank} alt="" />{t('payment_billing_sub_tab_payment_method_bank_transfer')}</Grid>
                      <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_bank_transfer_sub">{t('payment_billing_sub_tab_payment_method_bank_transfer_sub')}</p>
                    </Grid>
                  }
                />
                <FormControlLabel
                  value={EPaymentMethod.INTERNET_BANKING}
                  classes={{ root: classes.lable }}
                  control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
                  label={
                    <Grid classes={{ root: classes.order }}>
                      <Grid classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_internet_banking">
                        <img src={images.icInternetBanking} alt="" />{t("payment_billing_sub_tab_payment_method_internet_banking")}
                      </Grid>
                      <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_internet_banking_sub">
                        {t("payment_billing_sub_tab_payment_method_internet_banking_sub")}
                      </p>
                    </Grid>
                  }
                />
                <FormControlLabel
                  value={EPaymentMethod.CREDIT_OR_DEBIT}
                  classes={{ root: classes.lable }}
                  control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
                  label={
                    <Grid classes={{ root: classes.order }}>
                      <Grid classes={{ root: classes.title1 }} translation-key="payment_billing_sub_tab_payment_method_credit_or_debit">
                        <img src={images.icCreditDebit} alt="" />{t("payment_billing_sub_tab_payment_method_credit_or_debit")}
                      </Grid>
                      <Grid className={classes.methodImg}>
                        <img src={images.imgVisa} alt="" />
                        <img src={images.imgMastercard} alt="" />
                        <img src={images.imgAmericanExpress} alt="" />
                        <img src={images.imgJCB} alt="" />
                        <img src={images.imgUnionpay} alt="" />
                      </Grid>
                      <p className={classes.titleSub} translation-key="payment_billing_sub_tab_payment_method_credit_or_debit_sub">
                        {t("payment_billing_sub_tab_payment_method_credit_or_debit_sub")}
                      </p>
                    </Grid>
                  }
                />
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
                  <span translation-key="payment_billing_sub_tab_payment_summary_sample_size">{t('payment_billing_sub_tab_payment_summary_sample_size')} {`(${payment?.sampleSize || 0})`}</span>
                  <span>{`$`}{fCurrency2(payment?.sampleSizeCostUSD || 0)}</span>
                </div>
                <div className={classes.flexOrder}>
                  <span translation-key="payment_billing_sub_tab_payment_summary_custom_question">Custom questions {`(${payment?.customQuestions?.length || 0})`}</span>
                  <span>{`$`}{fCurrency2(payment?.customQuestionCostUSD || 0)}</span>
                </div>
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
                <div className={classes.chargedBy}>Your card will be charged in VND
                  <TooltipCustom popperClass={classes.popperClass} title="The US$ rate shown is approximate and may differ by the exhange rate used by your credit card issuer.">
                    <InfoOutlined />
                  </TooltipCustom>
                </div>
              </Grid>
              <Buttons type="submit" children={t('payment_billing_sub_tab_payment_summary_place_order')} translation-key="payment_billing_sub_tab_payment_summary_place_order" btnType="Blue" width="100%" padding="11px" className={classes.btn} />
            </Grid>
            <div className={classes.cancelPayment} onClick={onCancelPayment}>Want to edit project? Cancel payment.</div>
          </Grid>
          <Grid className={classes.flexTotalMobile}>
            <Grid>
              <p translation-key="common_total">{t('common_total')} (USD)</p>
              <a style={{ marginBottom: 4 }}>{`$`}{fCurrency2(payment?.totalAmountUSD || 0)}</a>
              <span>({fCurrency2VND(payment?.totalAmount || 0)} VND)</span>
            </Grid>
            <Buttons type="submit" children={t('payment_billing_sub_tab_payment_summary_place_order')} translation-key="payment_billing_sub_tab_payment_summary_place_order" btnType="Blue" padding="11px" className={classes.btnMobile} />
          </Grid>
        </Grid>
      </Grid>
    );
  }
);

export default ChangePaymentMethod;
