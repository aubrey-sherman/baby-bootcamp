import BabyApp from './BabyApp.tsx';
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
    <div className="App">
      <div className="App-content">
        <BabyApp />
      </div>
    </div>
  );
};

export default App;
