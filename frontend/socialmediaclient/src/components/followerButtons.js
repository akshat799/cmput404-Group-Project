import { useState } from "react";
import {
  addFollower,
  denyRequest,
  followUser,
} from "../features/notifications";
import { Button } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";

function FollowerButtons({ req, i }) {
  const [isAccepted, setIsAccepted] = useState(false);
  const dispatch = useDispatch();
  const state = useSelector((state) => state);

  return (
    <>
      {!isAccepted ? (
        <div>
          <Button
            variant="contained"
            style={{ marginRight: "1rem" }}
            onClick={async () => {
              const res = await dispatch(
                addFollower(state.auth.author.id, req.actor.id, i)
              );
              if (res?.status == 201) {
                setIsAccepted(true);
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
      )}
    </>
  );
}

export default FollowerButtons;
