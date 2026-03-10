import { useState, useRef, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Layout } from '../../components/Layout';
import { C, Card, Btn, Alert, Spinner } from '../../components/ui';
import * as api from '../../api';

export default function LiveScan(){
  const { id }     = useParams();
  const navigate   = useNavigate();
  const location   = useLocation();
  const videoRef   = useRef(null);
  const streamRef  = useRef(null);
  const scanningRef = useRef(false);

  const [session,  setSession]  = useState(location.state?.session || null);
  const [total,    setTotal]    = useState(0);
  const [scanning, setScanning] = useState(false);
  const [camErr,   setCamErr]   = useState('');
  const [result,   setResult]   = useState(null);  // last scan result overlay
  const [present,  setPresent]  = useState([]);
  const [ending,   setEnding]   = useState(false);
  const [loading,  setLoading]  = useState(!location.state?.session);

  useEffect(()=>{
    if(!session){
      api.getSession(id).then(d=>{ setSession(d.session); setTotal(d.totalStudents); setPresent(d.session.studentsPresent||[]); }).catch(()=>setCamErr('Session not found'));
      setLoading(false);
    } else {
      api.getSession(id).then(d=>{ setTotal(d.totalStudents); setPresent(d.session.studentsPresent||[]); }).catch(()=>{});
    }
  },[id]);

  useEffect(()=>{
    const initCamera = async () => {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices) {
        setCamErr('❌ Camera not supported on this device. Please use a modern browser (Chrome, Safari, Firefox) on HTTPS.');
        return;
      }
      // Check for secure context (HTTPS required for camera)
      if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
        setCamErr('❌ Camera requires HTTPS. Please access this page via a secure connection.');
        return;
      }
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 640 }, 
            height: { ideal: 480 }, 
            aspectRatio: 4/3,
            facingMode: 'user' 
          } 
        });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          // Wait for metadata then play
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch(() => {});
          };
        }
      } catch(e){ 
        let msg = 'Camera access denied. ';
        if(e.name === 'NotAllowedError') {
          msg = '❌ Camera blocked! Click the 🔴 camera icon in the browser address bar and select "Allow", then refresh. On mobile, check your browser settings to allow camera access.';
        } else if(e.name === 'NotFoundError') {
          msg = '❌ No camera found! Please connect a webcam or grant camera permission to your browser. On mobile, make sure no other app is using the camera.';
        } else if(e.name === 'NotReadableError') {
          msg = '❌ Camera in use! Close other apps (Zoom, Teams, Camera app, etc.) and refresh.';
        } else if(e.name === 'OverconstrainedError') {
          msg = '❌ Camera settings not supported. Please try a different browser or device.';
        } else {
          msg = `❌ Camera error: ${e.message}`;
        }
        setCamErr(msg); 
      }
    };
    initCamera();
    return ()=>{ streamRef.current?.getTracks().forEach(t=>t.stop()); };
  },[]);

  const startCam = async ()=>{
    // Check if mediaDevices is supported
    if (!navigator.mediaDevices) {
      setCamErr('❌ Camera not supported on this device. Please use a modern browser (Chrome, Safari, Firefox) on HTTPS.');
      return;
    }
    // Check for secure context (HTTPS required for camera)
    if (window.location.protocol !== 'https:' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      setCamErr('❌ Camera requires HTTPS. Please access this page via a secure connection.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 }, 
          height: { ideal: 480 }, 
          aspectRatio: 4/3,
          facingMode: 'user' 
        } 
      });
      streamRef.current = stream;
      if(videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.log('Auto-play:', e));
      }
    } catch(e){ 
      let msg = 'Camera access denied. ';
      if(e.name === 'NotAllowedError') {
        msg = '❌ Camera blocked! Click the 🔴 camera icon in the browser address bar and select "Allow", then refresh. On mobile, check your browser settings to allow camera access.';
      } else if(e.name === 'NotFoundError') {
        msg = '❌ No camera found! Please connect a webcam or grant camera permission to your browser. On mobile, make sure no other app is using the camera.';
      } else if(e.name === 'NotReadableError') {
        msg = '❌ Camera in use! Close other apps (Zoom, Teams, Camera app, etc.) and refresh.';
      } else if(e.name === 'OverconstrainedError') {
        msg = '❌ Camera settings not supported. Please try a different browser or device.';
      } else {
        msg = `❌ Camera error: ${e.message}`;
      }
      setCamErr(msg); 
    }
  };

  const scan = useCallback(async ()=>{
    if(scanningRef.current||!videoRef.current||!session) return;
    scanningRef.current = true;
    setScanning(true); setResult(null);
    try {
      const canvas = document.createElement('canvas');
      canvas.width  = videoRef.current.videoWidth  || 640;
      canvas.height = videoRef.current.videoHeight || 480;
      canvas.getContext('2d').drawImage(videoRef.current,0,0);
      const image = canvas.toDataURL('image/jpeg',0.85);

      const res = await api.recognizeFace({
        image, year:session.year, semester:session.semester,
        section:session.section, department:session.department,
      });

      if(res.recognized){
        if(present.some(p=>p.usn===res.usn)){
          setResult({ type:'already', name:res.name, usn:res.usn, confidence:res.confidence });
        } else {
          await api.markAttendance({ sessionId:id, usn:res.usn, name:res.name });
          setPresent(prev=>[...prev,{ usn:res.usn, name:res.name, markedAt:new Date() }]);
          setResult({ type:'success', name:res.name, usn:res.usn, confidence:res.confidence });
        }
      } else {
        setResult({ type:'fail', message:res.message||'Face not recognized' });
      }
    } catch(e){
      setResult({ type:'error', message: e.message });
    } finally {
      scanningRef.current = false;
      setScanning(false);
      setTimeout(()=>setResult(null), 3000);
    }
  },[session, present, id]);

  const endSession = async ()=>{
    setEnding(true);
    try {
      await api.endSession(id);
      streamRef.current?.getTracks().forEach(t=>t.stop());
      navigate(`/faculty/summary/${id}`, { state:{ session, present, total } });
    } catch(e){ setEnding(false); }
  };

  const pct = total>0?Math.round((present.length/total)*100):0;

  const ResultOverlay = ()=>{
    if(!result) return null;
    const cfg = {
      success: { bg:'#16a34a', icon:'✅', msg:`${result.name}`, sub:`USN: ${result.usn} · ${result.confidence}% confidence` },
      already: { bg:'#d97706', icon:'⚠️', msg:`Already marked`, sub:`${result.name} (${result.usn})` },
      fail:    { bg:'#dc2626', icon:'❌', msg:'Not Recognized',  sub:result.message },
      error:   { bg:'#dc2626', icon:'⚠',  msg:'Error',          sub:result.message },
    }[result.type];
    return(
      <div style={{position:'absolute',bottom:16,left:16,right:16,background:cfg.bg,borderRadius:10,
        padding:'12px 16px',color:'#fff',display:'flex',alignItems:'center',gap:10,zIndex:10}}>
        <span style={{fontSize:24}}>{cfg.icon}</span>
        <div><div style={{fontWeight:700,fontSize:15}}>{cfg.msg}</div><div style={{fontSize:12,opacity:.85}}>{cfg.sub}</div></div>
      </div>
    );
  };

  return(
    <Layout title="Live Attendance Scan">
      <div style={{
        padding: 16, 
        display: 'grid', 
        gridTemplateColumns: '1fr', 
        gap: 16, 
        alignItems: 'start',
        width: '100%'
      }} className="live-scan-container">
        {/* Camera */}
        <div style={{width: '100%'}}>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:20,fontWeight:800}}>📷 Live Camera Scan</div>
            <div style={{color:C.muted,fontSize:13}}>
              {session?.subject} · {session?.year} · Sec {session?.section} · {session?.timeSlot}
            </div>
          </div>
          <Alert type="error" msg={camErr}/>
          <Card style={{overflow:'hidden', padding: 0}}>
            <div style={{background:'#0a0f1e',position:'relative',aspectRatio:'4/3', width: '100%'}}>
              <video 
                ref={videoRef} 
                autoPlay 
                muted 
                playsInline 
                onCanPlay={() => videoRef.current?.play()}
                style={{
                  width:'100%',
                  height:'100%',
                  objectFit:'cover',
                  display:'block',
                  transform:'scaleX(-1)'
                }}
              />
              {/* Corner brackets */}
              {['topLeft','topRight','bottomLeft','bottomRight'].map(pos=>{
                const isTop=pos.includes('top'), isLeft=pos.includes('Left');
                return <div key={pos} style={{position:'absolute',[isTop?'top':'bottom']:20,[isLeft?'left':'right']:20,
                  width:28,height:28,borderTop:isTop?'2px solid #06b6d4':'none',
                  borderBottom:!isTop?'2px solid #06b6d4':'none',
                  borderLeft:isLeft?'2px solid #06b6d4':'none',
                  borderRight:!isLeft?'2px solid #06b6d4':'none'}}/>;
              })}
              {/* LIVE badge */}
              <div style={{position:'absolute',top:12,left:12,background:'#dc2626',color:'#fff',
                fontSize:11,fontWeight:700,padding:'3px 10px',borderRadius:99,display:'flex',alignItems:'center',gap:5}}>
                <span style={{width:7,height:7,background:'#fff',borderRadius:'50%',display:'inline-block'}}/>LIVE
              </div>
              <ResultOverlay/>
            </div>
            <div style={{padding:16}}>
              <Btn onClick={scan} disabled={scanning||ending} loading={scanning}
                style={{width:'100%'}} size="lg">
                {scanning ? '🔍 Scanning...' : '🔍 Scan Student Face'}
              </Btn>
            </div>
          </Card>

          {/* Progress bar */}
          <div style={{marginTop:14,background:'#fff',borderRadius:10,padding:'14px 18px',border:`1px solid ${C.border}`, width: '100%', boxSizing: 'border-box'}}>
            <div style={{display:'flex',justifyContent:'space-between',fontSize:13,marginBottom:8}}>
              <span style={{fontWeight:600}}>Session Progress</span>
              <span style={{fontWeight:700,color:C.primary}}>{present.length} / {total} students</span>
            </div>
            <div style={{background:'#f1f5f9',borderRadius:99,height:8}}>
              <div style={{width:`${pct}%`,background:C.success,height:'100%',borderRadius:99,transition:'width .4s'}}/>
            </div>
            <div style={{fontSize:11,color:C.muted,marginTop:4}}>{pct}% attendance marked</div>
          </div>
        </div>

        {/* Present list */}
        <div style={{width: '100%'}}>
          <div style={{fontWeight:700,fontSize:15,marginBottom:12}}>
            ✅ Present Students ({present.length})
          </div>
          <div style={{maxHeight:'calc(100vh - 240px)',overflowY:'auto',display:'flex',flexDirection:'column',gap:8}}>
            {present.length===0
              ? <Card style={{padding:24,textAlign:'center',color:C.muted,fontSize:13}}>
                  No students marked yet.<br/>Click "Scan Student Face" to start.
                </Card>
              : [...present].reverse().map((s,i)=>(
                <Card key={s.usn} style={{padding:'10px 14px',borderLeft:`3px solid ${C.success}`,
                  display:'flex',alignItems:'center',gap:10}}>
                  <div style={{width:34,height:34,borderRadius:'50%',background:`${C.success}18`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:13,flexShrink:0}}>
                    {s.name?.[0]}
                  </div>
                  <div style={{flex:1,minWidth:0}}>
                    <div style={{fontWeight:600,fontSize:13,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{s.name}</div>
                    <div style={{fontSize:11,color:C.muted}}>{s.usn}</div>
                  </div>
                  <span style={{fontSize:11,color:C.success,fontWeight:700}}>✓</span>
                </Card>
              ))
            }
          </div>
          <Btn onClick={endSession} loading={ending} variant="danger" style={{width:'100%',marginTop:16}}>
            🔚 End Session
          </Btn>
          <div style={{fontSize:11,color:C.muted,textAlign:'center',marginTop:6}}>This will close the session and show summary</div>
        </div>
      </div>
    </Layout>
  );
}
