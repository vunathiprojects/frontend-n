/**
 * API Configuration for NOVYA Learning Platform
 * 
 * This app uses a microservices architecture with two backends:
 * 1. Django Backend (LMS_BACK) - Database operations, auth, courses, progress
 * 2. FastAPI Backend (AI_BACKEND) - AI features (quiz generation, chatbot, study plans)
 */

// Backend URLs - Both pointing to Azure
const DJANGO_BASE_URL = process.env.REACT_APP_DJANGO_URL || 'https://backend-n.azurewebsites.net/api';
const FASTAPI_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'https://backend-n.azurewebsites.net';

/**
 * API Endpoints Configuration
 */
export const API_CONFIG = {
  // ============================================
  // DJANGO BACKEND - Database & Core Features
  // ============================================
  DJANGO: {
    BASE_URL: DJANGO_BASE_URL,
    
    // Authentication
    AUTH: {
      LOGIN: `${DJANGO_BASE_URL}/auth/login/`,
      REGISTER: `${DJANGO_BASE_URL}/auth/register/`,
      LOGOUT: `${DJANGO_BASE_URL}/auth/logout/`,
      REFRESH_TOKEN: `${DJANGO_BASE_URL}/auth/token/refresh/`,
      USER_PROFILE: `${DJANGO_BASE_URL}/auth/profile/`,
      PROFILE_UPDATE: `${DJANGO_BASE_URL}/auth/profile/update/`,
      CHILD_PROFILE: `${DJANGO_BASE_URL}/auth/child-profile/`,
      PARENT_PROFILE: `${DJANGO_BASE_URL}/auth/parent-profile/`,
    },
    
    // Courses
    COURSES: {
      LIST: `${DJANGO_BASE_URL}/courses/`,
      DETAIL: (id) => `${DJANGO_BASE_URL}/courses/${id}/`,
      ENROLL: (id) => `${DJANGO_BASE_URL}/courses/${id}/enroll/`,
      MY_COURSES: `${DJANGO_BASE_URL}/courses/my-courses/`,
    },
    
    // Quizzes (Database-based)
    QUIZZES: {
      LIST: `${DJANGO_BASE_URL}/quizzes/`,
      DETAIL: (id) => `${DJANGO_BASE_URL}/quizzes/${id}/`,
      START: (id) => `${DJANGO_BASE_URL}/quizzes/${id}/start/`,
      SUBMIT: (id) => `${DJANGO_BASE_URL}/quizzes/${id}/submit/`,
      MY_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/my-attempts/`,
      STATS: `${DJANGO_BASE_URL}/quizzes/stats/`,
      
      // NEW: Enhanced Quiz Tracking System
      SUBMIT_ATTEMPT: `${DJANGO_BASE_URL}/quizzes/submit-attempt/`,
      RECENT_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/recent-attempts/`,
      CHILD_ATTEMPTS: `${DJANGO_BASE_URL}/quizzes/child-attempts/`,
      PERFORMANCE: `${DJANGO_BASE_URL}/quizzes/performance/`,
      STATISTICS: `${DJANGO_BASE_URL}/quizzes/statistics/`,
      
      // Static Quizzes
      STATIC_SUBJECTS: `${DJANGO_BASE_URL}/quizzes/static/subjects/`,
      STATIC_TOPICS: (subject) => `${DJANGO_BASE_URL}/quizzes/static/subjects/${subject}/topics/`,
      STATIC_QUIZ: (subject, topic) => `${DJANGO_BASE_URL}/quizzes/static/subjects/${subject}/topics/${topic}/`,
      
      // PDF Quizzes
      PDF_STRUCTURE: `${DJANGO_BASE_URL}/quizzes/pdf/structure/`,
      PDF_SUBJECTS: (className) => `${DJANGO_BASE_URL}/quizzes/pdf/${className}/subjects/`,
      PDF_TOPICS: (className, subject) => `${DJANGO_BASE_URL}/quizzes/pdf/${className}/${subject}/topics/`,
    },
    
    // Progress Tracking
    PROGRESS: {
      OVERVIEW: `${DJANGO_BASE_URL}/progress/`,
      BY_COURSE: (courseId) => `${DJANGO_BASE_URL}/progress/course/${courseId}/`,
      UPDATE: `${DJANGO_BASE_URL}/progress/update/`,
    },
    
    // Notifications
    NOTIFICATIONS: {
      LIST: `${DJANGO_BASE_URL}/notifications/`,
      MARK_READ: (id) => `${DJANGO_BASE_URL}/notifications/${id}/mark-read/`,
      MARK_ALL_READ: `${DJANGO_BASE_URL}/notifications/mark-all-read/`,
    },
    
    // AI Assistant - Database Operations
    AI_ASSISTANT: {
      // Save endpoints
      SAVE_STUDY_PLAN: `${DJANGO_BASE_URL}/ai-assistant/save-study-plan/`,
      SAVE_AI_NOTE: `${DJANGO_BASE_URL}/ai-assistant/save-ai-note/`,
      SAVE_MANUAL_NOTE: `${DJANGO_BASE_URL}/ai-assistant/save-manual-note/`,
      SAVE_CHAT_MESSAGE: `${DJANGO_BASE_URL}/ai-assistant/save-chat-message/`,
      
      // Get endpoints
      GET_STUDY_PLANS: `${DJANGO_BASE_URL}/ai-assistant/study-plans/`,
      GET_AI_NOTES: `${DJANGO_BASE_URL}/ai-assistant/ai-notes/`,
      GET_MANUAL_NOTES: `${DJANGO_BASE_URL}/ai-assistant/manual-notes/`,
      GET_CHAT_HISTORY: `${DJANGO_BASE_URL}/ai-assistant/chat-history/`,
      GET_ALL_NOTES: `${DJANGO_BASE_URL}/ai-assistant/all-notes/`,
      
      // Update/Delete endpoints
      UPDATE_MANUAL_NOTE: (noteId) => `${DJANGO_BASE_URL}/ai-assistant/manual-notes/${noteId}/`,
      DELETE_MANUAL_NOTE: (noteId) => `${DJANGO_BASE_URL}/ai-assistant/manual-notes/${noteId}/delete/`,
      
      // Favorites endpoints
      TOGGLE_FAVORITE: `${DJANGO_BASE_URL}/ai-assistant/toggle-favorite/`,
      GET_FAVORITES: `${DJANGO_BASE_URL}/ai-assistant/favorites/`,
    },
  },
  
  // ============================================
  // FASTAPI BACKEND - AI Features
  // ============================================
  FASTAPI: {
    BASE_URL: FASTAPI_BASE_URL,
    
    // Quick Practice (AI-Generated Quizzes) - CORRECTED ENDPOINTS
    QUICK_PRACTICE: {
      GET_CLASSES: `${FASTAPI_BASE_URL}/quick-practice`,
      GET_CHAPTERS: (className) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}`,
      GET_SUBTOPICS: (className, subject) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}/${encodeURIComponent(subject)}`,
      GENERATE_QUIZ: (params) => {
        const { subtopic, currentLevel, retry, language } = params;
        return `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(subtopic)}/${currentLevel}?retry=${retry}&language=${language}`;
      },
    },
    
    // Mock Tests (AI-Generated) - CORRECTED ENDPOINTS
    MOCK_TEST: {
      GET_CLASSES: `${FASTAPI_BASE_URL}/quick-practice`,
      GET_SUBJECTS: (className) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}`,
      GET_CHAPTERS: (className, subject) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}/${encodeURIComponent(subject)}`,
      GENERATE_TEST: (params) => {
        const { subtopic, currentLevel, retry, language } = params;
        return `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(subtopic)}/${currentLevel}?retry=${retry}&language=${language}`;
      },
    },
    
    // AI Assistant
    AI_ASSISTANT: {
      CHAT: `${FASTAPI_BASE_URL}/ai-assistant/chat`,
      GENERATE_STUDY_PLAN: `${FASTAPI_BASE_URL}/ai-assistant/generate-study-plan`,
      GENERATE_NOTES: `${FASTAPI_BASE_URL}/ai-assistant/generate-notes`,
    },
  },
};

