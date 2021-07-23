import React, { useEffect,useState } from 'react';
// import logo from './logo.svg';
import './index.css';


const {ipcRenderer,remote} = window.require('electron') 

 const initMenu = () => {
    const Menu = remote.Menu;
    const menu = Menu.buildFromTemplate([

    ]);
    Menu.setApplicationMenu(menu);
  }

let choosingFFmpeg = true

const  App = ()=> {
  
  const [destinantion,setDestinantion] = useState("")
  const [port,setPort] = useState("3333")
  const [serverPassowrd,setServerPassowrd] = useState("")
  const [audioBitRate,setAudioBitRate] = useState("360k")
  const [videoBitRate,setVideoBitRate] = useState("4096k")
  const [videoResolution,setVideoResolution] = useState("720")
  const [ffmpegLocation,setFFmpegLocation] = useState("FFmpeg bin location....")
  const [passwordEnabled,setPasswordEnabled] = useState(false)
  const [serverStarted,setServerStarted] = useState(false)


  useEffect(()=>{
    initMenu()
    ipcRenderer.on("folderSelected",(event, arg)=>{
      if (choosingFFmpeg) setFFmpegLocation(arg)
       else setDestinantion(arg)
    })

  },[])

  useEffect(()=>{
    // console.log(videoBitRate,videoResolution,audioBitRate);
    ipcRenderer.send('settingsChnaged',{videoBitRate,videoResolution,audioBitRate});
  },[videoBitRate,videoResolution,audioBitRate])

  const ffmpegLocationChanged = (e)=>{
    setFFmpegLocation(e.target.value)
  }
  const destinantionChanged = (e)=>{
    setDestinantion(e.target.value)
  }
  const passwordChanged = (e)=>{
    if (e.target.value.length<=10 ) {
      setServerPassowrd(e.target.value)
    }  
    
  }

  const portChanged = (e)=>{
    // const regExpr = new RegExp("^\d+$");
    const lPort =e.target.value 
    if (lPort.length<=4 ) {
      // if (!regExpr.test(lPort))
      setPort(lPort)  
    }   
  }

  const handleServer = ()=>{
    if(serverStarted) {
      ipcRenderer.send('stopServer');
      setServerStarted(false)
    }else{
      ipcRenderer.send('startServer',destinantion,port,passwordEnabled,serverPassowrd,ffmpegLocation);
      setServerStarted(true)
    }
  }

  const selectFolder = ()=>{
    ipcRenderer.send('selectFolder');
  }

    return (

      <div className="App">
        <div className = 'folderSelecet'>
          <label>Destinantion</label>
          <div className = 'folderSelecet-input'>
            <label>Folder:</label>
            <input type= "text" value ={destinantion} onChange = {destinantionChanged} />
            <button onClick = {()=> {choosingFFmpeg = false; selectFolder()}}>Browser</button>
          </div>
        </div>

        <div className = 'settings' >



          <div className = 'setting'>
            <label htmlFor="settinginput">Locate FFMPEG</label>
            <input  type="text"  id = "settinginput" value = {ffmpegLocation} onChange = {ffmpegLocationChanged} / >
            <button  id= 'locateBtn' onClick = {()=> {choosingFFmpeg = true; selectFolder()}} >Locate</button>
          </div>            

          <div className = 'setting'>
          <label htmlFor="passwordEnabled">Audio Bitrate :</label>
          <select  id = "settinginput" value = {audioBitRate}   onChange = {(e)=>setAudioBitRate(e.target.value)} >
            <option value = "160k">160k</option>
            <option value = "240k">240k</option>
            <option value = "360k">360k</option>
          </select>
          </div>  

          <div className = 'setting'>
              <label htmlFor="passwordEnabled">Video Bitrate : </label>
              <select id = "settinginput" value = {videoBitRate}   onChange = {(e)=>setVideoBitRate(e.target.value)} >
              <option value = "1024k">1024k</option>
              <option value = "2048k">2048k</option>
              <option value = "4096k">4096k</option>
            </select>
          </div>  
          <div className = 'setting'>
              <label htmlFor="passwordEnabled">Video Resolution : </label>
              <select id = "settinginput" value = {videoResolution}   onChange = {(e)=>setVideoResolution(e.target.value)} >
              <option value = "480">480p</option>
              <option value = "720">720p</option>
              <option value = "1080">1080p</option>
            </select>
          </div>  

          <div className = 'setting'>
            <label htmlFor="settinginput">Port : </label>
            <input type="text" id = "settinginput" value = {port} onChange = {portChanged}      / >
          </div> 

          <div className = 'setting'>
            <label htmlFor="passwordEnabled">Enable Password :
              <input type="checkbox" id="passwordEnabled" onChange = {(e)=>{setPasswordEnabled(!passwordEnabled)}} / > 
            </label>
            
            <input type="text" id = "settinginput" disabled = {!passwordEnabled} value = {serverPassowrd} onChange = {passwordChanged} / >
          </div>  
          <button id = 'serverBtn' onClick= {handleServer} >{serverStarted ? 'Stop Server' :' Start Server'}</button>
        </div>
        
      </div>
    )

}
export default App;
