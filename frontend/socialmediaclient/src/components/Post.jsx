import "./Post.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { useEffect, useState } from "react";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import AddComment from "./AddComment";
import Comment from "./Comment";
import "./Post.css";
// import { getPostLikes } from "../features/posts";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { sendLikeOnPost } from "../features/posts";


export default function Post({ post }) {
  const state = useSelector((state) => state);
  const dispatch = useDispatch();

  const authorId = post.author;
  // const postId = post.id;

  // const getLikeCount = async() => {
  //   await dispatch(getPostLikes(authorId,postId))
  // }

  const [isLiked, setIsLiked] = useState(false);

  const likeHandler = async() => {

    const data = {
      "at_context": "https://www.w3.org/ns/activitystreams",
      "type": "Like",
      "summary": state.auth.author.displayName + " likes your post",
      "author" : state.auth.author.id,
      "post" : post.id
    }
    console.log(data)
    const resp = await dispatch(sendLikeOnPost(authorId, data))
    if (resp?.status == 200){
      setIsLiked(true)
    }        
    // setLike(isLiked ? like - 1 : like + 1);
    // setIsLiked(!isLiked);
  };

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
          <ThumbUpIcon className="likes" style= {{ color: isLiked? 'blue': 'gray'}} onClick={likeHandler} />
        </div>
        <div className="postBottomRight">
          <span className="postCommentText">{post.count} Comments</span>
        </div>
      </div>
      {/* {state.posts.posts.commentsSrc.comments != [] && state.posts.posts.commentsSrc.comments.map((c) => (
          <Comment key={c.id} comment={c} />
        ))} */}
      <AddComment />
    </div>
  );
}
