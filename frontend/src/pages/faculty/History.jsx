import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Badge, Table, Td, Spinner, PageWrap } from '../../components/ui';
import * as api from '../../api';

export default function History(){
  const [sessions, setSessions] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(()=>{ api.getHistory().then(setSessions).catch(()=>{}).finally(()=>setLoading(false)); },[]);

  return(
    <Layout title="Session History">
      <PageWrap>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:20,fontWeight:800}}>Session History</div>
          <div style={{color:C.muted,fontSize:14}}>All attendance sessions you have taken</div>
        </div>
        {loading ? <Spinner/>
          : <Card>
            <Table
              headers={['Date','Subject','Year','Section','Time Slot','Present','Status']}
              rows={sessions.map((s,i)=>(
                <tr key={s._id} style={{borderBottom:`1px solid ${C.border}`}}>
                  <Td style={{fontWeight:600}}>{new Date(s.createdAt).toLocaleDateString('en-IN',{day:'2-digit',month:'short',year:'numeric'})}</Td>
                  <Td><div style={{fontWeight:600}}>{s.subject}</div><div style={{fontSize:11,color:C.muted}}>{s.subjectCode}</div></Td>
                  <Td>{s.year}</Td>
                  <Td>Sec {s.section}</Td>
                  <Td>{s.timeSlot||'—'}</Td>
                  <Td style={{fontWeight:700,color:C.success}}>{s.studentsPresent?.length||0}</Td>
                  <Td><Badge color={s.isActive?'blue':'gray'}>{s.isActive?'Active':'Ended'}</Badge></Td>
                </tr>
              ))}
              emptyMsg="No sessions taken yet"
            />
          </Card>
        }
      </PageWrap>
    </Layout>
  );
}
