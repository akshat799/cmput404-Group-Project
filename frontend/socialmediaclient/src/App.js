import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import LoginSignUpContainer from "./containers/LoginSignUpContainer";
import Home from "./pages/Home.jsx";
import Inbox from "./pages/Inbox/Inbox";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<LoginSignUpContainer />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/profile" element={<Profile />} />
          <Route exact path="/inbox" element={<Inbox />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
