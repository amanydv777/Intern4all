import api from './api';

// Get all internships
export const getInternships = async (params = {}) => {
  try {
    const response = await api.get('/internships', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get internships' };
  }
};

// Get single internship
export const getInternship = async (internshipId) => {
  try {
    const response = await api.get(`/internships/${internshipId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get internship' };
  }
};

// Get single internship (public - no auth required)
export const getInternshipPublic = async (internshipId) => {
  try {
    const response = await api.get(`/internships/${internshipId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get internship' };
  }
};

// Create internship (Admin/Company only)
export const createInternship = async (internshipData) => {
  try {
    const response = await api.post('/internships', internshipData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create internship' };
  }
};

// Update internship (Admin/Company only)
export const updateInternship = async (internshipId, internshipData) => {
  try {
    const response = await api.put(`/internships/${internshipId}`, internshipData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update internship' };
  }
};

// Delete internship (Admin/Company only)
export const deleteInternship = async (internshipId) => {
  try {
    const response = await api.delete(`/internships/${internshipId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete internship' };
  }
};

// Get AI-recommended internships
export const getRecommendations = async () => {
  try {
    const response = await api.get('/internships/recommendations/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get recommendations' };
  }
};

// Search internships
export const searchInternships = async (searchQuery, filters = {}) => {
  try {
    const params = {
      search: searchQuery,
      ...filters,
    };
    const response = await api.get('/internships', { params });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search internships' };
  }
};

// Get applications for an internship (Admin/Recruiter only)
export const getInternshipApplications = async (internshipId) => {
  try {
    const response = await api.get(`/internships/${internshipId}/applications`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to get applications' };
  }
};

// Get recruiter's postings
export const getMyPostings = async () => {
  try {
    const response = await api.get('/internships/my-postings/all');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch postings' };
  }
};

// Get recruiter stats
export const getRecruiterStats = async () => {
  try {
    const response = await api.get('/internships/recruiter-stats/dashboard');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch stats' };
  }
};
