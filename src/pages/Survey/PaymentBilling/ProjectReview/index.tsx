import { memo, useEffect, useState } from "react";
import { Button, Divider, Grid } from "@mui/material"
import classes from './styles.module.scss';
import Images from "config/images";
import Buttons from "components/Buttons";
import { useDispatch, useSelector } from "react-redux";
import { push } from "connected-react-router";
import { routes } from "routers/routes";
import { ReducerType } from "redux/reducers";
import { Pack } from "models/pack";
import { AdditionalBrand } from "models/additional_brand";
import { ProjectAttribute } from "models/project_attribute";
import { UserAttribute } from "models/user_attribute";
import { PackService } from "services/pack";
import { ProjectAttributeService } from "services/project_attribute";
import { UserAttributeService } from "services/user_attribute";
import { AdditionalBrandService } from "services/additional_brand";
import clsx from "clsx";
import { TargetQuestionType } from "models/Admin/target";

interface ProjectReviewProps {
}

const ProjectReview = memo(({ }: ProjectReviewProps) => {
  const dispatch = useDispatch()
  const { project } = useSelector((state: ReducerType) => state.project)

  const [packs, setPacks] = useState<Pack[]>([])
  const [additionalBrand, setAdditionalBrand] = useState<AdditionalBrand[]>([])
  const [projectAttributes, setProjectAttributes] = useState<ProjectAttribute[]>([]);
  const [userAttributes, setUserAttributes] = useState<UserAttribute[]>([]);



  const onConfirmProject = () => {
    if (!isValidConfirm()) return
    dispatch(push(routes.project.detail.paymentBilling.previewAndPayment.payment.replace(':id', `${project.id}`)))
  }

  const gotoSetupSurvey = () => {
    dispatch(push(routes.project.detail.setupSurvey.replace(':id', `${project.id}`)))
  }

  const gotoTarget = () => {
    dispatch(push(routes.project.detail.target.replace(':id', `${project.id}`)))
  }

  useEffect(() => {
    if (project) {
      let isSubscribed = true
      const getPacks = () => {
        PackService.getPacks({ take: 9999, projectId: project.id })
          .then(res => {
            if (isSubscribed) setPacks(res.data)
          })
      }
    
      const getProjectAttributes = () => {
        ProjectAttributeService.getProjectAttributes({ take: 9999, projectId: project.id })
          .then((res) => {
            if (isSubscribed) setProjectAttributes(res.data)
          })
      }
    
      const getUserAttributes = () => {
        UserAttributeService.getUserAttributes({ take: 9999, projectId: project.id })
          .then((res) => {
            if (isSubscribed) setUserAttributes(res.data)
          })
      }
    
      const getAdditionalBrand = () => {
        AdditionalBrandService.getAdditionalBrandList({ take: 9999, projectId: project.id })
          .then((res) => {
            if (isSubscribed) setAdditionalBrand(res.data)
          })
      }
      getPacks()
      getAdditionalBrand()
      getProjectAttributes()
      getUserAttributes()
      return () => { isSubscribed = false }
    }
  }, [project])

  const inValidTarget = () => {
    const mess: string[] = []
    const location = project?.targets.find(it => it.targetQuestion?.typeId === TargetQuestionType.Location)
    if (!location) mess.push('Location')
    const economicClass = project?.targets.find(it => it.targetQuestion?.typeId === TargetQuestionType.Economic_Class)
    if (!economicClass) mess.push('Economic class')
    const ageCoverage = project?.targets.find(it => [TargetQuestionType.Mums_Only, TargetQuestionType.Gender_And_Age_Quotas].includes(it.targetQuestion?.typeId || 0))
    if (!ageCoverage) mess.push('Age coverage')
    return mess.join(', ')
  }

  const isValidSampleSize = () => {
    return !!project?.sampleSize
  }

  const isValidPacks = () => {
    return !!packs?.length
  }

  const isValidAdditionalBrand = () => {
    return !!additionalBrand?.length
  }

  const isValidAttributes = () => {
    return !!((projectAttributes?.length || 0) + (userAttributes?.length || 0))
  }

  const isValidBasic = () => {
    return !!project?.category && !!project?.brand && !!project?.variant && !!project?.manufacturer
  }

  const isValidConfirm = () => {
    return isValidSampleSize() && !inValidTarget() && isValidPacks() && isValidAdditionalBrand() && isValidAttributes() && isValidBasic()
  }

  return (
    <Grid classes={{ root: classes.root }}>
      {
        isValidConfirm() ? (
          <p className={classes.title}>Please review your project setup and confirm to continue with payment. Note that after placing an order in the next step,
            you <span>can not modify</span> what you have set up.
          </p>
        ) : (
          <p className={classes.title}>
            Your project specifications <span className={classes.colorDanger}>do not satisfy the minimum requirement</span>. Please review the following table then modify project specifications to continuing.
          </p>
        )
      }
      <Grid className={classes.body}>
        <Grid className={classes.flex1}>
          <Grid className={classes.left}>
            <div className={classes.solution}><p className={classes.textGreen}>Solution</p>
              <span className={classes.textBlue}><img src={project?.solution.image || Images.icPack} />{project?.solution?.title}</span>
            </div>
            <div className={classes.expected}><p className={classes.textGreen}>Expected delivery</p><span className={classes.textBlack}>{project?.sampleSize <= 500 ? 10 : 15} working days</span></div>
            <div className={classes.target}>
              <p className={classes.textGreen}>Sample and target<Button onClick={gotoTarget} classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />}>Go to setup</Button></p>
              <div className={classes.flex2}>
                <div>
                  <p className={classes.text}>Sample size</p><span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidSampleSize() })}>{project?.sampleSize || 'No sample size'}</span>
                </div>
                <div>
                  <p className={classes.text}>Target criteria</p><a className={clsx(classes.textBlack, { [classes.colorDanger]: !!inValidTarget() })} onClick={gotoTarget}>{inValidTarget() || 'View detail'}</a>
                </div>
              </div>
            </div>
          </Grid>
          <Grid className={classes.right}>
            <p style={{ marginBottom: 20 }} className={classes.textGreen}>Survey detail<Button onClick={gotoSetupSurvey} classes={{ root: classes.rootbtn }} endIcon={<img src={Images.icNext} alt="" />}>Go to setup</Button></p>
            <div>
              <div className={classes.bascInfor}>
                <p className={classes.text}>Basic information</p>
                <div className={classes.infor}>
                  <div><p>Category <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.category })}> {project?.category || 'None'}</span></div>
                  <div><p>Brand <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.brand })}> {project?.brand || 'None'}</span></div>
                  <div><p>Variant <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.variant })}> {project?.variant || 'None'}</span></div>
                  <div><p>Manufacturer <a>: </a> </p><span className={clsx({ [classes.colorDanger]: !project?.manufacturer })}> {project?.manufacturer || 'None'}</span></div>
                </div>
              </div>
              <div className={classes.pack}>
                <p className={classes.text}>Pack</p>
                <span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidPacks() })}>{packs?.length || 0} packs</span>
              </div>
              <div className={classes.brandList}>
                <p className={classes.text}>Brand list</p><span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidAdditionalBrand() })}>{additionalBrand?.length || 0} brands</span>
              </div>
              <div className={classes.attribute}>
                <p className={classes.text}>Additional attribute</p><span className={clsx(classes.textBlack, { [classes.colorDanger]: !isValidAttributes() })}>{(projectAttributes?.length || 0) + (userAttributes?.length || 0)} attributes</span>
              </div>
            </div>
          </Grid>
        </Grid>
      </Grid>
      <p className={classes.textSub}>*Expected working days to results delivery after payment has been received.</p>
      <Divider className={classes.divider} />
      <p className={classes.textBlue1}>Additional materials</p>
      <p className={classes.textSub1}>These materials are here for your reference only, please note that these are not your final invoice or contract.</p>
      <Grid className={classes.box}>
        <div><span><img className={classes.imgAddPhoto} src={Images.icAddPhoto} /></span><p>Invoice</p></div>
        <div><span><img className={classes.imgAddPhoto} src={Images.icAddPhoto} /></span><p>Contract</p></div>
      </Grid>
      <Grid className={classes.btn}>
        <Buttons disabled={!isValidConfirm()} onClick={onConfirmProject} children={"Confirm project"} btnType="Blue" padding="16px" />
        <p className={classes.textSub}>By click “Confirm project”, you agree to our Terms of Service and Privacy Policy.</p>
      </Grid>
    </Grid>
  )
})

export default ProjectReview;