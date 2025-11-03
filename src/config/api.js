/**
 * API Configuration for NOVYA Learning Platform
 * 
 * This app uses a microservices architecture with two backends:
 * 1. Django Backend (LMS_BACK) - Database operations, auth, courses, progress
 * 2. FastAPI Backend (AI_BACKEND) - AI features (quiz generation, chatbot, study plans)
 */

// Backend URLs - Updated based on backend structure
const DJANGO_BASE_URL = process.env.REACT_APP_DJANGO_URL || 'https://backend-n.azurewebsites.net/api';
const FASTAPI_BASE_URL = process.env.REACT_APP_FASTAPI_URL || 'https://backend-n.azurewebsites.net/ai';

// Debug logging
console.log('🚀 API Config Loaded:');
console.log('Django URL:', DJANGO_BASE_URL);
console.log('FastAPI URL:', FASTAPI_BASE_URL);
console.log('Quick Practice Endpoint:', `${FASTAPI_BASE_URL}/quick-practice`);
console.log('Environment Django URL:', process.env.REACT_APP_DJANGO_URL);
console.log('Environment FastAPI URL:', process.env.REACT_APP_FASTAPI_URL);

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
    
    // Quick Practice (AI-Generated Quizzes) - UPDATED ENDPOINTS
    QUICK_PRACTICE: {
      GET_CLASSES: `${FASTAPI_BASE_URL}/quick-practice`,
      GET_CHAPTERS: (className) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}`,
      GET_SUBTOPICS: (className, subject) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}/${encodeURIComponent(subject)}`,
      GENERATE_QUIZ: (params) => {
        const { subtopic, currentLevel, retry, language } = params;
        return `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(subtopic)}/${currentLevel}?retry=${retry}&language=${language}`;
      },
    },
    
    // Mock Tests (AI-Generated) - UPDATED ENDPOINTS
    MOCK_TEST: {
      GET_CLASSES: `${FASTAPI_BASE_URL}/quick-practice`,
      GET_SUBJECTS: (className) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}`,
      GET_CHAPTERS: (className, subject) => `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(className)}/${encodeURIComponent(subject)}`,
      GENERATE_TEST: (params) => {
        const { subtopic, currentLevel, retry, language } = params;
        return `${FASTAPI_BASE_URL}/quick-practice/${encodeURIComponent(subtopic)}/${currentLevel}?retry=${retry}&language=${language}`;
      },
    },
    
    // AI Assistant - UPDATED ENDPOINTS
    AI_ASSISTANT: {
      CHAT: `${FASTAPI_BASE_URL}/ai-assistant/chat`,
      GENERATE_STUDY_PLAN: `${FASTAPI_BASE_URL}/ai-assistant/generate-study-plan`,
      GENERATE_NOTES: `${FASTAPI_BASE_URL}/ai-assistant/generate-notes`,
    },
  },
};

// ... rest of the file remains the same (getAuthHeaders, djangoAPI, fastAPI, etc.)
