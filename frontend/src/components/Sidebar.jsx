import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { COLLEGE, C } from './ui';

const NAV = {
  faculty: [
    { to:'/faculty/dashboard',   icon:'📊', label:'Dashboard' },
    { to:'/faculty/attendance',  icon:'📷', label:'Take Attendance' },
    { to:'/faculty/reports',     icon:'📋', label:'Reports' },
    { to:'/faculty/students',    icon:'👥', label:'Students' },
    { to:'/faculty/history',     icon:'🕐', label:'History' },
  ],
  student: [
    { to:'/student/dashboard',     icon:'📊', label:'Dashboard' },
    { to:'/student/my-attendance', icon:'📋', label:'My Attendance' },
    { to:'/student/register-face', icon:'🤳', label:'Register Face' },
  ],
  admin: [
    { to:'/admin/dashboard', icon:'🏠', label:'Dashboard' },
    { to:'/admin/faculty',   icon:'👨‍🏫', label:'Manage Faculty' },
    { to:'/admin/subjects',  icon:'📚', label:'Subjects' },
    { to:'/admin/students',  icon:'🎓', label:'Students' },
  ],
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  useEffect(() => {
    const handle = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return isMobile;
}

export default function Sidebar({ isOpen, onClose }){
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const links = NAV[user?.role] || [];

  const handleLogout = () => { 
    logout(); 
    navigate('/login'); 
    if (isMobile && onClose) onClose();
  };

  const handleLinkClick = () => {
    if (isMobile && onClose) onClose();
  };

  return (
    <>
      {isMobile && isOpen && (
        <div onClick={onClose} style={{position:'fixed',top:0,left:0,right:0,bottom:0,background:'rgba(0,0,0,0.5)',zIndex:99}}/>
      )}
      <div style={{
        width: isMobile ? 260 : 230,
        minHeight: '100vh',
        background: '#0f172a',
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: 0,
        top: 0,
        zIndex: 100,
        transform: isMobile ? (isOpen ? 'translateX(0)' : 'translateX(-100%)') : 'translateX(0)',
        transition: 'transform 0.3s ease',
      }}>
        <div style={{padding:'22px 18px 14px',borderBottom:'1px solid #1e293b'}}>
          <div style={{fontSize:20,fontWeight:800,color:'#fff',letterSpacing:-0.5}}>
            <span style={{color:C.accent}}>Smart</span>Attend
          </div>
          <div style={{fontSize:10,color:'#475569',marginTop:2,textTransform:'uppercase',letterSpacing:1,lineHeight:1.4}}>{COLLEGE}</div>
        </div>
        <div style={{padding:'10px 8px',flex:1,overflowY:'auto'}}>
          {links.map(l=>(
            <NavLink key={l.to} to={l.to} onClick={handleLinkClick} style={({isActive})=>({
              display:'flex',alignItems:'center',gap:10,width:'100%',padding:'12px 14px',
              borderRadius:8,marginBottom:3,textDecoration:'none',
              background:isActive?'#1a56db22':'transparent',
              color:isActive?C.accent:'#94a3b8',
              fontWeight:isActive?700:500,fontSize:14,
            })}>
              <span style={{fontSize:18}}>{l.icon}</span>
              {l.label}
            </NavLink>
          ))}
        </div>
        <div style={{padding:'12px 8px',borderTop:'1px solid #1e293b'}}>
          <div style={{padding:'8px 12px',marginBottom:6}}>
            <div style={{fontSize:12,fontWeight:700,color:'#cbd5e1',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{user?.name}</div>
            <div style={{fontSize:11,color:'#475569',textTransform:'capitalize'}}>{user?.role} · {user?.usn||user?.email}</div>
          </div>
          <button onClick={handleLogout} style={{display:'flex',alignItems:'center',gap:8,width:'100%',padding:'9px 12px',
            borderRadius:8,border:'none',cursor:'pointer',background:'transparent',color:'#ef4444',fontWeight:600,fontSize:13,fontFamily:'inherit'}}>
            🚪 Logout
          </button>
        </div>
      </div>
    </>
  );
}

