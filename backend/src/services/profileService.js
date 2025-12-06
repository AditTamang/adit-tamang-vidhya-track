import { updateProfileModel } from "../models/profileModel.js";

export const updateProfileService = async (userId, name, phone) => {
  return await updateProfileModel(userId, name, phone);
};
