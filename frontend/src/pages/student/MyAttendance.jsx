import { useEffect, useState } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Badge, Bar, Spinner, PageWrap, StatCard, Grid } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function MyAttendance(){
  const { user } = useAuth();
  const [data, setData]   = useState(null);
  const [loading, setLoad]= useState(true);

  useEffect(()=>{
    if(user?.usn) api.getStudentAtt(user.usn).then(setData).catch(()=>{}).finally(()=>setLoad(false));
  },[user]);

  const att = data?.attendance || [];
  const avg = att.length>0?Math.round(att.reduce((a,x)=>a+x.percentage,0)/att.length):0;

  return(
    <Layout title="My Attendance">
      <PageWrap>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:20,fontWeight:800}}>My Attendance Report</div>
          <div style={{color:C.muted,fontSize:14}}>{user?.usn} · {user?.department} · {user?.year} · Section {user?.section} · {user?.semester}</div>
        </div>

        {loading ? <Spinner/> : <>
          <Grid columns={4} gap={14} style={{marginBottom:24}}>
            <StatCard icon="📚" label="Subjects" value={att.length} color={C.primary}/>
            <StatCard icon="📈" label="Avg Attendance" value={`${avg}%`} color={avg>=75?C.success:C.danger}/>
            <StatCard icon="✅" label="Subjects Safe" value={att.filter(x=>x.percentage>=75).length} color={C.success}/>
            <StatCard icon="⚠️" label="Below 75%" value={att.filter(x=>x.percentage<75).length} color={C.warning}/>
          </Grid>

          {att.length===0
            ? <Card style={{padding:48,textAlign:'center'}}>
                <div style={{fontSize:42,marginBottom:8}}>📭</div>
                <div style={{color:C.muted}}>No attendance records yet. Your faculty needs to take attendance first.</div>
              </Card>
            : <Card>
                <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,fontWeight:700,fontSize:15}}>
                  Subject-wise Breakdown
                </div>
                {/* Desktop table view */}
                <div className="desktop-table-view">
                  {att.map((s,i)=>(
                    <div key={s.subject} style={{display:'grid',gridTemplateColumns:'1fr 80px 80px 80px 160px 100px',
                      alignItems:'center',gap:12,padding:'14px 20px',
                      borderBottom:i<att.length-1?`1px solid ${C.border}`:'none',
                      background:s.percentage<60?'#fff5f5':s.percentage<75?'#fffbeb':'#fff'}}>
                      <div>
                        <div style={{fontWeight:700,fontSize:14}}>{s.subject}</div>
                        <div style={{fontSize:12,color:C.muted}}>{user?.semester}</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontWeight:700,fontSize:16}}>{s.total}</div>
                        <div style={{fontSize:11,color:C.muted}}>Total</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontWeight:700,fontSize:16,color:C.success}}>{s.present}</div>
                        <div style={{fontSize:11,color:C.muted}}>Present</div>
                      </div>
                      <div style={{textAlign:'center'}}>
                        <div style={{fontWeight:700,fontSize:16,color:C.danger}}>{s.absent}</div>
                        <div style={{fontSize:11,color:C.muted}}>Absent</div>
                      </div>
                      <Bar pct={s.percentage}/>
                      <div style={{textAlign:'right'}}>
                        <Badge color={s.percentage>=75?'green':s.percentage>=60?'yellow':'red'}>
                          {s.percentage>=75?'✓ Safe':s.percentage>=60?'Low':'⚠ Critical'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
                {/* Mobile card view */}
                <div className="mobile-card-view">
                  {att.map((s,i)=>(
                    <div key={s.subject} style={{
                      padding:'14px 16px',
                      borderBottom:i<att.length-1?`1px solid ${C.border}`:'none',
                      background:s.percentage<60?'#fff5f5':s.percentage<75?'#fffbeb':'#fff'
                    }}>
                      <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:10}}>
                        <div>
                          <div style={{fontWeight:700,fontSize:14}}>{s.subject}</div>
                          <div style={{fontSize:12,color:C.muted}}>{user?.semester}</div>
                        </div>
                        <Badge color={s.percentage>=75?'green':s.percentage>=60?'yellow':'red'}>
                          {s.percentage>=75?'✓ Safe':s.percentage>=60?'Low':'⚠ Critical'}
                        </Badge>
                      </div>
                      <div style={{display:'flex',gap:16, marginBottom:10}}>
                        <div><span style={{fontWeight:700,fontSize:14}}>{s.total}</span><span style={{fontSize:11,color:C.muted,marginLeft:4}}>Total</span></div>
                        <div><span style={{fontWeight:700,fontSize:14,color:C.success}}>{s.present}</span><span style={{fontSize:11,color:C.muted,marginLeft:4}}>Present</span></div>
                        <div><span style={{fontWeight:700,fontSize:14,color:C.danger}}>{s.absent}</span><span style={{fontSize:11,color:C.muted,marginLeft:4}}>Absent</span></div>
                      </div>
                      <Bar pct={s.percentage}/>
                    </div>
                  ))}
                </div>
              </Card>
          }

          {/* Attendance rule note */}
          <div style={{marginTop:16,padding:'12px 16px',background:C.primaryLight,borderRadius:10,fontSize:13,color:C.primaryDark}}>
            📌 <strong>Attendance Rule:</strong> Minimum 75% attendance required per subject. Below 60% is critical — contact your faculty immediately.
          </div>
        </>}
      </PageWrap>
    </Layout>
  );
}
