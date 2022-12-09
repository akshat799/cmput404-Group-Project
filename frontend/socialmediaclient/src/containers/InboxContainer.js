import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Inbox from "../pages/Inbox/Inbox";
import Navbar from "../components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { getNotifications } from "../features/notifications";
import { getAuthorPosts } from "../features/userposts";
import FriendRequests from "../pages/Inbox/FriendRequests";
import Liked from "../pages/Inbox/Liked";

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
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function BasicTabs() {
  const [value, setValue] = useState(0);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(getAuthorPosts(state.auth.author.id));
    dispatch(getNotifications(state.auth.author.id));
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Navbar />
      <div sx={{ width: "100%" }}>
        <div
          sx={{ borderBottom: 1, borderColor: "divider", marginTop: "1rem" }}
        >
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
            style={{
              display: "flex",
              justifyContent: "space-around",
              flex: 1,
            }}
          >
            <Tab label="Notifications" {...a11yProps(0)} style={{color : "white"}}/>
            <Tab label="Friend Requests" {...a11yProps(1)} style={{color : "white"}}/>
            <Tab label="Liked Items" {...a11yProps(2)} style={{color : "white"}}/>
          </Tabs>
        </div>
        <TabPanel value={value} index={0}>
          <Inbox />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <FriendRequests />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Liked />
        </TabPanel>
      </div>
    </>
  );
}
