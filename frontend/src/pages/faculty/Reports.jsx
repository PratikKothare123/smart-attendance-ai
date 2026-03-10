import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Inp, Btn, Alert, Badge, Bar, Table, Td, StatCard, PageWrap } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function Reports(){
  const { user } = useAuth();
  const subjects  = user?.assignedSubjects || [];
  const [selIdx,  setSelIdx]  = useState('');
  const [report,  setReport]  = useState(null);
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState('');

  const sel = selIdx!=='' ? subjects[selIdx] : null;

  const load = async ()=>{
    if(!sel) return setErr('Select a subject');
    setErr(''); setLoading(true);
    try {
      const d = await api.getReport({ subject:sel.subjectName, year:sel.year, semester:sel.semester, section:sel.section, department:sel.department });
      setReport(d);
    } catch(e){ setErr(e.message); }
    finally{ setLoading(false); }
  };

  const downloadExcel = ()=>{
    if(!sel) return;
    api.downloadExcel({ subject:sel.subjectName, year:sel.year, semester:sel.semester, section:sel.section, department:sel.department });
  };

  const safeCount     = report?.report?.filter(r=>r.percentage>=75).length||0;
  const criticalCount = report?.report?.filter(r=>r.percentage<60).length||0;

  return(
    <Layout title="Attendance Reports">
      <PageWrap>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:20,fontWeight:800}}>Attendance Reports</div>
          <div style={{color:C.muted,fontSize:14}}>View and download subject-wise attendance</div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(300px, 1fr))',gap:20,alignItems:'start'}}>
          <Card style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>🔍 Select Subject</div>
            <Alert type="error" msg={err}/>
            <Inp label="Subject" options={subjects.map((s,i)=>({ value:i, label:`${s.subjectName} — Sec ${s.section} (${s.year})` }))}
              value={selIdx} onChange={e=>setSelIdx(e.target.value)} required/>
            {sel&&(
              <div style={{background:'#f8fafc',borderRadius:8,padding:'10px 12px',marginBottom:12,fontSize:12}}>
                <div><span style={{color:C.muted}}>Year:</span> <strong>{sel.year}</strong></div>
                <div><span style={{color:C.muted}}>Semester:</span> <strong>{sel.semester}</strong></div>
                <div><span style={{color:C.muted}}>Section:</span> <strong>Sec {sel.section}</strong></div>
                <div><span style={{color:C.muted}}>Department:</span> <strong>{sel.department}</strong></div>
              </div>
            )}
            <Btn onClick={load} loading={loading} disabled={!sel} fullWidth>Load Report</Btn>
            {report&&(
              <Btn onClick={downloadExcel} variant="success" fullWidth style={{marginTop:10}}>
                📥 Download Excel (.xlsx)
              </Btn>
            )}
          </Card>

          <div>
            {!report ? (
              <Card style={{padding:56,textAlign:'center'}}>
                <div style={{fontSize:42,marginBottom:10}}>📊</div>
                <div style={{color:C.muted,fontSize:14}}>Select a subject and click "Load Report"</div>
              </Card>
            ) : (
              <>
                <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))',gap:14,marginBottom:16}}>
                  <StatCard icon="🎯" label="Total Sessions" value={report.totalSessions} color={C.primary}/>
                  <StatCard icon="👥" label="Students"       value={report.report?.length||0} color={C.accent}/>
                  <StatCard icon="✅" label="≥75% (Safe)"   value={safeCount}      color={C.success}/>
                  <StatCard icon="⚠️" label="<60% Critical" value={criticalCount}  color={C.danger}/>
                </div>
                <Card>
                  <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',alignItems:'center',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
                    <div style={{fontWeight:700}}>{report.subject} — Sec {report.section} · {report.year}</div>
                    <span style={{fontSize:12,color:C.muted}}>{report.totalSessions} sessions</span>
                  </div>
                  <Table
                    headers={['#','USN','Name','Total','Present','Absent','Attendance','Status']}
                    rows={(report.report||[]).map((r,i)=>(
                      <tr key={r.usn} style={{background:r.percentage<60?'#fff5f5':r.percentage<75?'#fffbeb':'#fff',
                        borderBottom:`1px solid ${C.border}`}}>
                        <Td style={{color:C.muted}}>{i+1}</Td>
                        <Td style={{fontWeight:600,fontFamily:'monospace'}}>{r.usn}</Td>
                        <Td style={{fontWeight:600}}>{r.name}</Td>
                        <Td style={{textAlign:'center'}}>{r.total}</Td>
                        <Td style={{textAlign:'center',color:C.success,fontWeight:700}}>{r.present}</Td>
                        <Td style={{textAlign:'center',color:C.danger,fontWeight:700}}>{r.absent}</Td>
                        <Td style={{minWidth:140}}><Bar pct={r.percentage}/></Td>
                        <Td><Badge color={r.percentage>=75?'green':r.percentage>=60?'yellow':'red'}>
                          {r.percentage>=75?'✓ Safe':r.percentage>=60?'Low':'⚠ Critical'}
                        </Badge></Td>
                      </tr>
                    ))}
                    emptyMsg="No students found for this section"
                  />
                </Card>
              </>
            )}
          </div>
        </div>
      </PageWrap>
    </Layout>
  );
}

