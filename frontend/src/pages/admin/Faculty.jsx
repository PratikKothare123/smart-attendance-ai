import { useState, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Inp, Btn, Alert, Table, Td, Spinner, PageWrap, DEPTS } from '../../components/ui';
import * as api from '../../api';

export default function AdminFaculty(){
  const [faculty, setFaculty]  = useState([]);
  const [loading, setLoading]  = useState(true);
  const [saving,  setSaving]   = useState(false);
  const [err,     setErr]      = useState('');
  const [ok,      setOk]       = useState('');
  const [f, setF] = useState({ name:'',email:'',password:'',department:'' });
  const set = k=>e=>setF({...f,[k]:e.target.value});

  const load = ()=>api.getFaculty().then(setFaculty).catch(()=>{}).finally(()=>setLoading(false));
  useEffect(()=>{ load(); },[]);

  const create = async ()=>{
    setErr(''); setOk(''); setSaving(true);
    try {
      await api.createFaculty(f);
      setOk(`Faculty "${f.name}" created! Login: ${f.email} / ${f.password}`);
      setF({ name:'',email:'',password:'',department:'' });
      load();
    } catch(e){ setErr(e.message); }
    finally { setSaving(false); }
  };

  const del = async (id,name)=>{
    if(!window.confirm(`Delete ${name}?`)) return;
    await api.deleteFaculty(id); load();
  };

  return(
    <Layout title="Manage Faculty">
      <PageWrap>
        <div style={{marginBottom:20}}><div style={{fontSize:20,fontWeight:800}}>Manage Faculty</div></div>
        <div style={{display:'grid',gridTemplateColumns:'380px 1fr',gap:20,alignItems:'start'}}>
          <Card style={{padding:24}}>
            <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>➕ Add New Faculty</div>
            <Alert type="error"   msg={err}/>
            <Alert type="success" msg={ok}/>
            <Inp label="Full Name"     value={f.name}       onChange={set('name')}       placeholder="Dr. Sharma" required/>
            <Inp label="College Email" type="email" value={f.email} onChange={set('email')} placeholder="faculty@sbjain.edu" required/>
            <Inp label="Password"      type="password" value={f.password} onChange={set('password')} placeholder="Set login password" required/>
            <Inp label="Department"    options={DEPTS} value={f.department} onChange={set('department')} required/>
            <Btn onClick={create} loading={saving} disabled={!f.name||!f.email||!f.password||!f.department} style={{width:'100%'}}>
              Create Faculty Account
            </Btn>
          </Card>
          <Card>
            <div style={{padding:'12px 20px',borderBottom:`1px solid ${C.border}`,display:'flex',justifyContent:'space-between',fontSize:13}}>
              <strong>Faculty List</strong><span style={{color:C.muted}}>{faculty.length} total</span>
            </div>
            {loading ? <Spinner/>
              : <Table
                  headers={['#','Name','Email','Dept','Subjects Assigned','Action']}
                  rows={faculty.map((f,i)=>(
                    <tr key={f._id} style={{borderBottom:`1px solid ${C.border}`}}>
                      <Td style={{color:C.muted}}>{i+1}</Td>
                      <Td style={{fontWeight:600}}>{f.name}</Td>
                      <Td style={{color:C.muted,fontSize:12}}>{f.email}</Td>
                      <Td>{f.department||'—'}</Td>
                      <Td style={{textAlign:'center',fontWeight:700}}>{f.assignedSubjects?.length||0}</Td>
                      <Td>
                        <button onClick={()=>del(f._id,f.name)} style={{background:'#fee2e2',color:C.danger,
                          border:'none',padding:'4px 10px',borderRadius:6,cursor:'pointer',fontSize:12,fontWeight:600}}>
                          Delete
                        </button>
                      </Td>
                    </tr>
                  ))}
                  emptyMsg="No faculty added yet"
                />
            }
          </Card>
        </div>
      </PageWrap>
    </Layout>
  );
}
