import React from 'react';




const Video = ({metadata,onClicked})=>{

    return (
        <div className = 'videoThumbnail' onClick = {()=>onClicked(metadata.name)}>
            <img alt ='thumbnail' src = {metadata.thumbnailPath}/>
            <span className = 'videoThumbnail__duration'>{ ~~((metadata.duration % 3600) / 60)}:{~~metadata.duration % 60}</span>
            <p >{metadata.name}</p>
        </div> 
    )
}
export default Video