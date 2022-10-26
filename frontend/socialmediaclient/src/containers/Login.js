import React, { useState } from "react";
import { Avatar, Button, Grid, Link, TextField, Typography } from '@mui/material';
import { Paper } from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';

const Login=() => {

    const paperStyle={padding: 20, height: '60vh', width: 280, margin:"20px auto"}
    const avatarStyle={backgroundColor: '#22c469'}
    const formFieldStyle ={margin: '15px 0px 0px 0px'}
    return (
        <Grid>
             <Paper elevation = {10} style={paperStyle}>
                <Grid align='center'> 
                    <Avatar style= {avatarStyle} ><LockIcon/></Avatar>
                    <h2>Login</h2>
                </Grid>
                <TextField variant="standard" label='Username' placeholder="Enter Username" style={formFieldStyle} fullWidth required/>
                <TextField variant="standard" label='Password' placeholder="Enter Password" style={formFieldStyle} fullWidth required type='password'/>
                <Button style={{margin: '25px 0px 10px 0px'}} variant='contained' type='submit' color='primary' fullWidth> Login</Button>
                <Typography> Don't have an account?
                    <Link href="#"> SignUp</Link>
                </Typography>
            </Paper>
        </Grid>
    )
}

export default Login




// import Form from "react-bootstrap/Form";

// import Button from "react-bootstrap/Button";

// // import "./Login.css";

// export default function Login() {

//   const [email, setEmail] = useState("");

//   const [password, setPassword] = useState("");

//   function validateForm() {

//     return email.length > 0 && password.length > 0;

//   }

//   function handleSubmit(event) {

//     event.preventDefault();

//   }

//   return (
//     <div className="Login">
//         <h3> Hi </h3>

//       <Form onSubmit={handleSubmit}>

//         <Form.Group size="lg" controlId="email">

//           <Form.Label>Email</Form.Label>

//           <Form.Control

//             autoFocus

//             type="email"

//             value={email}

//             onChange={(e) => setEmail(e.target.value)}

//           />

//         </Form.Group>

//         <Form.Group size="lg" controlId="password">

//           <Form.Label>Password</Form.Label>

//           <Form.Control

//             type="password"

//             value={password}

//             onChange={(e) => setPassword(e.target.value)}

//           />

//         </Form.Group>

//         <Button block size="lg" type="submit" disabled={!validateForm()}>

//           Login

//         </Button>

//       </Form>

//     </div>

//   );

// }