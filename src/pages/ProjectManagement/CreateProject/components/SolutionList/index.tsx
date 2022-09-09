import Grid from "@mui/material/Grid";
import InputSearch from "components/InputSearch";
import useDebounce from "hooks/useDebounce";
import { UserGetSolutions } from "models/solution";
import React, { memo, useState,useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setLoading, setErrorMess } from "redux/reducers/Status/actionTypes";
import classes from "./styles.module.scss";
import { Solution, SolutionCategory } from "models/Admin/solution";
import { SolutionService } from "services/solution";
import { DataPagination, EStatus } from "models/general";
import { Button, Chip, Stack, useMediaQuery, useTheme } from "@mui/material";
import clsx from "clsx";
import images from "config/images";
import Buttons from "components/Buttons";
import PopupInforSolution from "pages/ProjectManagement/components/PopupInforSolution";

interface SolutionListProps{
    handleNextStep: () => void;
    solutionShow?: Solution ;
    setSolutionShow?: (solution: Solution) => void;
}


const SolutionList = memo(({handleNextStep,solutionShow,setSolutionShow}: SolutionListProps)=>{

    const {t, i18n } = useTranslation();
    const dispatch = useDispatch();
    const [keyword, setKeyword] = useState<string>("");
    const [category, setCategory] = useState<SolutionCategory>();
    const [solution, setSolution] = useState<DataPagination<Solution>>();
    const [solutionCategory, setSolutionCategory] = useState<DataPagination<SolutionCategory>>();
    const [isReadMore, setIsReadMore] = useState<boolean>(false);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down(767));    
    
    const getSolutions = async (value: {
        keyword?: string;
        categoryId?: number;
      }) => {
        dispatch(setLoading(true));
        const params: UserGetSolutions = {
          take: 99999,
          keyword: keyword,
          categoryId: category?.id || undefined,
        };
        if (value?.keyword !== undefined) {
          params.keyword = value.keyword || undefined;
        }
        if (value.categoryId !== undefined) {
          params.categoryId = value.categoryId;
        }
        SolutionService.getSolutions(params)
          .then((res) => {
            setSolution({
              data: res.data,
              meta: res.meta,
            });
          })
          .catch((e) => dispatch(setErrorMess(e)))
          .finally(() => dispatch(setLoading(false)));
      };
    const onSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        setKeyword(e.target.value);
        _onSearch(e.target.value);
      };
      const _onSearch = useDebounce(
        (keyword: string) => getSolutions({ keyword }),
        500
      );
      const onChangeCategory = (item?: SolutionCategory) => {
        if (category?.id === item?.id) return;
        setCategory(item);
        getSolutions({ categoryId: item?.id || null });
      };
      const hendleSolutionShow = (item: Solution) => {
        setSolutionShow(item);
      };
    useEffect(() => {
        const fetchData = async () => {
            dispatch(setLoading(true));
            Promise.all([
            SolutionService.getSolutions({ take: 99999 }),
            SolutionService.getSolutionCategories({ take: 99999 }),
            ])
            .then((res) => {
                setSolution({
                data: res[0].data,
                meta: res[0].meta,
                });
                setSolutionCategory({
                data: res[1].data,
                meta: res[1].meta,
                });
            })
            .catch((e) => dispatch(setErrorMess(e)))
            .finally(() => dispatch(setLoading(false)));
        };
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    
    return(
        <>
            <Grid className={classes.header}>
              <p translation-key="select_solution_select_solution">
                {t("select_solution_select_solution")}
              </p>
            </Grid>
            <Grid className={classes.headerContentInput2}>
                <InputSearch
                placeholder={t("select_solution_search_solution")}
                translation-key="select_solution_search_solution"
                value={keyword || ""}
                onChange={onSearch}
                width={"100%"}
                />
            </Grid>
            <Grid className={classes.headerContent}>
              <Stack direction="row" spacing={1} className={classes.stack}>
                {solutionCategory?.data.map((item) => (
                  <Chip
                    key={item.id}
                    label={item.name}
                    className={clsx(classes.category, {
                      [classes.categorySelected]: item.id === category?.id,
                    })}
                    clickable
                    variant="outlined"
                    onClick={() => onChangeCategory(item)}
                  />
                ))}
              </Stack>
              <Grid className={classes.headerContentInput}>
                <InputSearch
                  placeholder={t("select_solution_search_solution")}
                  translation-key="select_solution_search_solution"
                  value={keyword || ""}
                  onChange={onSearch}
                />
              </Grid>
            </Grid>
            <Grid className={classes.body}>
              {solution?.data.map((item, index) => {
                const selected = item.id === solutionShow?.id;
                switch (item.status) {
                  case EStatus.Active:
                    return (
                      <Grid
                        key={index}
                        className={clsx(
                          { [classes.cardSelect]: selected },
                          classes.card
                        )}
                        onClick={() => hendleSolutionShow(item)}
                      >
                        <div>
                          <Grid className={classes.titleCard}>
                            <img
                              className={classes.imgCard}
                              src={item.image}
                              alt="solution"
                            />
                            <p className="title">{item.title}</p>
                          </Grid>
                          <span>{item.description}</span>
                        </div>
                        <Grid className={classes.btnReadMore}>
                          <Button
                            translation-key="common_read_more"
                            className={classes.btnReadMoreRoot}
                            classes={{ disabled: classes.btndisabled }}
                            disabled={!selected}
                            onClick={() => setIsReadMore(true)}
                            startIcon={
                              <>
                                <img
                                  className={classes.icReadMore}
                                  src={images.icReadMore}
                                  alt=""
                                />
                                <img
                                  className={classes.icReadMoreGray}
                                  src={images.icReadMoreGray}
                                  alt=""
                                />
                              </>
                            }
                          >
                            {t("common_read_more")}
                          </Button>
                          <div className={classes.ticketBox}>
                            <img src={images.icTicked} alt="" />
                            <img src={images.icTick} alt="" />
                          </div>
                        </Grid>
                      </Grid>
                    );
                  case EStatus.Coming_Soon:
                    return (
                      <Grid key={index} className={classes.cardComing}>
                        <div translation-key="select_solution_coming_soon">
                          {t("select_solution_coming_soon")}
                        </div>
                        <img src={item.image} alt="solution" />
                        <p>{item.title}</p>
                        <span>{item.description}</span>
                      </Grid>
                    );
                  default:
                    return null;
                }
              })}
            </Grid>
            <Grid className={classes.footerSelected}>
              <Grid>
                {!solutionShow ? (
                  <a translation-key="select_solution_no_solution_select">
                    {t("select_solution_no_solution_select")}
                  </a>
                ) : (
                  <>
                    <p translation-key="select_solution_selected_solution">
                      {t("select_solution_selected_solution")}
                    </p>
                    <span>{solutionShow?.title}</span>
                  </>
                )}
              </Grid>
              <Buttons
                onClick={() => handleNextStep()}
                disabled={!solutionShow}
                children={t("select_solution_get_started")}
                translation-key="select_solution_get_started"
                btnType="Blue"
                padding="16px"
                className={classes.btnMobile}
              />
            </Grid>
            <PopupInforSolution
                solution={(isMobile && isReadMore) || !isMobile ? solutionShow : null}
                onSelect={() => handleNextStep()}
                onCancel={() => {
                setIsReadMore(false);
                if (!isMobile) setSolutionShow(undefined);
                }}
            />
        </>
        
    );
})
export default SolutionList;