import { Avatar, Button, Grid, Link, TextField, Typography } from '@mui/material';
import {Paper} from "@mui/material";
import React, { useState } from "react";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useSelector , useDispatch} from "react-redux";

const Signup=() => {
    console.log("LOADING");

    const { isSignedIn } = useSelector((state) => state.auth.isSignedIn);
    const dispatch = useDispatch();

    const [username, setUsername] = useState("")
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")


    const paperStyle={padding: 20, height: '70vh', width: 300, margin:"0px auto"}
    const avatarStyle={backgroundColor: '#9494de'}
    const formFieldStyle ={margin: '10px 0px 0px 0px'}
    const headerStyle = {margin:0}
    const handleSubmit = () => {
        if(password === confirmPassword){
            
        }
        else{
            
        }

    }

    return (
        <Grid>
             <Paper style={paperStyle}>
                <Grid align='center'> 
                    <Avatar style= {avatarStyle} ><AddCircleOutlineIcon/></Avatar>
                    <h2 style={headerStyle}> Sign Up</h2>
                    <Typography variant='caption'> Complete this form to create an account </Typography>
                </Grid>
                <form>
                    <TextField 
                        className='username' 
                        value = {username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="standard" 
                        label='Username' 
                        placeholder="Enter Username" 
                        style={formFieldStyle} 
                        fullWidth 
                        required/>
                    <TextField 
                        className='firstName'
                        value = {firstName} 
                        onChange={(e) => setFirstName(e.target.value)}
                        variant="standard" 
                        label='First Name' 
                        placeholder="Enter First Name" 
                        style={formFieldStyle} 
                        fullWidth 
                        required/>
                    <TextField 
                        className='lastName'
                        value = {lastName}
                        onChange={(e) => setLastName(e.target.value)} 
                        variant="standard" 
                        label='Last Name' 
                        placeholder="Enter Last Name" 
                        style={formFieldStyle} 
                        fullWidth 
                        required/>
                    <TextField 
                        className='password' 
                        value = {password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="standard" 
                        label='Password' 
                        placeholder="Enter Password" 
                        style={formFieldStyle} 
                        fullWidth 
                        required 
                        type='password'/>
                    <TextField 
                        className='confirmPassword'
                        value = {confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)} 
                        variant="standard" 
                        label='Confirm Password' 
                        placeholder="Confirm Password" 
                        style={formFieldStyle} 
                        fullWidth 
                        required 
                        type='password'/>
                    <Button 
                        className='submit' 
                        style={{margin: '25px 0px 10px 0px'}} 
                        variant='contained' 
                        type='submit' 
                        color='primary' 
                        fullWidth
                        onClick={handleSubmit}
                        > 
                        Sign Up</Button>                
                </form>
            </Paper>
        </Grid>
    )
} 

export default Signup