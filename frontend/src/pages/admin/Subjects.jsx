import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Inp, Btn, Alert, Table, Td, Spinner, PageWrap, DEPTS, YEARS, SEMS, SECS } from '../../components/ui';
import * as api from '../../api';

export default function AdminSubjects(){
  const [subjects, setSubjects] = useState([]);
  const [faculty,  setFaculty]  = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [saving,   setSaving]   = useState(false);
  const [assigning,setAssigning]= useState(false);
  const [err,  setErr]  = useState('');
  const [aErr, setAErr] = useState('');
  const [ok,   setOk]   = useState('');
  const [aOk,  setAOk]  = useState('');

  const [ns, setNs] = useState({ name:'',code:'',department:'',semester:'',year:'' });
  const [asgn, setAsgn] = useState({ facultyId:'',subjectId:'',year:'',semester:'',section:'',department:'' });
  const setN = k=>e=>setNs({...ns,[k]:e.target.value});
  const setA = k=>e=>setAsgn({...asgn,[k]:e.target.value});

  const load = ()=>{
    Promise.all([api.getSubjects(), api.getFaculty()])
      .then(([s,f])=>{ setSubjects(s); setFaculty(f); })
      .catch(()=>{}).finally(()=>setLoading(false));
  };
  useEffect(()=>{ load(); },[]);

  const createSub = async ()=>{
    setErr(''); setOk(''); setSaving(true);
    try { await api.createSubject(ns); setOk('Subject created!'); setNs({ name:'',code:'',department:'',semester:'',year:'' }); load(); }
    catch(e){ setErr(e.message); } finally{ setSaving(false); }
  };

  const assign = async ()=>{
    setAErr(''); setAOk(''); setAssigning(true);
    try { await api.assignSubject(asgn); setAOk('Subject assigned to faculty!'); load(); }
    catch(e){ setAErr(e.message); } finally{ setAssigning(false); }
  };

  const delSub = async (id)=>{
    if(!window.confirm('Delete this subject?')) return;
    await api.deleteSubject(id); load();
  };

  return(
    <Layout title="Subjects & Assignment">
      <PageWrap>
        <div style={{marginBottom:20}}><div style={{fontSize:20,fontWeight:800}}>Subjects & Faculty Assignment</div></div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,marginBottom:20}}>
          {/* Add subject */}
          <Card style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>➕ Add New Subject</div>
            <Alert type="error" msg={err}/><Alert type="success" msg={ok}/>
            <Inp label="Subject Name"  value={ns.name}       onChange={setN('name')}       placeholder="Data Structures" required/>
            <Inp label="Subject Code"  value={ns.code}       onChange={setN('code')}       placeholder="CS301"/>
            <Inp label="Department"    options={DEPTS}        value={ns.department}         onChange={setN('department')}  required/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Inp label="Year"        options={YEARS}        value={ns.year}               onChange={setN('year')}        required/>
              <Inp label="Semester"    options={SEMS}         value={ns.semester}           onChange={setN('semester')}    required/>
            </div>
            <Btn onClick={createSub} loading={saving} disabled={!ns.name||!ns.department||!ns.year||!ns.semester} style={{width:'100%'}}>
              Add Subject
            </Btn>
          </Card>
          {/* Assign */}
          <Card style={{padding:22}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:14}}>🔗 Assign Subject to Faculty</div>
            <Alert type="error" msg={aErr}/><Alert type="success" msg={aOk}/>
            <Inp label="Faculty" options={faculty.map(f=>({ value:f._id, label:`${f.name} (${f.department||'—'})` }))}
              value={asgn.facultyId} onChange={setA('facultyId')} required/>
            <Inp label="Subject" options={subjects.map(s=>({ value:s._id, label:`${s.name} (${s.code||s.department})` }))}
              value={asgn.subjectId} onChange={setA('subjectId')} required/>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Inp label="Year"     options={YEARS} value={asgn.year}       onChange={setA('year')}       required/>
              <Inp label="Section"  options={SECS}  value={asgn.section}    onChange={setA('section')}    required/>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
              <Inp label="Semester"    options={SEMS}  value={asgn.semester}    onChange={setA('semester')}   required/>
              <Inp label="Department"  options={DEPTS} value={asgn.department}  onChange={setA('department')} required/>
            </div>
            <Btn onClick={assign} loading={assigning}
              disabled={!asgn.facultyId||!asgn.subjectId||!asgn.year||!asgn.section||!asgn.semester||!asgn.department}
              style={{width:'100%'}}>
              Assign to Faculty
            </Btn>
          </Card>
        </div>
        {/* Subjects list */}
        <Card>
          <div style={{padding:'12px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',fontSize:13}}>
            <strong>All Subjects</strong><span style={{color:C.muted}}>{subjects.length} total</span>
          </div>
          {loading ? <Spinner/>
            : <Table
                headers={['#','Name','Code','Dept','Year','Semester','Action']}
                rows={subjects.map((s,i)=>(
                  <tr key={s._id} style={{borderBottom:`1px solid ${C.border}`}}>
                    <Td style={{color:C.muted}}>{i+1}</Td>
                    <Td style={{fontWeight:600}}>{s.name}</Td>
                    <Td style={{fontFamily:'monospace'}}>{s.code||'—'}</Td>
                    <Td>{s.department}</Td>
                    <Td>{s.year}</Td>
                    <Td>{s.semester}</Td>
                    <Td>
                      <button onClick={()=>delSub(s._id)} style={{background:'#fee2e2',color:C.danger,
                        border:'none',padding:'4px 10px',borderRadius:6,cursor:'pointer',fontSize:12,fontWeight:600}}>
                        Delete
                      </button>
                    </Td>
                  </tr>
                ))}
                emptyMsg="No subjects added yet"
              />
          }
        </Card>
      </PageWrap>
    </Layout>
  );
}
