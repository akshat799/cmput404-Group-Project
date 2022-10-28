import './App.css';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
import LoginSignUpContainer from './containers/LoginSignUpContainer';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Homepage</h1>
      <Routes>
          <Route path= "/" element={<LoginSignUpContainer/>} />
      </Routes>
        
      </div>
    </Router>
  );
}

export default App;
