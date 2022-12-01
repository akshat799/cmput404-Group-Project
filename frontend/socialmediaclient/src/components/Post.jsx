import "./Post.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddComment from "./AddComment";
import Comment from "./Comment";
import "./Post.css";
import { getPostLikes } from "../features/posts";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";

export default function Post({ post }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const authorId = state.auth.author.id;
  const postId = post.id;

  const getLikeCount = async() => {
    await dispatch(getPostLikes(authorId,postId))
  }
  const [like, setLike] = useState(post.like);
  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = () => {
    setLike(isLiked ? like - 1 : like + 1);
    setIsLiked(!isLiked);
  };

  useEffect(() => {
    getLikeCount();
  }, [])

  return (
    <div className="post">
      <div className="postTop">
        <div className="postTopLeft">
          {/* <img
            className="postProfileImg"
            src={post.author.profileImage}
            alt=""
          /> */}
          <span className="postUsername">
            {/* {post.author.displayName} */}
            
          </span>
        </div>
        <div className="postTopRight">
          <MoreHorizIcon />
        </div>
      </div>
      <div className="postCenter">
        <span className="postText">{post?.title}</span>
        <img className="postImg" src={post?.img} alt="" />
        <span className="postText">{post?.description}</span>
      </div>
      <div className="postBottom">
        <div className="postBottomLeft">
          <ThumbUpIcon className="likes" onClick={likeHandler} />
          <span style={{color: "gray"}}> {state.posts.postLikeCount}</span>
        </div>
        <div className="postBottomRight">
          <span className="postCommentText">{post.count} Comments</span>
        </div>
      </div>
      <Comment />
      <AddComment />
    </div>
  );
}
