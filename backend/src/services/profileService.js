import { updateProfileModel } from "../models/profileModel.js";

export const updateProfileService = async (userId, name, phone_number) => {
  return await updateProfileModel(userId, name, phone_number);
};
