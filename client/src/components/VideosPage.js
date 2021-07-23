import React,{useEffect,useState} from 'react';
import Video from './Video'
import VideoPlayerModal from './VideoPlayerModal'
import axios from 'axios'
import Header from './Header'




const VideosPage = ()=>{
    const [metaData,setMetaData] =  useState([]);
    const [playerOpened,setPlayerOpened] =  useState(false);
    const [currentlyPlaying,setCurrentlyPlaying] = useState('');
    const [currentMetadata,setCurrentMetadata] = useState({});
    useEffect (()=>{
        
        axios.get('video/metadata')
        .then((response)=>{
            if (!response.data.success) {
                console.log(response.data.error);
            }
            
            const sortedData = response.data.metadata.sort(function(a, b) {
                const nameA = a.name.toUpperCase();
                const nameB = b.name.toUpperCase();
                if (nameA < nameB) {
                  return -1;
                }
                if (nameA > nameB) {
                  return 1;
                }
                return 0;
              })
              console.log(response.data);
              console.log(response);
            setMetaData(sortedData)
        })
        .catch((err)=>{
            console.log(err) 
    })

    },[])
    
    const videoClicked = (data)=>{
        const T = metaData.find(element => element.name === data)
        // console.log(T );
        setCurrentMetadata({...T})
        setCurrentlyPlaying(encodeURIComponent(data))
        setPlayerOpened(true)
    }

    return (
        <>
        <Header/>
        <div className = "videosGrid">
            {
                metaData.map((meta,index)=>{
                    return (
                        <Video onClicked = {videoClicked} key = {index} metadata = {meta}/>
                        )
                })
            }
            <VideoPlayerModal opened = {playerOpened} setOpened = {setPlayerOpened} currentlyPlaying={currentlyPlaying} currentMetadata={currentMetadata} /> 
        </div>   
        </>    
    )
    
}

export default VideosPage