import { yupResolver } from "@hookform/resolvers/yup";
import { ArrowBackOutlined, Save } from "@mui/icons-material";
import { Box, Button, Card, CardContent, Grid, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import Inputs from "components/Inputs";
import { push } from "connected-react-router";
import { memo, useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { routes } from "routers/routes";
import * as yup from 'yup';
import { OptionItem } from "models/general";
import InputSelect from "components/InputsSelect";
import { setErrorMess, setLoading } from "redux/reducers/Status/actionTypes";
import { QuotaTable } from "models/Admin/quota";
import { TargetQuestionService } from "services/admin/target_question";
import { TargetAnswer, TargetQuestion } from "models/Admin/target";
import { TargetAnswerService } from "services/admin/target_answer";
import _ from "lodash";

const schema = yup.object().shape({
  title: yup.string().required('Title is required.'),
  order: yup.number().typeError('Order is required.').required('Order is required.'),
  questionIds: yup.array(yup.object().shape({
    id: yup.number(),
    name: yup.string()
  })).required('Questions is required.'),
})

export interface CalculationItem {
  answers: TargetAnswer[],
  original: number
}

export interface QuotaTableFormData {
  title: string;
  order: number;
  questionIds: OptionItem[];
  calculations: {
    answerIds: number[]
    original: number
  }[];
}

interface Props {
  langEdit?: string;
  itemEdit?: QuotaTable;
  onSubmit: (data: QuotaTableFormData) => void
}

const QuotaTableForm = memo(({ itemEdit, langEdit, onSubmit }: Props) => {

  const dispatch = useDispatch();
  const [targetQuestions, setTargetQuestions] = useState<OptionItem[]>([]);
  const [calculationsData, setCalculationsData] = useState<CalculationItem[]>([]);

  const { register, handleSubmit, formState: { errors, isValid }, reset, control, watch, setValue } = useForm<QuotaTableFormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const handleBack = () => {
    dispatch(push(routes.admin.quotaTable.root))
  }

  useEffect(() => {
    if (itemEdit) {
      reset({
        title: itemEdit.title,
        order: itemEdit.order,
        questionIds: itemEdit.targetQuestions.map(it => ({ id: it.id, name: it.name }))
      })
    }
  }, [reset, itemEdit])

  useEffect(() => {
    const fetchOption = async () => {
      TargetQuestionService.getQuestions({ take: 9999 })
        .then((res) => {
          setTargetQuestions((res.data as TargetQuestion[]).map((it) => ({ id: it.id, name: it.name })))
        })
        .catch((e) => dispatch(setErrorMess(e)))
    }
    fetchOption()
  }, [dispatch])

  useEffect(() => {
    if (itemEdit && calculationsData?.length) {
      const _calculationsData = calculationsData.map(item => {
        const answerIds = item.answers.map(it => it.id).sort()
        const config = itemEdit.quotaCalculations.find(temp => _.isEqual(temp.answerIds.sort(), answerIds))
        return {
          ...item,
          original: config?.original || 0
        }
      })
      setCalculationsData(_calculationsData)
    }
  }, [itemEdit, calculationsData])

  const questionsSelected = watch("questionIds")

  useEffect(() => {
    if (questionsSelected?.length) {
      const fetchData = async () => {
        dispatch(setLoading(true))
        const apis = questionsSelected.map(async (item): Promise<TargetAnswer[]> => {
          return TargetAnswerService.getAnswers({ take: 999, questionId: item.id })
            .then(res => res.data)
        })
        Promise.all(apis)
          .then((res) => {
            const _questionsIds = questionsSelected.filter((_, index) => !!res[index]?.length)
            if (_questionsIds?.length !== questionsSelected?.length) {
              setValue('questionIds', _questionsIds)
              return
            }
            let _calculationsData: CalculationItem[] = []
            const getCalculationsData = (answers: TargetAnswer[] = [], i: number = 0) => {
              res[i].forEach(item => {
                if (res[i + 1]) {
                  getCalculationsData([...answers, item], i + 1)
                } else _calculationsData.push({ answers: [...answers, item], original: 0 })
              })
            }
            getCalculationsData()
            setCalculationsData(_calculationsData)
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)))
      }
      fetchData()
    } else setCalculationsData([])
  }, [questionsSelected])

  const onChangeOriginal = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, index: number) => {
    const _calculationsData = [...calculationsData]
    let original = null
    if (e.target.value !== '' && Number(e.target.value) > 0) original = Number(e.target.value)
    _calculationsData[index].original = original
    setCalculationsData(_calculationsData)
  }

  const checkIsValid = () => {
    return isValid && !calculationsData.find(it => (it.original ?? null) === null)
  }

  const _onSubmit = (data: QuotaTableFormData) => {
    if (!checkIsValid()) return
    onSubmit({
      ...data,
      calculations: calculationsData.map(it => ({
        answerIds: it.answers?.map(temp => temp.id),
        original: it.original
      }))
    })
  }

  return (
    <div>
      <Box display="flex" justifyContent="space-between" alignContent="center" mb={4}>
        <Typography component="h2" variant="h6" align="left">
          {itemEdit ? 'Edit Quota Table' : 'Create Quota Table'}
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={handleBack}
          startIcon={<ArrowBackOutlined />}
        >
          Back
        </Button>
      </Box>
      <form autoComplete="off" noValidate onSubmit={handleSubmit(_onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card elevation={3} sx={{ overflow: "unset" }}>
              <CardContent>
                <Typography component="h2" variant="h6" align="left" sx={{ marginBottom: "2rem" }}>
                  Quota Table
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Title"
                      name="title"
                      type="text"
                      inputRef={register('title')}
                      errorMessage={errors.title?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Inputs
                      title="Order"
                      name="order"
                      type="number"
                      disabled={!!langEdit}
                      inputRef={register('order')}
                      errorMessage={errors.order?.message}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InputSelect
                      fullWidth
                      title="Questions"
                      name="questionIds"
                      control={control}
                      selectProps={{
                        isMulti: true,
                        options: targetQuestions,
                        placeholder: "Select questions",
                        isDisabled: !!langEdit
                      }}
                      errorMessage={(errors.questionIds as any)?.message}
                    />
                  </Grid>
                  {(!!questionsSelected?.length && !!calculationsData?.length) && (
                    <Grid item xs={12}>
                      <TableContainer sx={{ marginTop: '2rem' }}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              {questionsSelected.map(item => (
                                <TableCell key={item.id}>{item.name}</TableCell>
                              ))}
                              <TableCell>Original</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {calculationsData.map((item, index) => (
                              <TableRow key={index}>
                                {item.answers.map(answer => {
                                  return (
                                    <TableCell key={answer.id}>{answer.name}</TableCell>
                                  )
                                })}
                                <TableCell>
                                  <Inputs
                                    name=""
                                    type="number"
                                    disabled={!!langEdit}
                                    value={item.original ?? ''}
                                    onChange={(e) => onChangeOriginal(e, index)}
                                  />
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  )}
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={!checkIsValid()}
                    startIcon={<Save />}
                  >
                    Save
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </form>
    </div>
  )
})

export default QuotaTableForm