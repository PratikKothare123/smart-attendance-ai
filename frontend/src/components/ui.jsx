// ── Shared UI primitives ──────────────────────────────────────────────────────
import React, { useState, useEffect } from 'react';

export const C = {
  primary:'#1a56db', primaryDark:'#1e429f', primaryLight:'#e8f0fe',
  accent:'#0ea5e9', success:'#16a34a', warning:'#d97706', danger:'#dc2626',
  bg:'#f0f4ff', text:'#0f172a', muted:'#64748b', border:'#e2e8f0',
};

export const DEPTS   = ['CSE','ECE','ME','CE','EEE','IT'];
export const YEARS   = ['1st Year','2nd Year','3rd Year','4th Year'];
export const SEMS    = ['Sem 1','Sem 2','Sem 3','Sem 4','Sem 5','Sem 6','Sem 7','Sem 8'];
export const SECS    = ['A','B','C','D'];
export const SLOTS   = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM'];
export const COLLEGE = 'SB Jain Institute Nagpur';

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' ? window.innerWidth <= 768 : false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handle = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handle);
    return () => window.removeEventListener('resize', handle);
  }, []);
  return isMobile;
}

export function Card({ children, style={} }){
  const isMobile = useIsMobile();
  return (
    <div style={{ 
      background:'#fff',
      borderRadius: isMobile ? 10 : 14,
      border:`1px solid ${C.border}`,
      boxShadow:'0 1px 6px rgba(0,0,0,0.06)',
      padding: isMobile ? '16px' : undefined,
      ...style 
    }}>
      {children}
    </div>
  );
}

export function Badge({ color='blue', children }){
  const m={ green:{bg:'#dcfce7',c:'#16a34a'}, red:{bg:'#fee2e2',c:'#dc2626'},
    yellow:{bg:'#fef3c7',c:'#d97706'}, blue:{bg:'#e8f0fe',c:'#1a56db'}, gray:{bg:'#f1f5f9',c:'#64748b'} };
  const s=m[color]||m.blue;
  return <span style={{background:s.bg,color:s.c,padding:'2px 10px',borderRadius:99,fontSize:12,fontWeight:600}}>{children}</span>;
}

export function Btn({ children, onClick, variant='primary', size='md', style={}, disabled=false, loading=false, type='button' }){
  const v={
    primary:{background:C.primary,color:'#fff',border:'none'},
    outline:{background:'transparent',color:C.primary,border:`1.5px solid ${C.primary}`},
    ghost:{background:'transparent',color:C.muted,border:`1.5px solid ${C.border}`},
    danger:{background:C.danger,color:'#fff',border:'none'},
    success:{background:C.success,color:'#fff',border:'none'},
    warning:{background:C.warning,color:'#fff',border:'none'},
  };
  const isMobile = useIsMobile();
  const sz={
    sm:{padding:'6px 14px',fontSize:13},
    md:{padding: isMobile ? '10px 16px' : '10px 20px',fontSize:14},
    lg:{padding: isMobile ? '12px 20px' : '13px 28px',fontSize:15}
  };
  return(
    <button type={type} onClick={onClick} disabled={disabled||loading} style={{
      ...v[variant],...sz[size],borderRadius:8,fontWeight:600,cursor:(disabled||loading)?'not-allowed':'pointer',
      fontFamily:'inherit',opacity:(disabled||loading)?0.6:1,transition:'all .15s',width: isMobile ? '100%' : 'auto',...style}}>
      {loading?'⏳ Please wait...':children}
    </button>
  );
}

export function Inp({ label,type='text',value,onChange,placeholder,required,options,disabled,name }){
  const base={width:'100%',padding:'10px 14px',borderRadius:8,border:`1.5px solid ${C.border}`,
    fontSize:14,outline:'none',boxSizing:'border-box',background:'#fafbff',fontFamily:'inherit',color:C.text};
  return(
    <div style={{marginBottom:14}}>
      {label&&<label style={{display:'block',fontSize:13,fontWeight:600,marginBottom:4,color:C.text}}>
        {label}{required&&<span style={{color:C.danger}}> *</span>}
      </label>}
      {options
        ?<select value={value} onChange={onChange} disabled={disabled} name={name} style={{...base,color:value?C.text:C.muted}}>
          <option value="">{placeholder||`Select ${label}`}</option>
          {options.map(o=><option key={o.value??o} value={o.value??o}>{o.label??o}</option>)}
        </select>
        :<input type={type} value={value} onChange={onChange} placeholder={placeholder} disabled={disabled} name={name} style={base}/>
      }
    </div>
  );
}

