import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { C, Card, StatCard, Badge, Spinner, PageWrap } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function FacultyDashboard(){
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(()=>{
    api.getTodaySessions().then(setSessions).catch(()=>{}).finally(()=>setLoading(false));
  },[]);

  const totalPresent = sessions.reduce((a,s)=>a+s.studentsPresent.length,0);
  const subjects     = user?.assignedSubjects || [];

  return(
    <Layout title="Faculty Dashboard">
      <PageWrap>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:800}}>Good {new Date().getHours()<12?'Morning':'Afternoon'}, {user?.name?.split(' ')[0]} 👋</div>
          <div style={{color:C.muted,fontSize:14}}>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16,marginBottom:24}}>
          <StatCard icon="📚" label="Assigned Subjects" value={subjects.length} color={C.primary}/>
          <StatCard icon="🎯" label="Sessions Today"   value={sessions.length} color={C.success}/>
          <StatCard icon="👥" label="Present Today"    value={totalPresent}   color={C.accent}/>
        </div>

        {/* Quick Action */}
        <Card style={{padding:24,marginBottom:24,background:`linear-gradient(135deg,${C.primary}08,${C.accent}08)`,border:`1.5px solid ${C.primary}25`}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
            <div>
              <div style={{fontWeight:800,fontSize:16,marginBottom:4}}>📷 Start Taking Attendance</div>
              <div style={{color:C.muted,fontSize:13}}>Select subject → Open camera → Scan student faces → Done</div>
            </div>
            <Link to="/faculty/attendance" style={{textDecoration:'none'}}>
              <span style={{background:C.primary,color:'#fff',padding:'11px 22px',borderRadius:10,fontWeight:700,fontSize:14,display:'inline-block'}}>
                Take Attendance →
              </span>
            </Link>
          </div>
        </Card>

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20}}>
          {/* Assigned Subjects */}
          <Card>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:15}}>My Subjects</div>
            {subjects.length===0
              ? <div style={{padding:24,color:C.muted,fontSize:13,textAlign:'center'}}>No subjects assigned yet. Ask admin.</div>
              : subjects.map((s,i)=>(
                <div key={i} style={{display:'flex',alignItems:'center',justifyContent:'space-between',
                  padding:'12px 20px',borderBottom:i<subjects.length-1?`1px solid ${C.border}`:'none'}}>
                  <div>
                    <div style={{fontWeight:600,fontSize:14}}>{s.subjectName}</div>
                    <div style={{fontSize:12,color:C.muted}}>{s.code} · {s.year} · Sec {s.section}</div>
                  </div>
                  <Badge color="blue">{s.department}</Badge>
                </div>
              ))
            }
          </Card>

          {/* Today's sessions */}
          <Card>
            <div style={{padding:'16px 20px',borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:15}}>Today's Sessions</div>
            {loading ? <Spinner/>
              : sessions.length===0
              ? <div style={{padding:24,color:C.muted,fontSize:13,textAlign:'center'}}>No sessions taken today yet.</div>
              : sessions.map((s,i)=>(
                <div key={s._id} style={{padding:'12px 20px',borderBottom:i<sessions.length-1?`1px solid ${C.border}`:'none'}}>
                  <div style={{fontWeight:600,fontSize:14}}>{s.subject}</div>
                  <div style={{display:'flex',justifyContent:'space-between',marginTop:4}}>
                    <span style={{fontSize:12,color:C.muted}}>{s.timeSlot} · Sec {s.section}</span>
                    <span style={{fontSize:12,fontWeight:700,color:C.success}}>{s.studentsPresent.length} present</span>
                  </div>
                </div>
              ))
            }
          </Card>
        </div>
      </PageWrap>
    </Layout>
  );
}
