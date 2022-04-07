import { useEffect, useState } from "react";
import classes from './styles.module.scss';
import {
  Grid,
  Step,
  Stepper,
  StepLabel,
  StepConnector,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
  Button,
} from "@mui/material";

import QontoStepIcon from "../components/QontoStepIcon";
import Header from "components/Header";
import Footer from "components/Footer";
import Container from "components/Container";
import InputSearch from "components/InputSearch";
import Inputs from "components/Inputs";
import Buttons from "components/Buttons";
import PopupInforSolution from "../components/PopupInforSolution";
import { useDispatch } from "react-redux";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { SolutionService } from "services/solution";
import useDebounce from "hooks/useDebounce";
import { DataPagination, EStatus } from "models/general";
import { Solution, SolutionCategory } from "models/Admin/solution";
import * as yup from 'yup';
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import clsx from "clsx";
import QueryString from 'query-string';
import { routes } from "routers/routes";
import { push } from "connected-react-router";
import { ProjectService } from "services/project";
import { Project } from "models/project";
import images from "config/images";
import { useHistory } from 'react-router-dom';

interface IQueryString {
  solution_id?: string
}

const schema = yup.object().shape({
  name: yup.string().required('Name is required.'),
  category: yup.string(),
  brand: yup.string(),
  variant: yup.string(),
  manufacturer: yup.string()
})

export interface CreateProjectFormData {
  name: string,
  category: string,
  brand: string,
  variant: string,
  manufacturer: string
}

enum EStep {
  SELECT_SOLUTION,
  CREATE_PROJECT
}

const steps = [
  { id: EStep.SELECT_SOLUTION, name: 'Select solution' },
  { id: EStep.CREATE_PROJECT, name: 'Create project' },
]

