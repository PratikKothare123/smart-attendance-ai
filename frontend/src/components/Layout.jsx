import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { C, COLLEGE } from './ui';
import Sidebar from './Sidebar';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return isMobile;
}

export function TopBar({ title }){
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return(
    <>
      {isMobile && (
        <div style={{
          height: 60, display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 12px', background: '#fff', borderBottom: `1px solid ${C.border}`,
          position: 'sticky', top: 0, zIndex: 60,
          width: '100%', boxSizing: 'border-box'
        }}>
          <button onClick={() => setSidebarOpen(true)} style={{
            background: 'none', border: 'none', fontSize: 24, cursor: 'pointer', padding: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, minWidth: 40, minHeight: 40
          }}>
            ☰
          </button>
          <div style={{ 
            fontSize: 15, fontWeight: 700, 
            flex: 1, textAlign: 'center', 
            overflow: 'hidden', 
            textOverflow: 'ellipsis', 
            whiteSpace: 'nowrap',
            padding: '0 8px',
            maxWidth: '60%'
          }}>
            {title}
          </div>
          <div style={{ width: 36, height: 36, borderRadius: '50%', background: C.primary,
            display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff',
            fontWeight: 700, fontSize: 14,
            flexShrink: 0
          }}>
            {user?.name?.[0]}
          </div>
        </div>
      )}

      {!isMobile && (
        <div style={{height:60,display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'0 28px',background:'#fff',borderBottom:`1px solid ${C.border}`,position:'sticky',top:0,zIndex:50}}>
          <div style={{fontSize:17,fontWeight:700}}>{title}</div>
          <div style={{display:'flex',alignItems:'center',gap:10}}>
            <div style={{textAlign:'right'}}>
              <div style={{fontSize:13,fontWeight:600}}>{user?.name}</div>
              <div style={{fontSize:11,color:C.muted,textTransform:'capitalize'}}>{user?.role}</div>
            </div>
            <div style={{width:34,height:34,borderRadius:'50%',background:C.primary,
              display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>
              {user?.name?.[0]}
            </div>
          </div>
        </div>
      )}

      {isMobile && (
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      )}
    </>
  );
}

export function Footer(){
  const isMobile = useIsMobile();
  return(
    <div style={{
      background:'#0f172a',color:'#475569',
      padding: isMobile ? '12px 16px' : '16px 28px',
      display:'flex',flexDirection: isMobile ? 'column' : 'row',
      alignItems: isMobile ? 'center' : 'center',justifyContent:'space-between',
      gap: isMobile ? 8 : 0,
      fontSize: isMobile ? 11 : 13,
      borderTop:'1px solid #1e293b'
    }}>
      <div>© {new Date().getFullYear()} {COLLEGE}</div>
      <a href="https://github.com/PratikKothare123" target="_blank" rel="noreferrer"
        style={{display:'flex',alignItems:'center',gap:7,color:'#94a3b8',textDecoration:'none',fontWeight:600,
          padding: isMobile ? '6px 10px' : '5px 12px',border:'1px solid #1e293b',borderRadius:7}}>
        <svg height="15" viewBox="0 0 16 16" fill="currentColor">
          <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
        </svg>
        Pratik Kothare
      </a>
    </div>
  );
}

export function Layout({ title, children }){
  const isMobile = useIsMobile();

  return(
    <div style={{
      minHeight:'100vh',
      background:C.bg,
      fontFamily:"'DM Sans','Segoe UI',sans-serif",
      width: '100%',
      maxWidth: '100%',
      overflowX: 'hidden'
    }}>
      {!isMobile && <Sidebar />}
      
      <div style={{
        marginLeft: isMobile ? 0 : 230,
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        transition: 'margin-left 0.3s ease',
        width: isMobile ? '100%' : 'calc(100% - 230px)'
      }}>
        <TopBar title={title}/>
        <div style={{flex:1, width: '100%', overflowX: 'hidden'}}>{children}</div>
        <Footer/>
      </div>
    </div>
  );
}

