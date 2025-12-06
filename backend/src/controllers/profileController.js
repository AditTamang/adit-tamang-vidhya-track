import { updateProfileService } from "../services/profileService.js";

export const updateProfileController = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name, phone } = req.body;
    const updatedUser = await updateProfileService(userId, name, phone);

    res.status(200).json({
      status: 200,
      message: "Profile updated successfully",
      data: updatedUser,
    });
  } catch (err) {
    next(err);
  }
};
