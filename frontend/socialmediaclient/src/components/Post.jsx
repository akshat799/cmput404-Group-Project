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
import { getCommentsOnPost } from "../features/posts";
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
import { sendLiketoAuthor } from "../features/posts";

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
  const [change , setChange] = useState(false);
  const currentAuthorId = state.auth.author.id;
  const post_Id = comp == "inbox" ? post.id : post.id.split("/").reverse();
  const postId = post_Id[0] == ""? post_Id[1]: post_Id[0]


  const postAuthorId =
    comp == "inbox" ? post.author.id : post.author.id.split("/").reverse()[0];

  const getLikeCount = async () => {
    const resp = await dispatch(getPostLikes(currentAuthorId, postId));
    await setLikeCount(resp);
  };

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [display, setDisplay] = useState("visible");
  const [followerModal, setFollowerModal] = useState(false);

  const allLikedPosts = state.auth.allLiked;

  const getIsLiked = () => {
    for (let p of allLikedPosts) {
      if (p.post == postId) {
        setIsLiked(true);
        break;
      }
    }
  };
  const [commentsList, setCommentsList] = useState([]);

  const handleGetComments = async () => {
    const resp = await dispatch(getCommentsOnPost(postAuthorId, postId));
    
    await setCommentsList(resp);
  };

  const data = {
    at_context: "https://www.w3.org/ns/activitystreams",
    type: "Like",
    summary: state.auth.author.displayName + " likes your post",
    author: currentAuthorId,
    post: postId,
  };

  const likeHandler = async () => {
    if (isLiked === false) {
      const resp = await dispatch(sendLiketoAuthor(postAuthorId, data));
      if (resp == 201) {
        setIsLiked(true);
        getLikeCount();
      }
    }
  };

  useEffect(() => {
    getLikeCount();
    handleGetComments();
    if (comp != "profile") setDisplay("hidden");
    getIsLiked();
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
      categories: categories,
    };
    if (postType == "image") {
      requestData.contentType = `image/${
        selectedFile.name.split(".").reverse()[0]
      };base64`;
      requestData.content = await convertToBase64(selectedFile);
    }
    
    const res = await dispatch(
      editPosts(
        requestData,
        state.auth.author.id,
        post.id.split("/").reverse()[0],
        index
      )
    );
    if (res == 201) {
      setChange(true);
      handleTextClose();
      handleImageClose();
      
    }
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
        <span className="postDescription">Post Description: {post?.description}</span>
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <ThumbUpIcon
            className="likes"
            style={{ color: isLiked ? "blue" : "gray" }}
            onClick={likeHandler}
          />
          <span style={{ color: "gray" }}> {likeCount}</span>
        </div>
        <div className="postBottomRight">
          <span className="postCommentText">
            <Button
              variant="text"
              onClick={handleGetComments}
              style={{ color: "gray" }}
            >
              {" "}
              Show {commentsList.length} Comments{" "}
            </Button>
          </span>
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

              {postType != "image" && (
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
      {commentsList != [] &&
        commentsList.map((c) => (
          <Comment
            key={c.id}
            data={data}
            comment={c}
            postAuthorId={postAuthorId}
          />
        ))}
      <AddComment currentAuthorId={currentAuthorId} postId={postId} />
      <FollowerModal
        open={followerModal}
        handleCloseFollowerModal={handleCloseFollowerModal}
        id={postId}
      />
    </div>
  );
}
