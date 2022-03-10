import { useState } from "react";
import { Checkbox, Divider, FormControlLabel, Grid, Radio, RadioGroup, Tooltip } from "@mui/material"
import classes from './styles.module.scss';
import images from "config/images";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";

interface PaymentProps {
  onConfirm?: () => void,
}

const Payment = (props: PaymentProps) => {
  const { onConfirm } = props

  return (
    <Grid classes={{ root: classes.root }}>
      <Grid classes={{ root: classes.left }}>
        <p>Payment method:</p>
        <RadioGroup defaultValue="order" classes={{ root: classes.radioGroup }}>
          <FormControlLabel
            value="order"
            classes={{ root: classes.lable }}
            control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
            label={
              <Grid classes={{ root: classes.order }}>
                <Grid classes={{ root: classes.title }}><img src={images.icOrder} alt="" />Make an order</Grid>
                <p className={classes.titleSub}>The simplest way to get started, especially if you need consultation. Our professional consultants will contact you using the information provided below.</p>
                <form name="order" autoComplete="off">
                  <Inputs title="Contact name" name="Contactname" placeholder="Enter contact name" />
                  <Inputs title="Contact email" name="Contactemail" placeholder="Enter contact email address" />
                  <Inputs title="Contact phone" name="Contactphone" placeholder="e.g. +84378312333" />
                </form>
              </Grid>
            }
          />
          <FormControlLabel
            value="bank"
            classes={{ root: classes.lable }}
            control={<Radio classes={{ root: classes.rootRadio, checked: classes.checkRadio }} />}
            label={
              <Grid classes={{ root: classes.order }}>
                <Grid classes={{ root: classes.title }}><img src={images.icBank} alt="" />Bank transfer</Grid>
                <p className={classes.titleSub}>The direct transfer of funds from your bank account into our business bank account. The details of our bank account will be provided in the next step.</p>
              </Grid>
            }
          />
          <Divider />
        </RadioGroup>
        <p>Invoice and contract information <span>(optional)</span></p>
        <span className={classes.titleSub}>You can update this information later</span>
        <form name="bank" autoComplete="off">
          <Grid classes={{ root: classes.flex }}>
            <Inputs title="Full name" placeholder="e.g. John Smith" name="" />
            <Inputs title="Company name" placeholder="Enter conpany name" name="" />
          </Grid>
          <Inputs title="Email" placeholder="e.g. John Smith" name="email" />
          <Grid classes={{ root: classes.flex }}>
            <Inputs title="Phone" placeholder="e.g. John Smith" name="" />
            <Inputs title="Country" placeholder="e.g. John Smith" name="" />
          </Grid>
          <Inputs title="Company address" placeholder="e.g. John Smith" name="address" />
          <Inputs title="Tax code for invoice (optional)" placeholder="Enter tax code" name="code" />
          <Grid classes={{ root: classes.tips }}>
            <FormControlLabel
              control={
                <Checkbox
                  classes={{ root: classes.rootCheckbox }}
                  icon={<img src={images.icCheck} alt="" />}
                  checkedIcon={<img src={images.icCheckActive} alt="" />} />
              }
              label="Save for later"
            />
            <Tooltip classes={{ tooltip: classes.popper }} placement="right" title="This information will be used to automatically fill out the form in subsequent payments.">
              <img src={images.icTip} alt="" />
            </Tooltip>
          </Grid>
        </form>
      </Grid>
      <Grid classes={{ root: classes.right }}>
        <Grid classes={{ root: classes.bodyOrder }}>
          <p>Order summary</p>
          <div className={classes.flexOrder}>
            <span>Sample size</span>
            <span>$99</span>
          </div>
          <div className={classes.flexOrder}>
            <span>Eye tracking</span>
            <span>$99</span>
          </div>
          <Divider />
          <div className={classes.flexOrder}>
            <span>Sample size</span>
            <span>$99</span>
          </div>
          <div className={classes.flexOrder}>
            <span>Eye tracking</span>
            <span>$99</span>
          </div>
          <Divider />
          <div className={classes.flexTotal}>
            <span>Total (USD)</span>
            <a>$218.9</a>
          </div>
          <span>(4,599,000 VND)</span>
        </Grid>
        <Buttons onClick={onConfirm} children={"Place order"} btnType="Blue" width="100%" padding="16px" className={classes.btn} />
      </Grid>
    </Grid>
  )
}

export default Payment;