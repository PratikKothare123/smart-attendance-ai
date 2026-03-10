import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { C, Card, StatCard, Bar, Badge, Spinner, PageWrap, PageTitle, Grid } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function StudentDashboard(){
  const { user } = useAuth();
  const [data, setData]     = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{
    if(user?.usn) api.getStudentAtt(user.usn).then(setData).catch(()=>{}).finally(()=>setLoading(false));
  },[user]);

  const att = data?.attendance || [];
  const avg = att.length>0 ? Math.round(att.reduce((a,x)=>a+x.percentage,0)/att.length) : 0;
  const low = att.filter(x=>x.percentage<75).length;

  return(
    <Layout title="My Dashboard">
      <PageWrap>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:800}}>Welcome back, {user?.name?.split(' ')[0]} 👋</div>
          <div style={{color:C.muted,fontSize:14}}>{user?.usn} · {user?.department} · {user?.year} · Section {user?.section}</div>
        </div>

        {loading ? <Spinner/> : <>
          <Grid columns={3} gap={16} style={{marginBottom:24}}>
            <StatCard icon="📚" label="Total Subjects" value={att.length} color={C.primary}/>
            <StatCard icon="✅" label="Average Attendance" value={`${avg}%`}
              sub={avg>=75?'Above 75% threshold':'⚠ Below threshold'} color={avg>=75?C.success:C.danger}/>
            <StatCard icon="⚠️" label="Subjects Below 75%" value={low} sub="Need attention" color={C.warning}/>
          </Grid>

          {/* Quick actions */}
          <Grid columns={2} gap={16} style={{marginBottom:24}}>
            <Card style={{padding:22,border:`1.5px solid ${C.primary}30`}}>
              <div style={{fontSize:28,marginBottom:8}}>🤳</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>Register Your Face</div>
              <div style={{color:C.muted,fontSize:13,marginBottom:14}}>
                {data?.faceRegistered ? '✅ Face is registered. You can update it anytime.' : '⚠ Face not registered yet. Register to be recognized in class.'}
              </div>
              <Link to="/student/register-face" style={{textDecoration:'none', display: 'block'}}>
                <span style={{background:C.primary,color:'#fff',padding:'10px 16px',borderRadius:8,fontWeight:600,fontSize:13, display: 'inline-block'}}>
                  {data?.faceRegistered ? 'Update Face' : 'Register Now'}
                </span>
              </Link>
            </Card>
            <Card style={{padding:22,border:`1.5px solid ${C.success}30`}}>
              <div style={{fontSize:28,marginBottom:8}}>📋</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>View Full Attendance</div>
              <div style={{color:C.muted,fontSize:13,marginBottom:14}}>Check subject-wise attendance with detailed breakdown.</div>
              <Link to="/student/my-attendance" style={{textDecoration:'none', display: 'block'}}>
                <span style={{background:C.success,color:'#fff',padding:'10px 16px',borderRadius:8,fontWeight:600,fontSize:13, display: 'inline-block'}}>
                  View Attendance
                </span>
              </Link>
            </Card>
          </Grid>

          {/* Subject summary */}
          {att.length>0 && (
            <Card style={{padding:24}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:18}}>Subject-wise Summary</div>
              {att.map((s,i)=>(
                <div key={s.subject} style={{
                  display: 'flex', 
                  flexDirection: 'column',
                  gap: 10,
                  padding:'12px 0',
                  borderBottom:i<att.length-1?`1px solid ${C.border}`:'none'
                }}>
                  <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start'}}>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:14}}>{s.subject}</div>
                      <div style={{fontSize:12,color:C.muted}}>{s.present} present · {s.absent} absent</div>
                    </div>
                    <Badge color={s.percentage>=75?'green':s.percentage>=60?'yellow':'red'}>
                      {s.percentage>=75?'✓ Safe':s.percentage>=60?'Low':'⚠ Critical'}
                    </Badge>
                  </div>
                  <div style={{width:'100%'}}><Bar pct={s.percentage}/></div>
                </div>
              ))}
            </Card>
          )}
        </>}
      </PageWrap>
    </Layout>
  );
}
