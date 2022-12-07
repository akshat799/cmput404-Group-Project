import React from "react";
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
import { addComment } from "../features/posts";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import "./Post.css";

const AddComment = ({ currentAuthorId, postId }) => {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();
  const imgLink = state.auth.profileImage;

  const [commentText, setCommentText] = useState("");
  const [textOpen, setTextOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [markOpen, setMarkOpen] = useState(false);
  const [finalTextOpen, setFinalTextOpen] = useState(false);
  const [postType, setPostType] = useState("none");
  const [content, setContent] = useState("");
  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

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
  const handleMarkClose = () => {
    setMarkOpen(false);
    setPreview(undefined);
  };
  const handleFinalTextClose = () => {
    setFinalTextOpen(false);
    setPostType("none");
  };

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
    if (event.target.value !== "none") {
      setTextOpen(false);
      setFinalTextOpen(true);
    }
  };

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
        setPostType(`image/${ext[ext.length - 1]};base64`);
        setSelectedFile(e.target.files[0]);
      }
    }
  };

  const sendComment = async (type) => {
    let data = {
      comment: content,
      contentType: postType,
    };

    if (type == "image") {
      const imgData = await convertToBase64(selectedFile);
      data.comment = imgData;
    }

    const status = await dispatch(addComment(currentAuthorId, postId, data));

    if (status == 200) {
      console.log("ADDED")
      setContent("");
    }
  };

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };
  return (
    <div
      style={{
        width: "58vw",
        display: "flex",
        marginTop: "1rem",
      }}
    >
      <div
        className="post"
        style={{
          marginTop: "1rem",
          padding: "0",
          backgroundColor: "#454545",
          borderRadius: "15px",
        }}
      >
        <div className="what-to-post" style={{ marginTop: "1rem" }}>
          Add a comment
        </div>
        <br />
        <div className="post-options">
          <div className="post-type" onClick={handleTextOpen}>
            <TextFieldsIcon />
            <span>
              <button className="button">Text</button>
            </span>
          </div>
          <div className="post-type" onClick={handleImageOpen}>
            <ImageIcon />
            <span>
              <button className="button">Image</button>
            </span>
          </div>
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
                    onClick={() => sendComment("image")}
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
              <Box textAlign="center" style={{ marginTop: 10 }}>
                <Button
                  variant="contained"
                  onClick={() => sendComment("application")}
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
              <Box textAlign="center" style={{ marginTop: 10 }}>
                <Button variant="contained" onClick={() => sendComment("text")}>
                  Post
                </Button>
              </Box>
            </Box>
          </Box>
        </Modal>
      </div>
    </div>
  );
};

export default AddComment;
