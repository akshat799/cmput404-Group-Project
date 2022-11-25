
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import { useState } from "react";
import { Users } from "../dummy";
import AddComment from './AddComment';
import Comment from './Comment';
import "./Post.css";

export default function Post({ post }) {
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };


  return (
    <div className="post">
      <div className="postTop">
        <div className="postTopLeft">
          <img
            className="postProfileImg"
            src={Users.filter((u) => u.id === post?.userId)[0].profilePicture}
            alt=""
          />
          <span className="postUsername">
            {Users.filter((u) => u.id === post?.userId)[0].username}
          </span>
        </div>
        <div className="postTopRight">
          <MoreHorizIcon />
        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{post?.desc}</span>
        <img className="postImg" src={post.photo} alt="" />
      </div>

   
      <div className="postBottom">
        <div className="postBottomLeft">
          {!isLiked ? <ThumbUpIcon className="likes" onClick={likeHandler} /> : <ThumbDownIcon className="likes" onClick={likeHandler} />}

          <span className="postLikeCounter">{like} Likes</span>
        </div>
        <div className="postBottomRight">
          <span className="postCommentText">{post.comment} Comments</span>
        </div>
      </div>

      <Comment />
      <AddComment />
     
    </div>

  );
}

