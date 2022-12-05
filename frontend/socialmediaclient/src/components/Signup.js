import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { Avatar, Button, Grid, Paper, TextField, Typography } from '@mui/material';
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from 'react-toastify';
import { signUp } from '../features/auth';

const Signup = ({ handleChange }) => {

    const dispatch = useDispatch();

    const [username, setUsername] = useState("");
    const [fullName, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [email, setEmail] = useState("");
    const [isError, setError] = useState(false);
    const [githubName, setGithubName] = useState("");

    useEffect(() => {
        if (confirmPassword != password) {
            setError(true);
        }
        else {
            setError(false);
        }
    }, [confirmPassword]);

    const paperStyle = { padding: 20, height: '80vh', width: 300, margin: "0px auto" };
    const avatarStyle = { backgroundColor: '#9494de' };
    const formFieldStyle = { margin: '10px 0px 0px 0px' };
    const headerStyle = { margin: 0 };
    const handleSubmit = async (e) => {
        toast.error("something went wrong. please try agin");
        e.preventDefault();
        if (!isError) {
            let formData = {
                "username": username,
                "displayName": fullName,
                "password": password,
                "githubName": githubName,
                "email": email
            };

            const status = await dispatch(signUp(formData));
            if (status == 201) {
                handleChange(e, 0);
            } else {
                //DISPLAY 
            }
        }
        else {

        }

    };

    return (
        <Grid>
            <Paper style={paperStyle}>
                <Grid align='center'>
                    <Avatar style={avatarStyle} ><AddCircleOutlineIcon /></Avatar>
                    <h2 style={headerStyle}> Sign Up</h2>
                    <Typography variant='caption'> Complete this form to create an account </Typography>
                </Grid>
                <form>
                    <TextField
                        className='username'
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="standard"
                        label='Username'
                        placeholder="Enter Username"
                        style={formFieldStyle}
                        fullWidth
                        required />
                    <TextField
                        className='fullName'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        variant="standard"
                        label='Full Name'
                        placeholder="Enter Full Name"
                        style={formFieldStyle}
                        fullWidth
                        required />
                    <TextField
                        type="email"
                        className='email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="standard"
                        label='Email'
                        placeholder="Enter email"
                        style={formFieldStyle}
                        fullWidth
                        required />
                    <TextField
                        className='githubName'
                        value={githubName}
                        onChange={(e) => setGithubName(e.target.value)}
                        variant="standard"
                        label='Github Name'
                        placeholder="Enter Github Name"
                        style={formFieldStyle}
                        fullWidth
                        required />
                    <TextField
                        className='password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="standard"
                        label='Password'
                        placeholder="Enter Password"
                        style={formFieldStyle}
                        fullWidth
                        required
                        type='password' />
                    <TextField
                        className='confirmPassword'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="standard"
                        label='Confirm Password'
                        placeholder="Confirm Password"
                        style={formFieldStyle}
                        fullWidth
                        required
                        type='password' />
                    {isError && <div className='dispError' style={{ color: "red" }}> Error:Passwords Don't Match!</div>}
                    <p style={{ textAlign: 'center', marginTop: 15, marginBottom: 10 }}>upload file for profile picture</p>
                    <input type="file" id="myfile" />
                    <Button
                        className='submit'
                        style={{ margin: '25px 0px 10px 0px' }}
                        variant='contained'
                        type='submit'
                        color='primary'
                        fullWidth
                        onClick={(e) => handleSubmit(e)}
                    >
                        Sign Up</Button>
                </form>
            </Paper>
        </Grid>
    );
};

export default Signup;