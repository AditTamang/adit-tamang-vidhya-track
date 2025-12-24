import {
  createUserService,
  deleteUserService,
  getAllUsersService,
  getUserByIdService,
  updateUserService,
} from "../services/userService.js";

const sendResponse = (res, status, message, data = null) => {
  res.status(status).json({ status, message, data });
};

// Create User
export const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status, phone_number } = req.body;
    const newUser = await createUserService({
      name,
      email,
      password,
      role,
      status,
      phone_number,
    });
    sendResponse(res, 201, "User created successfully", newUser);
  } catch (err) {
    next(err);
  }
};

// Get All Users
export const getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { users, total } = await getAllUsersService(limit, offset);
    
    sendResponse(res, 200, "Users retrieved successfully", {
        users,
        meta: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        }
    });
  } catch (err) {
    next(err);
  }
};

// Get User By ID
export const getUserById = async (req, res, next) => {
  try {
    const user = await getUserByIdService(req.params.id);
    if (!user) return sendResponse(res, 404, "User not found");
    sendResponse(res, 200, "User retrieved successfully", user);
  } catch (err) {
    next(err);
  }
};

// Update User
export const updateUser = async (req, res, next) => {
  try {
    const { name, email, password, role, status, phone_number } = req.body;
    const updatedUser = await updateUserService(req.params.id, {
      name,
      email,
      password,
      role,
      status,
      phone_number,
    });
    if (!updatedUser) return sendResponse(res, 404, "User not found");
    sendResponse(res, 200, "User updated successfully", updatedUser);
  } catch (err) {
    next(err);
  }
};

// Delete User
export const deleteUser = async (req, res, next) => {
  try {
    const deletedUser = await deleteUserService(req.params.id);
    if (!deletedUser) return sendResponse(res, 404, "User not found");
    sendResponse(res, 200, "User deleted successfully", deletedUser);
  } catch (err) {
    next(err);
  }
};
