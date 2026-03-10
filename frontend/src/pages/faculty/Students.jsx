import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Inp, Btn, Badge, Table, Td, Spinner, PageWrap, DEPTS, YEARS, SEMS, SECS } from '../../components/ui';
import * as api from '../../api';

export default function FacultyStudents(){
  const [students, setStudents] = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [f, setF] = useState({ department:'',year:'',semester:'',section:'' });
  const set = k=>e=>setF({...f,[k]:e.target.value});

  const load = ()=>{
    setLoading(true);
    api.getStudents(f).then(setStudents).catch(()=>{}).finally(()=>setLoading(false));
  };

  return(
    <Layout title="Students">
      <PageWrap>
        <div style={{marginBottom:20}}>
          <div style={{fontSize:20,fontWeight:800}}>Students</div>
          <div style={{color:C.muted,fontSize:14}}>Search students by department, year, and section</div>
        </div>
        <Card style={{padding:20,marginBottom:20}}>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr) auto',gap:12,alignItems:'end'}}>
            <Inp label="Department" options={DEPTS} value={f.department} onChange={set('department')}/>
            <Inp label="Year"       options={YEARS} value={f.year}       onChange={set('year')}/>
            <Inp label="Semester"   options={SEMS}  value={f.semester}   onChange={set('semester')}/>
            <Inp label="Section"    options={SECS}  value={f.section}    onChange={set('section')}/>
            <Btn onClick={load} loading={loading} style={{marginBottom:14}}>Search</Btn>
          </div>
        </Card>
        {loading ? <Spinner/>
          : <Card>
            <div style={{padding:'12px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',fontSize:13}}>
              <strong>Results</strong><span style={{color:C.muted}}>{students.length} students</span>
            </div>
            <Table
              headers={['#','USN','Name','Dept','Year','Section','Face Status']}
              rows={students.map((s,i)=>(
                <tr key={s.usn} style={{borderBottom:`1px solid ${C.border}`}}>
                  <Td style={{color:C.muted}}>{i+1}</Td>
                  <Td style={{fontWeight:600,fontFamily:'monospace'}}>{s.usn}</Td>
                  <Td style={{fontWeight:600}}>{s.name}</Td>
                  <Td>{s.department}</Td>
                  <Td>{s.year}</Td>
                  <Td>Sec {s.section}</Td>
                  <Td><Badge color={s.faceRegistered?'green':'yellow'}>{s.faceRegistered?'✓ Registered':'Pending'}</Badge></Td>
                </tr>
              ))}
              emptyMsg="Use filters above to search students"
            />
          </Card>
        }
      </PageWrap>
    </Layout>
  );
}
