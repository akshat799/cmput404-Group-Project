import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginSignUpContainer from "./containers/LoginSignUpContainer";
import Profile from "./pages/profile/Profile";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignUpContainer />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
