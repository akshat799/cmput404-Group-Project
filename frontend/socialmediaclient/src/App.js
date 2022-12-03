import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import LoginSignUpContainer from "./containers/LoginSignUpContainer";
import Home from "./pages/Home.jsx";
import Inbox from "./pages/Inbox/Inbox";
import Pprofile from "./pages/profile/Pprofile";
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
          {/* This is for search bar profile */}
          <Route exact path="/pprofile" element={<Pprofile />} />
        </Routes>
        <ToastContainer
          position="top-right"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
