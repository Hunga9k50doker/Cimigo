import { createTheme } from '@mui/material/styles';


const CIMIGO_BLUE = '#1F61A9';
const CIMIGO_GREEN = '#A6CC17';

const defaultTheme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 768,
      md: 900,
      lg: 1200,
      xl: 1536,
    },
  },
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
  },
  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          'img': {
            borderRadius: '4px'
          }
        }
      }
    }
  }
});

export { defaultTheme };