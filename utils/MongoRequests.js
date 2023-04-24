import User from "../models/User.js";
import Meme from "../models/Memes.js";

export async function createUser(username, userId, isAdmin) {
  const user = new User({
    username,
    userId,
    isAdmin,
  });

  const result = await user.save();
  return result;
}

export async function createMemes(user, isApproved, fileId) {
  const meme = new Meme({
    user,
    isApproved,
    fileId,
  });

  const result = await meme.save();
  return result;
}

export async function findUser(userId) {
  const foundedUser = await User.findOne({ userId: userId }).exec();

  return foundedUser;
}
