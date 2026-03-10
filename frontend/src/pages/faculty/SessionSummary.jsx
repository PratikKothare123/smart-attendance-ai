import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { C, Card, Btn, StatCard, PageWrap } from '../../components/ui';

export default function SessionSummary(){
  const { id } = useParams();
  const nav    = useNavigate();
  const loc    = useLocation();
  const { session, present=[], total=0 } = loc.state || {};
  const absent  = total - present.length;
  const pct     = total>0?Math.round((present.length/total)*100):0;

  return(
    <Layout title="Session Summary">
      <PageWrap style={{maxWidth:700}}>
        <div style={{textAlign:'center',padding:'28px 0 20px'}}>
          <div style={{fontSize:56,marginBottom:8}}>🎉</div>
          <div style={{fontSize:22,fontWeight:800}}>Session Complete!</div>
          <div style={{color:C.muted,fontSize:14,marginTop:4}}>
            {session?.subject} · {session?.year} · Sec {session?.section} · {session?.timeSlot}
          </div>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:14,marginBottom:24}}>
          <StatCard icon="👥" label="Total Students"  value={total}           color={C.primary}/>
          <StatCard icon="✅" label="Present"         value={present.length}  color={C.success}/>
          <StatCard icon="❌" label="Absent"          value={absent}          color={C.danger}/>
          <StatCard icon="📈" label="Attendance %"    value={`${pct}%`}       color={pct>=75?C.success:C.warning}/>
        </div>

        {/* Percentage visual */}
        <Card style={{padding:24,marginBottom:20,textAlign:'center'}}>
          <div style={{position:'relative',width:120,height:120,margin:'0 auto 16px'}}>
            <svg viewBox="0 0 36 36" style={{width:'100%',height:'100%',transform:'rotate(-90deg)'}}>
              <circle cx="18" cy="18" r="15.9" fill="none" stroke="#f1f5f9" strokeWidth="3.5"/>
              <circle cx="18" cy="18" r="15.9" fill="none"
                stroke={pct>=75?C.success:pct>=60?C.warning:C.danger} strokeWidth="3.5"
                strokeDasharray={`${pct} ${100-pct}`} strokeLinecap="round"/>
            </svg>
            <div style={{position:'absolute',inset:0,display:'flex',alignItems:'center',justifyContent:'center'}}>
              <span style={{fontSize:22,fontWeight:800}}>{pct}%</span>
            </div>
          </div>
          <div style={{fontSize:15,fontWeight:700}}>{pct>=75?'✅ Good attendance!':pct>=60?'⚠ Below threshold':'❌ Low attendance'}</div>
          <div style={{color:C.muted,fontSize:13,marginTop:4}}>
            {present.length} out of {total} students marked present
          </div>
        </Card>

        {/* Present list */}
        {present.length>0&&(
          <Card style={{marginBottom:20}}>
            <div style={{padding:'14px 20px',borderBottom:`1px solid ${C.border}`,fontWeight:700}}>Present Students</div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:0}}>
              {present.map((s,i)=>(
                <div key={s.usn} style={{display:'flex',alignItems:'center',gap:8,padding:'10px 16px',
                  borderBottom:i<present.length-1?`1px solid ${C.border}`:'none'}}>
                  <span style={{width:7,height:7,borderRadius:'50%',background:C.success,flexShrink:0}}/>
                  <div>
                    <div style={{fontSize:13,fontWeight:600}}>{s.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{s.usn}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:12}}>
          <Btn onClick={()=>nav('/faculty/attendance')} size="lg" style={{width:'100%'}}>📷 Take Another Attendance</Btn>
          <Btn onClick={()=>nav('/faculty/reports')} variant="outline" size="lg" style={{width:'100%'}}>📋 View Reports</Btn>
        </div>
      </PageWrap>
    </Layout>
  );
}
