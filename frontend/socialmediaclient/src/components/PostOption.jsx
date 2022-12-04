import Modal from "@material-ui/core/Modal";
import ImageIcon from '@mui/icons-material/Image';
import LinkIcon from '@mui/icons-material/Link';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import React from 'react';
import { useDispatch } from 'react-redux';
import { useSelector } from "react-redux";
import { createNewPost } from "../features/posts";
import "./PostOption.css";

export default function PostOption() {

  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const authorId = state.auth.author.id; 

  const [textOpen, setTextOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [markOpen, setMarkOpen] = React.useState(false);
  const [postContent, setPostContent] = React.useState("");
  const [postTitle, setPostTitle] = React.useState("");

  const handleTextOpen = () => setTextOpen(true);
  const handleImageOpen = () => setImageOpen(true);
  const handleLinkOpen = () => setLinkOpen(true);
  const handleMarkOpen = () => setMarkOpen(true);

  const handleTextClose = () => setTextOpen(false);
  const handleImageClose = () => setImageOpen(false);
  const handleLinkClose = () => setLinkOpen(false);
  const handleMarkClose = () => setMarkOpen(false);


  const [selectedFile, setSelectedFile] = React.useState();
  const [preview, setPreview] = React.useState();
  const [linkPreview, setLinkPreview] = React.useState('');

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

  const onSelectFile = e => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined);
      return;
    }

    // I've kept this example simple by using the first image instead of multiple
    setSelectedFile(e.target.files[0]);
  };

  const changeLinkHandler = e => {

    setLinkPreview(e.target.value);
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

  var formdata = {
    "type" : "post",
    "title" : "",
    "description": "",
    "contentType": "",
    "categories": ["web","tutorial"],
    "visibility": "PUBLIC",
    "unlisted": "false",
    "content": ""
}

  const handleTextSubmit = async() => {
    formdata["content"] = postContent

    const resp = await dispatch(createNewPost(formdata, authorId));
  }
  // const handleImageSubmit = async() => {
  //   formdata["content"] = postContent

  //   const resp = await dispatch(createNewPost(formdata, authorId));
  // }
  // const handleCommonMarkSubmit = async() => {
  //   formdata["content"] = postContent

  //   const resp = await dispatch(createNewPost(formdata, authorId));
  // }
  // const handleImagelinkSubmit = async() => {
  //   formdata["content"] = postContent

  //   const resp = await dispatch(createNewPost(formdata, authorId));
  // }
  return (
    <div className="post">
      <div className="what-to-post">
        What would you like to post today?
      </div>
      <br />
      <div className="post-options">

        <div className="post-type" onClick={handleTextOpen}>
          <TextFieldsIcon />
          <span><button className='button'>Plain Text</button></span>
        </div>
        <div className="post-type" onClick={handleImageOpen}>
          <ImageIcon />
          <span><button className='button'>Image</button></span>
        </div>
        <div className="post-type" onClick={handleLinkOpen}>
          <LinkIcon />
          <span><button className='button'>Image Link</button></span>
        </div>
        <div className="post-type" onClick={handleMarkOpen}>
          <TextSnippetIcon />
          <span><button className='button'>CommonMark</button></span>
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
          <TextField
            id="outlined-multiline-static"
            label="Enter your post"
            multiline
            rows={2}
            placeholder="write something..."
            style={{ width: 400, marginTop: 20 }}

          />

          <Box textAlign='center' style={{ marginTop: 10 }}>
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
          <TextField 
              id= "title"
              label = "Enter title"
              placeholder="Enter the Title"
              style={{ width: 400, marginTop: 20, marginBottom: 5 }}
              value={postTitle}
              onChange = {(e)=> setPostTitle(e.target.value)}
            />
          <input type='file' accept="image/*" onChange={onSelectFile} />
          <Box textAlign='center' style={{ marginTop: 10 }}>
            {selectedFile && <img alt="nothing" style={{ height: '150px', width: '300px' }} src={preview} />}
          </Box>

          <Box textAlign='center' style={{ marginTop: 10 }}>
            <Button variant='contained'>
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
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center' }}>
            <div className="option">Enter the Link of the Image</div>
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
          <Box textAlign='center' style={{ marginTop: 10 }}>
            {<img alt="Enter correct link" style={{ height: '150px', width: '300px' }} src={linkPreview} />}
          </Box>
          <Box textAlign='center' style={{ marginTop: 10 }}>
            <Button variant='contained'>
              Post
            </Button>
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

        <TextField 
            id= "title"
            label = "Enter title"
            placeholder="Enter Title"
            style={{ width: 400, marginTop: 20, marginBottom: 5 }}
            value={postTitle}
            onChange = {(e)=> setPostTitle(e.target.value)}
          />

          <input type='file' />
          <Box textAlign='center' style={{ marginTop: 10 }}>
            <Button variant='contained'>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>

  );
}