const CreateProject = () => {

  const dispatch = useDispatch()
  const history = useHistory();
  const [keyword, setKeyword] = useState<string>('');
  const [category, setCategory] = useState<SolutionCategory>();
  const [solutionShow, setSolutionShow] = useState<Solution>();
  const [solutionSelected, setSolutionSelected] = useState<Solution>();
  const [solution, setSolution] = useState<DataPagination<Solution>>();
  const [solutionShowMobile, setSolutionShowMobile] = useState<Solution>();
  const [solutionCategory, setSolutionCategory] = useState<DataPagination<SolutionCategory>>();
  const [selectedIndex, setSelectedIndex] = useState<any>('');
  const [activeStep, setActiveStep] = useState<EStep>(EStep.SELECT_SOLUTION);
  const { solution_id }: IQueryString = QueryString.parse(window.location.search);
  const theme = useTheme();

  const isMobile = useMediaQuery(theme.breakpoints.down(767));

  const { register, handleSubmit, formState: { errors } } = useForm<CreateProjectFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleClickCollapse = index => {
    if (selectedIndex === index) {
      setSelectedIndex("")
    } else {
      setSelectedIndex(index)
    }
  }

  const hendleSolutionShow = (item, index) => {
    if (!isMobile) {
      setSolutionShow(item)
    }
    else {
      handleClickCollapse(index)
      setSolutionShowMobile(item)
    }
  }
  console.log(solutionShowMobile, 'sss');

  const handleNextStep = () => {
    if (!solutionShow) return
    setSolutionSelected(solutionShow)
    setSolutionShow(undefined)
    setActiveStep(EStep.CREATE_PROJECT)
  }

  const handleNextStepMobile = () => {
    if (!solutionShowMobile) return
    setSolutionSelected(solutionShowMobile)
    setSolutionShowMobile(undefined)
    setActiveStep(EStep.CREATE_PROJECT)
  }

  const handleBackStep = () => {
    setActiveStep(EStep.SELECT_SOLUTION)
  }

  const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(e.target.value)
    _onSearch(e.target.value)
  }

  const getSolutions = async (params: { keyword?: string, categoryId?: number }) => {
    dispatch(setLoading(true))
    SolutionService.getSolutions({ take: 99999, keyword: params?.keyword ?? keyword, categoryId: params?.categoryId !== undefined ? params?.categoryId : category?.id })
      .then((res) => {
        setSolution({
          data: res.data,
          meta: res.meta
        })
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const _onSearch = useDebounce((keyword: string) => getSolutions({ keyword }), 500)

  useEffect(() => {
    const fetchData = async () => {
      dispatch(setLoading(true))
      Promise.all([
        SolutionService.getSolutions({ take: 99999 }),
        SolutionService.getSolutionCategories({ take: 99999 })
      ])
        .then((res) => {
          setSolution({
            data: res[0].data,
            meta: res[0].meta
          })
          setSolutionCategory({
            data: res[1].data,
            meta: res[1].meta
          })
        })
        .catch(e => dispatch(setErrorMess(e)))
        .finally(() => dispatch(setLoading(false)))
    }
    fetchData()
  }, [dispatch])

  const onSubmit = (data: CreateProjectFormData) => {
    if (!solutionSelected) return
    dispatch(setLoading(true))
    ProjectService.createProject({
      solutionId: solutionSelected.id,
      name: data.name,
      category: data.category || '',
      brand: data.brand || '',
      variant: data.variant || '',
      manufacturer: data.manufacturer || ''
    })
      .then((res: Project) => {
        dispatch(push(routes.project.detail.root.replace(':id', `${res.id}`)))
      })
      .catch(e => dispatch(setErrorMess(e)))
      .finally(() => dispatch(setLoading(false)))
  }

  const onChangeCategory = (item: SolutionCategory) => {
    let data = category?.id === item?.id ? null : item
    setCategory(data)
    getSolutions({ categoryId: data?.id || null })
  }

  useEffect(() => {
    if (solution_id && !isNaN(Number(solution_id))) {
      SolutionService.getSolution(Number(solution_id))
        .then((res) => {
          dispatch(push(routes.project.create))
          setSolutionSelected(res)
          setActiveStep(EStep.CREATE_PROJECT)
        })
    }
  }, [solution_id])

  return (
    <Grid className={classes.root}>
      <Header project />
      <Grid className={classes.container}>
        <div className={classes.linkTextHome} >
          <img src={images.icHomeMobile} alt='' onClick={() => history.push(routes.project.management)} />
          <img src={images.icNextMobile} alt='' />
          <span>Projects</span>
        </div>
        <Stepper
          alternativeLabel
          activeStep={activeStep}
          classes={{ root: classes.rootStepper }}
          connector={<StepConnector classes={{ root: classes.rootConnector, active: classes.activeConnector }} />}
        >
          {steps.map((item, index) => {
            return (
              <Step key={index}>
                <StepLabel
                  StepIconComponent={QontoStepIcon}
                  classes={{
                    root: classes.rootStepLabel,
                    completed: classes.rootStepLabelCompleted,
                    active: classes.rootStepLabelActive,
                    label: classes.rootStepLabel
                  }}
                >{item.name}</StepLabel>
              </Step>
            );
          })}
        </Stepper>
        {activeStep === EStep.SELECT_SOLUTION ? (
          <>
            <Grid className={classes.header}>
              <p>Select a solution</p>
              <InputSearch
                placeholder="Search solution"
                value={keyword || ''}
                onChange={onSearch}
              />
            </Grid>
            <Stack direction="row" spacing={1} className={classes.stack}>
              {solutionCategory?.data.map((item) => (
                <Chip key={item.id} label={item.name} className={clsx(classes.category, { [classes.categorySelected]: item.id === category?.id })} clickable variant="outlined" onClick={() => onChangeCategory(item)} />
              ))}
            </Stack>
            <Grid className={classes.body}>
              {solution?.data.map((item, index) => {
                switch (item.status) {
                  case EStatus.Active:
                    return (
                      <Grid key={index} className={clsx(index === selectedIndex ? classes.cardSelect : "", classes.card)} onClick={() => hendleSolutionShow(item, index)}>
                        <div>
                          <img src={item.image} alt="solution image" />
                          <p>{item.title}</p>
                          <span>{item.description}</span>
                        </div>
                        <Grid className={classes.btnReadMore}>
                          <Button classes={{ disabled: classes.btndisabled }} disabled={index !== selectedIndex} onClick={() => setSolutionShow(item)} startIcon={<img src={index === selectedIndex ? images.icReadMore : images.icReadMoreGray} alt='' />}>Read more</Button>
                          <div className={clsx(index === selectedIndex ? classes.ticked : classes.disable)}>
                            <img src={images.icTicked} alt='' />
                            <img src={images.icTick} alt='' />
                          </div>
                        </Grid>
                      </Grid>
                    )
                  case EStatus.Coming_Soon:
                    return (
                      <Grid key={index} className={classes.cardComing}>
                        <div>Coming soon</div>
                        <img src={item.image} alt="solution image" />
                        <p>{item.title}</p>
                        <span>{item.description}</span>
                      </Grid>
                    )
                }
              })}
            </Grid>
            <Grid className={classes.footerSelected}>
              <Grid>
                {selectedIndex === '' ?
                  <a>No solution selected</a>
                  :
                  <>
                    <p>Selected solution</p>
                    <span>{solutionShowMobile?.title}</span>
                  </>
                }
              </Grid>
              <Buttons onClick={() => handleNextStepMobile()} disabled={selectedIndex === '' ? true : false} children={"Get started"} btnType="Blue" padding="16px" className={classes.btnMobile} />
            </Grid>
          </>
        ) : (
          <Grid className={classes.form}>
            <form autoComplete="off" noValidate onSubmit={handleSubmit(onSubmit)}>
              <p className={classes.title}>Solution: {solutionSelected?.title}</p>
              <span className={classes.textLink} onClick={handleBackStep}>Choose another solution</span>
              <Inputs
                titleRequired
                name="name"
                type="text"
                placeholder="Enter your project name"
                title="Project name"
                inputRef={register('name')}
                errorMessage={errors.name?.message}
              />
              <p className={classes.textInfo}>Pack test specific information<span> (optional)</span><br /><a>You may modify these later</a></p>
              <Inputs
                name="category"
                type="text"
                placeholder="e.g. C7727 On Demand"
                title="Category"
                inputRef={register('category')}
                errorMessage={errors.category?.message}
              />
              <Inputs
                name="brand"
                type="text"
                placeholder="Enter your product brand name"
                title="Brand"
                inputRef={register('brand')}
                errorMessage={errors.brand?.message}
              />
              <Inputs
                name="variant"
                type="text"
                placeholder="Enter your product variant"
                title="Variant"
                inputRef={register('variant')}
                errorMessage={errors.variant?.message}
              />
              <Inputs
                name="manufacturer"
                type="text"
                placeholder="Enter product manufacturer"
                title="Manufacturer"
                inputRef={register('manufacturer')}
                errorMessage={errors.manufacturer?.message}
              />
              <Buttons type="submit" children="Create project" btnType="Blue" width="100%" padding="16px" />
            </form>
          </Grid>
        )}
      </Grid>
      <Footer />
      <PopupInforSolution
        solution={solutionShow}
        onSelect={() => handleNextStep()}
        onCancel={() => setSolutionShow(undefined)}
      />
    </Grid>
  );
};
export default CreateProject;