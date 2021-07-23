import React,{ useState,useRef,useEffect } from 'react';
import ReactPlayer from 'react-player'
import Modal from 'react-modal' 
import { makeStyles} from "@material-ui/core/styles";
import screenful from "screenfull";
import Controls from './Controls'
import axios from 'axios'

const useStyles = makeStyles((theme) => ({
    playerWrapper: {
      width: "100%",
      position: "relative",
    },
  
    controlsWrapper: {
      visibility: "hidden",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(0,0,0,0.4)",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
    },
    topControls: {
      display: "flex",
      justifyContent: "flex-end",
      padding: theme.spacing(2),
    },
    middleControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    bottomWrapper: {
      display: "flex",
      flexDirection: "column",
  
      // background: "rgba(0,0,0,0.6)",
      // height: 60,
      padding: theme.spacing(2),
    },
  
    bottomControls: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      // height:40,
    },
  
    button: {
      margin: theme.spacing(1),
    },
    controlIcons: {
      color: "#777",
  
      fontSize: 50,
      transform: "scale(0.9)",
      "&:hover": {
        color: "#fff",
        transform: "scale(1)",
      },
    },
  
    bottomIcons: {
      color: "#999",
      "&:hover": {
        color: "#fff",
      },
    },
  
    volumeSlider: {
      width: 100,
    },
  }));

  
  const format = (seconds) => {
    if (isNaN(seconds)) {
      return `00:00`;
    }
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, "0");
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, "0")}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  let count = 0;
const VideoPlayer = ({setOpened,opened,currentlyPlaying,currentMetadata})=>{

    const classes = useStyles()

    const [seekTime,setsSeekTime] = useState(0)   
    const [timeDisplayFormat, setTimeDisplayFormat] = useState("normal")
    const [playing, setPlaying] = useState(true)
    const [muted, setMuted] = useState(false)
    const [played, setPlayed] = useState(0)
    // const [subtitle, setSubtitle] = useState('')
    const [playbackRate, setPlaybackRate] = useState(1.0)
    const [volume, setVolume] = useState(1)
    const [subOffset, setSubOffset] = useState(0)
    const [audioTrack, setAudioTrack] = useState(0)
    const [seeking, setSeeking] = useState(false)


    const playerRef = useRef(null);
    const playerContainerRef = useRef(null);
    const controlsRef = useRef(null);

    
  useEffect(()=>{
    setsSeekTime(0)
    setPlayed(0)
  },[currentlyPlaying])

    const handlePlayPause = () => {
      setPlaying(!playing)

    };
  
    const handleRewind = () => {
      const newTime = (played*parseFloat(currentMetadata.duration))-10
      setsSeekTime(newTime)
      setPlayed(newTime)
    };
  
    const handleFastForward = () => {    
        const newTime = (played*parseFloat(currentMetadata.duration))+10
        setsSeekTime(newTime)
        setPlayed(newTime)
    };
  
    const handleProgress = (changeState) => {
      if (count > 3) {
        controlsRef.current.style.visibility = "hidden";
        count = 0;
      }
      if (controlsRef.current.style.visibility === "visible") {
        count += 1;
      }
      if (!seeking) {
        setPlayed((changeState.playedSeconds+seekTime)/parseFloat(currentMetadata.duration))

      }
    };
  
    const handleSeekChange = (e, newValue) => {
      setPlayed(parseFloat(newValue / 100))

    };
  
    const handleSeekMouseDown = (e) => {
      setSeeking(true)
    };
  
    const handleSeekMouseUp = (e, newValue) => {
      
      setsSeekTime(parseInt(currentMetadata.duration*(newValue/100)))
      setSeeking(false)
    };

    const handleVolumeSeekDown = (e, newValue) => {
      setSeeking(false)
      setVolume(parseFloat(newValue / 100))

    };
    const handleVolumeChange = (e, newValue) => {
      setVolume(parseFloat(newValue / 100))
      setMuted(newValue === 0 ? true : false)

    }
  
    const toggleFullScreen = () => {
      screenful.toggle(playerContainerRef.current);
    };
  
    const handleMouseMove = () => {
      controlsRef.current.style.visibility = "visible";
      count = 0;
    };
  
    const hanldeMouseLeave = () => {
      controlsRef.current.style.visibility = "hidden";
      count = 0;
    };
  
    const handleDisplayFormat = () => {
      setTimeDisplayFormat(
        timeDisplayFormat === "normal" ? "remaining" : "normal"
      );
    };
  
    const handlePlaybackRate = (rate) => {
      setPlaybackRate(rate)
    };  
    const handleAudioTrack = (track=0) => {
      setAudioTrack(track)
      setsSeekTime(played*parseFloat(currentMetadata.duration)-1)
    };
  
    const hanldeMute = () => {
      setMuted(!muted)
    };
  
    const onAddSubtitle = (e)=>{
      // playerRef.current.getInternalPlayer().id="myPlayer"
      const file = e.target.files[0]; 
      const reader = new FileReader();
      reader.readAsText(file)
        reader.onloadend = ()=>{
          axios.post('video/subs',{sub:reader.result,name:currentMetadata.name}).then((data)=>{
                console.log(data.data);
                setsSeekTime(played*parseFloat(currentMetadata.duration)-1)
        }).catch(()=>{

        })
      
        }
      
    }
    const onOffsetSub = (e)=>{
      setsSeekTime(played*parseFloat(currentMetadata.duration)-1)
      setSubOffset(e.target.value)
    }
    
    const currentTime =
      playerRef && playerRef.current
        ? playerRef.current.getCurrentTime()+seekTime
        : "00:00";
  

    const duration = currentMetadata ? currentMetadata.duration : "00:00";
    
    const elapsedTime =
      timeDisplayFormat === "normal"
        ? format(currentTime)
        : `-${format(duration - currentTime)}`;
  
    const totalDuration = format(duration);

    
    return (
        <Modal
        className = 'player-modal'
        overlayClassName="modal-Overlay"
        isOpen ={opened}
        onRequestClose = {()=>setOpened(!opened)}
        appElement={document.getElementById('root')}
        closeTimeoutMS ={200}
        >   
        <div
        onMouseMove={handleMouseMove}
        onMouseLeave={hanldeMouseLeave}
        ref={playerContainerRef}
        className={classes.playerWrapper}
      >
        <ReactPlayer
          ref={playerRef}
          width="100%"
          height="100%"
          url={`/video/video?seek=${seekTime}&play=${currentlyPlaying}&subOffset=${subOffset}&audioTrack=${audioTrack}`} 
          playing={playing}
          controls={false}
          light={false}
          loop={false}
          playbackRate={playbackRate}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          // config={{
          //   file: {
          //     attributes: {
          //       crossOrigin: "anonymous",
          //     },
          //     tracks: [
          //       {kind: 'subtitles', src:subtitle, srcLang: 'en', default: true},
          //     ]
          //   },
          // }}
        />

        <Controls
          ref={controlsRef}
          title={currentMetadata.name}
          onSeek={handleSeekChange}
          onSeekMouseDown={handleSeekMouseDown}
          onSeekMouseUp={handleSeekMouseUp}
          onRewind={handleRewind}
          onPlayPause={handlePlayPause}
          onFastForward={handleFastForward}
          playing={playing}
          played={played}
          OffsetSub={subOffset}
          onAddSubtitle={onAddSubtitle}
          elapsedTime={elapsedTime}
          totalDuration={totalDuration}
          onMute={hanldeMute}
          muted={muted}
          onVolumeChange={handleVolumeChange}
          onVolumeSeekDown={handleVolumeSeekDown}
          onChangeDispayFormat={handleDisplayFormat}
          playbackRate={playbackRate}
          onPlaybackRateChange={handlePlaybackRate}
          onAudioTrackChange={handleAudioTrack}
          onToggleFullScreen={toggleFullScreen}
          volume={volume}
          onOffsetSub = {onOffsetSub}
          audioTracks= {Boolean (currentMetadata.audioTracks) ?currentMetadata.audioTracks : []}
        />
      </div>

        </Modal>
    )
}
export default VideoPlayer