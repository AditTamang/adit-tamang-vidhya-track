import {
  requestLinkService,
  approveLinkService,
  getLinkedStudentsService,
} from "../services/parentStudentService.js";

export const requestLinkController = async (req, res) => {
  try {
    const parentId = req.user.id;
    const { studentId } = req.body;

    if (!studentId) {
      return res
        .status(400)
        .json({ status: 400, message: "studentId is required" });
    }

    const result = await requestLinkService(parentId, studentId);

    res.status(201).json({
      status: 201,
      message: "Link request sent",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
};

export const approveLinkController = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { parentId, studentId } = req.body;
    const result = await approveLinkService(parentId, studentId, adminId);
    res.status(200).json({
      status: 200,
      message: "Parent linked successfully",
      data: result,
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
};

export const getLinkedStudentsController = async (req, res) => {
  try {
    const parentId = req.user.id;
    const students = await getLinkedStudentsService(parentId);
    res.status(200).json({
      status: 200,
      message: "Linked students fetched",
      data: students,
    });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
};
