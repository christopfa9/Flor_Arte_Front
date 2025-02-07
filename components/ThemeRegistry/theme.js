import { Open_Sans } from "next/font/google";
import { createTheme } from '@mui/material/styles';

const openSans = Open_Sans({
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  display: 'swap',
});

const theme = createTheme({
  palette: {
    mode: 'light',

    black: {
      main: '#000',
      light: '#000',
      dark: '#000',
      contrastText: '#000',
    },
    primary: {
      main: "#B74A69",

    },
    secondary: {
      main: "#dedede",
    },
    pink: {
      main: '#B74A69',
      light: '#fff',
      dark: '#000',
      contrastText: '#fff',
    }
  },
  typography: {
    fontFamily: openSans.style.fontFamily,
  },
  components: {
    MuiAlert: {
      styleOverrides: {
        root: ({ ownerState }) => ({
          ...(ownerState.severity === 'info' && {
            backgroundColor: '#ffffff',
          }),
        }),
      },
    },
  },
});

export default theme;
