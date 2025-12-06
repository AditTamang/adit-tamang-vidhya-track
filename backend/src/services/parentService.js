import {
  requestLink,
  approveLinkModel,
  getLinkedStudents,
} from "../models/parentStudentModel.js";
import { getUserByIdService } from "../services/userService.js";

export const requestParentStudentLink = async (parentId, studentId) => {
  const student = await getUserByIdService(studentId);
  if (!student) throw new Error("Student not found");

  const parent = await getUserByIdService(parentId);
  if (!parent) throw new Error("Parent not found");

  return await requestLink(parentId, studentId);
};

export const approveLink = async (parentId, studentId) => {
  return await approveLinkModel(parentId, studentId);
};

export const listLinkedStudents = async (parentId) => {
  return await getLinkedStudents(parentId);
};
