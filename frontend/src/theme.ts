import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#0e867a',
    },
    secondary: {
      main: '#fb819b',
    },
    error: {
      main: '#D0021B',
    },
    background: {
      default: '#F5F7FA',
      paper: '#FFFFFF',
    },
    eliminating: {
      main: '#dbeae8',
      contrastText: '#000000',
    },
  },
  typography: {
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
  },
});

// Extend the palette type to include custom color
declare module '@mui/material/styles' {
  interface Palette {
    eliminating: Palette['primary'];
  }
  interface PaletteOptions {
    eliminating?: PaletteOptions['primary'];
  }
}

export default theme;