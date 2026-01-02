import { apiCall } from './api';

// Helper to make requests and parse JSON
const makeRequest = async (endpoint: string, options?: RequestInit) => {
    const response = await apiCall(endpoint, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return data;
};

// Get dashboard stats
export const getDashboardStats = async () => {
    return await makeRequest('/api/admin/stats');
};

// Get all users
export const getAllUsers = async (page = 1, limit = 10) => {
    return await makeRequest(`/api/admin/users?page=${page}&limit=${limit}`);
};

// Get pending users
export const getPendingUsers = async () => {
    return await makeRequest('/api/admin/pending-users');
};

// Approve user
export const approveUser = async (userId: number) => {
    return await makeRequest(`/api/admin/approve-user/${userId}`, {
        method: 'POST'
    });
};

// Reject user
export const rejectUser = async (userId: number) => {
    return await makeRequest(`/api/admin/reject-user/${userId}`, {
        method: 'POST'
    });
};

// Update user role
export const updateUserRole = async (userId: number, role: string) => {
    return await makeRequest(`/api/admin/update-role/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    });
};

// Get pending parent-student links
export const getPendingLinks = async () => {
    return await makeRequest('/api/admin/parent-student-links');
};

// Approve parent-student link
export const approveLink = async (linkId: number) => {
    return await makeRequest(`/api/admin/approve-link/${linkId}`, {
        method: 'POST'
    });
};

// Reject parent-student link
export const rejectLink = async (linkId: number) => {
    return await makeRequest(`/api/admin/reject-link/${linkId}`, {
        method: 'POST'
    });
};

// Get all classes and sections
export const getClassesSections = async () => {
    return await makeRequest('/api/admin/classes-sections');
};

// Update teacher's class assignments (Bulk)
export const updateTeacherClasses = async (teacherId: number, sectionIds: number[]) => {
    return await makeRequest('/api/admin/update-teacher-classes', {
        method: 'POST',
        body: JSON.stringify({ teacherId, sectionIds })
    });
};

// Toggle user active status (activate/deactivate)
export const toggleUserStatus = async (userId: number) => {
    return await makeRequest(`/api/admin/toggle-status/${userId}`, {
        method: 'PATCH'
    });
};

// Get audit logs (with pagination)
export const getAuditLogs = async (page = 1, limit = 20) => {
    return await makeRequest(`/api/admin/audit-logs?page=${page}&limit=${limit}`);
};
