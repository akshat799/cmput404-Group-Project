import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../pages/Inbox/Inbox.css";

function LikesTile({ notif }) {
  const [post, setPost] = useState();
  const state = useSelector((state) => state);

  useEffect(() => {
    if (notif.object.split("/").reverse()[1] == "posts") {
      const postId = notif.object.split("/").reverse()[0];
      const liked = state.userposts.posts.filter(
        (post) => post.id.split("/").reverse()[0] == postId
      );
      setPost(liked[0]);
    } else {
      console.log(notif.object.split("/").reverse()[1]);
    }
  }, []);

  return (
    <div class="notiContainer">
      <main>
        <div class="notif_card read">
          <img src={notif.author.profileImage} alt="avatar" className="img" />
          <div class="description">
            <p class="user_activity">
              {notif.summary} {post?.title}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default LikesTile;
