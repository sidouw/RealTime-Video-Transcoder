import React  from 'react';


const Settings = ()=>{


return (
    <div className = 'settingsPage' >
        <h1>Settings</h1>
        <div className = 'settings' >
            <div className = 'folderSelecet'>
                <label>FFmpeg Destinantion </label>
                <div className = 'folderSelecet-input'>
                    <label>Folder:</label>
                    <input type= "text"  />
                    <button >Browser</button>
                </div>
            </div>
            <div className = 'setting'>
                <label htmlFor="passwordEnabled">Audio Bitrate </label>
                <input type="text" id = "settinginput"  / >
            </div>  
            <div className = 'setting'>
                <label htmlFor="passwordEnabled">Video Bitrate </label>
                <input type="text" id = "settinginput"  / >
            </div>  
            <div className = 'setting'>
                <label htmlFor="passwordEnabled">Enable Password : </label>
                <input type="text" id = "settinginput"  / >
            </div>  
            <div className = 'setting'>
                <label htmlFor="passwordEnabled">Enable Password : </label>
                <input type="text" id = "settinginput"  / >
            </div>  

        </div>
    </div>
    )
}


export default Settings