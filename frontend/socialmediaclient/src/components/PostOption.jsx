import Modal from "@material-ui/core/Modal";
import ImageIcon from "@mui/icons-material/Image";
import LinkIcon from "@mui/icons-material/Link";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import React from "react";
import "./PostOption.css";
import { makePost } from "../features/userposts";
import { addNewPost } from "../features/posts";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";

export default function PostOption() {
  let requestData = {
    title: "Image Post",
    description: "Testing image post",
    contentType: "text/markdown",
    content: "anything wirte in content",
    categories: ["web", "tutorial"],
    visibility: "PUBLIC",
    unlisted: false,
  };
  const dispatch = useDispatch();
  const location = useLocation();
  const state = useSelector((state) => state);
  const [textOpen, setTextOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [markOpen, setMarkOpen] = React.useState(false);
  const [contentType, setContentType] = React.useState("");
  const handleTextOpen = () => setTextOpen(true);
  const handleImageOpen = () => setImageOpen(true);
  const handleLinkOpen = () => setLinkOpen(true);
  const handleMarkOpen = () => setMarkOpen(true);

  const handleTextClose = () => {
    setTextOpen(false);
    setPreview(undefined);
  };
  const handleImageClose = () => {
    setImageOpen(false);
    setSelectedFile(undefined);
  };
  const handleLinkClose = () => {
    setLinkOpen(false);
    setPreview(undefined);
  };
  const handleMarkClose = () => {
    setMarkOpen(false);
    setPreview(undefined);
  };

  const [selectedFile, setSelectedFile] = React.useState();
  const [preview, setPreview] = React.useState();
  const [linkPreview, setLinkPreview] = React.useState("");

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.readAsDataURL(file);
      fileReader.onload = () => {
        resolve(fileReader.result);
      };
      fileReader.onerror = (error) => {
        reject(error);
      };
    });
  };

  // create a preview as a side effect, whenever selected file is changed
  React.useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);

    // free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl);
  }, [selectedFile]);

  const onSelectFile = (e, type) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    if (type == "image") {
      const ext = e.target.files[0].name.split(".");
      if (ext[ext.length - 1] != "png" && ext[ext.length - 1] != "jpeg") {
        //display error
      } else {
        setContentType(`image/${ext[ext.length - 1]};base64`);
        setSelectedFile(e.target.files[0]);
      }
    }
  };

  const changeLinkHandler = (e) => {
    setLinkPreview(e.target.value);
  };

  const handleUpload = async (type) => {
    let data;
    if (type == "image") {
      data = await convertToBase64(selectedFile);
    }

    requestData.contentType = contentType;
    requestData.content = data;

    let res;

    if (location.pathname == "/home")
      res = await dispatch(addNewPost(requestData, state.auth.author.id));
    else res = await dispatch(makePost(requestData, state.auth.author.id));

    if (type == "image") handleImageClose();
  };

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div className="post">
      <div className="what-to-post">What would you like to post today?</div>
      <br />
      <div className="post-options">
        <div className="post-type" onClick={handleTextOpen}>
          <TextFieldsIcon />
          <span>
            <button className="button">Plain Text</button>
          </span>
        </div>
        <div className="post-type" onClick={handleImageOpen}>
          <ImageIcon />
          <span>
            <button className="button">Image</button>
          </span>
        </div>
        <div className="post-type" onClick={handleLinkOpen}>
          <LinkIcon />
          <span>
            <button className="button">Image Link</button>
          </span>
        </div>
        <div className="post-type" onClick={handleMarkOpen}>
          <TextSnippetIcon />
          <span>
            <button className="button">CommonMark</button>
          </span>
        </div>
      </div>
      {/* upload text */}
      <Modal
        open={textOpen}
        onClose={handleTextClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', color: 'black' }}>
            <div className="option">Enter what you would like to post</div>

          </Typography>


          <Box textAlign='center' style={{ marginTop: 10 }}>
            <TextField
              id="outlined-multiline-static"
              label="Enter your post"
              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 280, marginTop: 20, marginBottom: 15 }}

            />
            <Button variant='contained'>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* upload image */}
      <Modal
        open={imageOpen}
        onClose={handleImageClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => onSelectFile(e, "image")}
          />
          <Box textAlign="center" style={{ marginTop: 10 }}>
            {selectedFile != undefined && (
              <img
                alt="nothing"
                style={{ height: "150px", width: "300px" }}
                src={preview}
              />
            )}
          </Box>

          <Box textAlign="center" style={{ marginTop: 10 }}>
            <Button variant="contained" onClick={() => handleUpload("image")}>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* upload link */}
      <Modal
        open={linkOpen}
        onClose={handleLinkClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ textAlign: "center" }}
          >
            Enter the Link of the Image
          </Typography>
          <TextField
            id="outlined-multiline-static"
            label="Enter your link"
            multiline
            rows={2}
            placeholder="write something..."
            style={{ width: 400, marginTop: 20 }}
            onChange={changeLinkHandler}
          />
          <Box textAlign="center" style={{ marginTop: 10 }}>
            {
              <img
                alt="Enter correct link"
                style={{ height: "150px", width: "300px" }}
                src={linkPreview}
              />
            }
          </Box>
          <Box textAlign="center" style={{ marginTop: 10 }}>
            <Button variant="contained">Post</Button>
          </Box>
        </Box>
      </Modal>

      {/* Upload file */}
      <Modal
        open={markOpen}
        onClose={handleMarkClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <input type="file" />

          <Box textAlign="center" style={{ marginTop: 10 }}>
            <Button variant="contained">Post</Button>
          </Box>
        </Box>
      </Modal>
    </div>

  );
}
