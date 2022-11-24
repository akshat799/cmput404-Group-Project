import React, { useState } from "react";
import { Avatar, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Paper } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";

const Login=({handleChange}) => {

    const paperStyle={padding: 20, height: '70vh', width: 300, margin:"0px auto"}
    const avatarStyle={backgroundColor: '#22c469'}
    const formFieldStyle ={margin: '15px 0px 0px 0px'}
   
    const navigate = useNavigate()
    

    return (
        <Grid>
             <Paper style={paperStyle}>
                <Grid align='center'> 
                    <Avatar style= {avatarStyle} ><LockIcon/></Avatar>
                    <h2>Login</h2>
                </Grid>
                <TextField variant="standard" label='Username' placeholder="Enter Username" style={formFieldStyle} fullWidth required/>
                <TextField variant="standard" label='Password' placeholder="Enter Password" style={formFieldStyle} fullWidth required type='password'/>
                <Button style={{margin: '25px 0px 10px 0px'}} variant='contained' type='submit' color='primary' fullWidth> Login</Button>
                <Typography> Don't have an account?
                    <Link onClick={(e) => handleChange(e,1)} style={{cursor: "pointer" }}> Sign Up</Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login