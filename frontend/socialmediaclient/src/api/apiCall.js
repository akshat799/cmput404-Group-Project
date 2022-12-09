import * as api from "./index";

export const acceptRequest = async (author_id, foreign_author_id) => {
  try {
    const res = await api.addFollower(author_id, foreign_author_id);
    console.log(res);
  } catch (e) {
    console.log(e);
  }
};
