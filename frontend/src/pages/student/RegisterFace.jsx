import { useState, useRef, useCallback, useEffect } from 'react';
import { Layout } from '../../components/Layout';
import { C, Card, Btn, Alert, PageWrap } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import * as api from '../../api';

export default function RegisterFace(){
  const { user } = useAuth();
  const [step,   setStep]   = useState(1);
  const [images, setImages] = useState([]);
  const [loading, setLoad]  = useState(false);
  const [camErr, setCamErr] = useState('');
  const [apiErr, setApiErr] = useState('');
  const [done,   setDone]   = useState(false);
  const videoRef  = useRef(null);
  const streamRef = useRef(null);

  // Ensure video plays when step changes to 2 (camera active)
  useEffect(() => {
    if (step === 2 && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.play().catch(() => {});
        }
      }, 100);
    }
  }, [step]);

  const startCam = async () => {
    setCamErr('');
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
      setStep(2);
    } catch(e){
      let msg = 'Camera access denied. ';
      if(e.name === 'NotAllowedError') {
        msg = '❌ Camera blocked! Click the 🔴 camera icon in the browser address bar (left of URL) and select "Allow", then refresh. On mobile, check your browser settings to allow camera access.';
      } else if(e.name === 'NotFoundError') {
        msg = '❌ No camera found! Please connect a webcam and try again. On mobile, make sure no other app is using the camera.';
      } else if(e.name === 'NotReadableError') {
        msg = '❌ Camera in use! Close other apps using camera (Zoom, Teams, Camera app, etc.) and refresh.';
      } else if(e.name === 'OverconstrainedError') {
        msg = '❌ Camera settings not supported. Please try a different browser or device.';
      } else {
        msg = `❌ Camera error: ${e.message}`;
      }
      setCamErr(msg); 
    }
  };

  const stopCam = () => {
    streamRef.current?.getTracks().forEach(t=>t.stop());
    streamRef.current = null;
  };

  const capture = () => {
    if(!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width  = videoRef.current.videoWidth  || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    canvas.getContext('2d').drawImage(videoRef.current,0,0);
    const img = canvas.toDataURL('image/jpeg',0.85);
    setImages(prev=>[...prev,img]);
  };

  const remove = idx => setImages(prev=>prev.filter((_,i)=>i!==idx));

  const submit = async () => {
    setApiErr(''); setLoad(true);
    try {
      await api.encodeFace({ usn:user.usn, images });
      stopCam(); setDone(true);
    } catch(e){ setApiErr(e.message); }
    finally { setLoad(false); }
  };

  if(done) return(
    <Layout title="Register Face">
      <PageWrap>
        <Card style={{padding:56,textAlign:'center',maxWidth:480,margin:'40px auto'}}>
          <div style={{fontSize:64,marginBottom:14}}>🎉</div>
          <div style={{fontSize:22,fontWeight:800,marginBottom:6}}>Face Registered!</div>
          <div style={{color:C.muted,marginBottom:20}}>Your face is now linked to <strong>{user?.usn}</strong></div>
          <div style={{background:'#f0fdf4',border:'1.5px solid #bbf7d0',borderRadius:10,padding:14,fontSize:13,color:'#166534',marginBottom:20}}>
            ✅ You will now be automatically recognized when your faculty scans the class.
          </div>
          <Btn onClick={()=>{ setDone(false); setStep(1); setImages([]); }} variant="outline" style={{width:'100%'}}>
            Update Face Photos
          </Btn>
        </Card>
      </PageWrap>
    </Layout>
  );

  return(
    <Layout title="Register Face">
      <PageWrap>
        <div style={{fontSize:20,fontWeight:800,marginBottom:4}}>Register Your Face</div>
        <div style={{color:C.muted,fontSize:14,marginBottom:24}}>Take 3–5 clear photos so the AI can recognize you during class attendance</div>

        {step===1 && (
          <Card style={{padding:32,maxWidth:500}}>
            <Alert type="error" msg={camErr}/>
            <div style={{fontSize:15,fontWeight:700,marginBottom:14}}>📋 Before You Start</div>
            {['Sit in a well-lit area facing the camera','Look directly at the camera lens','Remove sunglasses or face coverings','You need at least 3 photos (5 recommended)','Take photos from slightly different angles for better accuracy'].map((t,i)=>(
              <div key={i} style={{display:'flex',gap:10,marginBottom:10,alignItems:'flex-start'}}>
                <span style={{background:C.primaryLight,color:C.primary,borderRadius:'50%',width:22,height:22,
                  display:'flex',alignItems:'center',justifyContent:'center',fontSize:12,fontWeight:700,flexShrink:0}}>{i+1}</span>
                <span style={{fontSize:13,color:C.text,lineHeight:1.5}}>{t}</span>
              </div>
            ))}
            <Btn onClick={startCam} style={{width:'100%',marginTop:8}} size="lg">📷 Open Camera</Btn>
          </Card>
        )}

        {step===2 && (
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:20,maxWidth:900}}>
            <div>
              <Alert type="error" msg={apiErr}/>
              <Card style={{overflow:'hidden',marginBottom:14}}>
                <div style={{background:'#0a0f1e',height:320,position:'relative'}}>
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
                  {/* Face oval guide */}
                  <div style={{position:'absolute',top:'50%',left:'50%',transform:'translate(-50%,-55%)',
                    width:140,height:180,borderRadius:'50%',border:'2px dashed rgba(14,165,233,0.7)',pointerEvents:'none'}}/>
                  <div style={{position:'absolute',bottom:10,left:0,right:0,textAlign:'center',color:'rgba(255,255,255,0.6)',fontSize:12}}>
                    Keep face inside the oval
                  </div>
                </div>
                <div style={{padding:'12px 16px'}}>
                  <Btn onClick={capture} disabled={images.length>=5} style={{width:'100%'}} size="lg">
                    📸 Take Photo ({images.length}/5)
                  </Btn>
                </div>
              </Card>
              <Btn onClick={submit} disabled={images.length<3} loading={loading}
                variant="success" style={{width:'100%'}} size="lg">
                ✅ Register Face ({images.length} photos)
              </Btn>
              {images.length<3&&<div style={{fontSize:12,color:C.muted,marginTop:6,textAlign:'center'}}>Need at least 3 photos to continue</div>}
            </div>

            <div>
              <div style={{fontWeight:700,fontSize:14,marginBottom:12}}>📷 Captured Photos</div>
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:10}}>
                {images.map((img,i)=>(
                  <div key={i} style={{position:'relative',borderRadius:10,overflow:'hidden',aspectRatio:'4/3',background:'#0f172a'}}>
                    <img src={img} alt={`face ${i+1}`} style={{width:'100%',height:'100%',objectFit:'cover'}}/>
                    <button onClick={()=>remove(i)} style={{position:'absolute',top:4,right:4,background:'#dc2626',
                      border:'none',borderRadius:'50%',width:22,height:22,color:'#fff',cursor:'pointer',fontSize:12,
                      display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>✕</button>
                    <div style={{position:'absolute',bottom:0,left:0,right:0,background:'rgba(0,0,0,0.6)',
                      color:'#fff',fontSize:11,padding:'3px 8px',textAlign:'center'}}>Photo {i+1} ✓</div>
                  </div>
                ))}
                {Array.from({length:Math.max(0,5-images.length)}).map((_,i)=>(
                  <div key={`e${i}`} style={{aspectRatio:'4/3',borderRadius:10,border:`2px dashed ${C.border}`,
                    display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,color:C.border,background:'#f8fafc'}}>+</div>
                ))}
              </div>
              <div style={{marginTop:14,padding:'12px',background:C.primaryLight,borderRadius:8,fontSize:12,color:C.primaryDark}}>
                💡 <strong>Tip:</strong> Take photos in slightly different positions (front, left, right, slightly up/down) for better recognition accuracy.
              </div>
            </div>
          </div>
        )}
      </PageWrap>
    </Layout>
  );
}
