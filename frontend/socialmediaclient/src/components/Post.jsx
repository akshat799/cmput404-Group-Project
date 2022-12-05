import Modal from "@material-ui/core/Modal";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import TextField from "@mui/material/TextField";
import Typography from '@mui/material/Typography';
import { getCommentsOnPost } from "../features/posts";

import { alpha, styled } from '@mui/material/styles';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getPostLikes } from "../features/posts";
import { sendLiketoAuthor } from "../features/posts";
import AddComment from "./AddComment";
import Comment from "./Comment";
import "./Post.css";
import PostContent from "./PostContent";


const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: 'bottom',
      horizontal: 'right',
    }}
    transformOrigin={{
      vertical: 'top',
      horizontal: 'right',
    }}
    {...props}
  />
))(({ theme }) => ({
  '& .MuiPaper-root': {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 180,
    color:
      theme.palette.mode === 'light' ? 'rgb(55, 65, 81)' : theme.palette.grey[300],
    boxShadow:
      'rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px',
    '& .MuiMenu-list': {
      padding: '4px 0',
    },
    '& .MuiMenuItem-root': {
      '& .MuiSvgIcon-root': {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      '&:active': {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity,
        ),
      },
    },
  },
}));


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

export default function Post({ post }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const currentAuthorId = state.auth.author.id;
  const postId = post.id.split("/").reverse()[0];

  const postAuthorId = post.author.id.split("/").reverse()[0]

  const getLikeCount = async () => {
    const resp = await dispatch(getPostLikes(currentAuthorId, postId));
    await setLikeCount(resp)
    await console.log("posts"+resp)
  };

  const [likeCount, setLikeCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);

  const [commentsList, setCommentsList] = useState([])

  const handleGetComments = async() => {

    console.log("here")
    console.log(postAuthorId, postId)
    const resp = await dispatch(getCommentsOnPost(postAuthorId, postId))
    setCommentsList = resp
  }

  const data = {
    "at_context": "https://www.w3.org/ns/activitystreams",
    "type": "Like",
    "summary": state.auth.author.displayName + " likes your post",
    "author" : currentAuthorId,
    "post" : postId
  }

  const likeHandler = async() => {
    if (isLiked === false) {
      const resp = await dispatch(sendLiketoAuthor(postAuthorId, data))
      if (resp == 201){
        setIsLiked(true)
        getLikeCount()
    }  
    }      
  };

  useEffect(() => {
    getLikeCount();
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

  const [textOpen, setTextOpen] = useState(false);
  const handleTextOpen = () => setTextOpen(true);
  const handleTextClose = () => setTextOpen(false);

  return (
    <div className="post">
      <div className="postTop">
        <div className="postTopLeft">
          <img
            className="postProfileImg"
            src={post.author.profileImage}
            alt=""
          />
          <span className="postUsername">
            {post.author.displayName}

          </span>
        </div>
        <div className="postTopRight">
          <MoreHorizIcon onClick={handleClick} />
          <StyledMenu
            id="demo-customized-menu"
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button',
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
        <PostContent contentType={post}/>
        <img className="postImg" src={post?.img} alt="" />
        <span className="postText">{post?.description}</span>
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <ThumbUpIcon className="likes" style={{ color: isLiked? "blue":"gray" }} onClick={likeHandler} />
          <span style={{ color: "gray"}}> {likeCount}</span>
        </div>
        <div className="postBottomRight">
          <span className="postCommentText"><Button variant="text" onClick={handleGetComments} style={{color:"gray"}}> Show Comments </Button></span>
        </div>
      </div>
      <Modal
        open={textOpen}
        onClose={handleTextClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" style={{ textAlign: 'center', color: 'black' }}>
            <div className="option">Title</div>

            <TextField
              id="outlined-multiline-static"
              defaultValue={post?.title}
              multiline
              rows={1}
              placeholder="write something..."
              style={{ width: 330, marginTop: 10, marginBottom: 10 }}

            />

            <div className="option">Description</div>

            <TextField
              id="outlined-multiline-static"
              defaultValue={post?.description}
              multiline
              rows={2}
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
            <div className="option">Upload File</div>
            <Box textAlign='center' style={{ marginTop: 10, marginBottom: 10 }}>
              <input type='file' />
            </Box>
          </Typography>


          <Box textAlign='center' style={{ marginTop: 10 }}>
            <Button variant='contained'>
              Update
            </Button>
          </Box>
        </Box>
      </Modal>
      {commentsList != [] && commentsList.map((c) => (
          <Comment key={c.id} data= {data} comment={c} postAuthorId = {postAuthorId} />
        ))}
      <AddComment authorId={postAuthorId} postId={postId}/>
    </div>
  );
}
