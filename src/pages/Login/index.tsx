import { useForm } from "react-hook-form";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import classes from './styles.module.scss';

const schema = yup.object().shape({
  
});

interface FormData {
  
}

const Login = () => {
  
  const { register, handleSubmit, formState: { errors }, getValues } = useForm<FormData>({
    resolver: yupResolver(schema),
    mode: 'onChange'
  });

  const onSubmit = (data: FormData) => {
    
  };


  return (
    <div className={classes.root}>
   
    </div>
  );
};

export default Login;