import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import * as api from '../api';
import { C, COLLEGE, Card, Inp, Btn, Alert, DEPTS, YEARS, SEMS, SECS } from '../components/ui';

export default function StudentRegister(){
  const [f, setF] = useState({ name:'',usn:'',email:'',phone:'',department:'',year:'',semester:'',section:'',password:'',confirm:'' });
  const [err, setErr]     = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const nav = useNavigate();
  const set = k => e => setF({...f,[k]:e.target.value});

  const submit = async () => {
    if(f.password!==f.confirm) return setErr('Passwords do not match');
    setErr(''); setLoading(true);
    try {
      const data = await api.registerStudent(f);
      login(data.user, data.token);
      nav('/student/dashboard', { replace:true });
    } catch(e){ setErr(e.message); }
    finally { setLoading(false); }
  };

  return(
    <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',
      background:C.bg,padding:20,fontFamily:"'DM Sans','Segoe UI',sans-serif"}}>
      <div style={{width:'100%',maxWidth:580}}>
        <div style={{textAlign:'center',marginBottom:24}}>
          <div style={{fontSize:26,fontWeight:900,color:C.primary}}>SmartAttend</div>
          <div style={{color:C.muted,fontSize:14}}>{COLLEGE}</div>
        </div>
        <Card style={{padding:32}}>
          <div style={{fontSize:18,fontWeight:800,marginBottom:16}}>Create Student Account</div>
          <Alert type="error" msg={err}/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Inp label="Full Name" value={f.name} onChange={set('name')} placeholder="Your full name" required/>
            <Inp label="USN Number" value={f.usn} onChange={set('usn')} placeholder="e.g. CS22B101" required/>
          </div>
          <Inp label="College Email" type="email" value={f.email} onChange={set('email')} placeholder="usn@sbjain.edu" required/>
          <Inp label="Phone (optional)" value={f.phone} onChange={set('phone')} placeholder="10-digit mobile"/>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Inp label="Department" options={DEPTS} value={f.department} onChange={set('department')} required/>
            <Inp label="Year" options={YEARS} value={f.year} onChange={set('year')} required/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Inp label="Semester" options={SEMS} value={f.semester} onChange={set('semester')} required/>
            <Inp label="Section" options={SECS} value={f.section} onChange={set('section')} required/>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
            <Inp label="Password" type="password" value={f.password} onChange={set('password')} placeholder="Create password" required/>
            <Inp label="Confirm Password" type="password" value={f.confirm} onChange={set('confirm')} placeholder="Repeat password" required/>
          </div>
          <Btn onClick={submit} loading={loading}
            disabled={!f.name||!f.usn||!f.email||!f.password||!f.department||!f.year||!f.semester||!f.section||f.password!==f.confirm}
            style={{width:'100%',marginTop:4}} size="lg">Create Account →</Btn>
          <div style={{textAlign:'center',marginTop:14,color:C.muted,fontSize:13}}>
            Already have an account? <Link to="/login" style={{color:C.primary,fontWeight:700}}>Sign In</Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
