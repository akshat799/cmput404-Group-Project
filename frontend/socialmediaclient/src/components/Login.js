import React, { useState } from "react";
import { Avatar, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Paper } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate } from "react-router-dom";
import { login } from "../features/auth";
import { useDispatch } from "react-redux";
import { useStore } from "react-redux";

const Login=({handleChange}) => {

    const paperStyle={padding: 20, height: '70vh', width: 300, margin:"0px auto"}
    const avatarStyle={backgroundColor: '#22c469'}
    const formFieldStyle ={margin: '15px 0px 0px 0px'}
   
    const navigate = useNavigate()

    

    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isError, setIsError] = useState(false)
    const dispatch = useDispatch();

    const store = useStore()
    const state = store.getState()

    const handleSubmit= async(e) => {

        let formData = {
            "username" : username,
            "password" : password
        }
        
        const resp = await dispatch(login(formData));
        if (resp.status === 200){
            setIsError(false)
            if(resp.data.user.type == "author")
                navigate("/home")
            else
                navigate("http://localhost:8000/admin")
        }
        else{
            setIsError(true)
            setPassword("")
        }        
    }
    
    return (
        <Grid>
             <Paper style={paperStyle}>
                {isError && <div className = "error" style={{color:"red", padding:20}} > Invalid Credentials. Try Again</div>}
                <Grid align='center'> 
                    <Avatar style= {avatarStyle} ><LockIcon/></Avatar>
                    <h2>Login</h2>
                </Grid>
                <TextField onChange={(e) => setUsername(e.target.value)} variant="standard" label='Username' placeholder="Enter Username" style={formFieldStyle} fullWidth required/>
                <TextField value={password} onChange={(e) => setPassword(e.target.value)} variant="standard" label='Password' placeholder="Enter Password" style={formFieldStyle} fullWidth required type='password'/>
                <Button onClick={(e)=>handleSubmit(e)}
                    style={{margin: '25px 0px 10px 0px'}} variant='contained' type='submit' color='primary' fullWidth> Login</Button>
                <Typography> Don't have an account?
                    <Link onClick={(e) => handleChange(e,1)} style={{cursor: "pointer" }}> Sign Up</Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login

/* TODO : 
1. IF INCORRECT CREDENTIALS:
-> MAKE PASSWORD TEXTFILED EMPTY
-> DISPLAY MODAL WITH MESSAGE
*/