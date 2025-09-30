import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import BabyApp from './BabyApp.tsx';
import theme from './theme.ts';
import './App.css';


/** Component for entire page.
 *
 * Props: none
 * State: none
 *
 * App -> BabyApp
*/

function App() {

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div className="App">
        <div className="App-content">
          <BabyApp />
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
