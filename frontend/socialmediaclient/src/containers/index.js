import React, { useState } from 'react'
import {Paper, Tabs, Tab, Typography, Box} from "@mui/material";
import Login from '../components/Login'
import Signup from '../components/Signup' 

const SignInOutContainer = () => {

    const [value, setValue] = useState(0)
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const paperStyle={width:340,margin:"20px auto"}
    function TabPanel(props) {
      const { children, value, index, ...other } = props;
    
      return (
        <div
          role="tabpanel"
          hidden={value !== index}
          id={`simple-tabpanel-${index}`}
          aria-labelledby={`simple-tab-${index}`}
          {...other}
        >
          {value === index && (
            <Box>
              <Typography>{children}</Typography>
            </Box>
          )}
        </div>
      );
    }    
    return (
    <Paper elevation={20} style={paperStyle}>
      <Tabs
          value={value}
          indicatorColor="primary"
          textColor="primary"
          onChange={handleChange}
          aria-label="log in sign up"
        >
          <Tab label="Log In" />
         
          <Tab label="Sign Up" />
        </Tabs>
        <TabPanel value={value} index={0}>
       <Login handleChange={handleChange}/>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Signup/>
      </TabPanel>
      </Paper>
    )
}

export default SignInOutContainer



// <Grid>
        //     <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        //         <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
        //             <Tab label="Item One" {...a11yProps(0)}/>
        //             <Tab label="Item Two" {...a11yProps(1)}/>
        //         </Tabs>
        //     </Box>
        // <TabPanel value={value} index={0}> Item One </TabPanel>
        // <TabPanel value={value} index={1}> Item Two </TabPanel>
        // </Grid>

