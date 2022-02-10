import { createTheme } from '@mui/material/styles';


const CIMIGO_BLUE       = '#1F61A9';
const CIMIGO_GREEN  = '#A6CC17';

const defaultTheme = createTheme({
  typography: {
    fontFamily: [
      'Montserrat',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
  palette: {
    primary: {
      main: CIMIGO_BLUE,
    
    },
    secondary: {
      main: CIMIGO_GREEN,
    }
  }
});

export {defaultTheme};