/**
 * Helper function to get auth headers
 */
export const getAuthHeaders = () => {
  const token = localStorage.getItem('userToken');
  
  // Check if token is valid (basic check - not expired format)
  if (token && token.includes('.')) {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      if (payload.exp && payload.exp < now) {
        console.log('Token is expired, clearing authentication data');
        clearAuthData();
        return { 'Content-Type': 'application/json' };
      }
    } catch (e) {
      console.log('Invalid token format, clearing authentication data');
      clearAuthData();
      return { 'Content-Type': 'application/json' };
    }
  }
  
  return token ? {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  } : {
    'Content-Type': 'application/json',
  };
};

// Clear all authentication data
export const clearAuthData = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('userRole');
  localStorage.removeItem('username');
  localStorage.removeItem('userId');
  localStorage.removeItem('userEmail');
  localStorage.removeItem('firstName');
  localStorage.removeItem('studentData');
  localStorage.removeItem('parentData');
  localStorage.removeItem('studentDataLastFetch');
  localStorage.removeItem('parentDataLastFetch');
};

/**
 * Helper function to get headers without auth (for registration)
 */
export const getNoAuthHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

/**
 * Helper function for Django API calls
 */
export const djangoAPI = {
  get: async (url) => {
    console.log('🔍 Django API GET:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Django API Error:', response.status, errorText);
      
      // If 401 Unauthorized, clear authentication data
      if (response.status === 401) {
        clearAuthData();
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ Django API Response:', data);
    return data;
  },
  
  post: async (url, data) => {
    console.log('🔍 Django API POST:', url, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Django API Error:', response.status, errorText);
      
      // If 401 Unauthorized, clear authentication data
      if (response.status === 401) {
        clearAuthData();
      }
      
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Django API Response:', responseData);
    return responseData;
  },
  
  // Special method for registration (no auth needed)
  postNoAuth: async (url, data) => {
    console.log('🔍 Django API POST (No Auth):', url, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: getNoAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Django API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Django API Response:', responseData);
    return responseData;
  },
  
  put: async (url, data) => {
    console.log('🔍 Django API PUT:', url, data);

    const response = await fetch(url, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Django API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ Django API Response:', responseData);
    return responseData;
  },
  
  delete: async (url) => {
    console.log('🔍 Django API DELETE:', url);
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Django API Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    // For DELETE, return success message if no content
    if (response.status === 204) {
      return { success: true, message: 'Deleted successfully' };
    }
    
    return await response.json();
  },
};

/**
 * Quiz Tracking API Functions
 */
export const quizTrackingAPI = {
  // Submit quiz attempt
  submitAttempt: async (quizData) => {
    return await djangoAPI.post(API_CONFIG.DJANGO.QUIZZES.SUBMIT_ATTEMPT, quizData);
  },
  
  // Get recent quiz attempts
  getRecentAttempts: async (limit = 10) => {
    const url = `${API_CONFIG.DJANGO.QUIZZES.RECENT_ATTEMPTS}?limit=${limit}`;
    return await djangoAPI.get(url);
  },
  
  // Get student performance
  getPerformance: async () => {
    return await djangoAPI.get(API_CONFIG.DJANGO.QUIZZES.PERFORMANCE);
  },
  
  // Get detailed statistics
  getStatistics: async () => {
    return await djangoAPI.get(API_CONFIG.DJANGO.QUIZZES.STATISTICS);
  },
};

/**
 * Helper function for FastAPI calls (no auth needed)
 */
export const fastAPI = {
  get: async (url) => {
    console.log('🔍 FastAPI GET:', url);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FastAPI Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ FastAPI Response:', data);
    return data;
  },
  
  post: async (url, data) => {
    console.log('🔍 FastAPI POST:', url, data);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ FastAPI Error:', response.status, errorText);
      throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
    }
    
    const responseData = await response.json();
    console.log('✅ FastAPI Response:', responseData);
    return responseData;
  },
};

export default API_CONFIG;
