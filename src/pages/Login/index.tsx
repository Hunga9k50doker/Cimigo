import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useStyles from "./styles";
import { Grid } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";


const schema = yup.object().shape({

});

interface FormData {

}

const Login = () => {
  const classes = useStyles();
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {

  };

  return (
    <Grid className={classes.root}>
      <Header/>
      <Footer/>
    </Grid>
  );
};

export default Login;