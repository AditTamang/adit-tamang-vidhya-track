import {
  createLinkRequest,
  approveLink,
  getLinkedStudents,
} from "../models/parentStudentModel.js";

export const requestLinkService = async (parentId, studentId) => {
  return await createLinkRequest(parentId, studentId);
};

export const approveLinkService = async (parentId, studentId) => {
  return await approveLink(parentId, studentId);
};

export const getLinkedStudentsService = async (parentId) => {
  return await getLinkedStudents(parentId);
};