export function Alert({ type='error', msg }){
  if(!msg) return null;
  const s={success:{bg:'#dcfce7',c:'#166534',b:'#bbf7d0'},error:{bg:'#fee2e2',c:'#991b1b',b:'#fecaca'},info:{bg:'#e8f0fe',c:'#1e429f',b:'#bfdbfe'},warning:{bg:'#fef3c7',c:'#92400e',b:'#fde68a'}};
  const x=s[type]||s.error;
  return <div style={{background:x.bg,color:x.c,border:`1px solid ${x.b}`,borderRadius:8,padding:'10px 14px',fontSize:13,marginBottom:14}}>{msg}</div>;
}

export function StatCard({ icon,label,value,sub,color=C.primary }){
  const isMobile = useIsMobile();
  return(
    <Card style={{padding: isMobile ? '16px' : '20px 24px',display:'flex',gap: isMobile ? 12 : 16,alignItems:'center'}}>
      <div style={{width: isMobile ? 40 : 48,height: isMobile ? 40 : 48,borderRadius: isMobile ? 10 : 12,background:`${color}18`,display:'flex',alignItems:'center',justifyContent:'center',fontSize: isMobile ? 18 : 22}}>{icon}</div>
      <div>
        <div style={{fontSize: isMobile ? 20 : 24,fontWeight:700}}>{value}</div>
        <div style={{fontSize: isMobile ? 12 : 13,color:C.muted}}>{label}</div>
        {sub&&<div style={{fontSize:12,color,marginTop:2}}>{sub}</div>}
      </div>
    </Card>
  );
}

export function Bar({ pct }){
  const col=pct>=75?C.success:pct>=60?C.warning:C.danger;
  return(
    <div style={{display:'flex',alignItems:'center',gap:10}}>
      <div style={{flex:1,background:'#f1f5f9',borderRadius:99,height:7,overflow:'hidden'}}>
        <div style={{width:`${pct}%`,background:col,height:'100%',borderRadius:99,transition:'width .5s'}}/>
      </div>
      <span style={{fontSize:13,fontWeight:700,color:col,minWidth:38,textAlign:'right'}}>{pct}%</span>
    </div>
  );
}

export function PageWrap({ children, style={} }){
  const isMobile = useIsMobile();
  return <div style={{padding: isMobile ? 16 : 28,...style}}>{children}</div>;
}

export function PageTitle({ title, sub }){
  const isMobile = useIsMobile();
  return(
    <div style={{marginBottom: isMobile ? 16 : 22}}>
      <div style={{fontSize: isMobile ? 18 : 20,fontWeight:800}}>{title}</div>
      {sub&&<div style={{color:C.muted,fontSize: isMobile ? 13 : 14,marginTop:2}}>{sub}</div>}
    </div>
  );
}

export function Spinner(){
  return(
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',padding:60}}>
      <div style={{width:36,height:36,border:`3px solid ${C.border}`,borderTopColor:C.primary,borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}

export function Table({ headers, rows, emptyMsg='No data' }){
  return(
    <div style={{overflowX:'auto'}}>
      <table style={{width:'100%',borderCollapse:'collapse',minWidth: 500}}>
        <thead>
          <tr style={{background:'#f8fafc'}}>
            {headers.map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',fontSize:11,fontWeight:700,color:C.muted,textTransform:'uppercase',letterSpacing:.5,whiteSpace:'nowrap'}}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {rows.length===0
            ?<tr><td colSpan={headers.length} style={{padding:24,textAlign:'center',color:C.muted,fontSize:14}}>{emptyMsg}</td></tr>
            :rows}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, style={} }){
  return <td style={{padding:'11px 14px',fontSize:13,...style}}>{children}</td>;
}

