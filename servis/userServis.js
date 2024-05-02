import { ImageService } from './imageServis.js';

export const updateAvatarService = async (userData, user, file) => {
  if (file) {
    user.avatarURL = await ImageService.saveImage(
      file,
      {
        maxFileSize: 5,
        width: 200,
        height: 200,
      },
      'avatars'
    );
  }
  Object.keys(userData).forEach(key => {
    user[key] = userData[key];
  });
  return user.save();
};
