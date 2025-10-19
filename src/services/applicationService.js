import api from './api';

// Get all applications for current user
export const getMyApplications = async () => {
  try {
    const response = await api.get('/applications');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get applications' };
  }
};

// Get single application
export const getApplication = async (applicationId) => {
  try {
    const response = await api.get(`/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get application' };
  }
};

// Create new application
export const createApplication = async (applicationData) => {
  try {
    const response = await api.post('/applications', applicationData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create application' };
  }
};

// Update application status (Admin/Company only)
export const updateApplicationStatus = async (applicationId, statusData) => {
  try {
    const response = await api.put(`/applications/${applicationId}/status`, statusData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update application status' };
  }
};

// Delete application
export const deleteApplication = async (applicationId) => {
  try {
    const response = await api.delete(`/applications/${applicationId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete application' };
  }
};
