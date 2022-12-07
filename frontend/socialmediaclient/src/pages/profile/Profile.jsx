import Fab from "@material-ui/core/Fab";
import Modal from "@material-ui/core/Modal";
import AccountCircle from "@mui/icons-material/AccountCircle";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import EditIcon from "@mui/icons-material/Edit";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import AuthorPosts from "../../components/AuthorPosts";
import Navbar from "../../components/Navbar";
import "./Profile.css";
import { editAuthorInfo } from "../../features/auth";
import { useDispatch } from "react-redux";
import { getAuthorInfo } from "../../features/auth";
import { useEffect } from "react";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const formStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 300,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Profile() {
  const state = useSelector((state) => state);
  const dispatch = useDispatch()
  const [req, setReq] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [formOpen, setFormOpen] = React.useState(false);
  const currentAuthorId = state.auth.author.id;

  const ProfilePhoto = state.auth.author.profileImage;
  const Username = state.auth.author.displayName;

  const [displayname, setDisplayName] = useState(state.auth.author.displayName)
  const [githubName, setgithubName] = useState(state.auth.author.githubName)
  const [email, setEmail] = useState(state.auth.author.email)
  const [updateSuccess, setupdateSuccess] = useState(false)


  
  const handleImageOpen = () => setImageOpen(true);
  const handleFormOpen = () => setFormOpen(true);
  const handleImageClose = () => setImageOpen(false);
  const handleFormClose = () => setFormOpen(false);
  const [selectedFile, setSelectedFile] = React.useState();
  const [preview, setPreview] = React.useState();
  useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }
    setSelectedFile(e.target.files[0]);
  };

  const handleSubmit = async() => {
    const formData = {
      displayName: displayname,
      githubName : githubName,
      email: email,
    };
    console.log("here")
    const res = await dispatch(editAuthorInfo(formData, currentAuthorId))

    if (res.status == 200){
      setFormOpen(false)
      fetchCurrentAuthorInfo()
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    }
    
  }

  const fetchCurrentAuthorInfo = async() => {
    const res = await dispatch(getAuthorInfo(currentAuthorId))
    if (res.status == 200){
      setupdateSuccess(true)
    }

  }

  useEffect(()=>{
    // setDisplayName(state.auth.author.displayName)
  }, [updateSuccess])

  

  return (
    <>
      <Navbar />
      <div className="profileCover">
        <img
          className="profileCoverImg"
          src={process.env.PUBLIC_URL + "/images/CoverPhoto.jpg"}
          alt=""
        />
        <img
          className="profilePhoto"
          onClick={handleImageOpen}
          src={ProfilePhoto}
          alt=""
        />
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
              <Fab
                component="span"
                style={{
                  position: "absolute",
                  right: "120px",
                  bottom: "80px",
                }}
              >
                <AddPhotoAlternateIcon />
              </Fab>
            </label>
            <Box textAlign="center" style={{ marginTop: 10 }}>
              {selectedFile ? (
                <img
                  alt="nothing"
                  style={{
                    height: "300px",
                    width: "300px",
                    borderRadius: "50%",
                  }}
                  src={preview}
                />
              ) : (
                <img
                  alt="nothing"
                  style={{
                    height: "300px",
                    width: "300px",
                    borderRadius: "50%",
                  }}
                  src={ProfilePhoto}
                />
              )}
            </Box>

            <Box textAlign="center" style={{ marginTop: 10 }}>
              <Button variant="contained">Post</Button>
            </Box>
          </Box>
        </Modal>
        {/* upload image modal */}
      </div>
      <div className="profileInfo">
        <div className="nameAdd">
          <h4 className="profileName">{Username} </h4>
        </div>
        <div style={{ display: "flex" }}>
          <span className="profileDescription">Welcome to my profile! </span>
          <EditIcon sx={{ marginLeft: 2 }} onClick={handleFormOpen} />
          <Modal
            open={formOpen}
            onClose={handleFormClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box sx={formStyle}>
              <h4 style={{ color: "black", textAlign: "center" }}>
                Update your profile
              </h4>
              <Box textAlign="center" style={{ marginTop: 10 }}>
                
                <TextField
                  id="input-with-icon-textfield"
                  label="Fullname"
                  value= {displayname}
                  style={{ marginTop: 20 }}
                  onChange={(e) => {setDisplayName(e.target.value)}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
                <TextField
                  id="input-with-icon-textfield"
                  label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => {setEmail(e.target.value)}}
                  style={{ marginTop: 20 }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
                <TextField
                  id="input-with-icon-textfield"
                  label="Github Name"
                  valeue={githubName}
                  style={{ marginTop: 20, marginBottom: 20 }}
                  onChange={(e) => {setgithubName(e.target.value)}}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <AccountCircle />
                      </InputAdornment>
                    ),
                  }}
                  variant="standard"
                />
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
              </Box>
            </Box>
          </Modal>
        </div>
      </div>
      <AuthorPosts />
    </>
  );
}
