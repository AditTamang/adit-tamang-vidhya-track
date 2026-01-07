import { apiCall } from './api';

// Simple helper for API calls
const makeRequest = async (endpoint: string, options?: RequestInit) => {
    const response = await apiCall(endpoint, options);
    const data = await response.json();
    if (!response.ok) {
        throw new Error(data.message || 'Request failed');
    }
    return await data;
};

export const getDashboardStats = async () => {
    return await makeRequest('/api/admin/stats');
};

export const getAllUsers = async (page = 1, limit = 10) => {
    return await makeRequest(`/api/admin/users?page=${page}&limit=${limit}`);
};

export const getPendingUsers = async () => {
    return await makeRequest('/api/admin/pending-users');
};

export const approveUser = async (userId: number) => {
    return await makeRequest(`/api/admin/approve-user/${userId}`, { method: 'POST' });
};

export const rejectUser = async (userId: number) => {
    return await makeRequest(`/api/admin/reject-user/${userId}`, { method: 'POST' });
};

export const updateUserRole = async (userId: number, role: string) => {
    return await makeRequest(`/api/admin/update-role/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ role })
    });
};

export const getPendingLinks = async () => {
    return await makeRequest('/api/admin/parent-student-links');
};

export const approveLink = async (linkId: number) => {
    return await makeRequest(`/api/admin/approve-link/${linkId}`, { method: 'POST' });
};

export const rejectLink = async (linkId: number) => {
    return await makeRequest(`/api/admin/reject-link/${linkId}`, { method: 'POST' });
};

export const getClassesSections = async () => {
    return await makeRequest('/api/admin/classes-sections');
};

export const updateTeacherClasses = async (teacherId: number, sectionIds: number[]) => {
    return await makeRequest('/api/admin/update-teacher-classes', {
        method: 'POST',
        body: JSON.stringify({ teacherId, sectionIds })
    });
};

export const toggleUserStatus = async (userId: number) => {
    return await makeRequest(`/api/admin/toggle-status/${userId}`, { method: 'PATCH' });
};

export const getAuditLogs = async (page = 1, limit = 20) => {
    return await makeRequest(`/api/admin/audit-logs?page=${page}&limit=${limit}`);
};
