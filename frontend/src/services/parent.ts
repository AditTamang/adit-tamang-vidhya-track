import { apiCall } from './api';

// Get linked students for the authenticated parent
export const fetchLinkedStudents = async () => {
  try {
    const response = await apiCall('/api/parent-student/linked', {
      method: 'GET',
    });

    const result = await response.json();
    
    if (result.status === 200 && result.data) {
      return result.data;
    }
    
    throw new Error(result.message || 'Failed to fetch linked students');
  } catch (error: any) {
    console.error('Error fetching linked students:', error);
    throw error;
  }
};

// Request link to a student (using student code)
export const requestStudentLink = async (studentId: string) => {
  try {
    const response = await apiCall('/api/parent-student/request', {
      method: 'POST',
      body: JSON.stringify({ studentId }),
    });

    const result = await response.json();
    
    if (result.status === 201) {
      return result.data;
    }
    
    throw new Error(result.message || 'Failed to request student link');
  } catch (error: any) {
    console.error('Error requesting student link:', error);
    throw error;
  }
};

// Approve a link request (for students/parents)
// Note: This endpoint may require admin privileges
export const approveLink = async (parentId: string, studentId: string) => {
  try {
    const response = await apiCall('/api/parent-student/approve', {
      method: 'POST',
      body: JSON.stringify({ parentId, studentId }),
    });

    const result = await response.json();
    
    if (result.status === 200) {
      return result.data;
    }
    
    throw new Error(result.message || 'Failed to approve link');
  } catch (error: any) {
    console.error('Error approving link:', error);
    throw error;
  }
};

// Legacy functions for backward compatibility
// These can be replaced with actual API calls when backend endpoints are available
export const fetchStudentSummary = async () => {
  try {
    const students = await fetchLinkedStudents();
    if (students && students.length > 0) {
      const student = students[0]; // Get first linked student
      return {
        id: student.student_id || student.id,
        name: student.student_name || student.name || 'Student',
        grade: student.class || 'N/A',
        section: student.section || 'N/A',
        rollNumber: student.student_code || 'N/A',
      };
    }
    // Return default if no students linked
    return {
      id: "1",
      name: "No student linked",
      grade: "N/A",
      section: "N/A",
      rollNumber: "N/A",
    };
  } catch (error) {
    // Return default on error
    return {
      id: "1",
      name: "Error loading student",
      grade: "N/A",
      section: "N/A",
      rollNumber: "N/A",
    };
  }
};

export const fetchPerformance = async () => {
  // This endpoint doesn't exist in backend yet, returning mock data
  // TODO: Replace with actual API call when backend endpoint is available
  return {
    overallPercentage: 87.5,
    rank: "Top 10%",
    attendance: { present: 171, total: 180 },
    homeworkCompletion: 92,
    pendingHomework: 4,
    behaviorScore: 4.7,
  };
};
