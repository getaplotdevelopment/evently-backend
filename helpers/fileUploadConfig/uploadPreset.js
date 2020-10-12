import { cloudinary } from '../../utils/cloudinary';

const cloudinaryUploadPresetHelper = async (image, folder) => {
  const uploadedResponse = await cloudinary.uploader.upload(image, {
    upload_preset: folder
  });
  return uploadedResponse;
};

export default cloudinaryUploadPresetHelper;
