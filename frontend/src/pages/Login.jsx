import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import { C, COLLEGE, Inp, Btn, Alert } from '../components/ui';

export default function Login(){
  const [tab,  setTab]  = useState('student');
  const [id,   setId]   = useState('');
  const [pass, setPass] = useState('');
  const [err,  setErr]  = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async () => {
    setErr(''); setLoading(true);
    try {
      const data = await api.login({ identifier:id, password:pass, role:tab });
      login(data.user, data.token);
      const dest = data.user.role==='faculty'?'/faculty/dashboard':data.user.role==='student'?'/student/dashboard':'/admin/dashboard';
      nav(dest, { replace:true });
    } catch(e){ setErr(e.message); }
    finally { setLoading(false); }
  };

  const roleColor = { student:C.accent, faculty:C.success, admin:'#8b5cf6' };

  return(
    <div style={{minHeight:'100vh',display:'flex',fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{flex:1,background:'linear-gradient(135deg,#1a56db 0%,#0ea5e9 100%)',
        display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:48,position:'relative',overflow:'hidden'}}>
        <div style={{position:'absolute',inset:0,opacity:.06}}>
          {[...Array(14)].map((_,i)=>(
            <div key={i} style={{position:'absolute',borderRadius:'50%',border:'1px solid white',
              width:(i+1)*55,height:(i+1)*55,top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
          ))}
        </div>
        <div style={{position:'relative',textAlign:'center',color:'#fff'}}>
          <div style={{fontSize:54,marginBottom:10}}>🎓</div>
          <div style={{fontSize:32,fontWeight:900,letterSpacing:-1}}>SmartAttend</div>
          <div style={{fontSize:14,opacity:.85,marginTop:4}}>AI-Powered Attendance System</div>
          <div style={{fontSize:13,opacity:.65,marginTop:3}}>{COLLEGE}</div>
          <div style={{marginTop:36,display:'flex',flexDirection:'column',gap:12,textAlign:'left'}}>
            {['Face recognition marks attendance instantly','Subject-wise monthly tracking','Automatic % calculation','Download Excel reports'].map(f=>(
              <div key={f} style={{display:'flex',alignItems:'center',gap:10,fontSize:13}}>
                <span style={{background:'rgba(255,255,255,0.2)',borderRadius:5,padding:'1px 8px',fontSize:11}}>✓</span>{f}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{width:440,display:'flex',alignItems:'center',justifyContent:'center',background:'#fff',padding:40}}>
        <div style={{width:'100%'}}>
          <div style={{fontSize:24,fontWeight:800,marginBottom:2}}>Welcome back</div>
          <div style={{color:C.muted,fontSize:14,marginBottom:24}}>Sign in to your account</div>

          <div style={{display:'flex',gap:5,marginBottom:22,background:'#f1f5f9',borderRadius:10,padding:4}}>
            {['student','faculty','admin'].map(r=>(
              <button key={r} onClick={()=>{setTab(r);setId('');setPass('');setErr('');}} style={{
                flex:1,padding:'8px',borderRadius:7,border:'none',cursor:'pointer',
                fontWeight:600,fontSize:13,textTransform:'capitalize',fontFamily:'inherit',
                background:tab===r?'#fff':'transparent',
                color:tab===r?roleColor[r]:C.muted,
                boxShadow:tab===r?'0 1px 4px rgba(0,0,0,0.1)':'none',
              }}>
                {r==='student'?'🎓':r==='faculty'?'👨‍🏫':'⚙️'} {r}
              </button>
            ))}
          </div>

          <Alert type="error" msg={err}/>
          <Inp label={tab==='student'?'USN Number':'College Email'} type={tab==='student'?'text':'email'}
            value={id} onChange={e=>setId(e.target.value)}
            placeholder={tab==='student'?'e.g. CS22B101':'you@sbjain.edu'} required/>
          <Inp label="Password" type="password" value={pass} onChange={e=>setPass(e.target.value)} placeholder="••••••••" required/>
          <Btn onClick={submit} loading={loading} style={{width:'100%',marginTop:4}} size="lg">Sign In →</Btn>

          {tab==='student'&&(
            <div style={{textAlign:'center',marginTop:16,color:C.muted,fontSize:13}}>
              New student?{' '}
              <Link to="/register" style={{color:C.primary,fontWeight:700}}>Register with USN</Link>
            </div>
          )}
          <div style={{marginTop:22,padding:'12px',background:'#f8fafc',borderRadius:8,fontSize:11,color:C.muted}}>
            
          </div>
        </div>
      </div>
    </div>
  );
}

