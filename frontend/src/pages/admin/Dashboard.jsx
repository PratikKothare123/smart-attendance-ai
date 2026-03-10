import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { C, Card, StatCard, PageWrap, COLLEGE, Grid } from '../../components/ui';
import * as api from '../../api';

export default function AdminDashboard(){
  const [counts, setCounts] = useState({ faculty:0, subjects:0, students:0 });

  useEffect(()=>{
    Promise.all([api.getFaculty(), api.getSubjects(), api.getStudents()])
      .then(([f,s,st])=>setCounts({ faculty:f.length, subjects:s.length, students:st.length }))
      .catch(()=>{});
  },[]);

  const actions = [
    { to:'/admin/faculty',  icon:'👨‍🏫', title:'Manage Faculty',      desc:'Add, view, and delete faculty accounts', color:C.primary },
    { to:'/admin/subjects', icon:'📚',  title:'Subjects & Assignment',  desc:'Add subjects and assign to faculty with sections', color:C.success },
    { to:'/admin/students', icon:'🎓',  title:'All Students',           desc:'View all registered students', color:'#8b5cf6' },
  ];

  return(
    <Layout title="Admin Dashboard">
      <PageWrap>
        <div style={{marginBottom:22}}>
          <div style={{fontSize:22,fontWeight:800}}>Admin Panel</div>
          <div style={{color:C.muted,fontSize:14}}>{COLLEGE}</div>
        </div>
        <Grid columns={3} gap={16} style={{marginBottom:28}}>
          <StatCard icon="👨‍🏫" label="Faculty Members"  value={counts.faculty}   color={C.primary}/>
          <StatCard icon="📚"  label="Subjects Created" value={counts.subjects}  color={C.success}/>
          <StatCard icon="🎓"  label="Students"          value={counts.students}  color='#8b5cf6'/>
        </Grid>
        <Grid columns={3} gap={16}>
          {actions.map(a=>(
            <Card key={a.to} style={{padding:24,border:`1.5px solid ${a.color}20`,cursor:'pointer'}}>
              <div style={{fontSize:32,marginBottom:12}}>{a.icon}</div>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>{a.title}</div>
              <div style={{color:C.muted,fontSize:13,marginBottom:16}}>{a.desc}</div>
              <Link to={a.to} style={{textDecoration:'none', display: 'block'}}>
                <span style={{background:a.color,color:'#fff',padding:'10px 16px',borderRadius:8,fontWeight:600,fontSize:13, display: 'inline-block'}}>Go →</span>
              </Link>
            </Card>
          ))}
        </Grid>
        <Card style={{padding:20,marginTop:20,background:'#f0f4ff',border:`1.5px solid ${C.primary}20`}}>
          <div style={{fontWeight:700,marginBottom:8}}>🚀 Setup Checklist</div>
          {['1. Create Faculty accounts','2. Create Subjects','3. Assign subjects to faculty (with Year, Section, Department)','4. Faculty can now take attendance for their assigned sections','5. Students register and take 5 face photos'].map(s=>(
            <div key={s} style={{fontSize:13,color:C.muted,marginBottom:4}}>☐ {s}</div>
          ))}
        </Card>
      </PageWrap>
    </Layout>
  );
}
