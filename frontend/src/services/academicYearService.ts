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

// Get all academic years
export const getAllAcademicYears = async () => {
    return await makeRequest('/api/academic-years');
};

// Get active academic year
export const getActiveAcademicYear = async () => {
    return await makeRequest('/api/academic-years/active');
};

// Create academic year
export const createAcademicYear = async (name: string, startDate: string, endDate: string) => {
    return await makeRequest('/api/academic-years', {
        method: 'POST',
        body: JSON.stringify({ name, start_date: startDate, end_date: endDate })
    });
};

// Update academic year
export const updateAcademicYear = async (id: number, name: string, startDate: string, endDate: string) => {
    return await makeRequest(`/api/academic-years/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ name, start_date: startDate, end_date: endDate })
    });
};

// Set active academic year
export const setActiveAcademicYear = async (id: number) => {
    return await makeRequest(`/api/academic-years/${id}/activate`, {
        method: 'PATCH'
    });
};

// Delete academic year
export const deleteAcademicYear = async (id: number) => {
    return await makeRequest(`/api/academic-years/${id}`, {
        method: 'DELETE'
    });
};
