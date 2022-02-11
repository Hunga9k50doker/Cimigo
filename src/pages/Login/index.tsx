import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import useStyles from "./styles";
import { Grid } from "@mui/material";
import Header from "components/Header";
import Footer from "components/Footer";
import Inputs from "components/Inputs";
// import Buttons from "components/Buttons";


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
      <Header />
      <Grid className={classes.body}>
        <p className="textLogin">Login</p>
        <Inputs
          title="Email address"
          name="email"
          placeholder="Enter your email address"
        />
        <Inputs
          title="Password"
          name="password"
          type="password"
          showEyes
          placeholder="Enter your password"
        />
        {/* <Buttons children={"Login"} btnType="blue" width={200}/> */}
      </Grid>
      <Footer />
    </Grid>
  );
};

export default Login;