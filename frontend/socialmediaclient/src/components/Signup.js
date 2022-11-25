import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { signUp } from "../features/auth";

const Signup = ({ handleChange }) => {
  const { isSignedIn } = useSelector((state) => state.auth.isSignedIn);
  const dispatch = useDispatch();

  const [username, setUsername] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isError, setError] = useState(false);
  const [githubName, setGithubName] = useState("");

  useEffect(() => {
    if (confirmPassword != password) {
      setError(true);
    } else {
      setError(false);
    }
  }, [confirmPassword]);

  const initialState = {
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    github: "",
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isError) {
      let formData = {
        username: username,
        displayName: fullName,
        password: password,
        githubName: githubName,
        email: email,
      };

      const status = dispatch(signUp(formData));

      if (status == 201) {
        handleChange(e, 0);
      } else {
      }
    } else {
    }
  };

  return (
    <Grid>
      <Paper style={paperStyle}>
        <Grid align="center">
          <Avatar style={avatarStyle}>
            <AddCircleOutlineIcon />
          </Avatar>
          <h2 style={headerStyle}> Sign Up</h2>
          <Typography variant="caption">
            {" "}
            Complete this form to create an account{" "}
          </Typography>
        </Grid>
        <form>
          <TextField
            className="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            variant="standard"
            label="Username"
            placeholder="Enter Username"
            style={formFieldStyle}
            fullWidth
            required
          />
          <TextField
            className="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            variant="standard"
            label="Full Name"
            placeholder="Enter Full Name"
            style={formFieldStyle}
            fullWidth
            required
          />
          <TextField
            className="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="standard"
            label="Email id"
            placeholder="Enter email id"
            style={formFieldStyle}
            fullWidth
            type={email}
            required
          />
          <TextField
            className="githubName"
            value={githubName}
            onChange={(e) => setGithubName(e.target.value)}
            variant="standard"
            label="Github Name"
            placeholder="Enter Github Name"
            style={formFieldStyle}
            fullWidth
            required
          />
          <TextField
            className="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            label="Password"
            placeholder="Enter Password"
            style={formFieldStyle}
            fullWidth
            required
            type="password"
          />
          <TextField
            className="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            variant="standard"
            label="Confirm Password"
            placeholder="Confirm Password"
            style={formFieldStyle}
            fullWidth
            required
            type="password"
          />
          {isError && (
            <div className="dispError" style={{ color: "red" }}>
              {" "}
              Error:Passwords Don't Match!
            </div>
          )}
          <Button
            className="submit"
            style={{ margin: "25px 0px 10px 0px" }}
            variant="contained"
            type="submit"
            color="primary"
            fullWidth
            onClick={(e) => handleSubmit(e)}
          >
            Sign Up
          </Button>
        </form>
      </Paper>
      <form>
        <TextField
          variant="standard"
          label="Username"
          placeholder="Enter Username"
          style={formFieldStyle}
          fullWidth
          required
          handleChange={handleChange}
        />
        <TextField
          variant="standard"
          label="First Name"
          placeholder="Enter First Name"
          style={formFieldStyle}
          fullWidth
          required
          handleChange={handleChange}
        />
        <TextField
          variant="standard"
          label="Last Name"
          placeholder="Enter Last Name"
          style={formFieldStyle}
          fullWidth
          required
          handleChange={handleChange}
        />
        <TextField
          variant="standard"
          label="Password"
          placeholder="Enter Password"
          style={formFieldStyle}
          fullWidth
          required
          type="password"
          handleChange={handleChange}
        />
        <TextField
          variant="standard"
          label="Confirm Password"
          placeholder="Confirm Password"
          style={formFieldStyle}
          fullWidth
          required
          type="password"
          handleChange={handleChange}
        />
        <TextField
          variant="standard"
          label="GitHub Name"
          placeholder="GitHub Name"
          style={formFieldStyle}
          fullWidth
          handleChange={handleChange}
        />
        <Button
          style={{ margin: "25px 0px 10px 0px" }}
          variant="contained"
          type="submit"
          color="primary"
          fullWidth
          onClick={registerCall(formData)}
        >
          {" "}
          Sign Up
        </Button>
      </form>
    </Grid>
  );
};

export default Signup;
