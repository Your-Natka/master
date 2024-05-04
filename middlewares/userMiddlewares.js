import { catchAsync } from "../helpers/catchAsync.js";
import { checkAndUpdatePassword } from "../servis/userServis.js";

export const checkAndUpdateMyPassword = catchAsync(async (req, res, next) => {
  // current password, new password
  const { currentPasswd, newPasswd } = req.body;

  await checkAndUpdatePassword(req.user.id, currentPasswd, newPasswd);

  next();
});
