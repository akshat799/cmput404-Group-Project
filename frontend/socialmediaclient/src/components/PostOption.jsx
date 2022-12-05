import Modal from "@material-ui/core/Modal";
import ImageIcon from "@mui/icons-material/Image";
import TextFieldsIcon from "@mui/icons-material/TextFields";
import TextSnippetIcon from "@mui/icons-material/TextSnippet";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import "./PostOption.css";
import { makePost } from "../features/userposts";
import { addNewPost } from "../features/posts";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";


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
  const [textOpen, setTextOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [linkOpen, setLinkOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState(false);
  const [finalTextOpen, setFinalTextOpen] = useState(false);

  const [privacy, setPrivacy] = useState("PUBLIC");
  const [postType, setPostType] = useState("none");
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");

  const handleChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
    if (event.target.value !== "none") {
      setTextOpen(false);
      setFinalTextOpen(true);
    }
  };

  const handleTextOpen = () => setTextOpen(true);
  const handleImageOpen = () => {
    setImageOpen(true);
  };
  const handleMarkOpen = () => {
    setMarkOpen(true);
    setPostType("application/base64");
  };
  const handleFinalTextOpen = () => setFinalTextOpen(true);

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
  const handleFinalTextClose = () => {
    setFinalTextOpen(false);
    setPostType("none");
  };

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();
  const [linkPreview, setLinkPreview] = useState("");

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
  useEffect(() => {
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
      console.log(ext);
      if (ext[ext.length - 1] != "png" && ext[ext.length - 1] != "jpeg") {
        //display error
      } else {
        setPostType(`image/${ext[ext.length - 1]};base64`);
        setSelectedFile(e.target.files[0]);
        console.log(selectedFile);
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
      requestData.content = data;
    } else {
      requestData.content = content;
    }

    requestData.title = title;
    requestData.description = desc;
    requestData.categories = categories;
    requestData.contentType = postType;
    requestData.visibility = privacy;

    let res;

    if (location.pathname == "/home")
      res = await dispatch(addNewPost(requestData, state.auth.author.id));
    else res = await dispatch(makePost(requestData, state.auth.author.id));

    if (type == "image") handleImageClose();
    else if (type == "text") handleFinalTextClose();
    else handleMarkClose();
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
        {/* <div className="post-type" onClick={handleLinkOpen}>
          <LinkIcon />
          <span><button className='button'>Image Link</button></span>
        </div> */}
        <div className="post-type" onClick={handleMarkOpen}>
          <TextSnippetIcon />
          <span>
            <button className="button">Base 64</button>
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
          <Typography
            id="modal-modal-title"
            variant="h6"
            component="h2"
            style={{ textAlign: "center", color: "black" }}
          >
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
              <MenuItem value={"none"}>Select an item</MenuItem>
              <MenuItem value={"text/html"}>HTML</MenuItem>
              <MenuItem value={"text/plain"}>Plain Text</MenuItem>
              <MenuItem value={"text/markdown"}>Markdown</MenuItem>
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
          <Box sx={style} textAlign="center">
            <Box>
              <Typography
                id="modal-modal-title"
                variant="h6"
                component="h2"
                style={{ textAlign: "center", color: "black" }}
              />
              <div className="option">Title</div>

              <TextField
                required
                id="outlined-multiline-static"
                multiline
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="option">Description</div>

              <TextField
                required
                id="outlined-multiline-static"
                multiline
                rows={2}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                onChange={(e) => setDesc(e.target.value)}
              />

              <div className="option">Categories (Separate by commas)</div>

              <TextField
                required
                id="outlined-multiline-static"
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                onChange={(e) => {
                  let data = e.target.value.split(",");
                  setCategories(data);
                }}
              />
              <div className="option">Choose Privacy</div>
              <Box
                textAlign="center"
                style={{ marginTop: 10, marginBottom: 10 }}
              ></Box>

              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={privacy}
                // label="Age"
                onChange={handleChange}
              >
                <MenuItem value={"PUBLIC"} selected>
                  Public
                </MenuItem>
                <MenuItem value={"FRIENDS"}>Private</MenuItem>
              </Select>
              <div className="option" style={{ marginTop: 10 }}>
                Upload image
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => onSelectFile(e, "image")}
              />
              <Box textAlign="center" style={{ marginTop: 10 }}>
                {selectedFile && (
                  <img
                    alt="nothing"
                    style={{
                      height: "100px",
                      width: "100px",
                      borderRadius: "50%",
                    }}
                    src={preview}
                  />
                )}
              </Box>
              <Box textAlign="center" style={{ marginTop: 10 }}>
                <Button
                  variant="contained"
                  onClick={() => handleUpload("image")}
                >
                  Post
                </Button>
              </Box>
            </Box>
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
        <Box sx={style} textAlign="center">
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ textAlign: "center", color: "black" }}
            />
            <div className="option">Title</div>

            <TextField
              required
              id="outlined-multiline-static"
              multiline
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="option">Description</div>

            <TextField
              required
              id="outlined-multiline-static"
              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="option">Categories (Separate by commas)</div>

            <TextField
              required
              id="outlined-multiline-static"
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => {
                let data = e.target.value.split(",");
                setCategories(data);
              }}
            />

            <div className="option">Content</div>
            <TextField
              required
              id="outlined-multiline-static"
              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => setContent(e.target.value)}
            />
            <div className="option">Choose Privacy</div>
            <Box
              textAlign="center"
              style={{ marginTop: 10, marginBottom: 10 }}
            ></Box>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={privacy}
              // label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"PUBLIC"} selected>
                Public
              </MenuItem>
              <MenuItem value={"FRIENDS"}>Private</MenuItem>
            </Select>

            <Box textAlign="center" style={{ marginTop: 10 }}>
              <Button
                variant="contained"
                onClick={() => handleUpload("application")}
              >
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
        <Box sx={style} textAlign="center">
          <Box sx={style}>
            <Typography
              id="modal-modal-title"
              variant="h6"
              component="h2"
              style={{ textAlign: "center", color: "black" }}
            />
            <div className="option">Title</div>

            <TextField
              required
              id="outlined-multiline-static"
              multiline
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className="option">Description</div>

            <TextField
              required
              id="outlined-multiline-static"
              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => setDesc(e.target.value)}
            />

            <div className="option">Categories (Separate by commas)</div>

            <TextField
              required
              id="outlined-multiline-static"
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => {
                let data = e.target.value.split(",");
                setCategories(data);
              }}
            />

            <div className="option">Content</div>
            <TextField
              required
              id="outlined-multiline-static"
              multiline
              rows={2}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}
              onChange={(e) => setContent(e.target.value)}
            />

            <div className="option">Choose Privacy</div>
            <Box
              textAlign="center"
              style={{ marginTop: 10, marginBottom: 10 }}
            ></Box>

            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={privacy}
              // label="Age"
              onChange={handleChange}
            >
              <MenuItem value={"PUBLIC"} selected>
                Public
              </MenuItem>
              <MenuItem value={"FRIENDS"}>Private</MenuItem>
            </Select>

            <Box textAlign="center" style={{ marginTop: 10 }}>
              <Button variant="contained" onClick={() => handleUpload("text")}>
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
