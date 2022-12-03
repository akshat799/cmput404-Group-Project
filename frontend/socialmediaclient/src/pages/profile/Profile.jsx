import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import EditIcon from '@mui/icons-material/Edit';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React from 'react';
import { useSelector } from "react-redux";
import AuthorPosts from "../../components/AuthorPosts";
import Navbar from "../../components/Navbar";
import "./Profile.css";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};




export default function Profile() {

  const state = useSelector((state) => state);
  const [req, setReq] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);

  const ProfilePhoto = state.auth.author.profileImage;
  const Username = state.auth.author.displayName;


  return (
    <>
      <Navbar />
      <div className="profileCover">
        <img
          className="profileCoverImg"
          src={process.env.PUBLIC_URL + "/images/CoverPhoto.jpg"}
          alt=""
        />
        <img className="profilePhoto" onClick={handleImageOpen} src={ProfilePhoto} alt="" />
        {/* upload image modal */}
        <Modal
          open={imageOpen}
          onClose={handleImageClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <input
              accept="image/*"
              id="contained-button-file"
              type="file"
              onChange={onSelectFile}
              hidden

            />
            <label htmlFor="contained-button-file">
              <Fab component="span" style={{
                position: 'absolute',
                right: '120px',
                bottom: '80px'
              }} >
                <AddPhotoAlternateIcon />
              </Fab>
            </label>
            {/* <input type='file' accept="image/*" onChange={onSelectFile} /> */}
            <Box textAlign='center' style={{ marginTop: 10 }}>
              {selectedFile ? <img alt="nothing" style={{ height: '300px', width: '300px', borderRadius: '50%' }} src={preview} /> : <img alt="nothing" style={{ height: '300px', width: '300px', borderRadius: '50%' }} src={ProfilePhoto} />}
            </Box>

            <Box textAlign='center' style={{ marginTop: 10 }}>
              <Button variant='contained'>
                Post
              </Button>
            </Box>
          </Box>
        </Modal>
        {/* upload image modal */}
      </div>
      <div className="profileInfo">
        <div className='nameAdd'>
          <h4 className="profileName">{Username} </h4>
        </div>
        <div style={{ display: 'flex' }}>


          <span className="profileDescription">Welcome to my profile! </span>
          <EditIcon sx={{ marginLeft: 2 }} onClick={handleFormOpen} />
          <Modal
            open={formOpen}
            onClose={handleFormClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={formStyle}>
              <h4 style={{ color: 'black', textAlign: 'center' }}>Update your profile</h4>
              <Box textAlign='center' style={{ marginTop: 10 }}>
                <TextField
                  id="input-with-icon-textfield"
                  label="Username"
                  placeholder="testuser1"
                  style={{ marginTop: 10 }}
                  InputProps={{

                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="standard"
                />
                <TextField
                  id="input-with-icon-textfield"
                  label="Fullname"
                  placeholder="test name"
                  style={{ marginTop: 20 }}
                  InputProps={{

                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="standard"
                />
                <TextField
                  id="input-with-icon-textfield"
                  label="Email"
                  type="email"
                  placeholder="test@gmail.com"
                  style={{ marginTop: 20 }}
                  InputProps={{

                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="standard"
                />
                <TextField
                  id="input-with-icon-textfield"
                  label="Github Name"
                  placeholder="usergithub"
                  style={{ marginTop: 20, marginBottom: 20 }}
                  InputProps={{

                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="standard"
                />

                <h4 style={{ color: 'black', textAlign: 'center' }}>Update your Password</h4>

                <TextField
                  id="input-with-icon-textfield"
                  label="Password"
                  placeholder="Enter new password"
                  type="password"
                  style={{ marginTop: 20 }}
                  InputProps={{

                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="standard"
                />
                <TextField
                  id="input-with-icon-textfield"
                  label="Confirm password"
                  placeholder="Confirm password"
                  type="password"
                  style={{ marginTop: 20 }}
                  InputProps={{

                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    )
                  }}
                  variant="standard"
                />

              </Box>
            </Box>
          </Modal>
        </div>
      </div>
      <AuthorPosts />
    </>
  );
}