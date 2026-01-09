import {
  createStudentService,
  getStudentByIdService,
  getStudentsBySectionService,
} from "../services/studentService.js";

export const createStudentController = async (req, res) => {
  try {
    const { userId, className, section } = req.body;
    const student = await createStudentService(userId, className, section);
    res
      .status(201)
      .json({ status: 201, message: "Student created", data: student });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
};

export const getStudentController = async (req, res) => {
  try {
    const student = await getStudentByIdService(req.params.id);
    if (!student)
      return res
        .status(404)
        .json({ status: 404, message: "Student not found" });
    res
      .status(200)
      .json({ status: 200, message: "Student fetched", data: student });
  } catch (err) {
    res.status(400).json({ status: 400, message: err.message });
  }
};

export const getStudentsBySectionController = async (req, res) => {
  try {
    const { sectionId } = req.params;
    const students = await getStudentsBySectionService(sectionId);
    res.status(200).json({ status: 200, data: students });
  } catch (err) {
    res.status(500).json({ status: 500, message: err.message });
  }
};
