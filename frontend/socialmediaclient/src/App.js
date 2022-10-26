// import logo from './logo.svg';
import './App.css';
import {BrowserRouter as Router , Routes , Route} from 'react-router-dom';
// import Login from "./components/Login";
// import Signup from "./components/Signup"
import SignInOutContainer from './containers';
// import { Router } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <h1>Homepage</h1>
      <Routes>
          {/* <Route path= "/" element={<Login />} /> */}
          <Route path= "/" element={<SignInOutContainer/>} />
      </Routes>
        {/* <header className="App-header"> */}
          {/* <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a> */}
        {/* </header> */}
      </div>
    </Router>
  );
}

export default App;
