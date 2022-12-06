import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getLiked } from "../../features/notifications";

function Liked() {
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  useEffect(() => {
    dispatch(getLiked(state.auth.author.id));
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <header>
        <div class="notif_box" style={{ textAlign: "center" }}>
          <h1 class="title">
            Things you liked : {state.notifications.liked.length}
          </h1>
        </div>
      </header>
      {state.notifications.liked != [] &&
        state.notifications.liked.map((ob) => {
          return (
            <div class="notiContainer">
              <main>
                <div class="notif_card">
                  <img
                    src={ob.author.profileImage}
                    alt="avatar"
                    className="img"
                  />
                  <div class="description">
                    <p class="user_activity">
                      You liked {ob.author.displayName}'s{" "}
                      {ob.summary.split(" ").reverse()[0]}
                    </p>
                  </div>
                </div>
              </main>
            </div>
          );
        })}
    </div>
  );
}

export default Liked;
