import { useState } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Inp, Btn, Badge, Table, Td, Spinner, PageWrap, DEPTS, YEARS, SEMS, SECS } from '../../components/ui';
import * as api from '../../api';

export default function AdminStudents(){
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [searched, setSearched] = useState(false);
  const [f, setF] = useState({ department:'',year:'',semester:'',section:'' });
  const set = k=>e=>setF({...f,[k]:e.target.value});

  const load = ()=>{
    setLoading(true); setSearched(true);
    api.getStudents(f).then(setStudents).catch(()=>{}).finally(()=>setLoading(false));
  };

  return(
    <Layout title="All Students">
      <PageWrap>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:20,fontWeight:800}}>All Students</div>
          <div style={{color:C.muted,fontSize:14}}>Monitor student registrations and face status</div>
        </div>
        <Card style={{padding:20,marginBottom:20,overflow:'visible'}}>
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:10}}>
              <Inp label="Department" options={DEPTS} value={f.department} onChange={set('department')}/>
              <Inp label="Year"       options={YEARS} value={f.year}       onChange={set('year')}/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(2, 1fr)',gap:10}}>
              <Inp label="Semester"   options={SEMS}  value={f.semester}   onChange={set('semester')}/>
              <Inp label="Section"    options={SECS}  value={f.section}    onChange={set('section')}/>
            </div>
            <Btn onClick={load} loading={loading}>Search</Btn>
          </div>
        </Card>
        {!searched
          ? <Card style={{padding:48,textAlign:'center'}}>
              <div style={{fontSize:36,marginBottom:8}}>🎓</div>
              <div style={{color:C.muted}}>Select filters above and click Search</div>
            </Card>
          : loading ? <Spinner/>
          : <Card>
              <div style={{padding:'12px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',fontSize:13,flexWrap:'wrap',gap:8}}>
                <strong>Results</strong>
                <span style={{color:C.muted}}>{students.length} students · {students.filter(s=>s.faceRegistered).length} faces registered</span>
              </div>
              <Table
                headers={['#','USN','Name','Email','Dept','Year','Section','Face']}
                rows={students.map((s,i)=>(
                  <tr key={s.usn} style={{borderBottom:`1px solid ${C.border}`}}>
                    <Td style={{color:C.muted}}>{i+1}</Td>
                    <Td style={{fontWeight:700,fontFamily:'monospace'}}>{s.usn}</Td>
                    <Td style={{fontWeight:600}}>{s.name}</Td>
                    <Td style={{fontSize:12,color:C.muted}}>{s.email}</Td>
                    <Td>{s.department}</Td>
                    <Td>{s.year}</Td>
                    <Td>Sec {s.section}</Td>
                    <Td><Badge color={s.faceRegistered?'green':'yellow'}>{s.faceRegistered?'✓ Done':'Pending'}</Badge></Td>
                  </tr>
                ))}
                emptyMsg="No students found"
              />
            </Card>
        }
      </PageWrap>
    </Layout>
  );
}

