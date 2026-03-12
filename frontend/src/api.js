import axios from 'axios';

// Production-ready API config: uses REACT_APP_API_URL env (Vercel) or '/api' (local proxy)
const api = axios.create({ 
  baseURL: process.env.REACT_APP_API_URL || '/api' 
});

api.interceptors.request.use(cfg => {
  const t = localStorage.getItem('sa_token');
  if (t) cfg.headers.Authorization = `Bearer ${t}`;
  return cfg;
});

api.interceptors.response.use(
  r => r.data,
  e => Promise.reject(new Error(e.response?.data?.message || e.message || 'Request failed'))
);

// Auth
export const login            = (d) => api.post('/auth/login', d);
export const registerStudent  = (d) => api.post('/auth/register-student', d);
export const getMe            = ()  => api.get('/auth/me');

// Students
export const getStudents      = (p={}) => api.get('/students', { params:p });
export const encodeFace       = (d)    => api.post('/students/face/encode', d);
export const recognizeFace    = (d)    => api.post('/students/face/recognize', d);

// Faculty
export const getFaculty       = ()  => api.get('/faculty');
export const createFaculty    = (d) => api.post('/faculty', d);
export const deleteFaculty    = (id)=> api.delete(`/faculty/${id}`);

// Subjects
export const getSubjects      = (p={}) => api.get('/subjects', { params:p });
export const createSubject    = (d)    => api.post('/subjects', d);
export const deleteSubject    = (id)   => api.delete(`/subjects/${id}`);
export const assignSubject    = (d)    => api.post('/subjects/assign', d);
export const removeAssignment = (fid,idx) => api.delete(`/subjects/assign/${fid}/${idx}`);

// Attendance
export const startSession     = (d)  => api.post('/attendance/session/start', d);
export const endSession       = (id) => api.put(`/attendance/session/${id}/end`);
export const getSession       = (id) => api.get(`/attendance/session/${id}`);
export const markAttendance   = (d)  => api.post('/attendance/mark', d);
export const getTodaySessions = ()   => api.get('/attendance/sessions/today');
export const getHistory       = ()   => api.get('/attendance/history');
export const getStudentAtt    = (usn)=> api.get(`/attendance/student/${usn}`);
export const getReport        = (p)  => api.get('/attendance/report', { params:p });

export const downloadExcel    = (params) => {
  const q = new URLSearchParams(params).toString();
  const t = localStorage.getItem('sa_token');
  const a = document.createElement('a');
  a.href = `/api/attendance/report/excel?${q}`;
  // Must add token in URL or use fetch with blob
  fetch(`/api/attendance/report/excel?${q}`, { headers:{ Authorization:`Bearer ${t}` } })
    .then(r => r.blob())
    .then(blob => {
      const url = URL.createObjectURL(blob);
      a.href = url;
      a.download = `attendance_report.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
    });
};

export default api;
