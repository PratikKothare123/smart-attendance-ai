import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Auth pages
import Login          from './pages/Login';
import StudentRegister from './pages/StudentRegister';

// Student pages
import StudentDashboard from './pages/student/Dashboard';
import MyAttendance     from './pages/student/MyAttendance';
import RegisterFace     from './pages/student/RegisterFace';

// Faculty pages
import FacultyDashboard  from './pages/faculty/Dashboard';
import TakeAttendance    from './pages/faculty/TakeAttendance';
import LiveScan          from './pages/faculty/LiveScan';
import SessionSummary    from './pages/faculty/SessionSummary';
import Reports           from './pages/faculty/Reports';
import FacultyStudents   from './pages/faculty/Students';
import History           from './pages/faculty/History';

// Admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminFaculty   from './pages/admin/Faculty';
import AdminSubjects  from './pages/admin/Subjects';
import AdminStudents  from './pages/admin/Students';

// Route guards
function Private({ children, roles }){
  const { user, loading } = useAuth();
  if(loading) return <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',fontFamily:'DM Sans'}}>Loading...</div>;
  if(!user) return <Navigate to="/login" replace/>;
  if(roles && !roles.includes(user.role)) return <Navigate to="/" replace/>;
  return children;
}

function Root(){
  const { user } = useAuth();
  if(!user) return <Navigate to="/login" replace/>;
  if(user.role==='student')  return <Navigate to="/student/dashboard" replace/>;
  if(user.role==='faculty')  return <Navigate to="/faculty/dashboard" replace/>;
  if(user.role==='admin')    return <Navigate to="/admin/dashboard"   replace/>;
  return <Navigate to="/login" replace/>;
}

export default function App(){
  return(
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login/>}/>
          <Route path="/register" element={<StudentRegister/>}/>
          <Route path="/"         element={<Root/>}/>

          {/* Student */}
          <Route path="/student/dashboard"     element={<Private roles={['student']}><StudentDashboard/></Private>}/>
          <Route path="/student/my-attendance" element={<Private roles={['student']}><MyAttendance/></Private>}/>
          <Route path="/student/register-face" element={<Private roles={['student']}><RegisterFace/></Private>}/>

          {/* Faculty */}
          <Route path="/faculty/dashboard"      element={<Private roles={['faculty']}><FacultyDashboard/></Private>}/>
          <Route path="/faculty/attendance"     element={<Private roles={['faculty']}><TakeAttendance/></Private>}/>
          <Route path="/faculty/scan/:id"       element={<Private roles={['faculty']}><LiveScan/></Private>}/>
          <Route path="/faculty/summary/:id"    element={<Private roles={['faculty']}><SessionSummary/></Private>}/>
          <Route path="/faculty/reports"        element={<Private roles={['faculty']}><Reports/></Private>}/>
          <Route path="/faculty/students"       element={<Private roles={['faculty']}><FacultyStudents/></Private>}/>
          <Route path="/faculty/history"        element={<Private roles={['faculty']}><History/></Private>}/>

          {/* Admin */}
          <Route path="/admin/dashboard" element={<Private roles={['admin']}><AdminDashboard/></Private>}/>
          <Route path="/admin/faculty"   element={<Private roles={['admin']}><AdminFaculty/></Private>}/>
          <Route path="/admin/subjects"  element={<Private roles={['admin']}><AdminSubjects/></Private>}/>
          <Route path="/admin/students"  element={<Private roles={['admin']}><AdminStudents/></Private>}/>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace/>}/>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
