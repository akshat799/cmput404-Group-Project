import Modal from "@material-ui/core/Modal";
import ImageIcon from '@mui/icons-material/Image';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import TextSnippetIcon from '@mui/icons-material/TextSnippet';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import React from 'react';
import "./PostOption.css";


export default function PostOption() {

  const [textOpen, setTextOpen] = React.useState(false);
  const [imageOpen, setImageOpen] = React.useState(false);
  const [linkOpen, setLinkOpen] = React.useState(false);
  const [markOpen, setMarkOpen] = React.useState(false);
  const [finalTextOpen, setFinalTextOpen] = React.useState(false);

  const [privacy, setPrivacy] = React.useState('public');
  const [postType, setPostType] = React.useState('none');

  const handleChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
    if (event.target.value !== 'none') {
      setTextOpen(false);
      setFinalTextOpen(true);
    }
  };


  const handleTextOpen = () => setTextOpen(true);
  const handleImageOpen = () => setImageOpen(true);
  const handleMarkOpen = () => setMarkOpen(true);
  const handleFinalTextOpen = () => setFinalTextOpen(true);


  const handleTextClose = () => setTextOpen(false);
  const handleImageClose = () => setImageOpen(false);
  const handleLinkClose = () => setLinkOpen(false);
  const handleMarkClose = () => setMarkOpen(false);
  const handleFinalTextClose = () => setFinalTextOpen(false);



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
        {/* <div className="post-type" onClick={handleLinkOpen}>
          <LinkIcon />
          <span><button className='button'>Image Link</button></span>
        </div> */}
        <div className="post-type" onClick={handleMarkOpen}>
          <TextSnippetIcon />
          <span><button className='button'>Base 64</button></span>
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
            <div className="option">Select what you would like to post</div>
          </Typography>

          <Box textAlign="center">
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={postType}
              // label="select an item"
              onChange={handlePostTypeChange}
            >
              <MenuItem value={'none'}>Select an item</MenuItem>
              <MenuItem value={'html'}>HTML</MenuItem>
              <MenuItem value={'text'} >Plain Text</MenuItem>
              <MenuItem value={'markdown'}>Markdown</MenuItem>

            </Select>
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
          <Box sx={style} textAlign='center'>
            <Box>
              <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', color: 'black' }} />
              <div className="option">Title</div>

              <TextField
                id="outlined-multiline-static"

                multiline
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}

              />

              <div className="option">Description</div>

              <TextField
                id="outlined-multiline-static"

                multiline
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              />

              <div className="option">Category</div>

              <TextField
                id="outlined-multiline-static"
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              />

              <div className="option">Content</div>

              <TextField
                id="outlined-multiline-static"

                multiline
                rows={2}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              />
              <div className="option">Choose Privacy</div>
              <Box textAlign='center' style={{ marginTop: 10, marginBottom: 10 }}>

              </Box>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={privacy}
                // label="Age"
                onChange={handleChange}
              >
                <MenuItem value={'public'} selected>Public</MenuItem>
                <MenuItem value={'private'}>Private</MenuItem>

              </Select>
              <div className="option" style={{ marginTop: 10 }} >Upload image</div>

              <input type='file' accept="image/*" onChange={onSelectFile} />
              <Box textAlign='center' style={{ marginTop: 10 }}>
                {selectedFile && <img alt="nothing" style={{ height: '100px', width: '100px', borderRadius: '50%' }} src={preview} />}
              </Box>
              <Box textAlign='center' style={{ marginTop: 10 }}>
                <Button variant='contained'>
                  Post
                </Button>
              </Box>
            </Box>

          </Box>
          {/* <input type='file' accept="image/*" onChange={onSelectFile} />
          <Box textAlign='center' style={{ marginTop: 10 }}>
            {selectedFile && <img alt="nothing" style={{ height: '150px', width: '300px' }} src={preview} />}
          </Box>

          <Box textAlign='center' style={{ marginTop: 10 }}>
            <Button variant='contained'>
              Post
            </Button>
          </Box> */}
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

          <Box textAlign='center' style={{ marginTop: 10 }}>
            <TextField
              id="outlined-multiline-static"
              label="Enter your link"
              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 280, marginTop: 20, marginBottom: 15 }}
              onChange={changeLinkHandler}
            />
            {<img alt="Enter correct link" style={{ height: '150px', width: '300px' }} src={linkPreview} />}
          </Box>
          <Box textAlign='center' style={{ marginTop: 10 }}>
            <Button variant='contained'>
              Post
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Upload base64 */}
      <Modal
        open={markOpen}
        onClose={handleMarkClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} textAlign='center'>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', color: 'black' }} />
            <div className="option">Title</div>

            <TextField
              id="outlined-multiline-static"

              multiline
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}

            />

            <div className="option">Description</div>

            <TextField
              id="outlined-multiline-static"

              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
            />

            <div className="option">Category</div>

            <TextField
              id="outlined-multiline-static"
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
            />

            <div className="option">Content</div>

            <TextField
              id="outlined-multiline-static"

              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
            />
            <div className="option">Choose Privacy</div>
            <Box textAlign='center' style={{ marginTop: 10, marginBottom: 10 }}>

            </Box>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={privacy}
              // label="Age"
              onChange={handleChange}
            >
              <MenuItem value={'public'} selected>Public</MenuItem>
              <MenuItem value={'private'}>Private</MenuItem>

            </Select>

            <Box textAlign='center' style={{ marginTop: 10 }}>
              <Button variant='contained'>
                Post
              </Button>
            </Box>
          </Box>

        </Box>
      </Modal>
      {/* upload final text type */}
      <Modal
        open={finalTextOpen}
        onClose={handleFinalTextClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} textAlign='center'>
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', color: 'black' }} />
            <div className="option">Title</div>

            <TextField
              id="outlined-multiline-static"

              multiline
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}

            />

            <div className="option">Description</div>

            <TextField
              id="outlined-multiline-static"

              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
            />

            <div className="option">Category</div>

            <TextField
              id="outlined-multiline-static"
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
            />

            <div className="option">Content</div>

            <TextField
              id="outlined-multiline-static"

              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
            />
            <div className="option">Choose Privacy</div>
            <Box textAlign='center' style={{ marginTop: 10, marginBottom: 10 }}>

            </Box>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={privacy}
              // label="Age"
              onChange={handleChange}
            >
              <MenuItem value={'public'} selected>Public</MenuItem>
              <MenuItem value={'private'}>Private</MenuItem>

            </Select>

            <Box textAlign='center' style={{ marginTop: 10 }}>
              <Button variant='contained'>
                Post
              </Button>
            </Box>
          </Box>

        </Box>
      </Modal>
    </div>

  );
}
