import React,{useState,useEffect} from 'react';
// import VideosPage from '../components/VideosPage'
import VideosPage from '../components/VideosPage'
import AuthPage from '../components/AuthPage'
import axios from 'axios';

const App = ()=>{
    
    const [authed,setAuthed] = useState(false)

    useEffect(()=>{
        axios.post('/auth',{password:''}).then((data)=>{

            setAuthed(data.data)
        }).catch((err)=>{

        })

    },[])
    return (
        <>
        {
            authed ? 
            <VideosPage/>
            :
            <AuthPage setAuthed= {setAuthed}/>
        }
        </>
    )
}

export default App