import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { C, Card, Inp, Btn, Alert, PageWrap, SLOTS } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function TakeAttendance(){
  const { user }   = useAuth();
  const navigate   = useNavigate();
  const subjects   = user?.assignedSubjects || [];
  const [selIdx,   setSelIdx]   = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');

  const sel = selIdx!=='' ? subjects[selIdx] : null;

  const start = async () => {
    if(!sel||!timeSlot) return setErr('Select subject and time slot');
    setErr(''); setLoading(true);
    try {
      const res = await api.startSession({
        subject:sel.subjectName, subjectId:sel.subjectId, subjectCode:sel.code,
        year:sel.year, semester:sel.semester, section:sel.section,
        department:sel.department, timeSlot,
      });
      navigate(`/faculty/scan/${res.session._id}`, {
        state:{ session:res.session, subject:sel }
      });
    } catch(e){ setErr(e.message); }
    finally { setLoading(false); }
  };

  return(
    <Layout title="Take Attendance">
      <PageWrap>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:20,fontWeight:800}}>Take Attendance</div>
          <div style={{color:C.muted,fontSize:14}}>Step 1 of 3 — Select subject & time slot</div>
        </div>

        {/* Steps indicator */}
        <div style={{display:'flex',alignItems:'center',gap:0,marginBottom:28,maxWidth:480}}>
          {['Select Subject','Scan Faces','Summary'].map((s,i)=>(
            <>
              <div key={s} style={{display:'flex',flexDirection:'column',alignItems:'center',gap:4}}>
                <div style={{width:34,height:34,borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',
                  background:i===0?C.primary:C.border,color:i===0?'#fff':C.muted,fontWeight:700,fontSize:13}}>{i+1}</div>
                <div style={{fontSize:11,color:i===0?C.primary:C.muted,fontWeight:i===0?700:400,whiteSpace:'nowrap'}}>{s}</div>
              </div>
              {i<2&&<div key={`l${i}`} style={{flex:1,height:2,background:C.border,marginBottom:18}}/>}
            </>
          ))}
        </div>

        <div style={{maxWidth:520}}>
          <Alert type="error" msg={err}/>
          <Card style={{padding:28}}>
            <div style={{fontWeight:700,fontSize:15,marginBottom:18}}>Session Details</div>
            <Inp label="Select Subject" options={subjects.map((s,i)=>({ value:i, label:`${s.subjectName} — ${s.year}, Sec ${s.section} (${s.code})` }))}
              value={selIdx} onChange={e=>setSelIdx(e.target.value)} required/>
            {sel&&(
              <div style={{background:'#f0f4ff',borderRadius:10,padding:14,marginBottom:14,
                display:'grid',gridTemplateColumns:'1fr 1fr',gap:8,fontSize:13}}>
                <div><span style={{color:C.muted}}>Subject:</span> <strong>{sel.subjectName}</strong></div>
                <div><span style={{color:C.muted}}>Code:</span> <strong>{sel.code||'—'}</strong></div>
                <div><span style={{color:C.muted}}>Year:</span> <strong>{sel.year}</strong></div>
                <div><span style={{color:C.muted}}>Section:</span> <strong>Sec {sel.section}</strong></div>
                <div><span style={{color:C.muted}}>Department:</span> <strong>{sel.department}</strong></div>
                <div><span style={{color:C.muted}}>Semester:</span> <strong>{sel.semester}</strong></div>
              </div>
            )}
            <Inp label="Time Slot" options={SLOTS} value={timeSlot} onChange={e=>setTimeSlot(e.target.value)} required/>
            <div style={{marginBottom:16,background:'#f8fafc',borderRadius:8,padding:'10px 14px',fontSize:13,color:C.muted}}>
              📅 Date: <strong>{new Date().toLocaleDateString('en-IN',{weekday:'long',year:'numeric',month:'long',day:'numeric'})}</strong>
            </div>
            <Btn onClick={start} loading={loading} disabled={!sel||!timeSlot}
              style={{width:'100%'}} size="lg">
              Start Session & Open Camera →
            </Btn>
          </Card>
        </div>
      </PageWrap>
    </Layout>
  );
}
