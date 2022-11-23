import { Avatar, Button, Grid, TextField, Typography } from "@mui/material";
import { Paper } from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { registerCall } from "../api/apiCall";

const Signup = () => {
  const paperStyle = {
    padding: 20,
    height: "70vh",
    width: 300,
    margin: "0px auto",
  };
  const avatarStyle = { backgroundColor: "#9494de" };
  const formFieldStyle = { margin: "10px 0px 0px 0px" };
  const headerStyle = { margin: 0 };

  const initialState = {
    username: "",
    firstname: "",
    lastname: "",
    password: "",
    github: "",
  };

  const [formData, setFormData] = useState(initialState);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
            onClick={() => registerCall(formData)}
          >
            {" "}
            Sign Up
          </Button>
        </form>
      </Paper>
    </Grid>
  );
};

export default Signup;