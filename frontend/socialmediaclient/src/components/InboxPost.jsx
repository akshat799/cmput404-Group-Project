import "./Post.css";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import "./InboxPost.css";


export default function Post({ post }) {

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
    </div>
  );
}
