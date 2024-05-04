import { ImageService } from "./imageServis.js";
import HttpError from "../helpers/HttpError.js";

export const updateAvatarService = async (userData, user, file) => {
  if (file === null || file === undefined) {
    throw HttpError(400);
  }
  user.avatarURL = await ImageService.saveImage(
    file,
    {
      maxFileSize: 5,
      width: 200,
      height: 200,
    },
    "avatars"
  );

  Object.keys(userData).forEach((key) => {
    user[key] = userData[key];
  });
  return user.save();
};

export const checkAndUpdatePassword = async (
  userId,
  currentPasswd,
  newPasswd
) => {
  const currentUser = await User.findById(userId).select("+password");

  const passwordIsValid = await currentUser.checkUserPassword(
    currentPasswd,
    currentUser.password
  );

  if (!passwordIsValid) throw new HttpError(401, "Current password invalid!");

  currentUser.password = newPasswd;

  await currentUser.save();
};
