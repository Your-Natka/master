import { ImageService } from '../servis/imageServis.js';

export const uploadAvatar = ImageService.initUploadImageMiddleware('avatar');
