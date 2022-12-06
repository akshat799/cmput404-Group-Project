import Modal from "@material-ui/core/Modal";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { alpha, styled } from "@mui/material/styles";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostLikes } from "../features/posts";
import AddComment from "./AddComment";
import Comment from "./Comment";
import "./Post.css";
import PostContent from "./PostContent";
import { editPosts } from "../features/userposts";
import FollowerModal from "./FollowerModal";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "4px 0",
    },
    "& .MuiMenuItem-root": {
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));

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

export default function Post({ post, comp, index }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const authorId = state.auth.author.id;
  const postId = post.id;

  const getLikeCount = async () => {
    await dispatch(getPostLikes(authorId, postId));
  };
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);
  const [display, setDisplay] = useState("visible");
  const [followerModal, setFollowerModal] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    getLikeCount();
    if (comp != "profile") setDisplay("hidden");
  }, []);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setAnchorEl(null);
    handleTextOpen();
  };

  const [postType, setPostType] = useState("none");
  const [textOpen, setTextOpen] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);

  const reset = () => {
    setPostType("none");
    setTitle(post.title);
    setDesc(post.description);
    setCategories([]);
    setContent("");
    setPrivacy("PUBLIC");
    setPreview(undefined);
  };

  const handleTextOpen = () => setTextOpen(true);
  const handleTextClose = () => {
    setTextOpen(false);
    reset();
  };
  const handleImageOpen = () => {
    setImageOpen(true);
  };
  const handleImageClose = () => {
    setImageOpen(false);
    reset();
  };
  const handleCloseFollowerModal = () => {
    setFollowerModal(false);
  };
  const [privacy, setPrivacy] = useState(post.visibility);
  const [title, setTitle] = useState(post.title);
  const [desc, setDesc] = useState(post.description);
  const [categories, setCategories] = useState([]);
  const [content, setContent] = useState("");

  const [selectedFile, setSelectedFile] = useState();
  const [preview, setPreview] = useState();

  useEffect(() => {
    if (!selectedFile) {
      console.log("UNDEFINED");
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

  const onSelectFile = (e, type) => {
    console.log(e.target.files);
    if (!e.target.files || e.target.files.length === 0) {
      console.log("HERE");
      setSelectedFile(undefined);
      return;
    }

    if (type == "image") {
      const ext = e.target.files[0].name.split(".");
      if (ext[ext.length - 1] != "png" && ext[ext.length - 1] != "jpeg") {
        //display error
      } else {
        setSelectedFile(e.target.files[0]);
      }
    }
  };

  const handlePostTypeChange = (event) => {
    console.log(index);
    setPostType(event.target.value);
    if (event.target.value !== "none") {
      setTextOpen(false);
      setImageOpen(true);
    }
  };
  const handleChange = (event) => {
    setPrivacy(event.target.value);
  };

  const handleUpdate = async () => {
    const requestData = {
      title: title,
      description: desc,
      contentType: postType,
      content: content,
      visibility: privacy,
      unlisted: false,
    };
    if (postType == "image") {
      requestData.contentType = selectedFile.name.split(".").reverse()[0];
      requestData.content = await convertToBase64(selectedFile);
    }

    const res = await dispatch(
      editPosts(requestData, state.auth.id, post.id, index)
    );
  };

  return (
    <div className="post">
      <div className="postTop">
        <div className="postTopLeft">
          <img
            className="postProfileImg"
            src={post.author.profileImage}
            alt=""
          />
          <span className="postUsername">{post.author.displayName}</span>
        </div>
        <div className="postTopRight">
          <Button
            variant="contained"
            style={{ marginRight: "0.5rem" }}
            onClick={() => setFollowerModal(true)}
          >
            Share
          </Button>
          <MoreHorizIcon
            onClick={handleClick}
            style={{ visibility: display }}
          />
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              "aria-labelledby": "demo-customized-button",
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
          >
            <MenuItem onClick={handleEdit} disableRipple>
              <EditIcon />
              Edit
            </MenuItem>
            <Divider sx={{ my: 0.5 }} />
            <MenuItem onClick={handleClose} disableRipple>
              <DeleteIcon />
              Delete
            </MenuItem>
          </StyledMenu>
        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{post?.title}</span>
        <PostContent contentType={post} />
        <img className="postImg" src={post?.img} alt="" />
        <span className="postText">{post?.description}</span>
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <ThumbUpIcon className="likes" onClick={likeHandler} />
          <span style={{ color: "gray" }}> {state.posts.postLikeCount}</span>
        </div>
        <div className="postBottomRight">
          <span className="postCommentText">{post.count} Comments</span>
        </div>
      </div>
      {/* for selecting */}
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
              <MenuItem value={"image"}>Image</MenuItem>
              <MenuItem value={"application/base64"}>base64</MenuItem>
            </Select>
          </Box>
        </Box>
      </Modal>

      {/* for final edit */}
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
                id="outlined-multiline-static"
                multiline
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />

              <div className="option">Description</div>

              <TextField
                id="outlined-multiline-static"
                multiline
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />

              <div className="option">Category</div>

              <TextField
                id="outlined-multiline-static"
                rows={1}
                placeholder="write something..."
                style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                value={categories}
                onChange={(e) => {
                  let data = e.target.value.split(",");
                  setCategories(data);
                }}
              />

              {!imageOpen && (
                <>
                  <div className="option">Content</div>

                  <TextField
                    id="outlined-multiline-static"
                    multiline
                    rows={2}
                    placeholder="write something..."
                    style={{ width: 330, marginTop: 10, marginBottom: 10 }}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </>
              )}
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

              {postType === "image" && (
                <>
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
                </>
              )}
              <Box textAlign="center" style={{ marginTop: 10 }}>
                <Button variant="contained" onClick={() => handleUpdate()}>
                  Update
                </Button>
              </Box>
            </Box>
          </Box>
        </Box>
      </Modal>
      <Comment />
      <AddComment />
      <FollowerModal
        open={followerModal}
        handleCloseFollowerModal={handleCloseFollowerModal}
        id={postId}
      />
    </div>
  );
}
