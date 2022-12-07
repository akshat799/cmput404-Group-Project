import { useEffect, useState } from "react";
import { denyRequest, followUser } from "../features/notifications";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { addNewFollower, checkIfFollower } from "../features/auth";

function FollowerButtons({ req, i }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isFollower, setFollower] = useState(true);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  const checkFollower = async () => {
    const res = await dispatch(
      checkIfFollower(req.actor.id, state.auth.author.id)
    );
    if (res.data.split(" ")[1] == "NOT") setFollower(false);
  };

  useEffect(() => {
    checkFollower();
  }, []);

  return (
    <>
      {!isAccepted ? (
        <div>
          <Button
            variant="contained"
            style={{ marginRight: "1rem" }}
            onClick={async () => {
              const res = await dispatch(
                addNewFollower(state.auth.author.id, req.actor, i)
              );
              if (res?.status == 201) {
                if (!isFollower) setIsAccepted(true);
                else dispatch(denyRequest(i));
              }
            }}
          >
            {" "}
            Accept{" "}
          </Button>
          <Button variant="contained" onClick={() => dispatch(denyRequest(i))}>
            {" "}
            Deny{" "}
          </Button>
        </div>
      ) : (
        <div>
          <Button
            variant="contained"
            style={{ marginRight: "1rem" }}
            onClick={() => {
              dispatch(
                followUser(req.actor.id, i, {
                  type: "follow",
                  object: state.auth.author.url,
                })
              );
              setIsAccepted(false);
            }}
          >
            {" "}
            Follow Back{" "}
          </Button>
          <Button variant="contained" onClick={() => dispatch(denyRequest(i))}>
            {" "}
            Deny{" "}
          </Button>
        </div>
      )}
    </>
  );
}

export default FollowerButtons;
