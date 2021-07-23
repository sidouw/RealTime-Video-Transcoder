import React from 'react';
import axios from 'axios';



const AuthPage = ({setAuthed})=>{
    

    const onFormSubmit = (e)=> {
        e.preventDefault()

        axios.post('/auth',{passworrd:e.target[0].value}).then((data)=>{
            if (data.data) {
                setAuthed(true)
            }else{
                alert('Wrong Password')
            }
        }).catch(()=>{

        })

    }


    return (
        <div className = 'authContainer' >
             
             <form onSubmit = {onFormSubmit} >
             <h1>Password</h1>
             <input type = 'text'/>
             <button>Confirm</button>
             </form>

        </div> 
    )
}
export default AuthPage