import {
  requestLinkService,
  approveLinkService,
  getLinkedStudentsService,
} from "../services/parentStudentService.js";

export const requestLinkController = async (req, res, next) => {
  try {
    const { studentId } = req.body;
    const parentId = req.user.id;
    const result = await requestLinkService(parentId, studentId);
    res.status(201).json({
      status: 201,
      message: "Link request sent",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const approveLinkController = async (req, res, next) => {
  try {
    const { parentId, studentId } = req.body;
    const result = await approveLinkService(parentId, studentId);
    res.status(200).json({
      status: 200,
      message: "Parent linked successfully",
      data: result,
    });
  } catch (err) {
    next(err);
  }
};

export const getLinkedStudentsController = async (req, res, next) => {
  try {
    const parentId = req.user.id;
    const students = await getLinkedStudentsService(parentId);
    res.status(200).json({
      status: 200,
      message: "Linked students fetched",
      data: students,
    });
  } catch (err) {
    next(err);
  }
};
